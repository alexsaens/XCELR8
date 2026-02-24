import { mockAuditLog } from '../lib/mockData';
import { Shield, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

const actionLabels: Record<string, { label: string; color: string }> = {
  'submission.created': { label: 'Submission Created', color: 'bg-blue-100 text-blue-700' },
  'ai.processing_started': { label: 'AI Processing Started', color: 'bg-purple-100 text-purple-700' },
  'ai.risk_assessment_complete': { label: 'Risk Assessment Complete', color: 'bg-indigo-100 text-indigo-700' },
  'submission.assigned': { label: 'Reviewer Assigned', color: 'bg-cyan-100 text-cyan-700' },
  'review.approved': { label: 'Review Approved', color: 'bg-green-100 text-green-700' },
  'review.revision_requested': { label: 'Revision Requested', color: 'bg-orange-100 text-orange-700' },
};

export default function AdminAudit() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          Audit Log
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete, immutable record of all platform actions — BigQuery backed
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actor
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Action
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Target
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Metadata
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockAuditLog.map((entry) => {
              const actionConfig = actionLabels[entry.action] || {
                label: entry.action,
                color: 'bg-slate-100 text-slate-700',
              };
              return (
                <tr
                  key={entry.id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 text-xs font-mono text-slate-600">
                    {format(entry.timestamp, 'yyyy-MM-dd HH:mm:ss')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        entry.actor === 'System'
                          ? 'text-purple-600'
                          : 'text-slate-900'
                      }`}
                    >
                      {entry.actor}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${actionConfig.color}`}
                    >
                      {actionConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-slate-100 px-2 py-1 rounded font-mono text-slate-600">
                      {entry.target}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(entry.metadata).map(([key, value]) => (
                        <span
                          key={key}
                          className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"
                        >
                          {key}: <span className="font-medium">{value}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3">
        <Shield className="w-5 h-5 text-indigo-500 shrink-0" />
        <p className="text-sm text-slate-600">
          Audit logs are stored in BigQuery with a minimum 7-year retention
          period to satisfy financial services record-keeping requirements. All
          entries are immutable and include actor, action, target, timestamp,
          and metadata.
        </p>
        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
      </div>
    </div>
  );
}
