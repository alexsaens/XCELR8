

**XCELR8**

The AI-Powered Marketing-Legal Dynamic

**Project Requirements Document**

Version 1.0

February 2026

CONFIDENTIAL

| Status | Draft |
| :---- | :---- |
| **Target Delivery** | Sunday, March 1, 2026 |
| **Industry** | Financial Services |
| **Region** | Canada |

**Table of Contents**

# **1\. Executive Summary**

XCELR8 is an AI-powered platform designed to eliminate the bottleneck between marketing and legal teams in financial services organizations. By combining the legal domain expertise of SaulLM-7B with the general intelligence of Google Gemini, the platform provides real-time risk assessment, automated content summarization, and comprehensive legal precedent research through a unified interface.

The platform replaces fragmented communication channels (email, Slack) with a centralized submission and review workflow, ensuring no context is lost, every decision is auditable, and legal review cycles are dramatically shortened. Built on a greenfield Google Cloud architecture, XCELR8 leverages Vertex AI, Firebase, BigQuery, and Cloud Run to deliver a scalable, secure, and compliant solution tailored to Canadian financial services regulatory requirements.

# **2\. Problem Statement**

## **2.1 Current State**

Marketing teams in financial services operate under strict regulatory requirements. Every piece of content, whether it is a paid search ad, landing page, email campaign, or video script, must be reviewed and approved by legal before publication. Today, this process is managed through a combination of email threads and Slack messages, leading to several critical issues:

* Context Loss: Conversations about specific content are scattered across multiple channels, making it difficult to track the history of a review or the rationale behind decisions.

* No Audit Trail: There is no centralized record of what was reviewed, what feedback was given, when approvals were granted, or who approved them.

* Bottleneck Effect: Legal teams are overwhelmed by the volume of incoming requests with no way to prioritize based on risk level or urgency.

* Repetitive Work: Legal reviewers frequently encounter similar compliance issues across different content pieces but have no systematic way to reference past decisions or apply consistent standards.

* Delayed Time-to-Market: Marketing campaigns miss launch windows because content sits in legal review queues without visibility into status or expected turnaround.

## **2.2 Desired Future State**

A unified platform where marketers submit content through a simple interface, AI pre-processes and risk-scores each submission, and legal reviewers work from an intelligent dashboard that surfaces relevant precedents, automates routine analysis, and maintains a complete audit trail of every decision.

# **3\. Objectives and Success Metrics**

## **3.1 Primary Objectives**

1. Reduce average legal review turnaround time by 50% or more within the first 90 days of deployment.

2. Establish a single source of truth for all marketing-legal review workflows, eliminating reliance on email and Slack for content approvals.

3. Provide AI-powered risk assessment that pre-screens content before it reaches a human reviewer, allowing legal teams to prioritize high-risk items.

4. Build a continuously growing internal legal knowledge base (RAG) that improves over time as the legal team adds decisions and precedents.

## **3.2 Key Performance Indicators**

| KPI | Baseline | Target | Timeframe |
| :---- | :---- | :---- | :---- |
| Avg. review turnaround | 5-7 business days | 1-2 business days | 90 days |
| Content submissions via platform | 0% | 90%+ | 60 days |
| AI risk assessment accuracy | N/A | 85%+ | 90 days |
| Legal precedent hit rate | N/A | 70%+ relevant | 120 days |
| Compliance audit completeness | Partial | 100% traceable | 30 days |

# **4\. User Roles and Personas**

## **4.1 Marketer (Primary User)**

**Profile:** Marketing professionals responsible for creating and submitting content for legal review. They need a fast, intuitive interface that does not disrupt their existing workflow.

**Goals:** Submit content quickly, track review status in real-time, receive clear and actionable feedback, and get content approved and published as fast as possible.

**Pain Points:** Currently lose track of submissions in email, do not know where content is in the review pipeline, and receive feedback that lacks context about why changes are needed.

## **4.2 Legal Reviewer (Secondary User)**

**Profile:** In-house legal counsel or compliance officers responsible for reviewing marketing content to ensure regulatory compliance. They need comprehensive context to make informed decisions quickly.

**Goals:** Review content efficiently with AI-assisted analysis, access relevant internal and external legal precedents without manual research, maintain consistent compliance standards across all reviews, and build an institutional knowledge base over time.

**Pain Points:** Overwhelmed by volume, spend significant time on repetitive low-risk reviews, lack easy access to past decisions, and struggle to maintain consistency across reviewers.

