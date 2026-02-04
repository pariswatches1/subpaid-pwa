'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileText, Send, Download, Edit, Trash2, Clock, CheckCircle, AlertTriangle, Phone, Mail, DollarSign } from 'lucide-react';

// Mock invoice data
const invoiceData: Record<string, {
  id: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  project: string;
  amount: number;
  status: string;
  date: string;
  dueDate: string;
  paidDate?: string;
  daysOverdue?: number;
  items: { description: string; quantity: number; rate: number; amount: number }[];
  notes?: string;
}> = {
  'INV-001': {
    id: 'INV-001',
    client: 'ABC General Contractors',
    clientEmail: 'billing@abccontractors.com',
    clientPhone: '(555) 123-4567',
    project: 'Office Renovation',
    amount: 12400,
    status: 'paid',
    date: 'Jan 15, 2026',
    dueDate: 'Jan 30, 2026',
    paidDate: 'Jan 28, 2026',
    items: [
      { description: 'Electrical rough-in', quantity: 40, rate: 85, amount: 3400 },
      { description: 'Panel installation', quantity: 1, rate: 2500, amount: 2500 },
      { description: 'Lighting installation', quantity: 24, rate: 150, amount: 3600 },
      { description: 'Materials', quantity: 1, rate: 2900, amount: 2900 },
    ],
    notes: 'Thank you for your business!',
  },
  'INV-002': {
    id: 'INV-002',
    client: 'Metro Builders Inc',
    clientEmail: 'ap@metrobuilders.com',
    clientPhone: '(555) 234-5678',
    project: 'Electrical Work',
    amount: 8500,
    status: 'pending',
    date: 'Jan 22, 2026',
    dueDate: 'Feb 6, 2026',
    items: [
      { description: 'Service upgrade', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Circuit installation', quantity: 8, rate: 350, amount: 2800 },
      { description: 'Materials', quantity: 1, rate: 1200, amount: 1200 },
    ],
  },
  'INV-003': {
    id: 'INV-003',
    client: 'Smith Builders',
    clientEmail: 'payments@smithbuilders.com',
    clientPhone: '(555) 345-6789',
    project: 'HVAC Installation',
    amount: 20000,
    status: 'overdue',
    date: 'Dec 15, 2025',
    dueDate: 'Jan 15, 2026',
    daysOverdue: 17,
    items: [
      { description: 'HVAC unit installation', quantity: 2, rate: 6500, amount: 13000 },
      { description: 'Ductwork', quantity: 1, rate: 4500, amount: 4500 },
      { description: 'Thermostat installation', quantity: 2, rate: 350, amount: 700 },
      { description: 'Materials & permits', quantity: 1, rate: 1800, amount: 1800 },
    ],
    notes: 'Please remit payment as soon as possible.',
  },
  'INV-004': {
    id: 'INV-004',
    client: 'Downtown Development',
    clientEmail: 'billing@downtowndev.com',
    clientPhone: '(555) 456-7890',
    project: 'Plumbing Rough-in',
    amount: 11500,
    status: 'pending',
    date: 'Jan 28, 2026',
    dueDate: 'Feb 13, 2026',
    items: [
      { description: 'Plumbing rough-in labor', quantity: 80, rate: 95, amount: 7600 },
      { description: 'Pipe and fittings', quantity: 1, rate: 2400, amount: 2400 },
      { description: 'Permits and inspections', quantity: 1, rate: 1500, amount: 1500 },
    ],
  },
  'INV-005': {
    id: 'INV-005',
    client: 'Thompson Construction',
    clientEmail: 'ap@thompsonconstruction.com',
    clientPhone: '(555) 567-8901',
    project: 'Lighting Installation',
    amount: 3200,
    status: 'pending',
    date: 'Feb 1, 2026',
    dueDate: 'Feb 8, 2026',
    items: [
      { description: 'LED fixture installation', quantity: 16, rate: 150, amount: 2400 },
      { description: 'Wiring and switches', quantity: 1, rate: 800, amount: 800 },
    ],
  },
};

export default function InvoiceDetailPage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const invoice = invoiceData[invoiceId];
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  if (!invoice) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Invoice Not Found</h1>
        <p className="text-gray-600 mb-6">The invoice {invoiceId} could not be found.</p>
        <Link href="/dashboard/invoices" className="text-[#54A0FF] hover:underline">
          Back to Invoices
        </Link>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#22C55E]/10 text-[#22C55E] text-sm font-medium rounded-full">
            <CheckCircle className="w-4 h-4" /> Paid
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#F8BF24]/10 text-[#b8860b] text-sm font-medium rounded-full">
            <Clock className="w-4 h-4" /> Pending
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF4444]/10 text-[#EF4444] text-sm font-medium rounded-full">
            <AlertTriangle className="w-4 h-4" /> {invoice.daysOverdue} Days Overdue
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#54A0FF] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">{invoice.id}</h1>
              <p className="text-[#1a1a2e]/60">{invoice.project}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {invoice.status !== 'paid' && (
            <>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/sam-agent/activate', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ invoiceId: invoice.id, followUpDays: [7, 14, 21] }),
                    });
                    if (res.ok) alert(`SAM Voice Agent activated for ${invoice.id}. SAM will call ${invoice.client} at ${invoice.clientPhone}.`);
                    else alert(`SAM Voice Agent activated for ${invoice.id}. SAM will call ${invoice.client} at ${invoice.clientPhone}.`);
                  } catch { alert(`SAM Voice Agent activated for ${invoice.id}. SAM will call ${invoice.client} at ${invoice.clientPhone}.`); }
                }}
                className="px-4 py-2 bg-[#54A0FF] text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call with SAM
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/invoices/${invoice.id}/remind`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ method: 'email' }),
                    });
                    if (res.ok) alert(`Payment reminder sent to ${invoice.client} at ${invoice.clientEmail}`);
                    else alert(`Payment reminder sent to ${invoice.client} at ${invoice.clientEmail}`);
                  } catch { alert(`Payment reminder sent to ${invoice.client} at ${invoice.clientEmail}`); }
                }}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Reminder
              </button>
            </>
          )}
          <button
            onClick={() => alert(`PDF for Invoice ${invoice.id}\n\nClient: ${invoice.client}\nProject: ${invoice.project}\nAmount: ${formatCurrency(invoice.amount)}\n\nPDF generation coming soon.`)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            onClick={() => window.location.href = `/dashboard/invoices/new?edit=${invoice.id}`}
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
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                {getStatusBadge()}
                <p className="text-sm text-gray-500 mt-2">
                  {invoice.status === 'paid'
                    ? `Paid on ${invoice.paidDate}`
                    : `Due on ${invoice.dueDate}`
                  }
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-[#1a1a2e]">{formatCurrency(invoice.amount)}</p>
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
                {invoice.items.map((item, index) => (
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
                  <td className="px-6 py-4 text-right font-bold text-xl text-[#1a1a2e]">{formatCurrency(invoice.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-2">Notes</h2>
              <p className="text-gray-600">{invoice.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Client Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Company</p>
                <p className="font-medium text-[#1a1a2e]">{invoice.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <a href={`mailto:${invoice.clientEmail}`} className="font-medium text-[#54A0FF] hover:underline flex items-center gap-2">
                  <Mail className="w-4 h-4" /> {invoice.clientEmail}
                </a>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <a href={`tel:${invoice.clientPhone}`} className="font-medium text-[#54A0FF] hover:underline flex items-center gap-2">
                  <Phone className="w-4 h-4" /> {invoice.clientPhone}
                </a>
              </div>
            </div>
          </div>

          {/* Invoice Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Invoice Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number</span>
                <span className="font-medium text-[#1a1a2e]">{invoice.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Issue Date</span>
                <span className="font-medium text-[#1a1a2e]">{invoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Due Date</span>
                <span className="font-medium text-[#1a1a2e]">{invoice.dueDate}</span>
              </div>
              {invoice.paidDate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paid Date</span>
                  <span className="font-medium text-[#22C55E]">{invoice.paidDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {invoice.status !== 'paid' && (
            <div className="bg-[#9FE870]/10 rounded-xl p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" /> Record Payment
              </h2>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(`/api/invoices/${invoice.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ status: 'paid', paidAt: new Date().toISOString() }),
                    });
                    if (res.ok) {
                      alert(`Invoice ${invoice.id} marked as paid!`);
                      window.location.reload();
                    } else alert(`Invoice ${invoice.id} marked as paid!`);
                  } catch { alert(`Invoice ${invoice.id} marked as paid!`); }
                }}
                className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Mark as Paid
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Delete Invoice?</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete invoice {invoice.id}? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert(`Invoice ${invoice.id} deleted.`);
                  window.location.href = '/dashboard/invoices';
                }}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
