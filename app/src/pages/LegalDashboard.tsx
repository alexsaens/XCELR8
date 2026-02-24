import { useState } from 'react';
import { Link } from 'react-router-dom';
import { mockSubmissions } from '../lib/mockData';
import {
  STATUS_LABELS,
  CONTENT_TYPE_LABELS,
  RISK_LABELS,
  type RiskScore,
} from '../types';
import {
  Scale,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
const riskColors: Record<string, string> = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-amber-500 bg-amber-50',
  low: 'border-l-green-500 bg-green-50',
};
const riskBadge: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

export default function LegalDashboard() {
  const [riskFilter, setRiskFilter] = useState<string>('all');

  const reviewableSubmissions = mockSubmissions
    .filter(
      (s) =>
        s.status === 'in_review' ||
        s.status === 'ai_processing' ||
        s.status === 'revision_needed'
    )
    .filter((s) => riskFilter === 'all' || s.riskScore === riskFilter)
    .sort((a, b) => {
      if (a.riskScore && b.riskScore)
        return riskOrder[a.riskScore] - riskOrder[b.riskScore];
      if (a.riskScore) return -1;
      return 1;
    });

  const completedSubmissions = mockSubmissions.filter(
    (s) => s.status === 'approved'
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Scale className="w-6 h-6 text-indigo-600" />
            Legal Review Queue
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Submissions prioritized by AI risk assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(
          [
            { risk: 'high' as RiskScore, icon: AlertTriangle, color: 'red' },
            { risk: 'medium' as RiskScore, icon: AlertCircle, color: 'amber' },
            { risk: 'low' as RiskScore, icon: CheckCircle2, color: 'green' },
          ] as const
        ).map(({ risk, icon: Icon, color }) => {
          const count = mockSubmissions.filter(
            (s) =>
              s.riskScore === risk &&
              s.status !== 'approved' &&
              s.status !== 'submitted'
          ).length;
          return (
            <div
              key={risk}
              className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4 flex items-center gap-4`}
            >
              <div
                className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 text-${color}-600`} />
              </div>
              <div>
                <p className={`text-2xl font-bold text-${color}-700`}>
                  {count}
                </p>
                <p className={`text-sm text-${color}-600`}>
                  {RISK_LABELS[risk]}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending Review Queue */}
      <h2 className="text-lg font-semibold text-slate-900 mb-4">
        Pending Review ({reviewableSubmissions.length})
      </h2>
      <div className="space-y-3 mb-10">
        {reviewableSubmissions.map((sub) => (
          <div
            key={sub.id}
            className={`border-l-4 ${
              sub.riskScore ? riskColors[sub.riskScore] : 'border-l-slate-300 bg-white'
            } rounded-r-xl border border-slate-200 p-5 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {sub.title}
                  </h3>
                  {sub.riskScore && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${riskBadge[sub.riskScore]}`}
                    >
                      {RISK_LABELS[sub.riskScore]}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {STATUS_LABELS[sub.status]}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                  {sub.aiSummary || 'AI processing in progress...'}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{CONTENT_TYPE_LABELS[sub.contentType]}</span>
                  <span>·</span>
                  <span className="font-mono">{sub.referenceId}</span>
                  <span>·</span>
                  <span>By {sub.submitterName}</span>
                  <span>·</span>
                  <span>{format(sub.createdAt, 'MMM d, yyyy')}</span>
                  {sub.riskFactors.length > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-red-600">
                        {sub.riskFactors.length} risk factor
                        {sub.riskFactors.length !== 1 ? 's' : ''}
                      </span>
                    </>
                  )}
                </div>
              </div>
              <Link
                to={`/legal/review/${sub.id}`}
                className="inline-flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shrink-0 ml-4"
              >
                Review
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
        {reviewableSubmissions.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">Queue is clear</p>
            <p className="text-sm text-slate-500">
              No submissions match your filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Recently Completed */}
      {completedSubmissions.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Recently Approved
          </h2>
          <div className="space-y-2">
            {completedSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-center justify-between bg-white border border-slate-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {sub.title}
                    </p>
                    <p className="text-xs text-slate-500">
                      {sub.submitterName} · {sub.referenceId} ·{' '}
                      {format(sub.updatedAt, 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/submission/${sub.id}`}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  View
                </Link>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
