'use client';

import { Activity, Search, Filter } from 'lucide-react';

const activities = [
  { id: 1, action: 'New user signup', user: 'john@electricalpros.com', details: 'Joined Pro plan', time: '2 hours ago', type: 'signup' },
  { id: 2, action: 'Subscription upgraded', user: 'sarah@plumbingco.com', details: 'Starter → Autopilot', time: '5 hours ago', type: 'upgrade' },
  { id: 3, action: 'Invoice created', user: 'mike@hvacexperts.com', details: 'INV-12847 for $12,400', time: '6 hours ago', type: 'invoice' },
  { id: 4, action: 'SAM Voice Call', user: 'lisa@buildersllc.com', details: 'Called ABC Contractors', time: '8 hours ago', type: 'call' },
  { id: 5, action: 'Payment received', user: 'david@roofingpro.com', details: '$8,500 via ACH', time: '1 day ago', type: 'payment' },
  { id: 6, action: 'User churned', user: 'tom@oldcompany.com', details: 'Cancelled Starter plan', time: '1 day ago', type: 'churn' },
  { id: 7, action: 'Invoice paid', user: 'emma@fireprotection.com', details: 'INV-12840 marked paid', time: '2 days ago', type: 'payment' },
  { id: 8, action: 'New user signup', user: 'james@steelworks.com', details: 'Started free trial', time: '2 days ago', type: 'signup' },
];

export default function AdminActivityPage() {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'signup': return 'bg-green-100 text-green-700';
      case 'upgrade': return 'bg-blue-100 text-blue-700';
      case 'invoice': return 'bg-purple-100 text-purple-700';
      case 'call': return 'bg-yellow-100 text-yellow-700';
      case 'payment': return 'bg-emerald-100 text-emerald-700';
      case 'churn': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
        <p className="text-gray-500">Platform-wide activity tracking</p>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input type="text" placeholder="Search activity..." className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200" />
        </div>
        <select className="px-4 py-3 bg-white border border-gray-200 rounded-xl">
          <option value="all">All Types</option>
          <option value="signup">Signups</option>
          <option value="upgrade">Upgrades</option>
          <option value="invoice">Invoices</option>
          <option value="payment">Payments</option>
          <option value="churn">Churn</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {activities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50">
              <div className="w-10 h-10 bg-[#54A0FF]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-[#54A0FF]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                    {activity.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{activity.user}</p>
                <p className="text-sm text-gray-400">{activity.details}</p>
              </div>
              <span className="text-sm text-gray-400 whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
