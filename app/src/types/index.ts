export type UserRole = 'marketer' | 'legal' | 'admin';

export type SubmissionStatus =
  | 'submitted'
  | 'ai_processing'
  | 'in_review'
  | 'revision_needed'
  | 'approved';

export type RiskScore = 'high' | 'medium' | 'low';

export type ContentType =
  | 'paid_search'
  | 'landing_page'
  | 'email'
  | 'social'
  | 'video_script'
  | 'other';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface RiskFactor {
  category: string;
  description: string;
  regulation: string;
  severity: RiskScore;
}

export interface Submission {
  id: string;
  submittedBy: string;
  submitterName: string;
  contentType: ContentType;
  title: string;
  fileUrls: string[];
  fileNames: string[];
  referenceId: string;
  status: SubmissionStatus;
  riskScore: RiskScore | null;
  riskFactors: RiskFactor[];
  aiSummary: string;
  assignedReviewer: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  reviewerName: string;
  decision: 'approved' | 'revision_needed' | 'escalated';
  comments: ReviewComment[];
  precedentsCited: Precedent[];
  createdAt: Date;
}

export interface ReviewComment {
  id: string;
  text: string;
  section?: string;
  createdAt: Date;
}

export interface Precedent {
  id: string;
  title: string;
  citation: string;
  source: 'internal' | 'canlii';
  relevanceScore: number;
  url?: string;
  summary: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface RAGDocument {
  id: string;
  title: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
  fileSize: number;
  status: 'processing' | 'indexed' | 'error';
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  metadata: Record<string, string>;
  timestamp: Date;
}

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  paid_search: 'Paid Search Ad',
  landing_page: 'Landing Page',
  email: 'Email Campaign',
  social: 'Social Media',
  video_script: 'Video Script',
  other: 'Other',
};

export const STATUS_LABELS: Record<SubmissionStatus, string> = {
  submitted: 'Submitted',
  ai_processing: 'AI Processing',
  in_review: 'In Legal Review',
  revision_needed: 'Revision Needed',
  approved: 'Approved',
};

export const RISK_LABELS: Record<RiskScore, string> = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Low Risk',
};
