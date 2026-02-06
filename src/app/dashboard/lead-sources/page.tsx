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
  Phone,
  Percent,
  Timer,
  Edit2,
} from 'lucide-react';
import { LeadSource } from '@/lib/keyword-types';
import { LoadingSpinner } from '@/components/ui';

// Extended type with calculated metrics
interface LeadSourceWithMetrics extends LeadSource {
  calculatedMetrics?: {
    totalCost: number;
    revenue: number;
    roi: number;
    costPerJob: number;
    avgDaysToPaid: number;
  };
}

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

// Get Payback Grade based on metrics
function getPaybackGrade(ls: LeadSourceWithMetrics): { grade: string; color: string; bgColor: string } {
  const metrics = ls.calculatedMetrics;
  if (!metrics) return { grade: '-', color: 'text-gray-400', bgColor: 'bg-gray-100' };

  // Simple scoring: ROI weight (40%) + Speed weight (30%) + Volume weight (30%)
  let score = 0;

  // ROI score (0-40 points)
  if (metrics.roi >= 300) score += 40;
  else if (metrics.roi >= 200) score += 32;
  else if (metrics.roi >= 100) score += 24;
  else if (metrics.roi >= 50) score += 16;
  else if (metrics.roi > 0) score += 8;

  // Speed score (0-30 points) - faster is better
  if (metrics.avgDaysToPaid > 0) {
    if (metrics.avgDaysToPaid <= 14) score += 30;
    else if (metrics.avgDaysToPaid <= 21) score += 24;
    else if (metrics.avgDaysToPaid <= 30) score += 18;
    else if (metrics.avgDaysToPaid <= 45) score += 12;
    else score += 6;
  }

  // Volume score (0-30 points)
  if (ls.stats.jobsLinked >= 10) score += 30;
  else if (ls.stats.jobsLinked >= 5) score += 24;
  else if (ls.stats.jobsLinked >= 3) score += 18;
  else if (ls.stats.jobsLinked >= 1) score += 12;

  // Determine grade
  if (score >= 80) return { grade: 'A', color: 'text-green-700', bgColor: 'bg-green-100' };
  if (score >= 60) return { grade: 'B', color: 'text-blue-700', bgColor: 'bg-blue-100' };
  if (score >= 40) return { grade: 'C', color: 'text-yellow-700', bgColor: 'bg-yellow-100' };
  if (score >= 20) return { grade: 'D', color: 'text-orange-700', bgColor: 'bg-orange-100' };
  return { grade: 'F', color: 'text-red-700', bgColor: 'bg-red-100' };
}

