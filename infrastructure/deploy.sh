#!/bin/bash
set -e

# ============================================================
# XCELR8 — Full GCP Deployment Script
# Project: cs-poc-rlwc9pihxctoazqsylrl3ka (640454986584)
# Firebase App ID: 1:640454986584:web:0a55842b383fd777a5732d
# Budget: < $30 USD
# ============================================================

PROJECT_ID="cs-poc-rlwc9pihxctoazqsylrl3ka"
REGION="us-central1"
BACKEND_SERVICE="xcelr8-backend"

echo "========================================"
echo "XCELR8 Deployment — GCP Project: $PROJECT_ID"
echo "========================================"

# --------------------------------------------------------
# Step 0: Set project and enable required APIs
# --------------------------------------------------------
echo ""
echo ">>> Step 0: Setting project and enabling APIs..."
gcloud config set project $PROJECT_ID

gcloud services enable \
  firestore.googleapis.com \
  firebase.googleapis.com \
  cloudfunctions.googleapis.com \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  bigquery.googleapis.com \
  storage.googleapis.com \
  aiplatform.googleapis.com \
  identitytoolkit.googleapis.com \
  --project=$PROJECT_ID

echo "APIs enabled."

# --------------------------------------------------------
# Step 1: Set up Firebase + Authentication
# --------------------------------------------------------
echo ""
echo ">>> Step 1: Setting up Firebase..."

# Add Firebase to the GCP project (if not already done)
firebase projects:addfirebase $PROJECT_ID 2>/dev/null || echo "Firebase already added."

# Create Firestore database (if not exists)
gcloud firestore databases create \
  --location=nam5 \
  --project=$PROJECT_ID 2>/dev/null || echo "Firestore database already exists."

echo ""
echo ">>> Firebase Authentication: Email/Password provider must be enabled manually."
echo "    Go to: https://console.firebase.google.com/project/$PROJECT_ID/authentication/providers"
echo "    Enable 'Email/Password' sign-in method."
echo ""
read -p "Press Enter once Email/Password auth is enabled..."

# Deploy Firestore rules and indexes
echo ""
echo ">>> Deploying Firestore rules and indexes..."
firebase deploy --only firestore:rules,firestore:indexes --project=$PROJECT_ID

# --------------------------------------------------------
# Step 2: Create Cloud Storage bucket
# --------------------------------------------------------
echo ""
echo ">>> Step 2: Creating Cloud Storage bucket..."
gsutil mb -p $PROJECT_ID -l US gs://${PROJECT_ID}-xcelr8-uploads 2>/dev/null || echo "Bucket already exists."
gsutil uniformbucketlevelaccess set on gs://${PROJECT_ID}-xcelr8-uploads

# CORS policy for signed URL uploads from the browser
echo '[{"origin": ["*"], "method": ["GET", "PUT"], "responseHeader": ["Content-Type"], "maxAgeSeconds": 3600}]' > /tmp/cors.json
gsutil cors set /tmp/cors.json gs://${PROJECT_ID}-xcelr8-uploads
rm /tmp/cors.json

# --------------------------------------------------------
# Step 3: Set up BigQuery dataset and tables
# --------------------------------------------------------
echo ""
echo ">>> Step 3: Setting up BigQuery..."
bq mk --dataset --location=US ${PROJECT_ID}:xcelr8_audit 2>/dev/null || echo "Dataset already exists."

bq mk --table ${PROJECT_ID}:xcelr8_audit.audit_log \
  id:STRING,actor_id:STRING,actor_email:STRING,action:STRING,target_type:STRING,target_id:STRING,metadata:JSON,timestamp:TIMESTAMP \
  --time_partitioning_field=timestamp \
  2>/dev/null || echo "audit_log table already exists."

bq mk --table ${PROJECT_ID}:xcelr8_audit.submission_analytics \
  submission_id:STRING,submitted_by:STRING,content_type:STRING,risk_score:STRING,status:STRING,assigned_reviewer:STRING,submitted_at:TIMESTAMP,reviewed_at:TIMESTAMP,review_duration_hours:FLOAT,decision:STRING \
  --time_partitioning_field=submitted_at \
  2>/dev/null || echo "submission_analytics table already exists."

echo "BigQuery dataset and tables ready."

# --------------------------------------------------------
# Step 4: Build and deploy Cloud Run backend
# --------------------------------------------------------
echo ""
echo ">>> Step 4: Building and deploying Cloud Run backend..."
cd backend
npm ci
npm run build
gcloud run deploy $BACKEND_SERVICE \
  --source=. \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-env-vars="GCP_PROJECT_ID=$PROJECT_ID,GCP_REGION=$REGION" \
  --min-instances=0 \
  --max-instances=3 \
  --memory=512Mi \
  --cpu=1 \
  --project=$PROJECT_ID

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format='value(status.url)' --project=$PROJECT_ID)
echo "Backend deployed at: $BACKEND_URL"
cd ..

# --------------------------------------------------------
# Step 5: Deploy Cloud Functions
# --------------------------------------------------------
echo ""
echo ">>> Step 5: Deploying Cloud Functions..."
cd functions
npm ci
npm run build
firebase deploy --only functions --project=$PROJECT_ID
cd ..

# --------------------------------------------------------
# Step 6: Build and deploy frontend to Firebase Hosting
# --------------------------------------------------------
echo ""
echo ">>> Step 6: Building and deploying frontend..."
cd app
npm ci
npm run build
cd ..
firebase deploy --only hosting --project=$PROJECT_ID

HOSTING_URL="https://${PROJECT_ID}.web.app"

# --------------------------------------------------------
# Step 7: Seed demo users
# --------------------------------------------------------
echo ""
echo ">>> Step 7: Seeding demo users..."
echo "    Running: node infrastructure/seed-admin.js"
echo ""
node infrastructure/seed-admin.js || echo "User seeding failed — you can retry manually later."

echo ""
echo "========================================"
echo "DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Frontend:  $HOSTING_URL"
echo "Backend:   $BACKEND_URL"
echo ""
echo "Demo accounts:"
echo "  Marketer: sarah.chen@acmefinancial.ca / Xcelr8Mkt2026!"
echo "  Legal:    priya.sharma@acmefinancial.ca / Xcelr8Legal2026!"
echo "  Admin:    admin@acmefinancial.ca / Xcelr8Admin2026!"
echo ""
echo "Visit $HOSTING_URL and sign in!"
echo "========================================"
