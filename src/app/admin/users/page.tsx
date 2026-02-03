'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Mail, Ban, UserCheck, Download, X, AlertTriangle, CheckCircle } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  company: string;
  plan: string;
  mrr: number;
  status: string;
  joined: string;
  invoices: number;
  collected: number;
}

const initialUsers: User[] = [
  { id: 1, name: 'John Martinez', email: 'john@electricalpros.com', company: 'Electrical Pros LLC', plan: 'Pro', mrr: 79, status: 'active', joined: 'Jan 15, 2026', invoices: 47, collected: 125000 },
  { id: 2, name: 'Sarah Chen', email: 'sarah@plumbingco.com', company: 'Chen Plumbing', plan: 'Autopilot', mrr: 149, status: 'active', joined: 'Jan 10, 2026', invoices: 82, collected: 245000 },
  { id: 3, name: 'Mike Johnson', email: 'mike@hvacexperts.com', company: 'HVAC Experts', plan: 'Starter', mrr: 29, status: 'trial', joined: 'Feb 1, 2026', invoices: 5, collected: 8500 },
  { id: 4, name: 'Lisa Williams', email: 'lisa@buildersllc.com', company: 'Williams Builders', plan: 'Pro', mrr: 79, status: 'active', joined: 'Dec 20, 2025', invoices: 156, collected: 520000 },
  { id: 5, name: 'David Brown', email: 'david@roofingpro.com', company: 'Brown Roofing', plan: 'Starter', mrr: 0, status: 'churned', joined: 'Nov 5, 2025', invoices: 23, collected: 45000 },
  { id: 6, name: 'Emma Davis', email: 'emma@fireprotection.com', company: 'Fire Pro Systems', plan: 'Enterprise', mrr: 299, status: 'active', joined: 'Oct 15, 2025', invoices: 234, collected: 890000 },
  { id: 7, name: 'James Wilson', email: 'james@steelworks.com', company: 'Wilson Steel', plan: 'Pro', mrr: 79, status: 'active', joined: 'Jan 28, 2026', invoices: 12, collected: 67000 },
  { id: 8, name: 'Amy Thompson', email: 'amy@paintpros.com', company: 'Paint Professionals', plan: 'Starter', mrr: 29, status: 'active', joined: 'Feb 2, 2026', invoices: 8, collected: 12000 },
];

