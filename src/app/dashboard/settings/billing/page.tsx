'use client';

import { useState } from 'react';
import { CreditCard, Download, Check, Zap, Building, Crown } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 19,
    description: 'For independent subcontractors',
    features: ['Up to 25 invoices/month', 'Basic payment tracking', 'Email support', '1 user'],
    icon: Zap,
    current: false,
  },
  {
    name: 'Pro',
    price: 49,
    description: 'For growing businesses',
    features: ['Unlimited invoices', 'PayScore™ & Payment Prophet', 'Priority support', 'Up to 5 users', 'AIA billing'],
    icon: Building,
    current: true,
  },
  {
    name: 'Enterprise',
    price: 99,
    description: 'For large teams',
    features: ['Everything in Pro', 'Unlimited users', 'Custom integrations', 'Dedicated account manager', 'API access'],
    icon: Crown,
    current: false,
  },
];

const invoices = [
  { id: 'INV-2026-001', date: 'Jan 15, 2026', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-012', date: 'Dec 15, 2025', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-011', date: 'Nov 15, 2025', amount: '$49.00', status: 'Paid' },
  { id: 'INV-2025-010', date: 'Oct 15, 2025', amount: '$49.00', status: 'Paid' },
];

export default function BillingSettingsPage() {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">Current Plan</h2>
            <p className="text-sm text-gray-500">You are currently on the Pro plan</p>
          </div>
          <span className="px-3 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium">
            Active
          </span>
        </div>
        <div className="flex items-end gap-2 mb-4">
          <span className="text-4xl font-bold text-[#1a1a2e]">$49</span>
          <span className="text-gray-500 mb-1">/month</span>
        </div>
        <p className="text-sm text-gray-500 mb-4">Your next billing date is February 15, 2026</p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#1a1a2e]/90 transition-colors"
          >
            Change Plan
          </button>
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel Subscription
          </button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Payment Method</h2>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium text-[#1a1a2e]">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-500">Expires 12/2027</p>
            </div>
          </div>
          <button className="text-[#54A0FF] hover:underline text-sm font-medium">
            Update
          </button>
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1a2e]">Billing History</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Invoice</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-[#1a1a2e]">{invoice.id}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{invoice.date}</td>
                <td className="px-6 py-4 text-sm text-[#1a1a2e]">{invoice.amount}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-gray-500" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-6">Choose a Plan</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <div
                  key={plan.name}
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedPlan === plan.name || (selectedPlan === null && plan.current)
                      ? 'border-[#9FE870] bg-[#9FE870]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {plan.current && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#9FE870] text-[#1a1a2e] text-xs font-medium rounded">
                      Current
                    </span>
                  )}
                  <plan.icon className="w-8 h-8 text-[#9FE870] mb-3" />
                  <h4 className="font-semibold text-[#1a1a2e]">{plan.name}</h4>
                  <div className="flex items-end gap-1 my-2">
                    <span className="text-2xl font-bold text-[#1a1a2e]">${plan.price}</span>
                    <span className="text-gray-500 text-sm">/mo</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">{plan.description}</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-[#9FE870] mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