## **4.3 Administrator**

**Profile:** System administrators or team leads responsible for managing the platform, user access, and the internal legal knowledge base.

**Goals:** Manage user accounts and permissions, configure AI model parameters and risk thresholds, oversee the internal RAG repository, and monitor platform usage and performance.

# **5\. User Stories and Workflows**

## **5.1 Marketer Submission Flow**

1. As a marketer, I can drag and drop or upload content files (PDFs, images, HTML, video, text documents) to submit them for legal review.

2. As a marketer, I can specify the content type (paid search, landing page, email campaign, social media, video script, etc.) during submission.

3. As a marketer, the system automatically detects and extracts any job number, campaign ID, or project reference from my uploaded content and displays it in my dashboard.

4. As a marketer, I can see the real-time status of each submission (Submitted, AI Processing, In Legal Review, Revision Needed, Approved) in my review dashboard.

5. As a marketer, I receive clear feedback with specific annotations when legal requests revisions, including the reason and relevant compliance context.

6. As a marketer, I can resubmit revised content and see the full revision history for any submission.

## **5.2 Legal Review Flow**

1. As a legal reviewer, I see a prioritized queue of submissions sorted by AI-generated risk score (High, Medium, Low).

2. As a legal reviewer, I work in a three-pane dashboard: marketing content on the left, AI summary and chat interface in the center, and legal precedents and research on the right.

3. As a legal reviewer, the AI provides an automated summary of the submitted content, highlighting potential compliance risks specific to Canadian financial services regulations.

4. As a legal reviewer, I can interact with the AI via a chat interface to ask questions about the content, request deeper analysis, or explore specific compliance concerns.

5. As a legal reviewer, the right pane automatically surfaces relevant results from both the internal RAG repository and CanLII based on the content being reviewed.

6. As a legal reviewer, I can approve, request revisions (with annotations), or flag content for escalation.

7. As a legal reviewer, every action I take is logged in a full audit trail tied to the submission.

## **5.3 Admin Flow**

1. As an admin, I can manage user accounts, assign roles (Marketer, Legal, Admin), and configure team permissions.

2. As an admin, I can upload documents to the internal legal RAG repository and manage its contents.

3. As an admin, I can configure risk scoring thresholds and AI model parameters.

4. As an admin, I can view platform analytics including submission volumes, average review times, approval rates, and AI accuracy metrics.

## **5.4 AI Processing Pipeline**

When content is submitted, the following automated pipeline executes:

1. File Intake: Content is uploaded to Cloud Storage and metadata is recorded in Firestore.

2. Content Parsing: Gemini parses and extracts text, identifies the content type, and detects any job numbers or reference identifiers.

3. Summarization: Gemini generates a concise summary of the content for the legal reviewer.

4. Risk Assessment: SaulLM-7B analyzes the content against Canadian financial services regulations and assigns a risk score (High, Medium, Low) with specific risk factors identified.

5. Precedent Matching: The system queries both the internal RAG repository (via Vertex AI Vector Search) and CanLII API for relevant precedents, past decisions, and applicable legislation.

6. Dashboard Population: Results are written to Firestore and the legal dashboard updates in real-time.

# **6\. Feature Requirements (MoSCoW)**

## **6.1 Must Have (MVP for Sunday Delivery)**

* Drag-and-drop file upload interface for marketers supporting PDF, DOCX, images (PNG, JPG), HTML, and plain text.

* Content type selection during submission (paid search, landing page, email, social, video script, other).

* Automatic job number and reference ID extraction from uploaded content.

* Marketer dashboard showing submission status (Submitted, AI Processing, In Review, Revision Needed, Approved).

* Three-pane legal review dashboard (content | AI summary \+ chat | precedents).

* Gemini-powered content summarization and chat interface.

* SaulLM-7B risk assessment with High/Medium/Low scoring.

* Internal RAG repository with document upload and vector search.

* Firebase Authentication with role-based access (Marketer, Legal, Admin).

* Basic audit trail logging all submissions, reviews, and decisions.

* Submission status notifications (in-app).

## **6.2 Should Have (Fast Follow)**

* CanLII API integration for external Canadian legal precedent search.

* Email and push notifications for status changes.

* Revision history and diff view for resubmitted content.

* Legal reviewer annotation tools (highlight and comment on specific content areas).

* Admin analytics dashboard with KPI tracking.

## **6.3 Could Have (Phase 2\)**

* Video and audio content transcription and analysis.

