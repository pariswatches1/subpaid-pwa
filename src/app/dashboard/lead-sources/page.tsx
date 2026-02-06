'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Target,
  Search,
  FileText,
  Briefcase,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  Clock,
  MapPin,
} from 'lucide-react';
import { LeadSource } from '@/lib/keyword-types';
import { LoadingSpinner } from '@/components/ui';

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
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

export default function LeadSourcesPage() {
  const [leadSources, setLeadSources] = useState<LeadSource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeadSources();
  }, []);

  const fetchLeadSources = async () => {
    try {
      const res = await fetch('/api/lead-sources');
      if (res.ok) {
        const data = await res.json();
        setLeadSources(data.leadSources);
      }
    } catch (error) {
      console.error('Error fetching lead sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyContent = async (content: string, id: string) => {
    await navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Calculate totals
  const totals = leadSources.reduce(
    (acc, ls) => ({
      jobs: acc.jobs + ls.stats.jobsLinked,
      invoices: acc.invoices + ls.stats.invoicesLinked,
      paid: acc.paid + ls.stats.amountPaid,
    }),
    { jobs: 0, invoices: 0, paid: 0 }
  );

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-7 h-7 text-[#22C55E]" />
            Lead Sources
          </h1>
          <p className="text-gray-600 mt-1">
            Track which pages and keywords are bringing you real jobs
          </p>
        </div>
        <Link
          href="/dashboard/keywords"
          className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create New
        </Link>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{leadSources.length}</div>
              <div className="text-sm text-gray-500">Lead Sources</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#54A0FF]/10 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#54A0FF]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totals.jobs}</div>
              <div className="text-sm text-gray-500">Jobs Linked</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF9F43]/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#FF9F43]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{totals.invoices}</div>
              <div className="text-sm text-gray-500">Invoices Sent</div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{formatCurrency(totals.paid)}</div>
              <div className="text-sm text-green-600">Total Revenue</div>
            </div>
          </div>
        </div>
      </div>

      {/* Lead Sources List */}
      {leadSources.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Target className="w-12 h-12 text-[#22C55E]/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Lead Sources Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Create content from your keywords and save it as a Lead Source to track jobs and revenue.
          </p>
          <Link
            href="/dashboard/keywords"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors"
          >
            <Search className="w-4 h-4" />
            Find Keywords to Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {leadSources.map((ls) => (
            <div
              key={ls.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-[#22C55E]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{ls.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(ls.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Search className="w-3.5 h-3.5" />
                          {ls.keywords.length} keywords
                        </span>
                        {ls.filters?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {ls.filters.location.city}, {ls.filters.location.state}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedId(expandedId === ls.id ? null : ls.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedId === ls.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                </div>

                {/* Funnel Stats */}
                <div className="flex items-center gap-2 mt-4 text-sm">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-700">1 Page</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    ls.stats.jobsLinked > 0 ? 'bg-blue-50' : 'bg-gray-50'
                  }`}>
                    <Briefcase className={`w-4 h-4 ${ls.stats.jobsLinked > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${ls.stats.jobsLinked > 0 ? 'text-blue-700' : 'text-gray-400'}`}>
                      {ls.stats.jobsLinked} Jobs
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    ls.stats.invoicesLinked > 0 ? 'bg-orange-50' : 'bg-gray-50'
                  }`}>
                    <FileText className={`w-4 h-4 ${ls.stats.invoicesLinked > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${ls.stats.invoicesLinked > 0 ? 'text-orange-700' : 'text-gray-400'}`}>
                      {ls.stats.invoicesLinked} Invoices
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-300" />
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg ${
                    ls.stats.amountPaid > 0 ? 'bg-green-50' : 'bg-gray-50'
                  }`}>
                    <DollarSign className={`w-4 h-4 ${ls.stats.amountPaid > 0 ? 'text-green-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${ls.stats.amountPaid > 0 ? 'text-green-700' : 'text-gray-400'}`}>
                      {formatCurrency(ls.stats.amountPaid)} Paid
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === ls.id && (
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                  {/* Keywords */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Keywords Used</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {ls.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#A855F7]/10 text-[#A855F7] rounded text-xs font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Generated Content Preview */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Content</h4>
                    <div className="bg-white rounded-lg border border-gray-200 p-3 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-xs text-gray-600 font-mono">
                        {ls.generatedContent.slice(0, 500)}
                        {ls.generatedContent.length > 500 && '...'}
                      </pre>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyContent(ls.generatedContent, ls.id)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      {copiedId === ls.id ? (
                        <>
                          <Check className="w-4 h-4 text-green-500" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copy Content
                        </>
                      )}
                    </button>
                    {ls.pageUrl && (
                      <a
                        href={ls.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Page
                      </a>
                    )}
                    <Link
                      href="/dashboard/jobs/new"
                      className="flex items-center gap-2 px-3 py-1.5 bg-[#54A0FF] text-white rounded-lg text-sm font-medium hover:bg-[#4090EF] transition-colors"
                    >
                      <Briefcase className="w-4 h-4" />
                      Link to Job
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Bottom CTA */}
      {leadSources.length > 0 && (
        <div className="bg-gradient-to-r from-[#22C55E]/10 to-[#9FE870]/10 border border-[#22C55E]/20 rounded-xl p-6 text-center">
          <TrendingUp className="w-8 h-8 text-[#22C55E] mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Turn More Keywords Into Work
          </h3>
          <p className="text-gray-600 mb-4 max-w-md mx-auto">
            The more lead sources you create, the more opportunities you&apos;ll have to track your ROI.
          </p>
          <Link
            href="/dashboard/keywords"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#22C55E] text-white rounded-lg font-medium hover:bg-[#16A34A] transition-colors"
          >
            Find More Keywords
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
