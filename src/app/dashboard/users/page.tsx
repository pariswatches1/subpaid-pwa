'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Users, Search, Filter, MoreVertical, Mail, Shield,
  UserPlus, Download, Trash2, Edit, Eye, Ban, CheckCircle
} from 'lucide-react';

const users = [
  {
    id: 1,
    name: 'Sam Johnson',
    email: 'sam@electricalpros.com',
    role: 'Owner',
    status: 'Active',
    company: 'Electrical Pros LLC',
    plan: 'Pro',
    joined: 'Jan 15, 2025',
    lastActive: '2 minutes ago',
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Mike Chen',
    email: 'mike@electricalpros.com',
    role: 'Admin',
    status: 'Active',
    company: 'Electrical Pros LLC',
    plan: 'Pro',
    joined: 'Feb 1, 2025',
    lastActive: '1 hour ago',
    avatar: 'MC'
  },
  {
    id: 3,
    name: 'Sarah Williams',
    email: 'sarah@acmeplumbing.com',
    role: 'Member',
    status: 'Active',
    company: 'ACME Plumbing',
    plan: 'Starter',
    joined: 'Mar 10, 2025',
    lastActive: '3 hours ago',
    avatar: 'SW'
  },
  {
    id: 4,
    name: 'John Davis',
    email: 'john@buildersunited.com',
    role: 'Member',
    status: 'Suspended',
    company: 'Builders United',
    plan: 'Enterprise',
    joined: 'Dec 5, 2024',
    lastActive: '2 days ago',
    avatar: 'JD'
  },
  {
    id: 5,
    name: 'Lisa Thompson',
    email: 'lisa@roofingexperts.com',
    role: 'Owner',
    status: 'Active',
    company: 'Roofing Experts Inc',
    plan: 'Pro',
    joined: 'Nov 20, 2024',
    lastActive: '5 minutes ago',
    avatar: 'LT'
  },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role.toLowerCase() === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const toggleSelect = (id: number) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#54A0FF]/20 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-[#54A0FF]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">User Management</h1>
            <p className="text-[#1a1a2e]/60">{users.length} total users</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> Add User
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name, email, or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] outline-none"
            >
              <option value="all">All Roles</option>
              <option value="owner">Owner</option>
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-[#54A0FF]/10 rounded-lg p-4 flex items-center justify-between">
          <span className="text-[#1a1a2e] font-medium">{selectedUsers.length} users selected</span>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
              <Mail className="w-4 h-4" /> Email
            </button>
            <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1">
              <Ban className="w-4 h-4" /> Suspend
            </button>
            <button className="px-3 py-1.5 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100 flex items-center gap-1">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-6 py-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">User</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Company</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Plan</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Last Active</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => toggleSelect(user.id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#9FE870]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1a1a2e]">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.company}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'Owner' && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.plan === 'Enterprise' ? 'bg-purple-100 text-purple-700' :
                    user.plan === 'Pro' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.plan}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {user.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.lastActive}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
                      <Edit className="w-4 h-4 text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50" disabled>
            Previous
          </button>
          <button className="px-3 py-1.5 bg-[#1a1a2e] text-white rounded-lg text-sm font-medium">
            1
          </button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
