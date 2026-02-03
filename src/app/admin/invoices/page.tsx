'use client';

import { FileText, Search, Filter, Download } from 'lucide-react';

const invoices = [
  { id: 'INV-12847', user: 'John Martinez', client: 'ABC Contractors', amount: 12400, created: 'Feb 2, 2026', status: 'paid' },
  { id: 'INV-12846', user: 'Sarah Chen', client: 'Metro Builders', amount: 8500, created: 'Feb 2, 2026', status: 'pending' },
  { id: 'INV-12845', user: 'Mike Johnson', client: 'Smith LLC', amount: 45000, created: 'Feb 1, 2026', status: 'paid' },
  { id: 'INV-12844', user: 'Lisa Williams', client: 'Downtown Dev', amount: 20000, created: 'Feb 1, 2026', status: 'overdue' },
  { id: 'INV-12843', user: 'David Brown', client: 'Thompson Co', amount: 15600, created: 'Jan 31, 2026', status: 'paid' },
];

export default function AdminInvoicesPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Invoices</h1>
          <p className="text-gray-500">Platform-wide invoice tracking</p>
        </div>
        <button className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">12,847</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-[#9FE870]">$4.2M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">$3.8M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">$420K</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search invoices..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200" />
        </div>
        <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="text-left px-6 py-4">Invoice</th>
              <th className="text-left px-6 py-4">User</th>
              <th className="text-left px-6 py-4">Client</th>
              <th className="text-left px-6 py-4">Created</th>
              <th className="text-right px-6 py-4">Amount</th>
              <th className="text-left px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#54A0FF]">{inv.id}</td>
                <td className="px-6 py-4 text-gray-900">{inv.user}</td>
                <td className="px-6 py-4 text-gray-600">{inv.client}</td>
                <td className="px-6 py-4 text-gray-500">{inv.created}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(inv.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                    inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
