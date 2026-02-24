import type {
  Submission,
  User,
  Review,
  Precedent,
  ChatMessage,
  RAGDocument,
  AuditEntry,
} from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'sarah.chen@acmefinancial.ca',
    name: 'Sarah Chen',
    role: 'marketer',
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'u2',
    email: 'james.wilson@acmefinancial.ca',
    name: 'James Wilson',
    role: 'marketer',
    createdAt: new Date('2026-01-20'),
  },
  {
    id: 'u3',
    email: 'priya.sharma@acmefinancial.ca',
    name: 'Priya Sharma',
    role: 'legal',
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'u4',
    email: 'david.laurent@acmefinancial.ca',
    name: 'David Laurent',
    role: 'legal',
    createdAt: new Date('2026-01-10'),
  },
  {
    id: 'u5',
    email: 'admin@acmefinancial.ca',
    name: 'Alex Admin',
    role: 'admin',
    createdAt: new Date('2026-01-01'),
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: 'sub-001',
    submittedBy: 'u1',
    submitterName: 'Sarah Chen',
    contentType: 'paid_search',
    title: 'Q1 RRSP Campaign — Google Search Ads',
    fileUrls: ['/uploads/rrsp-campaign-q1.pdf'],
    fileNames: ['rrsp-campaign-q1.pdf'],
    referenceId: 'MKT-2026-0042',
    status: 'in_review',
    riskScore: 'high',
    riskFactors: [
      {
        category: 'Performance Claims',
        description:
          'Ad copy contains projected return percentages ("up to 8% annual returns") without adequate risk disclosure.',
        regulation: 'Provincial Securities Regulations',
        severity: 'high',
      },
      {
        category: 'Missing Disclaimers',
        description:
          'No mention of investment risk or past performance disclaimer required for financial product advertising.',
        regulation: 'Ad Standards Canada',
        severity: 'high',
      },
      {
        category: 'Privacy Concerns',
        description:
          'Landing page form collects SIN without clear privacy notice as required under PIPEDA.',
        regulation: 'PIPEDA',
        severity: 'medium',
      },
    ],
    aiSummary:
      'This submission contains Google Search ad copy and associated landing page for an RRSP investment product campaign. The ads promote tax-advantaged retirement savings with specific return projections. Key compliance concerns include unsubstantiated performance claims, missing risk disclaimers, and a data collection form that may not meet PIPEDA requirements for personal information consent.',
    assignedReviewer: 'u3',
    createdAt: new Date('2026-02-20T09:30:00'),
    updatedAt: new Date('2026-02-20T10:15:00'),
  },
  {
    id: 'sub-002',
    submittedBy: 'u2',
    submitterName: 'James Wilson',
    contentType: 'email',
    title: 'TFSA Awareness Email Series — March 2026',
    fileUrls: ['/uploads/tfsa-email-1.html', '/uploads/tfsa-email-2.html'],
    fileNames: ['tfsa-email-1.html', 'tfsa-email-2.html'],
    referenceId: 'MKT-2026-0045',
    status: 'ai_processing',
    riskScore: 'medium',
    riskFactors: [
      {
        category: 'CASL Compliance',
        description:
          'Email template missing mandatory unsubscribe mechanism and sender identification.',
        regulation: 'CASL',
        severity: 'medium',
      },
    ],
    aiSummary:
      'A two-part email series promoting Tax-Free Savings Account products. The content is generally compliant with financial services advertising standards, but the email templates require updates to meet CASL requirements for commercial electronic messages.',
    assignedReviewer: null,
    createdAt: new Date('2026-02-21T14:00:00'),
    updatedAt: new Date('2026-02-21T14:05:00'),
  },
  {
    id: 'sub-003',
    submittedBy: 'u1',
    submitterName: 'Sarah Chen',
    contentType: 'landing_page',
    title: 'Mortgage Rate Comparison Landing Page',
    fileUrls: ['/uploads/mortgage-landing.html'],
    fileNames: ['mortgage-landing.html'],
    referenceId: 'MKT-2026-0039',
    status: 'approved',
    riskScore: 'low',
    riskFactors: [],
    aiSummary:
      'A landing page comparing fixed and variable mortgage rates with appropriate disclaimers, rate effective dates, and links to full terms and conditions. The content meets regulatory requirements for mortgage rate advertising.',
    assignedReviewer: 'u3',
    createdAt: new Date('2026-02-18T11:00:00'),
    updatedAt: new Date('2026-02-19T16:30:00'),
  },
  {
    id: 'sub-004',
    submittedBy: 'u2',
    submitterName: 'James Wilson',
    contentType: 'social',
    title: 'Instagram — Financial Literacy Month Posts',
    fileUrls: [
      '/uploads/fin-lit-ig-1.png',
      '/uploads/fin-lit-ig-2.png',
      '/uploads/fin-lit-ig-3.png',
    ],
    fileNames: ['fin-lit-ig-1.png', 'fin-lit-ig-2.png', 'fin-lit-ig-3.png'],
    referenceId: 'MKT-2026-0048',
    status: 'submitted',
    riskScore: null,
    riskFactors: [],
    aiSummary: '',
    assignedReviewer: null,
    createdAt: new Date('2026-02-22T08:45:00'),
    updatedAt: new Date('2026-02-22T08:45:00'),
  },
  {
    id: 'sub-005',
    submittedBy: 'u1',
    submitterName: 'Sarah Chen',
    contentType: 'video_script',
    title: 'GIC Promotional Video Script — 60s',
    fileUrls: ['/uploads/gic-promo-script.docx'],
    fileNames: ['gic-promo-script.docx'],
    referenceId: 'MKT-2026-0050',
    status: 'revision_needed',
    riskScore: 'medium',
    riskFactors: [
      {
        category: 'Rate Guarantees',
        description:
          'Script references "guaranteed returns" without specifying GIC terms, conditions, and CDIC coverage limits.',
        regulation: 'OSFI Guidelines',
        severity: 'medium',
      },
      {
        category: 'Comparative Claims',
        description:
          'Script compares GIC returns to stock market without proper context or disclaimers.',
        regulation: 'Ad Standards Canada',
        severity: 'medium',
      },
    ],
    aiSummary:
      'A 60-second promotional video script for Guaranteed Investment Certificates (GICs). While the product claims are generally accurate, the script needs revisions to include proper CDIC coverage disclosure and context for comparative investment claims.',
    assignedReviewer: 'u4',
    createdAt: new Date('2026-02-19T13:00:00'),
    updatedAt: new Date('2026-02-20T11:00:00'),
  },
  {
    id: 'sub-006',
    submittedBy: 'u2',
    submitterName: 'James Wilson',
    contentType: 'paid_search',
    title: 'Credit Card Rewards — Google Ads Refresh',
    fileUrls: ['/uploads/cc-rewards-ads.pdf'],
    fileNames: ['cc-rewards-ads.pdf'],
    referenceId: 'MKT-2026-0051',
    status: 'in_review',
    riskScore: 'low',
    riskFactors: [
      {
        category: 'APR Disclosure',
        description:
          'Interest rate mentioned in ad copy but APR not prominently displayed as required.',
        regulation: 'Cost of Borrowing Regulations',
        severity: 'low',
      },
    ],
    aiSummary:
      'Updated Google Ads copy for the credit card rewards program. The content is largely compliant, with a minor issue regarding APR disclosure prominence. All claims about reward points and benefits align with the current product terms.',
    assignedReviewer: 'u3',
    createdAt: new Date('2026-02-21T10:30:00'),
    updatedAt: new Date('2026-02-21T11:00:00'),
  },
];

