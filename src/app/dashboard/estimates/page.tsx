'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Send,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { Estimate, EstimateStatus } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { StatusBadge, SearchInput } from '@/components/ui';

// Demo data
const estimates: Estimate[] = [
  {
    id: 'EST-001',
    client: 'Metro Builders Inc',
    clientEmail: 'billing@metrobuilders.com',
    project: 'Highland Shopping Center - Electrical',
    description: 'Complete electrical installation for new retail spaces',
    items: [
      { id: '1', description: 'Electrical Panel Installation', quantity: 4, rate: 2500, total: 10000 },
      { id: '2', description: 'Lighting & Fixture Installation', quantity: 120, rate: 85, total: 10200 },
      { id: '3', description: 'Wiring & Conduit (labor)', quantity: 200, rate: 75, total: 15000 },
    ],
    subtotal: 35200,
    tax: 2816,
    total: 38016,
    status: 'sent',
    validUntil: '2026-03-15',
    createdAt: '2026-02-01',
  },
  {
    id: 'EST-002',
    client: 'Downtown Development LLC',
    clientEmail: 'projects@downtowndev.com',
    project: 'Riverside Apartments - Phase 2',
    description: 'Electrical rough-in for 24 apartment units',
    items: [
      { id: '1', description: 'Per-unit electrical rough-in', quantity: 24, rate: 3500, total: 84000 },
      { id: '2', description: 'Common area electrical', quantity: 1, rate: 12000, total: 12000 },
    ],
    subtotal: 96000,
    tax: 7680,
    total: 103680,
    status: 'accepted',
    validUntil: '2026-02-28',
    createdAt: '2026-01-20',
    acceptedAt: '2026-01-25',
    convertedToInvoice: 'INV-015',
  },
  {
    id: 'EST-003',
    client: 'Smith Builders',
    clientEmail: 'john@smithbuilders.com',
    project: 'Office Renovation - Conference Room',
    description: 'Upgrade electrical and lighting in conference rooms',
    items: [
      { id: '1', description: 'Lighting upgrade', quantity: 8, rate: 450, total: 3600 },
      { id: '2', description: 'Power outlet installation', quantity: 12, rate: 150, total: 1800 },
      { id: '3', description: 'AV system wiring', quantity: 1, rate: 2500, total: 2500 },
    ],
    subtotal: 7900,
    tax: 632,
    total: 8532,
    status: 'draft',
    validUntil: '2026-03-01',
    createdAt: '2026-02-02',
  },
  {
    id: 'EST-004',
    client: 'ABC General Contractors',
    clientEmail: 'accounts@abcgc.com',
    project: 'Warehouse Expansion',
    description: 'High-bay lighting and power distribution for warehouse expansion',
    items: [
      { id: '1', description: 'High-bay LED fixtures', quantity: 40, rate: 650, total: 26000 },
      { id: '2', description: 'Power distribution panel', quantity: 2, rate: 5500, total: 11000 },
      { id: '3', description: 'Installation labor', quantity: 120, rate: 85, total: 10200 },
    ],
    subtotal: 47200,
    tax: 3776,
    total: 50976,
    status: 'declined',
    validUntil: '2026-02-15',
    createdAt: '2026-01-10',
  },
  {
    id: 'EST-005',
    client: 'Thompson Construction',
    clientEmail: 'mike@thompsonconstruction.com',
    project: 'Medical Office Build-out',
    description: 'Electrical installation for new medical office suite',
    items: [
      { id: '1', description: 'Medical-grade electrical installation', quantity: 1, rate: 18000, total: 18000 },
      { id: '2', description: 'Emergency power circuit', quantity: 1, rate: 4500, total: 4500 },
    ],
    subtotal: 22500,
    tax: 1800,
    total: 24300,
    status: 'expired',
    validUntil: '2026-01-20',
    createdAt: '2026-01-05',
  },
];

const statusFilters = [
  { value: 'all', label: 'All Estimates' },
  { value: 'draft', label: 'Drafts' },
  { value: 'sent', label: 'Sent' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'declined', label: 'Declined' },
  { value: 'expired', label: 'Expired' },
];

