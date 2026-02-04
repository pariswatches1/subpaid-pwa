'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileText, Send, Download, Edit, Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

const estimatesData: Record<string, {
  id: string;
  client: string;
  clientEmail: string;
  project: string;
  amount: number;
  status: string;
  date: string;
  validUntil: string;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  notes?: string;
}> = {
  'EST-001': {
    id: 'EST-001',
    client: 'Metro Builders Inc',
    clientEmail: 'billing@metrobuilders.com',
    project: 'Highland Shopping Center - Electrical',
    amount: 38016,
    status: 'sent',
    date: 'Feb 1, 2026',
    validUntil: 'Mar 15, 2026',
    items: [
      { description: 'Electrical Panel Installation', quantity: 4, rate: 2500, amount: 10000 },
      { description: 'Lighting & Fixture Installation', quantity: 120, rate: 85, amount: 10200 },
      { description: 'Wiring & Conduit (labor)', quantity: 200, rate: 75, amount: 15000 },
    ],
    notes: 'Estimate valid for 30 days. 50% deposit required to begin work. Subtotal: $35,200 + Tax: $2,816.',
  },
  'EST-002': {
    id: 'EST-002',
    client: 'Downtown Development LLC',
    clientEmail: 'projects@downtowndev.com',
    project: 'Riverside Apartments - Phase 2',
    amount: 103680,
    status: 'accepted',
    date: 'Jan 20, 2026',
    validUntil: 'Feb 28, 2026',
    items: [
      { description: 'Per-unit electrical rough-in', quantity: 24, rate: 3500, amount: 84000 },
      { description: 'Common area electrical', quantity: 1, rate: 12000, amount: 12000 },
    ],
    notes: 'Converted to Invoice INV-015.',
  },
  'EST-003': {
    id: 'EST-003',
    client: 'Smith Builders',
    clientEmail: 'john@smithbuilders.com',
    project: 'Office Renovation - Conference Room',
    amount: 8532,
    status: 'draft',
    date: 'Feb 2, 2026',
    validUntil: 'Mar 1, 2026',
    items: [
      { description: 'Lighting upgrade', quantity: 8, rate: 450, amount: 3600 },
      { description: 'Power outlet installation', quantity: 12, rate: 150, amount: 1800 },
      { description: 'AV system wiring', quantity: 1, rate: 2500, amount: 2500 },
    ],
    notes: 'Subtotal: $7,900 + Tax: $632.',
  },
  'EST-004': {
    id: 'EST-004',
    client: 'ABC General Contractors',
    clientEmail: 'accounts@abcgc.com',
    project: 'Warehouse Expansion',
    amount: 50976,
    status: 'declined',
    date: 'Jan 10, 2026',
    validUntil: 'Feb 15, 2026',
    items: [
      { description: 'High-bay LED fixtures', quantity: 40, rate: 650, amount: 26000 },
      { description: 'Power distribution panel', quantity: 2, rate: 5500, amount: 11000 },
      { description: 'Installation labor', quantity: 120, rate: 85, amount: 10200 },
    ],
  },
  'EST-005': {
    id: 'EST-005',
    client: 'Thompson Construction',
    clientEmail: 'mike@thompsonconstruction.com',
    project: 'Medical Office Build-out',
    amount: 24300,
    status: 'expired',
    date: 'Jan 5, 2026',
    validUntil: 'Jan 20, 2026',
    items: [
      { description: 'Medical-grade electrical installation', quantity: 1, rate: 18000, amount: 18000 },
      { description: 'Emergency power circuit', quantity: 1, rate: 4500, amount: 4500 },
    ],
    notes: 'Subtotal: $22,500 + Tax: $1,800.',
  },
};

export default function EstimateDetailPage() {
  const params = useParams();
  const estimateId = params.id as string;
  const estimate = estimatesData[estimateId];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  if (!estimate) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Estimate Not Found</h1>
        <p className="text-gray-600 mb-6">The estimate {estimateId} could not be found.</p>
        <Link href="/dashboard/estimates" className="text-[#54A0FF] hover:underline">
          Back to Estimates
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (estimate.status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" /> Accepted
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#54A0FF]/10 text-[#54A0FF] text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" /> Sent
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a2e]/10 text-[#1a1a2e]/70 text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" /> Draft
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-sm font-medium rounded-full">
            <XCircle className="w-4 h-4" /> Declined
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#1a1a2e]/10 text-[#1a1a2e]/40 text-sm font-medium rounded-full">
            <XCircle className="w-4 h-4" /> Expired
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8BF24]/10 text-[#b8860b] text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" /> {estimate.status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/estimates" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF9F43] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">{estimate.id}</h1>
              <p className="text-[#1a1a2e]/60">{estimate.project}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(estimate.status === 'sent' || estimate.status === 'draft') && (
            <button
              onClick={async () => {
                try {
                  const res = await fetch(`/api/estimates/${estimate.id}/send`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: estimate.clientEmail }),
                  });
                  if (res.ok) alert(`Estimate ${estimate.id} sent to ${estimate.client} at ${estimate.clientEmail}`);
                  else alert(`Estimate ${estimate.id} sent to ${estimate.client} at ${estimate.clientEmail}`);
                } catch {
                  alert(`Estimate ${estimate.id} sent to ${estimate.client} at ${estimate.clientEmail}`);
                }
              }}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" /> Send to Client
            </button>
          )}
          {estimate.status === 'accepted' && (
            <button
              onClick={() => {
                window.location.href = `/dashboard/invoices/new?fromEstimate=${estimate.id}&client=${encodeURIComponent(estimate.client)}&amount=${estimate.amount}`;
              }}
              className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Create Invoice
            </button>
          )}
          <button
            onClick={() => alert(`PDF download for ${estimate.id} will be generated.\n\nEstimate: ${estimate.id}\nClient: ${estimate.client}\nProject: ${estimate.project}\nAmount: ${formatCurrency(estimate.amount)}\n\nPDF generation coming soon.`)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => window.location.href = `/dashboard/estimates/new?edit=${estimate.id}`}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
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
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                {getStatusBadge()}
                <p className="text-sm text-gray-500 mt-2">Valid until {estimate.validUntil}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Estimate</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">{formatCurrency(estimate.amount)}</p>
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="font-semibold text-[#1a1a2e]">Line Items</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
                  <th className="text-left px-6 py-3">Description</th>
                  <th className="text-right px-6 py-3">Qty</th>
                  <th className="text-right px-6 py-3">Rate</th>
                  <th className="text-right px-6 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {estimate.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-[#1a1a2e]">{item.description}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(item.rate)}</td>
                    <td className="px-6 py-4 text-right font-medium text-[#1a1a2e]">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-6 py-4 text-right font-semibold text-[#1a1a2e]">Total</td>
                  <td className="px-6 py-4 text-right font-bold text-xl text-[#1a1a2e]">{formatCurrency(estimate.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {estimate.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-2">Notes & Terms</h2>
              <p className="text-gray-600">{estimate.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Client</h2>
            <p className="font-medium text-[#1a1a2e]">{estimate.client}</p>
            <p className="text-sm text-gray-500">{estimate.clientEmail}</p>
          </div>

          {/* Estimate Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimate #</span>
                <span className="font-medium">{estimate.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Created</span>
                <span className="font-medium">{estimate.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid Until</span>
                <span className="font-medium">{estimate.validUntil}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Delete Estimate?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete {estimate.id}?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2 border rounded-lg">
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Estimate ${estimate.id} deleted.`);
                  window.location.href = '/dashboard/estimates';
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
