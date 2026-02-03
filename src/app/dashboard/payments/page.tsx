'use client';

import { DollarSign, ArrowUpRight, ArrowDownRight, Download, Filter, Search } from 'lucide-react';

const payments = [
  { id: 'PAY-001', client: 'Metro Builders Inc', invoice: 'INV-001', amount: 12400, date: 'Jan 28, 2026', method: 'ACH', status: 'completed' },
  { id: 'PAY-002', client: 'Smith Builders', invoice: 'INV-005', amount: 8500, date: 'Jan 25, 2026', method: 'Check', status: 'completed' },
  { id: 'PAY-003', client: 'Downtown Development', invoice: 'INV-008', amount: 45000, date: 'Jan 20, 2026', method: 'Wire', status: 'completed' },
  { id: 'PAY-004', client: 'ABC General Contractors', invoice: 'INV-003', amount: 20000, date: 'Pending', method: '-', status: 'pending' },
  { id: 'PAY-005', client: 'Thompson Construction', invoice: 'INV-010', amount: 15600, date: 'Jan 15, 2026', method: 'ACH', status: 'completed' },
];

export default function PaymentsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const totalReceived = payments.filter(p => p.status === 'completed').reduce((a, b) => a + b.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Payments</h1>
          <p className="text-[#1a1a2e]/60">Track all incoming payments</p>
        </div>
        <button className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Total Received</p>
          <p className="text-3xl font-bold text-[#22C55E]">{formatCurrency(totalReceived)}</p>
          <div className="flex items-center gap-1 mt-1 text-[#22C55E] text-sm">
            <ArrowUpRight className="w-4 h-4" />
            +15% this month
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">Pending</p>
          <p className="text-3xl font-bold text-[#FF9F43]">{formatCurrency(totalPending)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-[#1a1a2e]/60">This Month</p>
          <p className="text-3xl font-bold text-[#1a1a2e]">{formatCurrency(85000)}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
          <input type="text" placeholder="Search payments..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200" />
        </div>
        <button className="px-4 py-3 bg-white border border-gray-200 rounded-xl flex items-center gap-2">
          <Filter className="w-5 h-5" /> Filter
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-[#1a1a2e]/60 uppercase">
              <th className="text-left px-6 py-4">Payment ID</th>
              <th className="text-left px-6 py-4">Client</th>
              <th className="text-left px-6 py-4">Invoice</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-left px-6 py-4">Method</th>
              <th className="text-right px-6 py-4">Amount</th>
              <th className="text-left px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-[#1a1a2e]">{payment.id}</td>
                <td className="px-6 py-4 text-[#1a1a2e]">{payment.client}</td>
                <td className="px-6 py-4 text-[#54A0FF]">{payment.invoice}</td>
                <td className="px-6 py-4 text-[#1a1a2e]/60">{payment.date}</td>
                <td className="px-6 py-4 text-[#1a1a2e]/60">{payment.method}</td>
                <td className="px-6 py-4 text-right font-semibold text-[#1a1a2e]">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${payment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {payment.status}
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
