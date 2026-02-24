import { Router } from 'express';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { queryAuditLog, getAnalyticsSummary } from '../services/bigquery';

export const auditRoutes = Router();

/** Get audit log entries */
auditRoutes.get(
  '/',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { limit, offset, targetId, action } = req.query;

      const entries = await queryAuditLog({
        limit: parseInt(limit as string) || 50,
        offset: parseInt(offset as string) || 0,
        targetId: targetId as string,
        action: action as string,
      });

      res.json({ entries });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Get analytics summary */
auditRoutes.get(
  '/analytics',
  requireRole('admin'),
  async (_req: AuthenticatedRequest, res) => {
    try {
      const summary = await getAnalyticsSummary();
      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
