'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, Filter, Download, Send, MoreVertical, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const invoices = [
  { id: 'INV-001', client: 'ABC General Contractors', project: 'Office Renovation', amount: 12400, status: 'paid', date: 'Jan 15, 2026', paidDate: 'Jan 28, 2026' },
  { id: 'INV-002', client: 'Metro Builders Inc', project: 'Electrical Work', amount: 8500, status: 'pending', date: 'Jan 22, 2026', dueDate: 'Feb 6, 2026' },
  { id: 'INV-003', client: 'Smith Builders', project: 'HVAC Installation', amount: 20000, status: 'overdue', date: 'Dec 15, 2025', dueDate: 'Jan 15, 2026', daysOverdue: 17 },
  { id: 'INV-004', client: 'Downtown Development', project: 'Plumbing Rough-in', amount: 11500, status: 'pending', date: 'Jan 28, 2026', dueDate: 'Feb 13, 2026' },
  { id: 'INV-005', client: 'Thompson Construction', project: 'Lighting Installation', amount: 3200, status: 'pending', date: 'Feb 1, 2026', dueDate: 'Feb 8, 2026' },
];

export default function InvoicesPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-[#22C55E]" />;
      case 'pending': return <Clock className="w-4 h-4 text-[#F8BF24]" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4 text-[#EF4444]" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string, daysOverdue?: number) => {
    switch (status) {
      case 'paid': return <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded-full">Paid</span>;
      case 'pending': return <span className="px-2 py-1 bg-[#F8BF24]/10 text-[#b8860b] text-xs font-medium rounded-full">Pending</span>;
      case 'overdue': return <span className="px-2 py-1 bg-[#EF4444]/10 text-[#EF4444] text-xs font-medium rounded-full">{daysOverdue} days overdue</span>;
      default: return null;
    }
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter !== 'all' && inv.status !== filter) return false;
    if (search && !inv.client.toLowerCase().includes(search.toLowerCase()) && !inv.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totals = {
    all: invoices.reduce((a, b) => a + b.amount, 0),
    paid: invoices.filter(i => i.status === 'paid').reduce((a, b) => a + b.amount, 0),
    pending: invoices.filter(i => i.status === 'pending').reduce((a, b) => a + b.amount, 0),
    overdue: invoices.filter(i => i.status === 'overdue').reduce((a, b) => a + b.amount, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#54A0FF] rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Invoices</h1>
            <p className="text-[#1a1a2e]/60">Manage all your invoices</p>
          </div>
        </div>
        <Link href="/dashboard/snap" className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <button onClick={() => setFilter('all')} className={`p-4 rounded-xl border transition-all text-left ${filter === 'all' ? 'bg-[#9FE870]/10 border-[#9FE870]' : 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'}`}>
          <p className="text-sm text-[#1a1a2e]/60">All Invoices</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(totals.all)}</p>
        </button>
        <button onClick={() => setFilter('paid')} className={`p-4 rounded-xl border transition-all text-left ${filter === 'paid' ? 'bg-[#22C55E]/10 border-[#22C55E]' : 'bg-white border-[#1a1a2e]/10 hover:border-[#22C55E]/50'}`}>
          <p className="text-sm text-[#1a1a2e]/60">Paid</p>
          <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(totals.paid)}</p>
        </button>
        <button onClick={() => setFilter('pending')} className={`p-4 rounded-xl border transition-all text-left ${filter === 'pending' ? 'bg-[#F8BF24]/10 border-[#F8BF24]' : 'bg-white border-[#1a1a2e]/10 hover:border-[#F8BF24]/50'}`}>
          <p className="text-sm text-[#1a1a2e]/60">Pending</p>
          <p className="text-2xl font-bold text-[#b8860b]">{formatCurrency(totals.pending)}</p>
        </button>
        <button onClick={() => setFilter('overdue')} className={`p-4 rounded-xl border transition-all text-left ${filter === 'overdue' ? 'bg-[#EF4444]/10 border-[#EF4444]' : 'bg-white border-[#1a1a2e]/10 hover:border-[#EF4444]/50'}`}>
          <p className="text-sm text-[#1a1a2e]/60">Overdue</p>
          <p className="text-2xl font-bold text-[#EF4444]">{formatCurrency(totals.overdue)}</p>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search invoices..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none"
          />
        </div>
        <button
          onClick={() => setFilter(filter === 'all' ? 'pending' : 'all')}
          className="px-4 py-3 bg-white border border-[#1a1a2e]/10 rounded-xl flex items-center gap-2 hover:bg-[#1a1a2e]/5 transition-all"
        >
          <Filter className="w-5 h-5 text-[#1a1a2e]/60" />
          <span className="text-[#1a1a2e]">Filter</span>
        </button>
        <button
          onClick={() => alert('Export feature: Invoice data will be exported as CSV. Coming soon.')}
          className="px-4 py-3 bg-white border border-[#1a1a2e]/10 rounded-xl flex items-center gap-2 hover:bg-[#1a1a2e]/5 transition-all"
        >
          <Download className="w-5 h-5 text-[#1a1a2e]/60" />
          <span className="text-[#1a1a2e]">Export</span>
        </button>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F7FBF4] text-xs text-[#1a1a2e]/60 uppercase tracking-wider">
              <th className="text-left px-6 py-4 font-medium">Invoice</th>
              <th className="text-left px-6 py-4 font-medium">Client</th>
              <th className="text-left px-6 py-4 font-medium">Date</th>
              <th className="text-left px-6 py-4 font-medium">Status</th>
              <th className="text-right px-6 py-4 font-medium">Amount</th>
              <th className="text-right px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1a1a2e]/5">
            {filteredInvoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-[#F7FBF4] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-10 rounded-full ${invoice.status === 'paid' ? 'bg-[#22C55E]' : invoice.status === 'pending' ? 'bg-[#F8BF24]' : 'bg-[#EF4444]'}`} />
                    <div>
                      <p className="font-semibold text-[#1a1a2e]">{invoice.id}</p>
                      <p className="text-sm text-[#1a1a2e]/60">{invoice.project}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#1a1a2e]">{invoice.client}</td>
                <td className="px-6 py-4 text-[#1a1a2e]/70">{invoice.date}</td>
                <td className="px-6 py-4">{getStatusBadge(invoice.status, invoice.daysOverdue)}</td>
                <td className="px-6 py-4 text-right font-semibold text-[#1a1a2e]">{formatCurrency(invoice.amount)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {invoice.status !== 'paid' && (
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/invoices/${invoice.id}/remind`, {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ method: 'email' }),
                            });
                            if (res.ok) alert(`Payment reminder sent to ${invoice.client}`);
                            else alert('Failed to send reminder');
                          } catch { alert('Failed to send reminder'); }
                        }}
                        className="p-2 text-[#1a1a2e]/60 hover:text-[#9FE870] transition-colors"
                        title="Send Reminder"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => alert(`Invoice ${invoice.id}\nClient: ${invoice.client}\nProject: ${invoice.project}\nAmount: ${formatCurrency(invoice.amount)}\nStatus: ${invoice.status}`)}
                      className="p-2 text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-colors"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