export default function EstimatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEstimates = estimates.filter((estimate) => {
    const matchesSearch =
      estimate.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
      estimate.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || estimate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    total: estimates.length,
    pending: estimates.filter((e) => e.status === 'sent').length,
    accepted: estimates.filter((e) => e.status === 'accepted').length,
    acceptanceRate: Math.round(
      (estimates.filter((e) => e.status === 'accepted').length /
        estimates.filter((e) => ['accepted', 'declined'].includes(e.status)).length) *
        100
    ),
    totalValue: estimates
      .filter((e) => e.status === 'accepted')
      .reduce((sum, e) => sum + e.total, 0),
  };

  const getStatusIcon = (status: EstimateStatus) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-[#22C55E]" />;
      case 'declined':
        return <XCircle className="w-4 h-4 text-[#EF4444]" />;
      case 'sent':
        return <Send className="w-4 h-4 text-[#54A0FF]" />;
      case 'expired':
        return <Clock className="w-4 h-4 text-[#1a1a2e]/40" />;
      default:
        return <FileText className="w-4 h-4 text-[#1a1a2e]/60" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#54A0FF] rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Estimates</h1>
            <p className="text-[#1a1a2e]/60">Create and manage project quotes</p>
          </div>
        </div>
        <Link
          href="/dashboard/estimates/new"
          className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          New Estimate
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Total Estimates</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Awaiting Response</p>
          <p className="text-2xl font-bold text-[#54A0FF]">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Acceptance Rate</p>
          <p className="text-2xl font-bold text-[#22C55E]">{stats.acceptanceRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Accepted Value</p>
          <p className="text-2xl font-bold text-[#9FE870]">{formatCurrency(stats.totalValue)}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search estimates..."
          className="flex-1"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                statusFilter === filter.value
                  ? 'bg-[#1a1a2e] text-white'
                  : 'bg-white border border-[#1a1a2e]/10 text-[#1a1a2e]/70 hover:border-[#9FE870]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estimates List */}
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
        {filteredEstimates.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-[#1a1a2e]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-[#1a1a2e]/30" />
            </div>
            <p className="text-[#1a1a2e]/60 mb-4">No estimates found</p>
            <Link
              href="/dashboard/estimates/new"
              className="inline-flex items-center gap-2 text-[#9FE870] font-medium hover:underline"
            >
              Create your first estimate
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[#1a1a2e]/5">
            {filteredEstimates.map((estimate) => (
              <Link
                key={estimate.id}
                href={`/dashboard/estimates/${estimate.id}`}
                className="flex items-center justify-between p-4 hover:bg-[#F7FBF4] transition-colors group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-[#54A0FF]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {getStatusIcon(estimate.status)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#1a1a2e] truncate">
                        {estimate.id}
                      </span>
                      <StatusBadge status={estimate.status} />
                    </div>
                    <p className="text-sm text-[#1a1a2e]/70 truncate">{estimate.client}</p>
                    <p className="text-sm text-[#1a1a2e]/50 truncate">{estimate.project}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="font-semibold text-[#1a1a2e]">
                      {formatCurrency(estimate.total)}
                    </p>
                    <p className="text-xs text-[#1a1a2e]/50">
                      Valid until {new Date(estimate.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  {estimate.status === 'accepted' && estimate.convertedToInvoice && (
                    <span className="hidden md:inline-flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3" />
                      {estimate.convertedToInvoice}
                    </span>
                  )}
                  <button
                    className="p-2 text-[#1a1a2e]/40 hover:text-[#1a1a2e] opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.preventDefault();
                      // Would open actions menu
                    }}
                    aria-label="More actions"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick tips */}
      <div className="bg-[#54A0FF]/10 rounded-xl p-6 border border-[#54A0FF]/20">
        <h3 className="font-semibold text-[#1a1a2e] mb-3">Pro Tips</h3>
        <ul className="space-y-2 text-sm text-[#1a1a2e]/70">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#54A0FF] mt-0.5 flex-shrink-0" />
            Accepted estimates can be converted to invoices with one click
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#54A0FF] mt-0.5 flex-shrink-0" />
            Set competitive validity periods (usually 30 days) to encourage quick decisions
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-[#54A0FF] mt-0.5 flex-shrink-0" />
            Use PayScore to check client reliability before providing estimates
          </li>
        </ul>
      </div>
    </div>
  );
}
