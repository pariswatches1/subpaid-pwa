'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import ActivityIcon from '@/components/admin/ActivityIcon';
import Pagination from '@/components/admin/Pagination';

const activities = [
  { id: 1, action: 'New user signup', user: 'john@electricalpros.com', details: 'Joined Pro plan', time: '2 hours ago', type: 'signup', date: 'Today' },
  { id: 2, action: 'Subscription upgraded', user: 'sarah@plumbingco.com', details: 'Starter → Autopilot', time: '5 hours ago', type: 'upgrade', date: 'Today' },
  { id: 3, action: 'Invoice created', user: 'mike@hvacexperts.com', details: 'INV-12847 for $12,400', time: '6 hours ago', type: 'invoice', date: 'Today' },
  { id: 4, action: 'SAM Voice Call', user: 'lisa@buildersllc.com', details: 'Called ABC Contractors', time: '8 hours ago', type: 'call', date: 'Today' },
  { id: 5, action: 'Payment received', user: 'david@roofingpro.com', details: '$8,500 via ACH', time: '1 day ago', type: 'payment', date: 'Yesterday' },
  { id: 6, action: 'User churned', user: 'tom@oldcompany.com', details: 'Cancelled Starter plan', time: '1 day ago', type: 'churn', date: 'Yesterday' },
  { id: 7, action: 'Invoice paid', user: 'emma@fireprotection.com', details: 'INV-12840 marked paid', time: '2 days ago', type: 'payment', date: 'Jan 31, 2026' },
  { id: 8, action: 'New user signup', user: 'james@steelworks.com', details: 'Started free trial', time: '2 days ago', type: 'signup', date: 'Jan 31, 2026' },
  { id: 9, action: 'Invoice created', user: 'amy@paintpros.com', details: 'INV-12839 for $6,700', time: '3 days ago', type: 'invoice', date: 'Jan 30, 2026' },
  { id: 10, action: 'Subscription upgraded', user: 'kevin@concreteco.com', details: 'Starter → Pro', time: '3 days ago', type: 'upgrade', date: 'Jan 30, 2026' },
];

const ITEMS_PER_PAGE = 6;

export default function AdminActivityPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState('all');

  const filteredActivities = filterType === 'all'
    ? activities
    : activities.filter(a => a.type === filterType);

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedActivities = filteredActivities.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  // Group paginated activities by date
  const groupedActivities: { date: string; items: typeof activities }[] = [];
  paginatedActivities.forEach((activity) => {
    const lastGroup = groupedActivities[groupedActivities.length - 1];
    if (lastGroup && lastGroup.date === activity.date) {
      lastGroup.items.push(activity);
    } else {
      groupedActivities.push({ date: activity.date, items: [activity] });
    }
  });

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
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl"
        >
          <option value="all">All Types</option>
          <option value="signup">Signups</option>
          <option value="upgrade">Upgrades</option>
          <option value="invoice">Invoices</option>
          <option value="payment">Payments</option>
          <option value="call">Calls</option>
          <option value="churn">Churn</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {groupedActivities.map((group) => (
          <div key={group.date}>
            {/* Date Group Header */}
            <div className="px-6 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{group.date}</span>
            </div>

            {/* Activities in this group */}
            <div className="divide-y divide-gray-100">
              {group.items.map((activity) => (
                <div key={activity.id} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                  <ActivityIcon type={activity.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        activity.type === 'signup' ? 'bg-green-100 text-green-700' :
                        activity.type === 'upgrade' ? 'bg-blue-100 text-blue-700' :
                        activity.type === 'invoice' ? 'bg-purple-100 text-purple-700' :
                        activity.type === 'call' ? 'bg-yellow-100 text-yellow-700' :
                        activity.type === 'payment' ? 'bg-emerald-100 text-emerald-700' :
                        activity.type === 'churn' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
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
        ))}

        {/* Pagination */}
        <div className="border-t border-gray-100 px-6 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredActivities.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
