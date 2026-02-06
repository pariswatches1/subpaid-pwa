'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Building2,
  Clock,
  DollarSign,
  Briefcase,
  FileText,
  MessageSquare,
  CheckCircle,
  XCircle,
  Edit2,
  Trash2,
  Zap,
  Target,
  PhoneCall,
  FormInput,
  Gavel,
  User,
  ExternalLink,
  AlertCircle,
  Send,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui';

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

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
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
    case 'email': return <Mail className="w-5 h-5" />;
    case 'call': return <PhoneCall className="w-5 h-5" />;
    case 'form': return <FormInput className="w-5 h-5" />;
    case 'bid': return <Gavel className="w-5 h-5" />;
    case 'manual': return <User className="w-5 h-5" />;
    default: return <Mail className="w-5 h-5" />;
  }
}

// Get priority config
function getPriorityConfig(priority: string) {
  switch (priority) {
    case 'hot': return { color: 'bg-red-500', label: 'Hot Lead', textColor: 'text-red-600', bgLight: 'bg-red-50' };
    case 'warm': return { color: 'bg-orange-400', label: 'Warm Lead', textColor: 'text-orange-600', bgLight: 'bg-orange-50' };
    case 'cold': return { color: 'bg-blue-400', label: 'Cold Lead', textColor: 'text-blue-600', bgLight: 'bg-blue-50' };
    default: return { color: 'bg-gray-400', label: 'Unknown', textColor: 'text-gray-600', bgLight: 'bg-gray-50' };
  }
}

