'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Mail, Phone, MoreVertical, Search, X, Loader2 } from 'lucide-react';

const initialCrew = [
  { id: 1, name: 'Jose Martinez', initials: 'JM', role: 'Lead Electrician', email: 'jose@company.com', phone: '(555) 123-4567', hourlyRate: 45, hoursThisWeek: 42, status: 'active' },
  { id: 2, name: 'Carlos Rivera', initials: 'CR', role: 'Electrician', email: 'carlos@company.com', phone: '(555) 234-5678', hourlyRate: 38, hoursThisWeek: 40, status: 'active' },
  { id: 3, name: 'David Chen', initials: 'DC', role: 'Electrician', email: 'david@company.com', phone: '(555) 345-6789', hourlyRate: 38, hoursThisWeek: 45, status: 'active' },
  { id: 4, name: 'Mike Thompson', initials: 'MT', role: 'HVAC Technician', email: 'mike@company.com', phone: '(555) 456-7890', hourlyRate: 42, hoursThisWeek: 38, status: 'active' },
  { id: 5, name: 'Sarah Kim', initials: 'SK', role: 'HVAC Technician', email: 'sarah@company.com', phone: '(555) 567-8901', hourlyRate: 40, hoursThisWeek: 36, status: 'active' },
  { id: 6, name: 'Tom Wilson', initials: 'TW', role: 'Apprentice', email: 'tom@company.com', phone: '(555) 678-9012', hourlyRate: 22, hoursThisWeek: 0, status: 'inactive' },
];

export default function CrewPage() {
  const router = useRouter();
  const [crewMembers, setCrewMembers] = useState(initialCrew);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    hourlyRate: '',
  });

  const filteredCrew = crewMembers.filter((member) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  });

  const activeCrew = crewMembers.filter(c => c.status === 'active').length;
  const totalHours = crewMembers.reduce((a, b) => a + b.hoursThisWeek, 0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAddCrewMember = async () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!formData.role.trim()) {
      setError('Role is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/crew', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email || null,
          phone: formData.phone || null,
          role: formData.role,
          hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to add crew member');
      }

      const newMember = {
        id: Date.now(),
        name: formData.name,
        initials: getInitials(formData.name),
        role: formData.role,
        email: formData.email || '',
        phone: formData.phone || '',
        hourlyRate: formData.hourlyRate ? parseFloat(formData.hourlyRate) : 0,
        hoursThisWeek: 0,
        status: 'active' as const,
      };

      setCrewMembers([...crewMembers, newMember]);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', role: '', hourlyRate: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add crew member. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = (memberId: number) => {
    setCrewMembers(crewMembers.map((m) =>
      m.id === memberId
        ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' }
        : m
    ));
    setOpenMenuId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Crew</h1>
          <p className="text-[#1a1a2e]/60">Manage your team members</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Add Crew Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Total Crew</p>
          <p className="text-3xl font-bold text-[#1a1a2e]">{crewMembers.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Active</p>
          <p className="text-3xl font-bold text-[#22C55E]">{activeCrew}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Hours This Week</p>
          <p className="text-3xl font-bold text-[#54A0FF]">{totalHours}h</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
        <input
          type="text"
          placeholder="Search crew..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCrew.map((member) => (
          <div key={member.id} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white font-semibold">
                  {member.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">{member.name}</h3>
                  <p className="text-sm text-[#1a1a2e]/60">{member.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {member.status}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/70">
                <Mail className="w-4 h-4" />
                {member.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/70">
                <Phone className="w-4 h-4" />
                {member.phone}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-[#1a1a2e]/50">Hourly Rate</p>
                <p className="font-semibold text-[#1a1a2e]">${member.hourlyRate}/hr</p>
              </div>
              <div>
                <p className="text-xs text-[#1a1a2e]/50">This Week</p>
                <p className="font-semibold text-[#1a1a2e]">{member.hoursThisWeek}h</p>
              </div>
              <div className="relative">
                <button
                  onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                  className="p-2 text-[#1a1a2e]/40 hover:text-[#1a1a2e]"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                {openMenuId === member.id && (
                  <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 w-44 py-1">
                    <button
                      onClick={() => {
                        router.push(`/dashboard/crew/${member.id}`);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleToggleStatus(member.id)}
                      className="w-full text-left px-4 py-2 text-sm text-[#1a1a2e] hover:bg-gray-50"
                    >
                      {member.status === 'active' ? 'Set Inactive' : 'Set Active'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrew.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-[#1a1a2e]/20 mx-auto mb-3" />
          <p className="text-[#1a1a2e]/60">No crew members found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Add Crew Member</h3>
              <button onClick={() => { setShowModal(false); setError(''); }} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="email@company.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 000-0000"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  required
                >
                  <option value="">Select role...</option>
                  <option value="Lead Electrician">Lead Electrician</option>
                  <option value="Electrician">Electrician</option>
                  <option value="HVAC Technician">HVAC Technician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Apprentice">Apprentice</option>
                  <option value="Foreman">Foreman</option>
                  <option value="Laborer">Laborer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                <input
                  type="number"
                  step="0.50"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setError(''); }} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                onClick={handleAddCrewMember}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Member'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
