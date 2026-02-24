import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { chat as aiChat } from '../services/vertexai';
import { v4 as uuidv4 } from 'uuid';

export const chatRoutes = Router();
const getDb = () => admin.firestore();

/** Get chat history for a submission */
chatRoutes.get(
  '/:submissionId',
  requireRole('legal', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const doc = await getDb()
        .collection('chatSessions')
        .doc(req.params.submissionId)
        .get();

      if (!doc.exists) {
        res.json({ messages: [] });
        return;
      }

      res.json({ messages: doc.data()!.messages || [] });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Send a chat message and get AI response */
chatRoutes.post(
  '/:submissionId',
  requireRole('legal', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        res.status(400).json({ error: 'message is required' });
        return;
      }

      // Get submission context
      const subDoc = await getDb()
        .collection('submissions')
        .doc(req.params.submissionId)
        .get();
      if (!subDoc.exists) {
        res.status(404).json({ error: 'Submission not found' });
        return;
      }

      const submission = subDoc.data()!;
      const context = `Title: ${submission.title}
Content Type: ${submission.contentType}
Risk Score: ${submission.riskScore || 'pending'}
AI Summary: ${submission.aiSummary}
Risk Factors: ${JSON.stringify(submission.riskFactors)}`;

      // Get existing chat history
      const chatDoc = await getDb()
        .collection('chatSessions')
        .doc(req.params.submissionId)
        .get();
      const existingMessages = chatDoc.exists
        ? chatDoc.data()!.messages || []
        : [];

      // Get AI response
      const aiResponse = await aiChat(context, existingMessages, message);

      // Save messages
      const userMsg = {
        id: uuidv4(),
        role: 'user',
        content: message,
        timestamp: new Date().toISOString(),
      };
      const assistantMsg = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      const updatedMessages = [...existingMessages, userMsg, assistantMsg];

      await getDb()
        .collection('chatSessions')
        .doc(req.params.submissionId)
        .set(
          {
            submissionId: req.params.submissionId,
            messages: updatedMessages,
          },
          { merge: true }
        );

      res.json({ userMessage: userMsg, aiResponse: assistantMsg });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
