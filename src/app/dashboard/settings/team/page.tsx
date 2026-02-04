'use client';

import { useState } from 'react';
import { Plus, MoreVertical, Mail, Shield, Trash2, UserPlus } from 'lucide-react';

const teamMembers = [
  { id: 1, name: 'Sam Johnson', email: 'sam@electricalpros.com', role: 'Owner', status: 'Active', avatar: 'SJ' },
  { id: 2, name: 'Mike Chen', email: 'mike@electricalpros.com', role: 'Admin', status: 'Active', avatar: 'MC' },
  { id: 3, name: 'Sarah Williams', email: 'sarah@electricalpros.com', role: 'Member', status: 'Active', avatar: 'SW' },
  { id: 4, name: 'John Davis', email: 'john@electricalpros.com', role: 'Member', status: 'Pending', avatar: 'JD' },
];

const roles = ['Owner', 'Admin', 'Member', 'Viewer'];

export default function TeamSettingsPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const handleInvite = () => {
    // Handle invite logic
    console.log('Inviting:', inviteEmail, 'as', inviteRole);
    setShowInviteModal(false);
    setInviteEmail('');
    setInviteRole('Member');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-[#1a1a2e]">Team Members</h2>
          <p className="text-sm text-gray-500">{teamMembers.length} members in your organization</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Team List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Member</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teamMembers.map((member) => (
              <tr key={member.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#9FE870]/20 rounded-full flex items-center justify-center text-sm font-medium text-[#1a1a2e]">
                      {member.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    member.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                    member.role === 'Admin' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {member.role === 'Owner' && <Shield className="w-3 h-3" />}
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {member.status === 'Pending' && (
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Resend invite">
                        <Mail className="w-4 h-4 text-gray-500" />
                      </button>
                    )}
                    {member.role !== 'Owner' && (
                      <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Remove member">
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
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

      {/* Role Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Role Permissions</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-4 text-sm">
            <div className="font-medium text-gray-500">Permission</div>
            <div className="font-medium text-center text-gray-500">Owner</div>
            <div className="font-medium text-center text-gray-500">Admin</div>
            <div className="font-medium text-center text-gray-500">Member</div>
          </div>
          {[
            { name: 'Manage team members', owner: true, admin: true, member: false },
            { name: 'Access billing', owner: true, admin: true, member: false },
            { name: 'Create invoices', owner: true, admin: true, member: true },
            { name: 'View all jobs', owner: true, admin: true, member: true },
            { name: 'Delete records', owner: true, admin: false, member: false },
          ].map((perm) => (
            <div key={perm.name} className="grid grid-cols-4 gap-4 text-sm py-2 border-t border-gray-100">
              <div className="text-gray-700">{perm.name}</div>
              <div className="text-center">{perm.owner ? '✓' : '—'}</div>
              <div className="text-center">{perm.admin ? '✓' : '—'}</div>
              <div className="text-center">{perm.member ? '✓' : '—'}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Invite Team Member</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                >
                  {roles.filter(r => r !== 'Owner').map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInviteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
