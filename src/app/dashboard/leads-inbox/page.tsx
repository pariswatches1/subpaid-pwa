'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  Briefcase,
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  MoreVertical,
  ChevronDown,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  ArrowRight,
  PhoneCall,
  FormInput,
  Gavel,
  User,
  AlertCircle,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';

// Lead type from db.ts
interface Lead {
  id: string;
  userId: string;
  leadSourceId?: string;
  sourceType: 'email' | 'call' | 'form' | 'bid' | 'manual';
  sourceName?: string;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  description?: string;
  location?: string;
  trade?: string;
  estimatedValue?: number;
  rawContent?: string;
  rawSubject?: string;
  status: 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'archived';
  priority: 'hot' | 'warm' | 'cold';
  convertedToJobId?: string;
  convertedToEstimateId?: string;
  convertedToInvoiceId?: string;
  callTrackingRecordId?: string;
  receivedAt: string;
  lastContactedAt?: string;
  createdAt: string;
}

interface LeadStats {
  total: number;
  new: number;
  contacted: number;
  quoted: number;
  won: number;
  lost: number;
  thisWeek: number;
  conversionRate: number;
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Get source icon
function getSourceIcon(sourceType: string) {
  switch (sourceType) {
    case 'email': return <Mail className="w-4 h-4" />;
    case 'call': return <PhoneCall className="w-4 h-4" />;
    case 'form': return <FormInput className="w-4 h-4" />;
    case 'bid': return <Gavel className="w-4 h-4" />;
    case 'manual': return <User className="w-4 h-4" />;
    default: return <Inbox className="w-4 h-4" />;
  }
}

// Get source badge color
function getSourceBadgeColor(sourceType: string) {
  switch (sourceType) {
    case 'email': return 'bg-blue-100 text-blue-700';
    case 'call': return 'bg-green-100 text-green-700';
    case 'form': return 'bg-purple-100 text-purple-700';
    case 'bid': return 'bg-orange-100 text-orange-700';
    case 'manual': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

// Get priority indicator
function getPriorityIndicator(priority: string) {
  switch (priority) {
    case 'hot': return { color: 'bg-red-500', label: 'Hot', textColor: 'text-red-600' };
    case 'warm': return { color: 'bg-orange-400', label: 'Warm', textColor: 'text-orange-600' };
    case 'cold': return { color: 'bg-blue-400', label: 'Cold', textColor: 'text-blue-600' };
    default: return { color: 'bg-gray-400', label: 'Unknown', textColor: 'text-gray-600' };
  }
}

// Get status badge
function getStatusBadge(status: string) {
  switch (status) {
    case 'new': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'New' };
    case 'contacted': return { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Contacted' };
    case 'quoted': return { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Quoted' };
    case 'won': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Won' };
    case 'lost': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Lost' };
    case 'archived': return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Archived' };
    default: return { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
  }
}

export default function LeadsInboxPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Set mounted state to prevent hydration mismatch with time formatting
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [filter, sourceFilter]);

  const fetchLeads = async () => {
    try {
      const params = new URLSearchParams();
      if (filter !== 'all') params.set('status', filter);
      if (sourceFilter !== 'all') params.set('sourceType', sourceFilter);

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
    setActionMenuId(null);
  };

  // Filter leads by search
  const filteredLeads = leads.filter(lead => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      (lead.name?.toLowerCase().includes(searchLower)) ||
      (lead.email?.toLowerCase().includes(searchLower)) ||
      (lead.company?.toLowerCase().includes(searchLower)) ||
      (lead.description?.toLowerCase().includes(searchLower)) ||
      (lead.sourceName?.toLowerCase().includes(searchLower))
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#9FE870] to-[#22C55E] rounded-xl flex items-center justify-center">
            <Inbox className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Leads Inbox</h1>
            <p className="text-[#1a1a2e]/60">All your job opportunities in one place</p>
          </div>
        </div>
        <Link
          href="/dashboard/leads-inbox/new"
          className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-full font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`p-4 rounded-xl border transition-all text-left ${
            filter === 'all'
              ? 'bg-[#9FE870]/10 border-[#9FE870]'
              : 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <Inbox className="w-4 h-4 text-[#1a1a2e]/40" />
            <span className="text-sm text-[#1a1a2e]/60">All Leads</span>
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{stats?.total || 0}</p>
        </button>

        <button
          onClick={() => setFilter('new')}
          className={`p-4 rounded-xl border transition-all text-left ${
            filter === 'new'
              ? 'bg-blue-50 border-blue-400'
              : 'bg-white border-[#1a1a2e]/10 hover:border-blue-400/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm text-[#1a1a2e]/60">New</span>
          </div>
          <p className="text-2xl font-bold text-blue-600">{stats?.new || 0}</p>
        </button>

        <button
          onClick={() => setFilter('contacted')}
          className={`p-4 rounded-xl border transition-all text-left ${
            filter === 'contacted'
              ? 'bg-yellow-50 border-yellow-400'
              : 'bg-white border-[#1a1a2e]/10 hover:border-yellow-400/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-yellow-600" />
            <span className="text-sm text-[#1a1a2e]/60">Contacted</span>
          </div>
          <p className="text-2xl font-bold text-yellow-600">{stats?.contacted || 0}</p>
        </button>

        <button
          onClick={() => setFilter('quoted')}
          className={`p-4 rounded-xl border transition-all text-left ${
            filter === 'quoted'
              ? 'bg-purple-50 border-purple-400'
              : 'bg-white border-[#1a1a2e]/10 hover:border-purple-400/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-purple-600" />
            <span className="text-sm text-[#1a1a2e]/60">Quoted</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">{stats?.quoted || 0}</p>
        </button>

        <button
          onClick={() => setFilter('won')}
          className={`p-4 rounded-xl border transition-all text-left ${
            filter === 'won'
              ? 'bg-green-50 border-green-400'
              : 'bg-white border-[#1a1a2e]/10 hover:border-green-400/50'
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-[#1a1a2e]/60">Won</span>
          </div>
          <p className="text-2xl font-bold text-green-600">{stats?.won || 0}</p>
        </button>

        <div className="p-4 rounded-xl bg-gradient-to-br from-[#9FE870]/20 to-[#22C55E]/20 border border-[#22C55E]/30">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-[#22C55E]" />
            <span className="text-sm text-[#1a1a2e]/60">Conversion</span>
          </div>
          <p className="text-2xl font-bold text-[#22C55E]">{stats?.conversionRate || 0}%</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none"
          />
        </div>

        {/* Source Type Filter */}
        <div className="relative">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="appearance-none px-4 py-3 pr-10 bg-white border border-[#1a1a2e]/10 rounded-xl focus:border-[#9FE870] focus:outline-none cursor-pointer"
          >
            <option value="all">All Sources</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
            <option value="form">Form</option>
            <option value="bid">Bid</option>
            <option value="manual">Manual</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40 pointer-events-none" />
        </div>
      </div>

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-12 text-center">
          <Inbox className="w-12 h-12 text-[#9FE870]/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#1a1a2e] mb-2">
            {filter === 'all' ? 'No Leads Yet' : `No ${filter} leads`}
          </h3>
          <p className="text-[#1a1a2e]/60 max-w-md mx-auto mb-6">
            Leads will automatically appear here when they come in via email, calls, forms, or bids.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/leads-inbox/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Lead Manually
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => {
            const priority = getPriorityIndicator(lead.priority);
            const status = getStatusBadge(lead.status);
            const sourceColor = getSourceBadgeColor(lead.sourceType);

            return (
              <div
                key={lead.id}
                className="bg-white rounded-xl border border-[#1a1a2e]/10 hover:border-[#9FE870]/50 transition-all overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Priority Indicator */}
                    <div className={`w-1.5 h-full min-h-[80px] ${priority.color} rounded-full flex-shrink-0`} />

                    {/* Lead Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {/* Source Badge & Time */}
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${sourceColor}`}>
                              {getSourceIcon(lead.sourceType)}
                              {lead.sourceName || lead.sourceType}
                            </span>
                            <span className="text-xs text-[#1a1a2e]/50">
                              {mounted ? formatRelativeTime(lead.receivedAt) : ''}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </div>

                          {/* Name & Company */}
                          <h3 className="font-semibold text-[#1a1a2e] truncate">
                            {lead.name || lead.email || lead.phone || 'Unknown Contact'}
                          </h3>
                          {lead.company && (
                            <p className="text-sm text-[#1a1a2e]/60">{lead.company}</p>
                          )}

                          {/* Description Preview */}
                          {lead.description && (
                            <p className="text-sm text-[#1a1a2e]/70 mt-2 line-clamp-2">
                              {lead.description}
                            </p>
                          )}

                          {/* Contact Info & Details */}
                          <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-[#1a1a2e]/60">
                            {lead.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5" />
                                {lead.phone}
                              </span>
                            )}
                            {lead.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="w-3.5 h-3.5" />
                                {lead.email}
                              </span>
                            )}
                            {lead.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" />
                                {lead.location}
                              </span>
                            )}
                            {lead.trade && (
                              <span className="flex items-center gap-1 px-2 py-0.5 bg-[#1a1a2e]/5 rounded-full">
                                {lead.trade}
                              </span>
                            )}
                            {lead.estimatedValue && (
                              <span className="flex items-center gap-1 font-medium text-green-600">
                                <DollarSign className="w-3.5 h-3.5" />
                                {formatCurrency(lead.estimatedValue)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="p-2 hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                              title="Call"
                            >
                              <Phone className="w-5 h-5" />
                            </a>
                          )}
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Email"
                            >
                              <Mail className="w-5 h-5" />
                            </a>
                          )}
                          {lead.status !== 'won' && lead.status !== 'lost' && (
                            <Link
                              href={`/dashboard/estimates/new?leadId=${lead.id}`}
                              className="p-2 hover:bg-purple-50 text-purple-600 rounded-lg transition-colors"
                              title="Create Estimate"
                            >
                              <FileText className="w-5 h-5" />
                            </Link>
                          )}
                          {lead.status !== 'won' && lead.status !== 'lost' && (
                            <Link
                              href={`/dashboard/jobs/new?leadId=${lead.id}`}
                              className="p-2 hover:bg-orange-50 text-orange-600 rounded-lg transition-colors"
                              title="Create Job"
                            >
                              <Briefcase className="w-5 h-5" />
                            </Link>
                          )}

                          {/* More Actions Menu */}
                          <div className="relative">
                            <button
                              onClick={() => setActionMenuId(actionMenuId === lead.id ? null : lead.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-5 h-5 text-[#1a1a2e]/60" />
                            </button>

                            {actionMenuId === lead.id && (
                              <>
                                <div
                                  className="fixed inset-0 z-10"
                                  onClick={() => setActionMenuId(null)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                                  <Link
                                    href={`/dashboard/leads-inbox/${lead.id}`}
                                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    onClick={() => setActionMenuId(null)}
                                  >
                                    <Users className="w-4 h-4" />
                                    View Details
                                  </Link>
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => updateLeadStatus(lead.id, 'contacted')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <MessageSquare className="w-4 h-4" />
                                    Mark Contacted
                                  </button>
                                  <button
                                    onClick={() => updateLeadStatus(lead.id, 'quoted')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Mark Quoted
                                  </button>
                                  <hr className="my-1" />
                                  <button
                                    onClick={() => updateLeadStatus(lead.id, 'won')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark Won
                                  </button>
                                  <button
                                    onClick={() => updateLeadStatus(lead.id, 'lost')}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                  >
                                    <XCircle className="w-4 h-4" />
                                    Mark Lost
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Converted Banner */}
                {lead.convertedToJobId && (
                  <div className="px-4 py-2 bg-green-50 border-t border-green-100 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    Converted to Job
                    <Link
                      href={`/dashboard/jobs/${lead.convertedToJobId}`}
                      className="ml-auto font-medium hover:underline"
                    >
                      View Job <ArrowRight className="w-3 h-3 inline" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bottom CTA */}
      {leads.length > 0 && (
        <div className="bg-gradient-to-r from-[#9FE870]/10 to-[#54A0FF]/10 border border-[#9FE870]/20 rounded-xl p-6 text-center">
          <Zap className="w-8 h-8 text-[#9FE870] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">
            Turn Leads into Paid Invoices with Autopilot
          </h3>
          <p className="text-[#1a1a2e]/60 mb-4 max-w-md mx-auto">
            Convert leads to jobs, send estimates, and let SAM chase payments automatically.
          </p>
          <Link
            href="/dashboard/autopilot"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors"
          >
            Enable Autopilot
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
