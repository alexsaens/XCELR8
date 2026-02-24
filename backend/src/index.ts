import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { submissionRoutes } from './routes/submissions';
import { reviewRoutes } from './routes/reviews';
import { chatRoutes } from './routes/chat';
import { ragRoutes } from './routes/rag';
import { auditRoutes } from './routes/audit';
import { adminRoutes } from './routes/admin';
import { authMiddleware } from './middleware/auth';

// Initialize Firebase Admin
admin.initializeApp({
  projectId: process.env.GCP_PROJECT_ID || 'cs-poc-rlwc9pihxctoazqsylrl3ka',
});

const app = express();
const PORT = parseInt(process.env.PORT || '8080', 10);

app.use(cors({ origin: true }));
app.use(express.json({ limit: '10mb' }));

// Health check (unauthenticated)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'xcelr8-backend', timestamp: new Date().toISOString() });
});

// All API routes require authentication
app.use('/api', authMiddleware);
app.use('/api/submissions', submissionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/rag', ragRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/admin', adminRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`XCELR8 backend running on port ${PORT}`);
});
