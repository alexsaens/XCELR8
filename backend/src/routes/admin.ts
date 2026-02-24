import { Router } from 'express';
import * as admin from 'firebase-admin';
import { AuthenticatedRequest, requireRole } from '../middleware/auth';
import { logAudit } from '../services/bigquery';

export const adminRoutes = Router();
const db = admin.firestore();

/** List all users */
adminRoutes.get(
  '/users',
  requireRole('admin'),
  async (_req: AuthenticatedRequest, res) => {
    try {
      const snapshot = await db.collection('users').get();
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      res.json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Create a new user */
adminRoutes.post(
  '/users',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { email, name, role, password } = req.body;

      if (!email || !name || !role || !password) {
        res.status(400).json({ error: 'email, name, role, and password are required' });
        return;
      }

      const validRoles = ['marketer', 'legal', 'admin'];
      if (!validRoles.includes(role)) {
        res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        return;
      }

      // Create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        email,
        displayName: name,
        password,
      });

      // Store user profile in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        email,
        name,
        role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Set custom claims for role
      await admin.auth().setCustomUserClaims(userRecord.uid, { role });

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'admin.user_created',
        targetType: 'user',
        targetId: userRecord.uid,
        metadata: { email, role },
      });

      res.status(201).json({ id: userRecord.uid, email, name, role });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Update user role */
adminRoutes.patch(
  '/users/:uid/role',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      const { role } = req.body;
      const validRoles = ['marketer', 'legal', 'admin'];
      if (!validRoles.includes(role)) {
        res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        return;
      }

      await db.collection('users').doc(req.params.uid).update({ role });
      await admin.auth().setCustomUserClaims(req.params.uid, { role });

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'admin.role_changed',
        targetType: 'user',
        targetId: req.params.uid,
        metadata: { newRole: role },
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

/** Delete a user */
adminRoutes.delete(
  '/users/:uid',
  requireRole('admin'),
  async (req: AuthenticatedRequest, res) => {
    try {
      await admin.auth().deleteUser(req.params.uid);
      await db.collection('users').doc(req.params.uid).delete();

      await logAudit({
        actorId: req.user!.uid,
        actorEmail: req.user!.email,
        action: 'admin.user_deleted',
        targetType: 'user',
        targetId: req.params.uid,
        metadata: {},
      });

      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);
