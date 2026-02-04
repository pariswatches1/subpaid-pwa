'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Briefcase, Edit, Trash2, MapPin, Calendar, DollarSign, Clock, User, FileText, Plus } from 'lucide-react';

const jobsData: Record<string, {
  id: string;
  name: string;
  client: string;
  address: string;
  status: string;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  description: string;
  crew: { name: string; role: string }[];
  invoices: { id: string; amount: number; status: string }[];
}> = {
  '1': {
    id: '1',
    name: 'Office Renovation - Main Building',
    client: 'ABC General Contractors',
    address: '123 Business Ave, San Francisco, CA 94102',
    status: 'in-progress',
    startDate: 'Jan 5, 2026',
    endDate: 'Feb 15, 2026',
    budget: 45000,
    spent: 28500,
    description: 'Complete electrical renovation of the main office building including panel upgrade, new circuits, and LED lighting installation.',
    crew: [
      { name: 'Mike Rodriguez', role: 'Lead Electrician' },
      { name: 'James Wilson', role: 'Electrician' },
      { name: 'Sarah Chen', role: 'Apprentice' },
    ],
    invoices: [
      { id: 'INV-001', amount: 12400, status: 'paid' },
      { id: 'INV-002', amount: 8500, status: 'pending' },
    ],
  },
  '2': {
    id: '2',
    name: 'Residential Wiring - New Construction',
    client: 'Metro Builders Inc',
    address: '456 Oak Street, Oakland, CA 94612',
    status: 'scheduled',
    startDate: 'Feb 20, 2026',
    budget: 32000,
    spent: 0,
    description: 'Full electrical installation for new 4-bedroom residential construction including service entrance, panel, and rough-in.',
    crew: [
      { name: 'Mike Rodriguez', role: 'Lead Electrician' },
    ],
    invoices: [],
  },
};

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  const job = jobsData[jobId];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  if (!job) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Job Not Found</h1>
        <p className="text-gray-600 mb-6">The job could not be found.</p>
        <Link href="/dashboard/jobs" className="text-[#54A0FF] hover:underline">
          Back to Jobs
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (job.status) {
      case 'completed':
        return <span className="px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-sm font-medium rounded-full">Completed</span>;
      case 'in-progress':
        return <span className="px-3 py-1 bg-[#54A0FF]/10 text-[#54A0FF] text-sm font-medium rounded-full">In Progress</span>;
      case 'scheduled':
        return <span className="px-3 py-1 bg-[#F8BF24]/10 text-[#b8860b] text-sm font-medium rounded-full">Scheduled</span>;
      default:
        return null;
    }
  };

  const progressPercent = Math.round((job.spent / job.budget) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jobs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-[#1a1a2e]">{job.name}</h1>
                {getStatusBadge()}
              </div>
              <p className="text-[#1a1a2e]/60">{job.client}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1a1a2e]">Budget Progress</h2>
              <span className="text-sm text-gray-500">{progressPercent}% used</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div
                className={`h-3 rounded-full ${progressPercent > 90 ? 'bg-[#EF4444]' : progressPercent > 70 ? 'bg-[#F8BF24]' : 'bg-[#9FE870]'}`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-gray-500">Spent</p>
                <p className="font-semibold text-[#1a1a2e]">{formatCurrency(job.spent)}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500">Budget</p>
                <p className="font-semibold text-[#1a1a2e]">{formatCurrency(job.budget)}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Job Description</h2>
            <p className="text-gray-600">{job.description}</p>
          </div>

          {/* Crew */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1a1a2e]">Assigned Crew</h2>
              <button className="text-[#54A0FF] text-sm font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            <div className="space-y-3">
              {job.crew.map((member, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#54A0FF]/20 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-[#54A0FF]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[#1a1a2e]">Related Invoices</h2>
              <Link href="/dashboard/invoices/new" className="text-[#54A0FF] text-sm font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Create Invoice
              </Link>
            </div>
            {job.invoices.length > 0 ? (
              <div className="space-y-3">
                {job.invoices.map((invoice) => (
                  <Link
                    key={invoice.id}
                    href={`/dashboard/invoices/${invoice.id}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-gray-400" />
                      <span className="font-medium text-[#1a1a2e]">{invoice.id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-medium">{formatCurrency(invoice.amount)}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        invoice.status === 'paid' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F8BF24]/10 text-[#b8860b]'
                      }`}>
                        {invoice.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No invoices yet</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Job Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Job Details</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-[#1a1a2e]">{job.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-[#1a1a2e]">{job.startDate}</p>
                </div>
              </div>
              {job.endDate && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="text-[#1a1a2e]">{job.endDate}</p>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-[#1a1a2e] font-semibold">{formatCurrency(job.budget)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#9FE870]/10 rounded-xl p-6 space-y-3">
            <Link
              href="/dashboard/time"
              className="w-full bg-white text-[#1a1a2e] py-3 rounded-lg font-medium hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Clock className="w-5 h-5" /> Log Time
            </Link>
            <Link
              href="/dashboard/invoices/new"
              className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-5 h-5" /> Create Invoice
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Delete Job?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this job? This will not delete related invoices.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