export default function LeadSourcesPage() {
  const [leadSources, setLeadSources] = useState<LeadSourceWithMetrics[]>([]);
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

  // Calculate totals including ROI metrics
  const totals = leadSources.reduce(
    (acc, ls) => ({
      jobs: acc.jobs + ls.stats.jobsLinked,
      invoices: acc.invoices + ls.stats.invoicesLinked,
      paid: acc.paid + ls.stats.amountPaid,
      totalCost: acc.totalCost + (ls.calculatedMetrics?.totalCost || 0),
    }),
    { jobs: 0, invoices: 0, paid: 0, totalCost: 0 }
  );

  // Calculate average ROI and best score
  const avgRoi = totals.totalCost > 0
    ? Math.round(((totals.paid - totals.totalCost) / totals.totalCost) * 100)
    : (totals.paid > 0 ? 999 : 0);

  // Find best grade
  const grades = leadSources.map(ls => getPaybackGrade(ls));
  const bestGrade = grades.reduce((best, current) => {
    const gradeOrder = ['A', 'B', 'C', 'D', 'F', '-'];
    return gradeOrder.indexOf(current.grade) < gradeOrder.indexOf(best.grade) ? current : best;
  }, { grade: '-', color: 'text-gray-400', bgColor: 'bg-gray-100' });

  // Calculate average days to paid
  const sourcesWithPayments = leadSources.filter(ls => ls.calculatedMetrics?.avgDaysToPaid && ls.calculatedMetrics.avgDaysToPaid > 0);
  const avgDaysToPaid = sourcesWithPayments.length > 0
    ? Math.round(sourcesWithPayments.reduce((sum, ls) => sum + (ls.calculatedMetrics?.avgDaysToPaid || 0), 0) / sourcesWithPayments.length)
    : 0;

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
            Track which pages and keywords are bringing you real jobs and money
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

      {/* Summary Stats - Enhanced with ROI metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{leadSources.length}</div>
              <div className="text-sm text-gray-500">Sources</div>
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
              <div className="text-sm text-gray-500">Jobs</div>
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
              <div className="text-sm text-green-600">Revenue</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Percent className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-700">
                {avgRoi === 999 ? '∞' : `${avgRoi}%`}
              </div>
              <div className="text-sm text-gray-500">Avg ROI</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-700">
                {avgDaysToPaid > 0 ? `${avgDaysToPaid}d` : '-'}
              </div>
              <div className="text-sm text-gray-500">Avg to Paid</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${bestGrade.bgColor} rounded-lg flex items-center justify-center`}>
              <span className={`text-lg font-bold ${bestGrade.color}`}>{bestGrade.grade}</span>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{bestGrade.grade}</div>
              <div className="text-sm text-gray-500">Best Score</div>
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
          {leadSources.map((ls) => {
            const gradeInfo = getPaybackGrade(ls);
            const metrics = ls.calculatedMetrics;

            return (
              <div
                key={ls.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {/* Payback Score Badge */}
                      <div className={`w-12 h-12 ${gradeInfo.bgColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-xl font-bold ${gradeInfo.color}`}>{gradeInfo.grade}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{ls.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-500 mt-1 flex-wrap">
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
                          {ls.trackingPhoneNumber && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {ls.trackingPhoneNumber}
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

                  {/* Funnel Stats with ROI Metrics */}
                  <div className="flex items-center gap-2 mt-4 text-sm flex-wrap">
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

                  {/* ROI Summary Row */}
                  {metrics && (metrics.totalCost > 0 || metrics.roi > 0) && (
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      {metrics.totalCost > 0 && (
                        <span className="text-gray-500">
                          Monthly Spend: <span className="font-medium text-gray-700">{formatCurrency(metrics.totalCost)}</span>
                        </span>
                      )}
                      {metrics.roi > 0 && (
                        <span className="text-gray-500">
                          ROI: <span className={`font-medium ${metrics.roi >= 100 ? 'text-green-600' : metrics.roi > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {metrics.roi === 999 ? '∞' : `${metrics.roi}%`}
                          </span>
                        </span>
                      )}
                      {metrics.avgDaysToPaid > 0 && (
                        <span className="text-gray-500">
                          Avg {metrics.avgDaysToPaid} days to paid
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedId === ls.id && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100">
                    {/* Cost Tracking Section */}
                    {(ls.monthlyAdSpend || ls.seoRetainerCost || ls.otherCosts) && (
                      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          Cost Breakdown
                        </h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          {ls.monthlyAdSpend !== undefined && ls.monthlyAdSpend > 0 && (
                            <div>
                              <div className="text-gray-500">Ad Spend</div>
                              <div className="font-semibold text-gray-900">{formatCurrency(ls.monthlyAdSpend)}/mo</div>
                            </div>
                          )}
                          {ls.seoRetainerCost !== undefined && ls.seoRetainerCost > 0 && (
                            <div>
                              <div className="text-gray-500">SEO Retainer</div>
                              <div className="font-semibold text-gray-900">{formatCurrency(ls.seoRetainerCost)}/mo</div>
                            </div>
                          )}
                          {ls.otherCosts !== undefined && ls.otherCosts > 0 && (
                            <div>
                              <div className="text-gray-500">Other Costs</div>
                              <div className="font-semibold text-gray-900">{formatCurrency(ls.otherCosts)}/mo</div>
                            </div>
                          )}
                        </div>
                        {ls.costNotes && (
                          <div className="mt-2 text-xs text-gray-500 italic">{ls.costNotes}</div>
                        )}
                      </div>
                    )}

                    {/* UTM Parameters */}
                    {ls.utmParams && Object.keys(ls.utmParams).length > 0 && (
                      <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">UTM Attribution</h4>
                        <div className="flex flex-wrap gap-2">
                          {ls.utmParams.source && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              source: {ls.utmParams.source}
                            </span>
                          )}
                          {ls.utmParams.medium && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                              medium: {ls.utmParams.medium}
                            </span>
                          )}
                          {ls.utmParams.campaign && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs">
                              campaign: {ls.utmParams.campaign}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

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
                    <div className="flex items-center gap-2 flex-wrap">
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
                        href={`/dashboard/lead-sources/${ls.id}`}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit & Timeline
                      </Link>
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
            );
          })}
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
