import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { generateUploadUrl } from '../services/storage';
import { logAudit, recordSubmissionAnalytics } from '../services/bigquery';
import { v4 as uuidv4 } from 'uuid';

export const submissionRoutes = Router();
const getDb = () => admin.firestore();

/** List submissions (marketers see own, legal/admin see all) */
submissionRoutes.get('/', async (req: AuthenticatedRequest, res) => {
  try {
    const { status, riskScore, limit: limitStr, offset: offsetStr } = req.query;
    let query: admin.firestore.Query = getDb().collection('submissions');

    // Marketers only see their own submissions
    if (req.user!.role === 'marketer') {
      query = query.where('submittedBy', '==', req.user!.uid);
    }

    if (status) query = query.where('status', '==', status);
    if (riskScore) query = query.where('riskScore', '==', riskScore);

    query = query.orderBy('createdAt', 'desc');

    const limit = parseInt(limitStr as string) || 50;
    const offset = parseInt(offsetStr as string) || 0;
    query = query.limit(limit).offset(offset);

    const snapshot = await query.get();
    const submissions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({ submissions });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/** Get a single submission */
submissionRoutes.get('/:id', async (req: AuthenticatedRequest, res) => {
  try {
    const doc = await getDb().collection('submissions').doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ error: 'Submission not found' });
      return;
    }

    const data = doc.data()!;
    // Marketers can only view their own
    if (req.user!.role === 'marketer' && data.submittedBy !== req.user!.uid) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    res.json({ id: doc.id, ...data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

/** Create a new submission */
submissionRoutes.post(
  '/',
  requireRole('marketer', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { title, contentType, fileNames } = req.body;

      if (!title || !contentType || !fileNames?.length) {
        res.status(400).json({ error: 'title, contentType, and fileNames are required' });
        return;
      }

      const submissionId = uuidv4();
      const now = admin.firestore.FieldValue.serverTimestamp();

      // Generate signed upload URLs for each file
      const uploadUrls = await Promise.all(
        fileNames.map(async (fn: { name: string; type: string }) => {
          const { uploadUrl, filePath } = await generateUploadUrl(
            submissionId,
            fn.name,
            fn.type
          );
          return { fileName: fn.name, uploadUrl, filePath };
        })
      );

      const submission = {
        submittedBy: req.user!.uid,
        submitterEmail: req.user!.email,
        contentType,
        title,
        fileUrls: uploadUrls.map((u) => u.filePath),
        fileNames: fileNames.map((f: { name: string }) => f.name),
        referenceId: '',
        status: 'submitted',
        riskScore: null,
        riskFactors: [],
        aiSummary: '',
        assignedReviewer: null,
        createdAt: now,
        updatedAt: now,
      };

      await getDb().collection('submissions').doc(submissionId).set(submission);

      // Audit log
      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'submission.created',
        targetType: 'submission',
        targetId: submissionId,
        metadata: { contentType, title },
      });

      // Record analytics
      await recordSubmissionAnalytics({
        submissionId,
        submittedBy: req.user!.uid,
        contentType,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      });

      res.status(201).json({
        id: submissionId,
        uploadUrls: uploadUrls.map((u) => ({
          fileName: u.fileName,
          uploadUrl: u.uploadUrl,
        })),
        ...submission,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Update submission status (internal use by pipeline and reviewers) */
submissionRoutes.patch(
  '/:id/status',
  requireRole('legal', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { status } = req.body;
      const validStatuses = ['submitted', 'ai_processing', 'in_review', 'revision_needed', 'approved'];
      if (!validStatuses.includes(status)) {
        res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
        return;
      }

      await getDb().collection('submissions').doc(req.params.id).update({
        status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: `submission.status_changed`,
        targetType: 'submission',
        targetId: req.params.id,
        metadata: { newStatus: status },
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
