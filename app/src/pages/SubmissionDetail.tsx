import { useParams, Link } from 'react-router-dom';
import { mockSubmissions, mockReviews } from '../lib/mockData';
import {
  STATUS_LABELS,
  CONTENT_TYPE_LABELS,
  RISK_LABELS,
  type SubmissionStatus,
} from '../types';
import {
  ArrowLeft,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { format } from 'date-fns';

const statusConfig: Record<
  SubmissionStatus,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  submitted: {
    icon: <Clock className="w-5 h-5" />,
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  ai_processing: {
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  in_review: {
    icon: <AlertCircle className="w-5 h-5" />,
    color: 'text-amber-600',
    bg: 'bg-amber-100',
  },
  revision_needed: {
    icon: <AlertTriangle className="w-5 h-5" />,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
  approved: {
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
};

const riskBg: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

export default function SubmissionDetail() {
  const { id } = useParams<{ id: string }>();
  const submission = mockSubmissions.find((s) => s.id === id);
  const reviews = mockReviews.filter((r) => r.submissionId === id);

  if (!submission) {
    return (
      <div className="p-8">
        <p className="text-slate-500">Submission not found.</p>
        <Link to="/dashboard" className="text-indigo-600 text-sm mt-2 inline-block">
          Back to dashboard
        </Link>
      </div>
    );
  }

  const sc = statusConfig[submission.status];

  return (
    <div className="p-8 max-w-5xl">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {submission.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{CONTENT_TYPE_LABELS[submission.contentType]}</span>
            <span>·</span>
            <code className="bg-slate-100 px-2 py-0.5 rounded font-mono text-xs">
              {submission.referenceId}
            </code>
            <span>·</span>
            <span>
              Submitted {format(submission.createdAt, 'MMM d, yyyy h:mm a')}
            </span>
          </div>
        </div>
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${sc.bg} ${sc.color}`}
        >
          {sc.icon}
          <span className="font-medium">
            {STATUS_LABELS[submission.status]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Details */}
        <div className="col-span-2 space-y-6">
          {/* AI Summary */}
          {submission.aiSummary && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-500" />
                AI Summary
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                {submission.aiSummary}
              </p>
            </div>
          )}

          {/* Risk Factors */}
          {submission.riskFactors.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-red-500" />
                Risk Factors
                {submission.riskScore && (
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium ${riskBg[submission.riskScore]}`}
                  >
                    {RISK_LABELS[submission.riskScore]}
                  </span>
                )}
              </h2>
              <div className="space-y-3">
                {submission.riskFactors.map((rf, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-lg border ${riskBg[rf.severity]}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{rf.category}</span>
                      <span className="text-xs font-mono">{rf.regulation}</span>
                    </div>
                    <p className="text-sm opacity-90">{rf.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="text-sm font-semibold text-slate-900 mb-4">
                Review History
              </h2>
              {reviews.map((review) => (
                <div key={review.id} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-semibold">
                      {review.reviewerName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {review.reviewerName}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        review.decision === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : review.decision === 'revision_needed'
                          ? 'bg-orange-100 text-orange-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {review.decision.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">
                      {format(review.createdAt, 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                  {review.comments.map((c) => (
                    <div
                      key={c.id}
                      className="ml-9 p-3 bg-slate-50 rounded-lg mb-2"
                    >
                      {c.section && (
                        <span className="text-xs font-medium text-indigo-600 mb-1 block">
                          {c.section}
                        </span>
                      )}
                      <p className="text-sm text-slate-700">{c.text}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Files & Metadata */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Files
            </h2>
            <div className="space-y-2">
              {submission.fileNames.map((name, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  <span className="text-sm text-slate-700 truncate">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-slate-500">Submitted By</dt>
                <dd className="font-medium text-slate-900">
                  {submission.submitterName}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Content Type</dt>
                <dd className="font-medium text-slate-900">
                  {CONTENT_TYPE_LABELS[submission.contentType]}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Reference ID</dt>
                <dd className="font-mono text-slate-900">
                  {submission.referenceId}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Last Updated</dt>
                <dd className="font-medium text-slate-900">
                  {format(submission.updatedAt, 'MMM d, yyyy h:mm a')}
                </dd>
              </div>
            </dl>
          </div>

          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Status Timeline
            </h2>
            <div className="space-y-3">
              {(
                [
                  'submitted',
                  'ai_processing',
                  'in_review',
                  'approved',
                ] as SubmissionStatus[]
              ).map((status, i) => {
                const order = [
                  'submitted',
                  'ai_processing',
                  'in_review',
                  'revision_needed',
                  'approved',
                ];
                const currentIdx = order.indexOf(submission.status);
                const stepIdx = order.indexOf(status);
                const isComplete = stepIdx <= currentIdx;
                const isCurrent = status === submission.status;

                return (
                  <div key={status} className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isComplete
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {isComplete ? '✓' : i + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? 'font-semibold text-indigo-600'
                          : isComplete
                          ? 'text-slate-900'
                          : 'text-slate-400'
                      }`}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
