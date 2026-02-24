import { mockSubmissions } from '../lib/mockData';
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Brain,
  Target,
} from 'lucide-react';

export default function AdminAnalytics() {
  const total = mockSubmissions.length;
  const approved = mockSubmissions.filter((s) => s.status === 'approved').length;
  const highRisk = mockSubmissions.filter((s) => s.riskScore === 'high').length;
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-indigo-600" />
          Analytics Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Platform performance and compliance KPIs
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Total Submissions',
            value: total,
            icon: FileText,
            color: 'indigo',
            change: '+12%',
          },
          {
            label: 'Avg. Review Time',
            value: '1.5 days',
            icon: Clock,
            color: 'blue',
            change: '-62%',
          },
          {
            label: 'Approval Rate',
            value: `${Math.round((approved / total) * 100)}%`,
            icon: CheckCircle2,
            color: 'green',
            change: '+8%',
          },
          {
            label: 'AI Accuracy',
            value: '87%',
            icon: Brain,
            color: 'purple',
            change: '+5%',
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-slate-200 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <kpi.icon className={`w-5 h-5 text-${kpi.color}-500`} />
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                {kpi.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
            <p className="text-sm text-slate-500 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Submissions by Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Submissions by Status
          </h3>
          <div className="space-y-3">
            {[
              {
                label: 'Approved',
                count: mockSubmissions.filter((s) => s.status === 'approved')
                  .length,
                color: 'bg-green-500',
              },
              {
                label: 'In Review',
                count: mockSubmissions.filter((s) => s.status === 'in_review')
                  .length,
                color: 'bg-amber-500',
              },
              {
                label: 'Revision Needed',
                count: mockSubmissions.filter(
                  (s) => s.status === 'revision_needed'
                ).length,
                color: 'bg-orange-500',
              },
              {
                label: 'AI Processing',
                count: mockSubmissions.filter(
                  (s) => s.status === 'ai_processing'
                ).length,
                color: 'bg-blue-500',
              },
              {
                label: 'Submitted',
                count: mockSubmissions.filter((s) => s.status === 'submitted')
                  .length,
                color: 'bg-slate-400',
              },
            ].map((status) => (
              <div key={status.label}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-slate-700">{status.label}</span>
                  <span className="font-medium text-slate-900">
                    {status.count}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className={`${status.color} rounded-full h-2 transition-all`}
                    style={{
                      width: `${(status.count / total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">
            Risk Distribution
          </h3>
          <div className="flex items-end gap-6 justify-center h-48">
            {[
              {
                label: 'High',
                count: highRisk,
                color: 'bg-red-500',
                height: `${(highRisk / total) * 200}px`,
              },
              {
                label: 'Medium',
                count: mockSubmissions.filter((s) => s.riskScore === 'medium')
                  .length,
                color: 'bg-amber-500',
                height: `${
                  (mockSubmissions.filter((s) => s.riskScore === 'medium')
                    .length /
                    total) *
                  200
                }px`,
              },
              {
                label: 'Low',
                count: mockSubmissions.filter((s) => s.riskScore === 'low')
                  .length,
                color: 'bg-green-500',
                height: `${
                  (mockSubmissions.filter((s) => s.riskScore === 'low').length /
                    total) *
                  200
                }px`,
              },
              {
                label: 'Pending',
                count: mockSubmissions.filter((s) => !s.riskScore).length,
                color: 'bg-slate-300',
                height: `${
                  (mockSubmissions.filter((s) => !s.riskScore).length / total) *
                  200
                }px`,
              },
            ].map((bar) => (
              <div key={bar.label} className="flex flex-col items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  {bar.count}
                </span>
                <div
                  className={`w-14 ${bar.color} rounded-t-lg transition-all`}
                  style={{ height: bar.height, minHeight: '16px' }}
                />
                <span className="text-xs text-slate-600">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Targets */}
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-indigo-500" />
          KPI Targets vs. Actuals
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">
                  KPI
                </th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">
                  Baseline
                </th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">
                  Target
                </th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">
                  Current
                </th>
                <th className="text-left py-2 text-xs font-semibold text-slate-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                {
                  kpi: 'Avg. Review Turnaround',
                  baseline: '5-7 days',
                  target: '1-2 days',
                  current: '1.5 days',
                  onTrack: true,
                },
                {
                  kpi: 'Platform Adoption',
                  baseline: '0%',
                  target: '90%+',
                  current: '78%',
                  onTrack: false,
                },
                {
                  kpi: 'AI Risk Accuracy',
                  baseline: 'N/A',
                  target: '85%+',
                  current: '87%',
                  onTrack: true,
                },
                {
                  kpi: 'Precedent Hit Rate',
                  baseline: 'N/A',
                  target: '70%+',
                  current: '72%',
                  onTrack: true,
                },
                {
                  kpi: 'Audit Completeness',
                  baseline: 'Partial',
                  target: '100%',
                  current: '100%',
                  onTrack: true,
                },
              ].map((row) => (
                <tr key={row.kpi}>
                  <td className="py-3 text-sm font-medium text-slate-900">
                    {row.kpi}
                  </td>
                  <td className="py-3 text-sm text-slate-500">
                    {row.baseline}
                  </td>
                  <td className="py-3 text-sm text-slate-500">{row.target}</td>
                  <td className="py-3 text-sm font-semibold text-slate-900">
                    {row.current}
                  </td>
                  <td className="py-3">
                    {row.onTrack ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        On Track
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-3 h-3" />
                        Needs Focus
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