// Get status config
function getStatusConfig(status: string) {
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

export default function LeadDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [leadSource, setLeadSource] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConverting, setIsConverting] = useState(false);
  const [convertType, setConvertType] = useState<'job' | 'estimate' | 'invoice' | null>(null);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
        setLeadSource(data.leadSource);
      } else if (res.status === 404) {
        router.push('/dashboard/leads-inbox');
      }
    } catch (error) {
      console.error('Error fetching lead:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!lead) return;
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLead(data.lead);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const convertLead = async (type: 'job' | 'estimate' | 'invoice', enableAutopilot = false) => {
    if (!lead) return;
    setIsConverting(true);
    setConvertType(type);

    try {
      const res = await fetch(`/api/leads/${id}/convert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, enableAutopilot }),
      });

      if (res.ok) {
        const data = await res.json();
        // Redirect to the created entity
        switch (type) {
          case 'job':
            router.push(`/dashboard/jobs/${data.conversion.id}`);
            break;
          case 'estimate':
            router.push(`/dashboard/estimates/${data.conversion.id}`);
            break;
          case 'invoice':
            router.push(`/dashboard/invoices/${data.conversion.id}`);
            break;
        }
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to convert lead');
      }
    } catch (error) {
      console.error('Error converting lead:', error);
      alert('Failed to convert lead');
    } finally {
      setIsConverting(false);
      setConvertType(null);
    }
  };

  const deleteLead = async () => {
    if (!lead) return;
    if (!confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        router.push('/dashboard/leads-inbox');
      }
    } catch (error) {
      console.error('Error deleting lead:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Lead not found</h2>
        <Link href="/dashboard/leads-inbox" className="text-[#9FE870] hover:underline mt-2 inline-block">
          Back to Leads Inbox
        </Link>
      </div>
    );
  }

  const priority = getPriorityConfig(lead.priority);
  const status = getStatusConfig(lead.status);
  const isConverted = lead.convertedToJobId || lead.convertedToEstimateId || lead.convertedToInvoiceId;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/leads-inbox"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-10 ${priority.color} rounded-full`} />
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">
                {lead.name || lead.email || lead.phone || 'Unknown Lead'}
              </h1>
              <p className="text-[#1a1a2e]/60">{lead.company || lead.trade || 'Lead Details'}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${priority.bgLight} ${priority.textColor}`}>
            {priority.label}
          </span>
        </div>
      </div>

      {/* Converted Banner */}
      {isConverted && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-medium text-green-800">Lead Converted Successfully</p>
              <p className="text-sm text-green-600">
                {lead.convertedToJobId && 'Converted to Job'}
                {lead.convertedToEstimateId && 'Converted to Estimate'}
                {lead.convertedToInvoiceId && 'Converted to Invoice'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            {lead.convertedToJobId && (
              <Link
                href={`/dashboard/jobs/${lead.convertedToJobId}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                View Job <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            {lead.convertedToEstimateId && (
              <Link
                href={`/dashboard/estimates/${lead.convertedToEstimateId}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                View Estimate <ExternalLink className="w-3 h-3" />
              </Link>
            )}
            {lead.convertedToInvoiceId && (
              <Link
                href={`/dashboard/invoices/${lead.convertedToInvoiceId}`}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700"
              >
                View Invoice <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {lead.name && (
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-[#1a1a2e]">{lead.name}</p>
                  </div>
                </div>
              )}
              {lead.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${lead.email}`} className="font-medium text-blue-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}
              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${lead.phone}`} className="font-medium text-green-600 hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
              {lead.company && (
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-[#1a1a2e]">{lead.company}</p>
                  </div>
                </div>
              )}
              {lead.location && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium text-[#1a1a2e]">{lead.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Contact Actions */}
            <div className="flex gap-2 mt-6 pt-4 border-t border-gray-100">
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium hover:bg-green-100 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              )}
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </a>
              )}
              {lead.phone && (
                <a
                  href={`sms:${lead.phone}`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Text
                </a>
              )}
            </div>
          </div>

          {/* Job Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Job Details</h2>

            {lead.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Description</p>
                <p className="text-[#1a1a2e] whitespace-pre-wrap">{lead.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {lead.trade && (
                <div>
                  <p className="text-sm text-gray-500">Trade/Service</p>
                  <p className="font-medium text-[#1a1a2e]">{lead.trade}</p>
                </div>
              )}
              {lead.estimatedValue && (
                <div>
                  <p className="text-sm text-gray-500">Estimated Value</p>
                  <p className="font-medium text-green-600 text-lg">{formatCurrency(lead.estimatedValue)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Raw Content (if exists) */}
          {(lead.rawContent || lead.rawSubject) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Original Message</h2>
              {lead.rawSubject && (
                <div className="mb-3">
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="font-medium text-[#1a1a2e]">{lead.rawSubject}</p>
                </div>
              )}
              {lead.rawContent && (
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {lead.rawContent}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Source Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Source</h2>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
                {getSourceIcon(lead.sourceType)}
              </div>
              <div>
                <p className="font-medium text-[#1a1a2e]">{lead.sourceName || lead.sourceType}</p>
                <p className="text-sm text-gray-500 capitalize">{lead.sourceType}</p>
              </div>
            </div>

            {leadSource && (
              <Link
                href={`/dashboard/lead-sources/${leadSource.id}`}
                className="flex items-center gap-2 text-sm text-[#22C55E] hover:underline"
              >
                <Target className="w-4 h-4" />
                View Lead Source
                <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Timeline</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div>
                  <p className="text-sm font-medium text-[#1a1a2e]">Lead Received</p>
                  <p className="text-xs text-gray-500">{formatRelativeTime(lead.receivedAt)}</p>
                </div>
              </div>
              {lead.lastContactedAt && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">Last Contacted</p>
                    <p className="text-xs text-gray-500">{formatRelativeTime(lead.lastContactedAt)}</p>
                  </div>
                </div>
              )}
              {lead.convertedToJobId && (
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">Converted to Job</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Status Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Update Status</h2>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus('contacted')}
                disabled={lead.status === 'contacted'}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  lead.status === 'contacted'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-yellow-50'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                Mark as Contacted
              </button>
              <button
                onClick={() => updateStatus('quoted')}
                disabled={lead.status === 'quoted'}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  lead.status === 'quoted'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                Mark as Quoted
              </button>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={() => updateStatus('won')}
                  disabled={lead.status === 'won'}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    lead.status === 'won'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  Won
                </button>
                <button
                  onClick={() => updateStatus('lost')}
                  disabled={lead.status === 'lost'}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    lead.status === 'lost'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  Lost
                </button>
              </div>
            </div>
          </div>

          {/* Convert Actions */}
          {!isConverted && (
            <div className="bg-gradient-to-br from-[#9FE870]/10 to-[#22C55E]/10 rounded-xl border border-[#22C55E]/20 p-6">
              <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Convert Lead</h2>
              <div className="space-y-2">
                <button
                  onClick={() => convertLead('job')}
                  disabled={isConverting}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  <Briefcase className="w-4 h-4" />
                  {isConverting && convertType === 'job' ? 'Creating...' : 'Create Job'}
                </button>
                <button
                  onClick={() => convertLead('estimate')}
                  disabled={isConverting}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-colors disabled:opacity-50"
                >
                  <FileText className="w-4 h-4" />
                  {isConverting && convertType === 'estimate' ? 'Creating...' : 'Create Estimate'}
                </button>
                <button
                  onClick={() => convertLead('invoice', true)}
                  disabled={isConverting}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-[#9FE870] to-[#22C55E] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {isConverting && convertType === 'invoice' ? 'Creating...' : 'Invoice + Autopilot'}
                </button>
              </div>
            </div>
          )}

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-red-200 p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h2>
            <button
              onClick={deleteLead}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