export const mockReviews: Review[] = [
  {
    id: 'rev-001',
    submissionId: 'sub-003',
    reviewerId: 'u3',
    reviewerName: 'Priya Sharma',
    decision: 'approved',
    comments: [
      {
        id: 'c1',
        text: 'All rate disclosures are accurate and up to date. Privacy policy link is properly visible. Approved for publication.',
        createdAt: new Date('2026-02-19T16:30:00'),
      },
    ],
    precedentsCited: [],
    createdAt: new Date('2026-02-19T16:30:00'),
  },
  {
    id: 'rev-002',
    submissionId: 'sub-005',
    reviewerId: 'u4',
    reviewerName: 'David Laurent',
    decision: 'revision_needed',
    comments: [
      {
        id: 'c2',
        text: 'The script needs to include CDIC deposit insurance coverage limits ($100,000 per depositor per category). Also, the comparison with stock market returns must include a disclaimer that past performance does not guarantee future results.',
        section: 'Performance Claims',
        createdAt: new Date('2026-02-20T11:00:00'),
      },
      {
        id: 'c3',
        text: 'Please add the standard risk disclosure footer: "GIC rates are subject to change. Terms and conditions apply."',
        section: 'Disclaimers',
        createdAt: new Date('2026-02-20T11:05:00'),
      },
    ],
    precedentsCited: [
      {
        id: 'p1',
        title: 'CDIC Advertising Requirements — Internal Policy',
        citation: 'INT-POL-2025-014',
        source: 'internal',
        relevanceScore: 0.94,
        summary:
          'All marketing materials referencing deposit products must include CDIC coverage disclosure with the current limit per eligible deposit.',
      },
    ],
    createdAt: new Date('2026-02-20T11:00:00'),
  },
];

