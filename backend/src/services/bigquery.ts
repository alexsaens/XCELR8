import { BigQuery } from '@google-cloud/bigquery';

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'cs-poc-rlwc9pihxctoazqsylrl3ka';
const DATASET_ID = 'xcelr8_audit';

const bigquery = new BigQuery({ projectId: PROJECT_ID });

/** Initialize BigQuery dataset and tables */
export async function initBigQuery(): Promise<void> {
  const dataset = bigquery.dataset(DATASET_ID);
  const [exists] = await dataset.exists();

  if (!exists) {
    await bigquery.createDataset(DATASET_ID, { location: 'US' });
    console.log(`Created BigQuery dataset: ${DATASET_ID}`);
  }

  // Create audit_log table
  const auditTable = dataset.table('audit_log');
  const [auditExists] = await auditTable.exists();
  if (!auditExists) {
    await dataset.createTable('audit_log', {
      schema: {
        fields: [
          { name: 'id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'actor_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'actor_email', type: 'STRING', mode: 'REQUIRED' },
          { name: 'action', type: 'STRING', mode: 'REQUIRED' },
          { name: 'target_type', type: 'STRING', mode: 'REQUIRED' },
          { name: 'target_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'metadata', type: 'JSON', mode: 'NULLABLE' },
          { name: 'timestamp', type: 'TIMESTAMP', mode: 'REQUIRED' },
        ],
      },
      timePartitioning: { type: 'DAY', field: 'timestamp' },
    });
    console.log('Created audit_log table');
  }

  // Create submission_analytics table
  const analyticsTable = dataset.table('submission_analytics');
  const [analyticsExists] = await analyticsTable.exists();
  if (!analyticsExists) {
    await dataset.createTable('submission_analytics', {
      schema: {
        fields: [
          { name: 'submission_id', type: 'STRING', mode: 'REQUIRED' },
          { name: 'submitted_by', type: 'STRING', mode: 'REQUIRED' },
          { name: 'content_type', type: 'STRING', mode: 'REQUIRED' },
          { name: 'risk_score', type: 'STRING', mode: 'NULLABLE' },
          { name: 'status', type: 'STRING', mode: 'REQUIRED' },
          { name: 'assigned_reviewer', type: 'STRING', mode: 'NULLABLE' },
          { name: 'submitted_at', type: 'TIMESTAMP', mode: 'REQUIRED' },
          { name: 'reviewed_at', type: 'TIMESTAMP', mode: 'NULLABLE' },
          { name: 'review_duration_hours', type: 'FLOAT', mode: 'NULLABLE' },
          { name: 'decision', type: 'STRING', mode: 'NULLABLE' },
        ],
      },
      timePartitioning: { type: 'DAY', field: 'submitted_at' },
    });
    console.log('Created submission_analytics table');
  }
}

/** Log an action to the audit trail */
export async function logAudit(entry: {
  actorId: string;
  actorEmail: string;
  action: string;
  targetType: string;
  targetId: string;
  metadata?: Record<string, string>;
}): Promise<void> {
  const row = {
    id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    actor_id: entry.actorId,
    actor_email: entry.actorEmail,
    action: entry.action,
    target_type: entry.targetType,
    target_id: entry.targetId,
    metadata: JSON.stringify(entry.metadata || {}),
    timestamp: new Date().toISOString(),
  };

  await bigquery.dataset(DATASET_ID).table('audit_log').insert([row]);
}

/** Record submission analytics */
export async function recordSubmissionAnalytics(data: {
  submissionId: string;
  submittedBy: string;
  contentType: string;
  riskScore?: string;
  status: string;
  assignedReviewer?: string;
  submittedAt: string;
  reviewedAt?: string;
  decision?: string;
}): Promise<void> {
  const reviewDuration =
    data.reviewedAt && data.submittedAt
      ? (new Date(data.reviewedAt).getTime() - new Date(data.submittedAt).getTime()) / 3600000
      : null;

  const row = {
    submission_id: data.submissionId,
    submitted_by: data.submittedBy,
    content_type: data.contentType,
    risk_score: data.riskScore || null,
    status: data.status,
    assigned_reviewer: data.assignedReviewer || null,
    submitted_at: data.submittedAt,
    reviewed_at: data.reviewedAt || null,
    review_duration_hours: reviewDuration,
    decision: data.decision || null,
  };

  await bigquery.dataset(DATASET_ID).table('submission_analytics').insert([row]);
}

/** Query audit log entries */
export async function queryAuditLog(options: {
  limit?: number;
  offset?: number;
  targetId?: string;
  action?: string;
}): Promise<unknown[]> {
  let query = `SELECT * FROM \`${PROJECT_ID}.${DATASET_ID}.audit_log\``;
  const conditions: string[] = [];
  const params: Record<string, string> = {};

  if (options.targetId) {
    conditions.push('target_id = @targetId');
    params.targetId = options.targetId;
  }
  if (options.action) {
    conditions.push('action = @action');
    params.action = options.action;
  }

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  query += ` ORDER BY timestamp DESC LIMIT @limit OFFSET @offset`;

  const [rows] = await bigquery.query({
    query,
    params: {
      ...params,
      limit: options.limit || 50,
      offset: options.offset || 0,
    },
  });

  return rows;
}

/** Get analytics summary */
export async function getAnalyticsSummary(): Promise<{
  totalSubmissions: number;
  avgReviewHours: number;
  approvalRate: number;
  riskDistribution: Record<string, number>;
}> {
  const [summaryRows] = await bigquery.query({
    query: `
      SELECT
        COUNT(*) as total,
        AVG(review_duration_hours) as avg_review_hours,
        COUNTIF(decision = 'approved') / NULLIF(COUNTIF(decision IS NOT NULL), 0) as approval_rate
      FROM \`${PROJECT_ID}.${DATASET_ID}.submission_analytics\`
    `,
  });

  const [riskRows] = await bigquery.query({
    query: `
      SELECT risk_score, COUNT(*) as count
      FROM \`${PROJECT_ID}.${DATASET_ID}.submission_analytics\`
      WHERE risk_score IS NOT NULL
      GROUP BY risk_score
    `,
  });

  const riskDistribution: Record<string, number> = {};
  for (const row of riskRows) {
    riskDistribution[row.risk_score] = row.count;
  }

  const summary = summaryRows[0] || {};
  return {
    totalSubmissions: summary.total || 0,
    avgReviewHours: summary.avg_review_hours || 0,
    approvalRate: summary.approval_rate || 0,
    riskDistribution,
  };
}