// Confirmation Modal Component
function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'red',
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor?: 'red' | 'green' | 'blue';
}) {
  if (!isOpen) return null;

  const colorClasses = {
    red: 'bg-red-600 hover:bg-red-700',
    green: 'bg-green-600 hover:bg-green-700',
    blue: 'bg-[#54A0FF] hover:bg-[#4090EF]',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${confirmColor === 'red' ? 'bg-red-100' : confirmColor === 'green' ? 'bg-green-100' : 'bg-blue-100'}`}>
            {confirmColor === 'red' ? (
              <AlertTriangle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle className={`w-5 h-5 ${confirmColor === 'green' ? 'text-green-600' : 'text-[#54A0FF]'}`} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
            <p className="text-gray-600 mt-1">{message}</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-white rounded-lg transition-colors ${colorClasses[confirmColor]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Notification Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded" aria-label="Close notification">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  // Modal state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'ban' | 'verify' | 'email' | null;
    user: User | null;
  }>({ isOpen: false, type: null, user: null });

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleBanUser = (user: User) => {
    setModalConfig({ isOpen: true, type: 'ban', user });
  };

  const handleVerifyUser = (user: User) => {
    setModalConfig({ isOpen: true, type: 'verify', user });
  };

  const handleEmailUser = (user: User) => {
    setModalConfig({ isOpen: true, type: 'email', user });
  };

  const confirmAction = () => {
    if (!modalConfig.user) return;

    switch (modalConfig.type) {
      case 'ban':
        setUsers(users.map(u =>
          u.id === modalConfig.user!.id ? { ...u, status: 'churned' } : u
        ));
        showToast(`${modalConfig.user.name} has been banned`, 'success');
        break;
      case 'verify':
        setUsers(users.map(u =>
          u.id === modalConfig.user!.id ? { ...u, status: 'active' } : u
        ));
        showToast(`${modalConfig.user.name} has been verified`, 'success');
        break;
      case 'email':
        showToast(`Email sent to ${modalConfig.user.email}`, 'success');
        break;
    }

    setModalConfig({ isOpen: false, type: null, user: null });
  };

  const getModalContent = () => {
    if (!modalConfig.user) return { title: '', message: '', confirmText: '', confirmColor: 'blue' as const };

    switch (modalConfig.type) {
      case 'ban':
        return {
          title: 'Ban User',
          message: `Are you sure you want to ban ${modalConfig.user.name}? They will lose access to their account and all services.`,
          confirmText: 'Ban User',
          confirmColor: 'red' as const,
        };
      case 'verify':
        return {
          title: 'Verify User',
          message: `Verify ${modalConfig.user.name}'s account? This will grant them full access to all features.`,
          confirmText: 'Verify',
          confirmColor: 'green' as const,
        };
      case 'email':
        return {
          title: 'Send Email',
          message: `Send an email to ${modalConfig.user.email}?`,
          confirmText: 'Send Email',
          confirmColor: 'blue' as const,
        };
      default:
        return { title: '', message: '', confirmText: '', confirmColor: 'blue' as const };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredUsers = users.filter(user => {
    if (filter !== 'all' && user.status !== filter) return false;
    if (search && !user.name.toLowerCase().includes(search.toLowerCase()) && !user.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Active</span>;
      case 'trial': return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Trial</span>;
      case 'churned': return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">Churned</span>;
      default: return null;
    }
  };

  const getPlanBadge = (plan: string) => {
    const colors: { [key: string]: string } = {
      'Starter': 'bg-gray-100 text-gray-700',
      'Pro': 'bg-[#54A0FF]/10 text-[#54A0FF]',
      'Autopilot': 'bg-[#9FE870]/10 text-[#1a1a2e]',
      'Enterprise': 'bg-[#FF9F43]/10 text-[#FF9F43]',
    };
    return <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[plan]}`}>{plan}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-500">Manage all platform users</p>
        </div>
        <button className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2d2d44] transition-all flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Active</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Trial</p>
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === 'trial').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Churned</p>
          <p className="text-2xl font-bold text-red-600">{users.filter(u => u.status === 'churned').length}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#54A0FF] focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-[#54A0FF] focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="trial">Trial</option>
          <option value="churned">Churned</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-4 font-medium">User</th>
              <th className="text-left px-6 py-4 font-medium">Plan</th>
              <th className="text-left px-6 py-4 font-medium">MRR</th>
              <th className="text-left px-6 py-4 font-medium">Status</th>
              <th className="text-right px-6 py-4 font-medium">Invoices</th>
              <th className="text-right px-6 py-4 font-medium">Collected</th>
              <th className="text-right px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white font-medium">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{getPlanBadge(user.plan)}</td>
                <td className="px-6 py-4 text-gray-900 font-medium">${user.mrr}/mo</td>
                <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-4 text-right text-gray-700">{user.invoices}</td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(user.collected)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleEmailUser(user)}
                      className="p-2 text-gray-400 hover:text-[#54A0FF] transition-colors"
                      title="Send Email"
                      aria-label={`Send email to ${user.name}`}
                    >
                      <Mail className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleVerifyUser(user)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Verify"
                      aria-label={`Verify ${user.name}`}
                    >
                      <UserCheck className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleBanUser(user)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Ban"
                      aria-label={`Ban ${user.name}`}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={`More options for ${user.name}`}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ isOpen: false, type: null, user: null })}
        onConfirm={confirmAction}
        {...getModalContent()}
      />

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
