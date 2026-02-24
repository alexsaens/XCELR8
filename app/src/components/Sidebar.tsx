import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  Scale,
  Shield,
  Users,
  Database,
  BarChart3,
  LogOut,
  Zap,
} from 'lucide-react';

export default function Sidebar() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <aside className="w-64 bg-slate-900 flex flex-col min-h-screen border-r border-slate-700">
      <div className="p-5 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">
            XCELR8
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">Marketing-Legal Compliance</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {(user.role === 'marketer' || user.role === 'admin') && (
          <>
            <NavLink to="/dashboard" className={linkClass} end>
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </NavLink>
            <NavLink to="/submit" className={linkClass}>
              <Upload className="w-4 h-4" />
              New Submission
            </NavLink>
          </>
        )}

        {(user.role === 'legal' || user.role === 'admin') && (
          <NavLink to="/legal" className={linkClass}>
            <Scale className="w-4 h-4" />
            Legal Review
          </NavLink>
        )}

        {user.role === 'admin' && (
          <>
            <div className="pt-4 pb-2">
              <span className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Administration
              </span>
            </div>
            <NavLink to="/admin/users" className={linkClass}>
              <Users className="w-4 h-4" />
              User Management
            </NavLink>
            <NavLink to="/admin/repository" className={linkClass}>
              <Database className="w-4 h-4" />
              RAG Repository
            </NavLink>
            <NavLink to="/admin/analytics" className={linkClass}>
              <BarChart3 className="w-4 h-4" />
              Analytics
            </NavLink>
            <NavLink to="/admin/audit" className={linkClass}>
              <Shield className="w-4 h-4" />
              Audit Log
            </NavLink>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.name}
            </p>
            <p className="text-xs text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
