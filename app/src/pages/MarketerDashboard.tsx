import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockSubmissions } from '../lib/mockData';
import {
  STATUS_LABELS,
  CONTENT_TYPE_LABELS,
  RISK_LABELS,
  type SubmissionStatus,
} from '../types';
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Loader2,
  FileText,
  ArrowUpRight,
} from 'lucide-react';
import { format } from 'date-fns';

const statusIcons: Record<SubmissionStatus, React.ReactNode> = {
  submitted: <Clock className="w-4 h-4 text-slate-400" />,
  ai_processing: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
  in_review: <AlertCircle className="w-4 h-4 text-amber-500" />,
  revision_needed: <AlertTriangle className="w-4 h-4 text-orange-500" />,
  approved: <CheckCircle2 className="w-4 h-4 text-green-500" />,
};

const statusColors: Record<SubmissionStatus, string> = {
  submitted: 'bg-slate-100 text-slate-700',
  ai_processing: 'bg-blue-100 text-blue-700',
  in_review: 'bg-amber-100 text-amber-700',
  revision_needed: 'bg-orange-100 text-orange-700',
  approved: 'bg-green-100 text-green-700',
};

const riskColors: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-green-100 text-green-700',
};

export default function MarketerDashboard() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const submissions = mockSubmissions.filter((s) => {
    if (user?.role === 'marketer' && s.submittedBy !== user.id) return false;
    if (statusFilter !== 'all' && s.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.referenceId.toLowerCase().includes(q) ||
        s.submitterName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    total: mockSubmissions.length,
    pending: mockSubmissions.filter(
      (s) => s.status === 'submitted' || s.status === 'ai_processing'
    ).length,
    inReview: mockSubmissions.filter((s) => s.status === 'in_review').length,
    approved: mockSubmissions.filter((s) => s.status === 'approved').length,
    revision: mockSubmissions.filter((s) => s.status === 'revision_needed')
      .length,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.role === 'marketer'
              ? 'Track your content submissions and review status'
              : 'Overview of all content submissions'}
          </p>
        </div>
        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Submission
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: 'Total',
            value: counts.total,
            color: 'text-slate-900',
            bg: 'bg-white',
          },
          {
            label: 'Pending',
            value: counts.pending,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
          },
          {
            label: 'In Review',
            value: counts.inReview,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
          },
          {
            label: 'Revision Needed',
            value: counts.revision,
            color: 'text-orange-600',
            bg: 'bg-orange-50',
          },
          {
            label: 'Approved',
            value: counts.approved,
            color: 'text-green-600',
            bg: 'bg-green-50',
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.bg} rounded-xl border border-slate-200 p-4`}
          >
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color} mt-1`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, reference ID, or submitter..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-slate-300 rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="ai_processing">AI Processing</option>
            <option value="in_review">In Review</option>
            <option value="revision_needed">Revision Needed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Submission
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Reference
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Risk
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Submitted
              </th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <tr
                key={sub.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {sub.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {sub.fileNames.length} file
                        {sub.fileNames.length !== 1 ? 's' : ''}
                        {user?.role !== 'marketer' &&
                          ` · ${sub.submitterName}`}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700">
                    {CONTENT_TYPE_LABELS[sub.contentType]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                    {sub.referenceId}
                  </code>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}
                  >
                    {statusIcons[sub.status]}
                    {STATUS_LABELS[sub.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {sub.riskScore ? (
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${riskColors[sub.riskScore]}`}
                    >
                      {RISK_LABELS[sub.riskScore]}
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {format(sub.createdAt, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4">
                  <Link
                    to={`/submission/${sub.id}`}
                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No submissions found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
