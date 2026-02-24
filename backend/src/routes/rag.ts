import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { generateUploadUrl } from '../services/storage';
import { logAudit } from '../services/bigquery';
import { v4 as uuidv4 } from 'uuid';

export const ragRoutes = Router();
const db = admin.firestore();

/** List RAG repository documents */
ragRoutes.get(
  '/',
  requireRole('legal', 'admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { category, status } = req.query;
      let query: admin.firestore.Query = db.collection('ragDocuments');

      if (category) query = query.where('category', '==', category);
      if (status) query = query.where('status', '==', status);

      query = query.orderBy('uploadedAt', 'desc');

      const snapshot = await query.get();
      const documents = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json({ documents });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Upload a document to the RAG repository */
ragRoutes.post(
  '/',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { title, category, fileName, fileType } = req.body;

      if (!title || !category || !fileName) {
        res.status(400).json({ error: 'title, category, and fileName are required' });
        return;
      }

      const docId = uuidv4();
      const { uploadUrl, filePath } = await generateUploadUrl(
        `rag/${docId}`,
        fileName,
        fileType || 'application/pdf'
      );

      const ragDoc = {
        title,
        category,
        fileName,
        filePath,
        uploadedBy: req.user!.uid,
        uploaderEmail: req.user!.email,
        uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        fileSize: 0,
        status: 'processing', // Will be updated by Cloud Function after embedding
      };

      await db.collection('ragDocuments').doc(docId).set(ragDoc);

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'rag.document_uploaded',
        targetType: 'ragDocument',
        targetId: docId,
        metadata: { title, category },
      });

      res.status(201).json({ id: docId, uploadUrl, ...ragDoc });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Delete a RAG document */
ragRoutes.delete(
  '/:id',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const doc = await db.collection('ragDocuments').doc(req.params.id).get();
      if (!doc.exists) {
        res.status(404).json({ error: 'Document not found' });
        return;
      }

      await db.collection('ragDocuments').doc(req.params.id).delete();

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'rag.document_deleted',
        targetType: 'ragDocument',
        targetId: req.params.id,
        metadata: { title: doc.data()!.title },
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
