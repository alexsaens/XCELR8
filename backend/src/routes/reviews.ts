import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { logAudit, recordSubmissionAnalytics } from '../services/bigquery';
import { v4 as uuidv4 } from 'uuid';

export const reviewRoutes = Router();
const getDb = () => admin.firestore();

/** List reviews for a submission */
reviewRoutes.get('/submission/:submissionId', async (req: AuthenticatedRequest, res) => {
  try {
    const snapshot = await getDb()
      .collection('reviews')
      .where('submissionId', '==', req.params.submissionId)
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/** Create a review (legal decision) */
reviewRoutes.post(
  '/',
  requireRole('legal', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { submissionId, decision, comments, precedentsCited } = req.body;

      if (!submissionId || !decision) {
        res.status(400).json({ error: 'submissionId and decision are required' });
        return;
      }

      const validDecisions = ['approved', 'revision_needed', 'escalated'];
      if (!validDecisions.includes(decision)) {
        res.status(400).json({ error: `Invalid decision. Must be one of: ${validDecisions.join(', ')}` });
        return;
      }

      // Verify submission exists
      const subDoc = await getDb().collection('submissions').doc(submissionId).get();
      if (!subDoc.exists) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      const reviewId = uuidv4();
      const now = admin.firestore.FieldValue.serverTimestamp();

      const review = {
        submissionId,
        reviewerId: req.user!.uid,
        reviewerEmail: req.user!.email,
        decision,
        comments: (comments || []).map((c: { text: string; section?: string }) => ({
          id: uuidv4(),
          text: c.text,
          section: c.section || null,
          createdAt: new Date().toISOString(),
        })),
        precedentsCited: precedentsCited || [],
        createdAt: now,
      };

      await getDb().collection('reviews').doc(reviewId).set(review);

      // Update submission status
      const newStatus = decision === 'approved' ? 'approved' : 'revision_needed';
      await getDb().collection('submissions').doc(submissionId).update({
        status: newStatus,
        updatedAt: now,
      });

      // Audit log
      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: `review.${decision}`,
        targetType: 'submission',
        targetId: submissionId,
        metadata: { reviewId, decision, commentCount: String(comments?.length || 0) },
      });

      // Update analytics
      const subData = subDoc.data()!;
      await recordSubmissionAnalytics({
        submissionId,
        submittedBy: subData.submittedBy,
        contentType: subData.contentType,
        riskScore: subData.riskScore,
        status: newStatus,
        assignedReviewer: req.user!.uid,
        submittedAt: subData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        reviewedAt: new Date().toISOString(),
        decision,
      });

      res.status(201).json({ id: reviewId, ...review });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
