#!/usr/bin/env node
/**
 * Seed script — creates the first admin user in Firebase Auth + Firestore
 *
 * Usage:
 *   export GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
 *   node seed-admin.js
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'cs-poc-rlwc9pihxctoazqsylrl3ka';

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

async function seedUsers() {
  const users = [
    { email: 'admin@acmefinancial.ca', name: 'Alex Admin', role: 'admin', password: 'Xcelr8Admin2026!' },
    { email: 'sarah.chen@acmefinancial.ca', name: 'Sarah Chen', role: 'marketer', password: 'Xcelr8Mkt2026!' },
    { email: 'james.wilson@acmefinancial.ca', name: 'James Wilson', role: 'marketer', password: 'Xcelr8Mkt2026!' },
    { email: 'priya.sharma@acmefinancial.ca', name: 'Priya Sharma', role: 'legal', password: 'Xcelr8Legal2026!' },
    { email: 'david.laurent@acmefinancial.ca', name: 'David Laurent', role: 'legal', password: 'Xcelr8Legal2026!' },
  ];

  for (const user of users) {
    try {
      // Create auth user
      const userRecord = await admin.auth().createUser({
        email: user.email,
        displayName: user.name,
        password: user.password,
      });

      // Set custom claims
      await admin.auth().setCustomUserClaims(userRecord.uid, { role: user.role });

      // Create Firestore profile
      await db.collection('users').doc(userRecord.uid).set({
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`Created user: ${user.email} (${user.role}) — UID: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        console.log(`User already exists: ${user.email}`);
      } else {
        console.error(`Error creating ${user.email}:`, error.message);
      }
    }
  }

  console.log('\nDone! Users created with these demo passwords:');
  console.log('  Admin:    Xcelr8Admin2026!');
  console.log('  Marketer: Xcelr8Mkt2026!');
  console.log('  Legal:    Xcelr8Legal2026!');
}

seedUsers().then(() => process.exit(0)).catch(console.error);
