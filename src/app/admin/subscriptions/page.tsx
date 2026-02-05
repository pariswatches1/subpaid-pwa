'use client';

import Link from 'next/link';
import { DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, Pencil } from 'lucide-react';

const plans = [
  { name: 'Starter', price: 29, users: 847, mrr: 24563, features: ['5 Snap invoices/mo', 'Basic tracking', 'Email support'] },
  { name: 'Pro', price: 79, users: 623, mrr: 49217, features: ['Unlimited Snap', 'Ask SubPaid AI', 'Payment Prophet', 'Priority support'] },
  { name: 'Autopilot', price: 149, users: 312, mrr: 46488, features: ['Everything in Pro', 'SAM Voice Agent (50 calls)', 'Auto-collection', 'PayScore access'] },
  { name: 'Enterprise', price: 299, users: 110, mrr: 32890, features: ['Everything', 'Unlimited SAM calls', 'Custom integrations', 'Dedicated support'] },
];

const recentTransactions = [
  { id: 1, user: 'John Martinez', type: 'subscription', plan: 'Pro', amount: 79, date: 'Feb 2, 2026', status: 'completed' },
  { id: 2, user: 'Sarah Chen', type: 'upgrade', plan: 'Autopilot', amount: 149, date: 'Feb 2, 2026', status: 'completed' },
  { id: 3, user: 'Mike Johnson', type: 'trial_start', plan: 'Starter', amount: 0, date: 'Feb 1, 2026', status: 'trial' },
  { id: 4, user: 'Lisa Williams', type: 'renewal', plan: 'Pro', amount: 79, date: 'Feb 1, 2026', status: 'completed' },
  { id: 5, user: 'David Brown', type: 'cancellation', plan: 'Starter', amount: 0, date: 'Jan 30, 2026', status: 'cancelled' },
];

export default function AdminSubscriptionsPage() {
  const totalMRR = plans.reduce((a, b) => a + b.mrr, 0);
  const totalUsers = plans.reduce((a, b) => a + b.users, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-500">Manage plans and billing</p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <span className="text-gray-500 text-sm">Total MRR</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalMRR)}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#54A0FF] rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-500 text-sm">Paying Users</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{totalUsers.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+12.5% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FF9F43] rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-gray-500 text-sm">Avg. Revenue/User</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">${Math.round(totalMRR / totalUsers)}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+3.1% vs last month</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FECA57] rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <span className="text-gray-500 text-sm">Annual Run Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalMRR * 12)}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            <span>+8.2% vs last month</span>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Plans Overview</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {plans.map((plan) => (
            <div key={plan.name} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
              </div>

              <div className="space-y-3 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <p className="text-xl font-bold text-gray-900">{plan.users.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">MRR</p>
                  <p className="text-xl font-bold text-[#9FE870]">{formatCurrency(plan.mrr)}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Features</p>
                <ul className="space-y-1">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-sm text-gray-600">&bull; {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-4">
                <button className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  <Pencil className="w-3.5 h-3.5" />
                  Edit Plan
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Transactions</h2>
          <Link href="/admin/invoices" className="text-[#54A0FF] text-sm font-medium hover:underline">View all</Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-6 py-3 font-medium">User</th>
              <th className="text-left px-6 py-3 font-medium">Type</th>
              <th className="text-left px-6 py-3 font-medium">Plan</th>
              <th className="text-right px-6 py-3 font-medium">Amount</th>
              <th className="text-left px-6 py-3 font-medium">Date</th>
              <th className="text-left px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {recentTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-900 font-medium">{tx.user}</td>
                <td className="px-6 py-4 text-gray-600 capitalize">{tx.type.replace('_', ' ')}</td>
                <td className="px-6 py-4 text-gray-600">{tx.plan}</td>
                <td className="px-6 py-4 text-right text-gray-900 font-medium">
                  {tx.amount > 0 ? `$${tx.amount}` : <span className="text-gray-400">N/A</span>}
                </td>
                <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tx.status === 'completed' ? 'bg-green-100 text-green-700' :
                    tx.status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {tx.status}
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