* Batch submission for campaign bundles.

* Custom compliance rule builder for admins.

* Integration with popular marketing tools (Google Ads, HubSpot, Mailchimp).

* Automated compliance report generation.

## **6.4 Won’t Have (This Release)**

* Multi-language support (French Canadian) — planned for future.

* Direct publishing integration (content goes live from the platform).

* Third-party legal review (external counsel access).

* Mobile native application.

# **7\. Content Types and File Handling**

## **7.1 Supported Content Types**

| Content Category | File Formats | AI Processing | Max Size |
| :---- | :---- | :---- | :---- |
| Paid Search Ads | TXT, DOCX, PDF | Text extraction \+ analysis | 10 MB |
| Landing Pages | HTML, PDF, PNG/JPG | HTML parse or OCR \+ analysis | 25 MB |
| Email Campaigns | HTML, PDF, DOCX | Text extraction \+ analysis | 25 MB |
| Social Media | PNG, JPG, PDF, TXT | OCR (images) \+ text analysis | 25 MB |
| Video Scripts | DOCX, PDF, TXT | Text extraction \+ analysis | 10 MB |
| Video/Audio | MP4, MOV, MP3 | Transcription \+ analysis (Phase 2\) | 500 MB |

## **7.2 Job Number and Reference ID Detection**

The AI content parsing layer (Gemini) will be configured to detect and extract common reference identifiers from uploaded content. This includes but is not limited to job numbers, campaign IDs, project codes, ticket references, and any organizational tracking identifier. The system is deliberately flexible and does not impose a rigid numbering scheme, allowing each organization to continue using their existing tracking conventions. Extracted identifiers are auto-populated in the marketer dashboard and linked to the submission record for traceability.

# **8\. AI Architecture**

## **8.1 Dual-Model Strategy**

XCELR8 employs a dual-model AI architecture, leveraging the strengths of two specialized models hosted on Vertex AI:

### **8.1.1 Google Gemini (General Intelligence)**

Gemini serves as the general-purpose AI layer responsible for tasks requiring broad language understanding and flexible reasoning:

* Content parsing and text extraction from diverse file formats.

* Job number and reference identifier detection and extraction.

* Content summarization for legal reviewer consumption.

* Interactive chat interface for legal reviewers to ask follow-up questions.

* Content type classification and metadata enrichment.

### **8.1.2 SaulLM-7B (Legal Domain Specialist)**

SaulLM-7B is a legal-domain language model hosted on Vertex AI, providing specialized legal analysis:

* Compliance risk scoring against Canadian financial services regulations.

* Identification of specific regulatory risk factors (PIPEDA, OSFI guidelines, provincial securities regulations, Ad Standards Canada).

* Legal precedent matching and relevance ranking.

* Risk classification (High, Medium, Low) with detailed justification.

## **8.2 RAG Pipeline (Internal Legal Repository)**

The internal legal knowledge base operates as a Retrieval-Augmented Generation pipeline:

5. Document Ingestion: Legal team uploads documents (past decisions, internal policies, compliance guidelines, regulatory interpretations) via the admin interface.

6. Embedding Generation: Documents are chunked and embedded using Vertex AI text embedding models.

7. Vector Storage: Embeddings are stored in Vertex AI Vector Search for fast similarity retrieval.

8. Query-Time Retrieval: When a new submission is processed, the system generates an embedding of the content and retrieves the most relevant documents from the vector store.

9. Augmented Generation: Retrieved documents are provided as context to SaulLM-7B and Gemini for more informed analysis and precedent citation.

## **8.3 CanLII Integration**

The CanLII API provides access to Canadian case law and legislation. Integration approach:

* API key must be requested via the CanLII feedback form (action item: submit request immediately).

* The API is a read-only REST API returning JSON, supporting case browsing, legislation browsing, and a case citator.

* Relevant queries will be constructed based on the compliance risk factors identified by SaulLM-7B.

* Results will be displayed in the right pane of the legal review dashboard with case titles, citations, and direct links to full text on CanLII.

* Note: The CanLII API provides metadata and URLs, not full text. Full case text is available via the CanLII website links.

* Existing Node.js and Python client libraries are available to accelerate integration.

# **9\. Technology Stack and Architecture**

## **9.1 Technology Stack**

