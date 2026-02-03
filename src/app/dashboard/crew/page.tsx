'use client';

import { Users, Plus, Mail, Phone, MoreVertical, Search } from 'lucide-react';

const crew = [
  { id: 1, name: 'Jose Martinez', initials: 'JM', role: 'Lead Electrician', email: 'jose@company.com', phone: '(555) 123-4567', hourlyRate: 45, hoursThisWeek: 42, status: 'active' },
  { id: 2, name: 'Carlos Rivera', initials: 'CR', role: 'Electrician', email: 'carlos@company.com', phone: '(555) 234-5678', hourlyRate: 38, hoursThisWeek: 40, status: 'active' },
  { id: 3, name: 'David Chen', initials: 'DC', role: 'Electrician', email: 'david@company.com', phone: '(555) 345-6789', hourlyRate: 38, hoursThisWeek: 45, status: 'active' },
  { id: 4, name: 'Mike Thompson', initials: 'MT', role: 'HVAC Technician', email: 'mike@company.com', phone: '(555) 456-7890', hourlyRate: 42, hoursThisWeek: 38, status: 'active' },
  { id: 5, name: 'Sarah Kim', initials: 'SK', role: 'HVAC Technician', email: 'sarah@company.com', phone: '(555) 567-8901', hourlyRate: 40, hoursThisWeek: 36, status: 'active' },
  { id: 6, name: 'Tom Wilson', initials: 'TW', role: 'Apprentice', email: 'tom@company.com', phone: '(555) 678-9012', hourlyRate: 22, hoursThisWeek: 0, status: 'inactive' },
];

export default function CrewPage() {
  const activeCrew = crew.filter(c => c.status === 'active').length;
  const totalHours = crew.reduce((a, b) => a + b.hoursThisWeek, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Crew</h1>
          <p className="text-[#1a1a2e]/60">Manage your team members</p>
        </div>
        <button className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Crew Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Total Crew</p>
          <p className="text-3xl font-bold text-[#1a1a2e]">{crew.length}</p>
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
        <input type="text" placeholder="Search crew..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crew.map((member) => (
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
              <button className="p-2 text-[#1a1a2e]/40 hover:text-[#1a1a2e]">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
