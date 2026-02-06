'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Target,
  DollarSign,
  Briefcase,
  FileText,
  Phone,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  Edit2,
  Save,
  X,
  TrendingUp,
  Percent,
  Timer,
  ChevronRight,
  Plus,
  CheckCircle,
  AlertCircle,
  Mail,
  PhoneCall,
  PhoneMissed,
} from 'lucide-react';
import { LeadSource, PaybackSpeedScore } from '@/lib/keyword-types';
import { LeadTimelineEvent, CallTrackingRecord, Job, Invoice } from '@/lib/db';
import { LoadingSpinner } from '@/components/ui';

interface LeadSourceDetail extends LeadSource {
  calculatedMetrics?: {
    totalCost: number;
    revenue: number;
    roi: number;
    costPerJob: number;
    avgDaysToPaid: number;
  };
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

// Format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format time
function formatTime(dateString: string): string {
  return new Date(dateString).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

// Get event icon
function getEventIcon(eventType: string) {
  switch (eventType) {
    case 'call':
      return <PhoneCall className="w-4 h-4 text-blue-500" />;
    case 'form_submit':
      return <FileText className="w-4 h-4 text-purple-500" />;
    case 'job_created':
      return <Briefcase className="w-4 h-4 text-blue-600" />;
    case 'estimate_sent':
      return <FileText className="w-4 h-4 text-orange-500" />;
    case 'estimate_accepted':
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case 'invoice_sent':
      return <FileText className="w-4 h-4 text-orange-600" />;
    case 'reminder_sent':
      return <Mail className="w-4 h-4 text-yellow-600" />;
    case 'sam_call':
      return <Phone className="w-4 h-4 text-indigo-500" />;
    case 'payment_received':
      return <DollarSign className="w-4 h-4 text-green-600" />;
    default:
      return <AlertCircle className="w-4 h-4 text-gray-400" />;
  }
}

// Get grade styling
function getGradeStyle(grade: string) {
  switch (grade) {
    case 'A':
      return { color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' };
    case 'B':
      return { color: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' };
    case 'C':
      return { color: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    case 'D':
      return { color: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' };
    default:
      return { color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' };
  }
}

export default function LeadSourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [leadSource, setLeadSource] = useState<LeadSourceDetail | null>(null);
  const [paybackScore, setPaybackScore] = useState<PaybackSpeedScore | null>(null);
  const [timelineEvents, setTimelineEvents] = useState<LeadTimelineEvent[]>([]);
  const [callRecords, setCallRecords] = useState<CallTrackingRecord[]>([]);
  const [linkedJobs, setLinkedJobs] = useState<Job[]>([]);
  const [linkedInvoices, setLinkedInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    monthlyAdSpend: '',
    seoRetainerCost: '',
    otherCosts: '',
    costNotes: '',
    trackingPhoneNumber: '',
    pageUrl: '',
  });

  useEffect(() => {
    fetchLeadSourceDetails();
  }, [resolvedParams.id]);

  const fetchLeadSourceDetails = async () => {
    try {
      const res = await fetch(`/api/lead-sources/${resolvedParams.id}`);
      if (res.ok) {
        const data = await res.json();
        setLeadSource(data.leadSource);
        setPaybackScore(data.paybackScore);
        setTimelineEvents(data.timelineEvents || []);
        setCallRecords(data.callRecords || []);
        setLinkedJobs(data.linkedJobs || []);
        setLinkedInvoices(data.linkedInvoices || []);

        // Set edit form defaults
        setEditForm({
          name: data.leadSource.name || '',
          monthlyAdSpend: data.leadSource.monthlyAdSpend?.toString() || '',
          seoRetainerCost: data.leadSource.seoRetainerCost?.toString() || '',
          otherCosts: data.leadSource.otherCosts?.toString() || '',
          costNotes: data.leadSource.costNotes || '',
          trackingPhoneNumber: data.leadSource.trackingPhoneNumber || '',
          pageUrl: data.leadSource.pageUrl || '',
        });
      } else {
        router.push('/dashboard/lead-sources');
      }
    } catch (error) {
      console.error('Error fetching lead source:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!leadSource) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/lead-sources/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          monthlyAdSpend: editForm.monthlyAdSpend ? parseFloat(editForm.monthlyAdSpend) : undefined,
          seoRetainerCost: editForm.seoRetainerCost ? parseFloat(editForm.seoRetainerCost) : undefined,
          otherCosts: editForm.otherCosts ? parseFloat(editForm.otherCosts) : undefined,
          costNotes: editForm.costNotes || undefined,
          trackingPhoneNumber: editForm.trackingPhoneNumber || undefined,
          pageUrl: editForm.pageUrl || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setLeadSource(data.leadSource);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving lead source:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!leadSource) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Lead source not found</p>
        <Link href="/dashboard/lead-sources" className="text-blue-600 hover:underline mt-2 inline-block">
          Back to Lead Sources
        </Link>
      </div>
    );
  }

  const gradeStyle = paybackScore ? getGradeStyle(paybackScore.grade) : getGradeStyle('F');
  const metrics = leadSource.calculatedMetrics;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/lead-sources" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${gradeStyle.bg} rounded-xl flex items-center justify-center`}>
              <span className={`text-2xl font-bold ${gradeStyle.color}`}>{paybackScore?.grade || '-'}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{leadSource.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Created {formatDate(leadSource.createdAt)}
                </span>
                {leadSource.filters?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {leadSource.filters.location.city}, {leadSource.filters.location.state}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          {isEditing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payback Score Card */}
          {paybackScore && (
            <div className={`bg-white rounded-xl border ${gradeStyle.border} p-6`}>
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#22C55E]" />
                Payback Speed Score
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`text-3xl font-bold ${gradeStyle.color}`}>{paybackScore.grade}</div>
                  <div className="text-sm text-gray-500 mt-1">Grade</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">{paybackScore.score}</div>
                  <div className="text-sm text-gray-500 mt-1">Score / 100</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {paybackScore.avgDaysToPaid > 0 ? `${paybackScore.avgDaysToPaid}d` : '-'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Avg to Paid</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {paybackScore.avgInvoiceAmount > 0 ? formatCurrency(paybackScore.avgInvoiceAmount) : '-'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">Avg Invoice</div>
                </div>
              </div>
            </div>
          )}

          {/* Cost Tracking (Editable) */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Cost Tracking & ROI
            </h2>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lead Source Name</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Ad Spend</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={editForm.monthlyAdSpend}
                        onChange={(e) => setEditForm({ ...editForm, monthlyAdSpend: e.target.value })}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SEO Retainer Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={editForm.seoRetainerCost}
                        onChange={(e) => setEditForm({ ...editForm, seoRetainerCost: e.target.value })}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Other Monthly Costs</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={editForm.otherCosts}
                        onChange={(e) => setEditForm({ ...editForm, otherCosts: e.target.value })}
                        placeholder="0"
                        className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Notes</label>
                  <input
                    type="text"
                    value={editForm.costNotes}
                    onChange={(e) => setEditForm({ ...editForm, costNotes: e.target.value })}
                    placeholder="e.g., Google Ads campaign, referral program..."
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tracking Phone Number</label>
                    <input
                      type="tel"
                      value={editForm.trackingPhoneNumber}
                      onChange={(e) => setEditForm({ ...editForm, trackingPhoneNumber: e.target.value })}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
                    <input
                      type="url"
                      value={editForm.pageUrl}
                      onChange={(e) => setEditForm({ ...editForm, pageUrl: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-500">Total Cost</div>
                  <div className="text-xl font-bold text-gray-900">
                    {metrics?.totalCost ? `${formatCurrency(metrics.totalCost)}/mo` : '-'}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Revenue</div>
                  <div className="text-xl font-bold text-green-700">
                    {formatCurrency(leadSource.stats.amountPaid)}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600">ROI</div>
                  <div className="text-xl font-bold text-purple-700">
                    {metrics?.roi ? (metrics.roi === 999 ? '∞' : `${metrics.roi}%`) : '-'}
                  </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Cost per Job</div>
                  <div className="text-xl font-bold text-blue-700">
                    {metrics?.costPerJob ? formatCurrency(metrics.costPerJob) : '-'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Activity Timeline
            </h2>

            {timelineEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No activity yet</p>
                <p className="text-sm">Events will appear here as jobs and invoices are created</p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                <div className="space-y-4">
                  {timelineEvents.map((event) => (
                    <div key={event.id} className="relative flex gap-4 pl-10">
                      <div className="absolute left-2 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-200">
                        {getEventIcon(event.eventType)}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-gray-900">{event.description}</p>
                            {event.amount && (
                              <p className="text-sm text-green-600 font-medium">{formatCurrency(event.amount)}</p>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(event.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-700">Calls</span>
                </div>
                <span className="font-bold text-gray-900">{leadSource.stats.totalCalls || 0}</span>
              </div>
              <ChevronRight className="w-4 h-4 mx-auto text-gray-300" />
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">Jobs</span>
                </div>
                <span className="font-bold text-blue-700">{leadSource.stats.jobsLinked}</span>
              </div>
              <ChevronRight className="w-4 h-4 mx-auto text-gray-300" />
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-600" />
                  <span className="text-gray-700">Invoices</span>
                </div>
                <span className="font-bold text-orange-700">{leadSource.stats.invoicesLinked}</span>
              </div>
              <ChevronRight className="w-4 h-4 mx-auto text-gray-300" />
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-gray-700">Paid</span>
                </div>
                <span className="font-bold text-green-700">{formatCurrency(leadSource.stats.amountPaid)}</span>
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-600" />
              Keywords ({leadSource.keywords.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {leadSource.keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Call Tracking */}
          {callRecords.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-600" />
                Recent Calls
              </h3>
              <div className="space-y-2">
                {callRecords.slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      {call.answered ? (
                        <PhoneCall className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <PhoneMissed className="w-3.5 h-3.5 text-red-500" />
                      )}
                      <span className="text-gray-700">{call.callerNumber}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{formatDate(call.callDate)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Jobs */}
          {linkedJobs.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                Linked Jobs ({linkedJobs.length})
              </h3>
              <div className="space-y-2">
                {linkedJobs.slice(0, 5).map((job) => (
                  <Link
                    key={job.id}
                    href={`/dashboard/jobs/${job.id}`}
                    className="block p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                  >
                    <div className="font-medium text-gray-900 text-sm">{job.title}</div>
                    <div className="text-xs text-gray-500">{job.status}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/dashboard/jobs/new"
                className="flex items-center gap-2 w-full px-4 py-2 bg-[#54A0FF] text-white rounded-lg font-medium hover:bg-[#4090EF] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Link New Job
              </Link>
              {leadSource.pageUrl && (
                <a
                  href={leadSource.pageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Landing Page
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
