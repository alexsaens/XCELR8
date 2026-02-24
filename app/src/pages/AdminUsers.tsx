import { useState } from 'react';
import { mockUsers } from '../lib/mockData';
import type { User, UserRole } from '../types';
import { Users, Plus, Shield, Scale, BarChart3, X } from 'lucide-react';

const roleBadge: Record<UserRole, string> = {
  marketer: 'bg-blue-100 text-blue-700',
  legal: 'bg-purple-100 text-purple-700',
  admin: 'bg-slate-800 text-white',
};

const roleIcon: Record<UserRole, React.ReactNode> = {
  marketer: <BarChart3 className="w-3.5 h-3.5" />,
  legal: <Scale className="w-3.5 h-3.5" />,
  admin: <Shield className="w-3.5 h-3.5" />,
};

export default function AdminUsers() {
  const [users] = useState<User[]>(mockUsers);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            User Management
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage user accounts and role-based access control
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Role Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {(
          [
            {
              role: 'marketer' as UserRole,
              label: 'Marketers',
              icon: BarChart3,
              color: 'blue',
            },
            {
              role: 'legal' as UserRole,
              label: 'Legal Reviewers',
              icon: Scale,
              color: 'purple',
            },
            {
              role: 'admin' as UserRole,
              label: 'Administrators',
              icon: Shield,
              color: 'slate',
            },
          ] as const
        ).map(({ role, label, icon: Icon, color }) => (
          <div
            key={role}
            className={`bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4`}
          >
            <div
              className={`w-10 h-10 bg-${color}-100 rounded-lg flex items-center justify-center`}
            >
              <Icon className={`w-5 h-5 text-${color}-600`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {users.filter((u) => u.role === role).length}
              </p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-semibold">
                      {u.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span className="text-sm font-medium text-slate-900">
                      {u.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {u.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleBadge[u.role]}`}
                  >
                    {roleIcon[u.role]}
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium mr-4">
                    Edit
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Add New User
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="user@company.ca"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="marketer">Marketer</option>
                  <option value="legal">Legal Reviewer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add User
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-slate-700 text-sm font-medium hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