export const mockPrecedents: Precedent[] = [
  {
    id: 'prec-001',
    title: 'CDIC Advertising Requirements — Internal Policy',
    citation: 'INT-POL-2025-014',
    source: 'internal',
    relevanceScore: 0.94,
    summary:
      'All marketing materials referencing deposit products must include CDIC coverage disclosure with the current limit per eligible deposit.',
  },
  {
    id: 'prec-002',
    title: 'RRSP Advertising Compliance — Q3 2025 Review',
    citation: 'INT-REV-2025-089',
    source: 'internal',
    relevanceScore: 0.91,
    summary:
      'Previous RRSP campaign required removal of projected return figures and addition of "past performance does not guarantee future results" disclaimer.',
  },
  {
    id: 'prec-003',
    title: 'Ontario Securities Commission v. Financial Corp',
    citation: '2024 ONSC 1234',
    source: 'canlii',
    relevanceScore: 0.87,
    url: '#',
    summary:
      'OSC enforcement action against financial services firm for misleading performance claims in retail investment advertising. Resulted in administrative penalties and mandatory compliance review.',
  },
  {
    id: 'prec-004',
    title: 'PIPEDA Compliance Order — Data Collection in Financial Advertising',
    citation: '2025 OPC 0056',
    source: 'canlii',
    relevanceScore: 0.82,
    url: '#',
    summary:
      'Office of the Privacy Commissioner finding regarding collection of SIN and financial data through marketing landing pages without adequate consent mechanisms.',
  },
  {
    id: 'prec-005',
    title: 'Ad Standards Canada — Financial Services Advertising Guidelines',
    citation: 'INT-POL-2025-022',
    source: 'internal',
    relevanceScore: 0.78,
    summary:
      'Internal policy document summarizing Ad Standards Canada requirements for financial services advertising, including truthfulness, clarity of disclaimers, and prominence of APR disclosures.',
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      'I\'ve analyzed the submitted content for submission MKT-2026-0042. This is a Google Search ad campaign for RRSP products with several compliance concerns. The primary issues are:\n\n1. **Performance claims** — The ad copy includes "up to 8% annual returns" which requires substantiation and risk disclosure.\n2. **Missing disclaimers** — No investment risk disclaimer is present.\n3. **Privacy concerns** — The landing page collects SIN without adequate PIPEDA-compliant privacy notice.\n\nHow would you like me to help?',
    timestamp: new Date('2026-02-20T10:16:00'),
  },
];

export const mockRAGDocuments: RAGDocument[] = [
  {
    id: 'rag-001',
    title: 'CDIC Advertising Requirements Policy',
    category: 'Internal Policy',
    uploadedBy: 'Alex Admin',
    uploadedAt: new Date('2026-01-15'),
    fileSize: 245000,
    status: 'indexed',
  },
  {
    id: 'rag-002',
    title: 'Ad Standards Canada — Financial Guidelines Summary',
    category: 'Regulatory Reference',
    uploadedBy: 'Alex Admin',
    uploadedAt: new Date('2026-01-16'),
    fileSize: 1200000,
    status: 'indexed',
  },
  {
    id: 'rag-003',
    title: 'PIPEDA Compliance Checklist for Marketing',
    category: 'Compliance Checklist',
    uploadedBy: 'Priya Sharma',
    uploadedAt: new Date('2026-01-20'),
    fileSize: 89000,
    status: 'indexed',
  },
  {
    id: 'rag-004',
    title: 'OSFI Guideline B-10 — Third Party Risk Management',
    category: 'Regulatory Reference',
    uploadedBy: 'Alex Admin',
    uploadedAt: new Date('2026-02-01'),
    fileSize: 3400000,
    status: 'indexed',
  },
  {
    id: 'rag-005',
    title: 'Q4 2025 Compliance Review Decisions',
    category: 'Past Decisions',
    uploadedBy: 'David Laurent',
    uploadedAt: new Date('2026-02-10'),
    fileSize: 567000,
    status: 'indexed',
  },
  {
    id: 'rag-006',
    title: 'CASL Requirements for Financial Services Email',
    category: 'Regulatory Reference',
    uploadedBy: 'Alex Admin',
    uploadedAt: new Date('2026-02-15'),
    fileSize: 156000,
    status: 'processing',
  },
];

export const mockAuditLog: AuditEntry[] = [
  {
    id: 'aud-001',
    actor: 'Sarah Chen',
    action: 'submission.created',
    target: 'sub-001',
    metadata: { contentType: 'paid_search', referenceId: 'MKT-2026-0042' },
    timestamp: new Date('2026-02-20T09:30:00'),
  },
  {
    id: 'aud-002',
    actor: 'System',
    action: 'ai.processing_started',
    target: 'sub-001',
    metadata: { models: 'gemini, saulm-7b' },
    timestamp: new Date('2026-02-20T09:31:00'),
  },
  {
    id: 'aud-003',
    actor: 'System',
    action: 'ai.risk_assessment_complete',
    target: 'sub-001',
    metadata: { riskScore: 'high', factorsCount: '3' },
    timestamp: new Date('2026-02-20T10:15:00'),
  },
  {
    id: 'aud-004',
    actor: 'System',
    action: 'submission.assigned',
    target: 'sub-001',
    metadata: { reviewer: 'Priya Sharma' },
    timestamp: new Date('2026-02-20T10:16:00'),
  },
  {
    id: 'aud-005',
    actor: 'Priya Sharma',
    action: 'review.approved',
    target: 'sub-003',
    metadata: { decision: 'approved' },
    timestamp: new Date('2026-02-19T16:30:00'),
  },
  {
    id: 'aud-006',
    actor: 'David Laurent',
    action: 'review.revision_requested',
    target: 'sub-005',
    metadata: { decision: 'revision_needed', comments: '2' },
    timestamp: new Date('2026-02-20T11:00:00'),
  },
];
