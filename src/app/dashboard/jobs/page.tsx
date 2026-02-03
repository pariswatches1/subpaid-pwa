'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Plus, Search, MoreVertical, ChevronRight, DollarSign, Clock, Users } from 'lucide-react';

const jobs = [
  { id: 1, name: 'Riverside Apartments - Electrical', client: 'ABC General Contractors', progress: 45000, total: 85000, status: 'active', crew: 3, icon: '⚡', color: 'bg-[#F8BF24]' },
  { id: 2, name: 'Downtown Office Tower - HVAC', client: 'Metro Builders Inc', progress: 75000, total: 125000, status: 'active', crew: 4, icon: '🔧', color: 'bg-[#FF9F43]' },
  { id: 3, name: 'Smith Residence - Plumbing', client: 'Smith Builders', progress: 12000, total: 12000, status: 'completed', crew: 2, icon: '🚿', color: 'bg-[#54A0FF]' },
  { id: 4, name: 'Highland Mall - Fire Suppression', client: 'Highland Construction', progress: 8500, total: 45000, status: 'active', crew: 2, icon: '🔥', color: 'bg-[#EF4444]' },
];

export default function JobsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const filteredJobs = jobs.filter(job => {
    if (filter !== 'all' && job.status !== filter) return false;
    if (search && !job.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totals = {
    active: jobs.filter(j => j.status === 'active').length,
    completed: jobs.filter(j => j.status === 'completed').length,
    totalValue: jobs.reduce((a, b) => a + b.total, 0),
    collected: jobs.reduce((a, b) => a + b.progress, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF9F43] rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Jobs</h1>
            <p className="text-[#1a1a2e]/60">Track all your projects</p>
          </div>
        </div>
        <Link href="/dashboard/jobs/new" className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Job
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Active Jobs</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{totals.active}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Completed</p>
          <p className="text-2xl font-bold text-[#22C55E]">{totals.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Total Value</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(totals.totalValue)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Collected</p>
          <p className="text-2xl font-bold text-[#9FE870]">{formatCurrency(totals.collected)}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-[#1a1a2e]/10 rounded-xl focus:border-[#9FE870] focus:outline-none"
        >
          <option value="all">All Jobs</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Jobs Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/jobs/${job.id}`}
            className="bg-white rounded-xl border border-[#1a1a2e]/10 p-5 hover:shadow-lg transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${job.color} rounded-xl flex items-center justify-center text-2xl`}>
                  {job.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e] group-hover:text-[#9FE870] transition-colors">{job.name}</h3>
                  <p className="text-sm text-[#1a1a2e]/60">{job.client}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-[#9FE870]/10 text-[#1a1a2e]' : 'bg-[#22C55E]/10 text-[#22C55E]'}`}>
                {job.status === 'active' ? 'Active' : 'Completed'}
              </span>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[#1a1a2e]/60">Progress</span>
                <span className="font-medium text-[#1a1a2e]">{formatCurrency(job.progress)} / {formatCurrency(job.total)}</span>
              </div>
              <div className="h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#9FE870] rounded-full transition-all"
                  style={{ width: `${(job.progress / job.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-[#1a1a2e]/60">
                  <Users className="w-4 h-4" />
                  {job.crew} crew
                </span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#1a1a2e]/40 group-hover:text-[#9FE870] transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