| Layer | Technology | Purpose |
| :---- | :---- | :---- |
| AI / ML | Vertex AI \+ Gemini | Summarization, chat, content parsing, ID extraction |
| AI / ML | Vertex AI \+ SaulLM-7B | Legal risk assessment, compliance analysis, precedent matching |
| AI / ML | Vertex AI Vector Search | Internal RAG repository embedding storage and retrieval |
| Frontend | Firebase Hosting | Marketer and legal dashboards (web application) |
| Authentication | Firebase Authentication | User management, role-based access control |
| Backend API | Cloud Run | Serverless backend services and API endpoints |
| Real-time Data | Firestore | Submission status, comments, chat, real-time updates |
| Analytics | BigQuery | Audit trails, review history, KPI reporting |
| File Storage | Cloud Storage (GCS) | Uploaded content files (all formats) |
| Event Processing | Cloud Functions | Event-driven triggers (upload processing pipeline) |
| External Data | CanLII API | Canadian case law and legislation |
| Security | IAM, VPC, Cloud Audit Logs | Role-based permissions, network security, traceability |

## **9.2 Architecture Flow**

The high-level data flow through the system follows this sequence:

7. Marketer uploads content via Firebase-hosted web app.

8. Cloud Function triggers on upload, writes metadata to Firestore, stores file in Cloud Storage.

9. Cloud Run backend orchestrates the AI processing pipeline.

10. Gemini parses content, extracts text and identifiers, generates summary.

11. SaulLM-7B performs risk assessment and identifies compliance concerns.

12. Vector Search queries internal RAG for relevant precedents.

13. CanLII API is queried for external Canadian legal precedents (when available).

14. Results are written to Firestore; legal dashboard updates in real-time.

15. Legal reviewer works in three-pane dashboard, takes action.

16. All actions are logged to BigQuery for audit and analytics.

# **10\. Data Model**

## **10.1 Firestore Collections (Real-time)**

### **submissions**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Auto-generated document ID |
| submittedBy | string | User ID of the submitting marketer |
| contentType | string | Category: paid\_search, landing\_page, email, social, video\_script, other |
| fileUrls | array\[string\] | Cloud Storage paths to uploaded files |
| referenceId | string | Auto-extracted job number or campaign identifier |
| status | string | submitted | ai\_processing | in\_review | revision\_needed | approved |
| riskScore | string | AI-assigned: high | medium | low |
| riskFactors | array\[object\] | Specific compliance risks identified |
| aiSummary | string | Gemini-generated content summary |
| assignedReviewer | string | User ID of assigned legal reviewer |
| createdAt | timestamp | Submission timestamp |
| updatedAt | timestamp | Last update timestamp |

### **reviews**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Auto-generated document ID |
| submissionId | string | Reference to parent submission |
| reviewerId | string | User ID of the legal reviewer |
| decision | string | approved | revision\_needed | escalated |
| comments | array\[object\] | Reviewer annotations and feedback |
| precedentsCited | array\[object\] | Internal and CanLII precedents referenced |
| createdAt | timestamp | Review timestamp |

### **chatSessions**

| Field | Type | Description |
| :---- | :---- | :---- |
| id | string | Auto-generated document ID |
| submissionId | string | Reference to parent submission |
| messages | array\[object\] | Chat history: {role, content, timestamp} |

## **10.2 BigQuery Tables (Analytics and Audit)**

BigQuery stores the immutable audit trail and aggregated analytics data. Key tables include: audit\_log (every system action with actor, action, target, timestamp, and metadata), submission\_analytics (denormalized view of submissions for KPI reporting), and review\_metrics (review duration, decision patterns, and reviewer workload).

# **11\. Security and Compliance**

## **11.1 Canadian Regulatory Considerations**

As a platform handling marketing content for financial services in Canada, XCELR8 must account for the following regulatory frameworks:

* PIPEDA (Personal Information Protection and Electronic Documents Act): Ensure any personal data within marketing content is identified and handled according to privacy requirements. The platform itself must protect user data and maintain appropriate consent mechanisms.

* OSFI Guidelines: Content related to federally regulated financial institutions must comply with the Office of the Superintendent of Financial Institutions guidelines on advertising and disclosure.

* Provincial Securities Regulations: Marketing content for investment products must comply with provincial securities commission requirements regarding advertising, performance claims, and risk disclosure.

* Ad Standards Canada: All marketing content must adhere to the Canadian Code of Advertising Standards, including truthfulness, accuracy, and clarity requirements.

* CASL (Canadian Anti-Spam Legislation): Email marketing content must comply with CASL requirements for commercial electronic messages.

## **11.2 Platform Security**

* Firebase Authentication with enforced role-based access control (RBAC) across three roles: Marketer, Legal, Admin.

* IAM policies limiting access to Google Cloud resources based on principle of least privilege.

* VPC with private endpoints for Vertex AI model serving to keep AI inference traffic off the public internet.

* Cloud Storage encryption at rest (Google-managed or customer-managed keys) for all uploaded content.

* Cloud Audit Logs enabled for full traceability of all platform operations.

* Firestore Security Rules enforcing data access based on user role and ownership.

* HTTPS enforced for all client-server communication.

## **11.3 Data Retention**

All submissions, reviews, and audit logs will be retained in accordance with the organization’s data retention policy and applicable regulatory requirements. BigQuery audit data will be retained for a minimum of 7 years to satisfy financial services record-keeping requirements. Content files in Cloud Storage will follow the same retention schedule.

# **12\. Timeline and Milestones**

Target delivery: Sunday, March 1, 2026\. The timeline is aggressive and requires focused execution on Must Have features only. Should Have features will follow in a fast-follow release.

| Day | Focus Area | Deliverables | Dependencies |
| :---- | :---- | :---- | :---- |
| Day 1 (Mon) | Infrastructure \+ Auth | GCP project, Firebase setup, Auth with RBAC, Firestore schema | GCP billing account |
| Day 2 (Tue) | Upload \+ Storage Pipeline | File upload UI, Cloud Storage integration, Cloud Function triggers | Day 1 complete |
| Day 3 (Wed) | AI Pipeline \- Gemini | Content parsing, summarization, job number extraction, chat interface | Vertex AI API enabled |
| Day 4 (Thu) | AI Pipeline \- SaulLM-7B | Model deployment on Vertex AI, risk scoring, compliance analysis | SaulLM-7B model access |
| Day 5 (Fri) | RAG \+ Legal Dashboard | Vector Search setup, RAG pipeline, three-pane dashboard | Days 3-4 complete |
| Day 6 (Sat) | Integration \+ Audit | End-to-end pipeline, BigQuery audit logging, status tracking | Days 1-5 complete |
| Day 7 (Sun) | Testing \+ Deployment | QA, bug fixes, production deployment, smoke testing | All features complete |

# **13\. Risks and Mitigations**

| Risk | Likelihood | Impact | Mitigation | Contingency |
| :---- | :---- | :---- | :---- | :---- |
| CanLII API key not approved in time | Medium | Medium | Submit request immediately; build interface to accept key later | Launch without CanLII; add as fast-follow |
| SaulLM-7B deployment complexity on Vertex AI | Medium | High | Begin model deployment Day 1; have fallback to Gemini-only risk assessment | Use Gemini for all AI tasks initially |
| Aggressive timeline causes quality issues | High | Medium | Strict MoSCoW prioritization; cut Should Have features early | Deliver core workflow only; defer dashboard polish |
| AI risk scoring accuracy insufficient | Medium | Medium | Set expectations for supervised AI; legal always has final say | Treat AI scores as advisory; improve with training data over time |
| File format parsing failures | Medium | Low | Support core formats first (PDF, DOCX, TXT); add others iteratively | Allow manual text entry as fallback |
| Vertex AI quota or capacity limits | Low | High | Request quota increases early; monitor usage during testing | Queue submissions and process asynchronously |

# **14\. Future Considerations and Roadmap**

## **14.1 Phase 2 (Weeks 2-4)**

* CanLII full integration with intelligent query construction based on content risk factors.

* Video and audio transcription and analysis support.

* Enhanced annotation tools for legal reviewers (inline commenting on content).

* Admin analytics dashboard with KPI tracking and trend visualization.

* Email and push notification system for status updates.

## **14.2 Phase 3 (Months 2-3)**

* French Canadian language support for bilingual content review.

* Custom compliance rule builder allowing admins to define organization-specific rules.

* Integration with marketing platforms (Google Ads, HubSpot, Mailchimp) for direct content import.

* Automated compliance report generation for regulatory audits.

* Batch submission and campaign bundle review.

## **14.3 Long-term Vision**

* Predictive compliance: AI proactively flags potential issues during content creation, before submission.

* Cross-organization benchmarking: Anonymized compliance patterns across financial services organizations.

* Regulatory change monitoring: Automated alerts when new regulations or case law affect existing approved content.

* Self-improving AI: Continuous model fine-tuning based on legal reviewer decisions to improve risk scoring accuracy over time.

*End of Document — XCELR8 PRD v1.0*
