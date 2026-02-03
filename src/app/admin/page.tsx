'use client';

import { Users, DollarSign, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

const stats = [
  { name: 'Total Users', value: '2,547', change: '+12.5%', trend: 'up', icon: Users, color: 'bg-[#54A0FF]' },
  { name: 'Monthly Revenue', value: '$48,250', change: '+8.2%', trend: 'up', icon: DollarSign, color: 'bg-[#9FE870]' },
  { name: 'Active Subscriptions', value: '1,892', change: '+5.4%', trend: 'up', icon: TrendingUp, color: 'bg-[#FF9F43]' },
  { name: 'Invoices Created', value: '12,847', change: '+18.7%', trend: 'up', icon: FileText, color: 'bg-[#FECA57]' },
];

const recentUsers = [
  { id: 1, name: 'John Martinez', email: 'john@electricalpros.com', plan: 'Pro', joined: '2 hours ago', status: 'active' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@plumbingco.com', plan: 'Autopilot', joined: '5 hours ago', status: 'active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@hvacexperts.com', plan: 'Starter', joined: '1 day ago', status: 'trial' },
  { id: 4, name: 'Lisa Williams', email: 'lisa@buildersllc.com', plan: 'Pro', joined: '2 days ago', status: 'active' },
  { id: 5, name: 'David Brown', email: 'david@roofingpro.com', plan: 'Starter', joined: '3 days ago', status: 'churned' },
];

const recentActivity = [
  { action: 'New user signup', details: 'john@electricalpros.com joined Pro plan', time: '2 hours ago' },
  { action: 'Subscription upgraded', details: 'sarah@plumbingco.com upgraded to Autopilot', time: '5 hours ago' },
  { action: 'Invoice milestone', details: '10,000th invoice created this month', time: '1 day ago' },
  { action: 'SAM Voice Call', details: '500 collection calls made today', time: '1 day ago' },
  { action: 'Payment collected', details: '$125,000 collected via platform', time: '2 days ago' },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        <p className="text-gray-500">Monitor your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center gap-1 mt-2 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  <span>{stat.change}</span>
                  <span className="text-gray-400">vs last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Users</h2>
            <a href="/admin/users" className="text-[#54A0FF] text-sm font-medium hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentUsers.map((user) => (
              <div key={user.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{user.name}</p>
                    <p className="text-gray-500 text-xs">{user.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' ? 'bg-green-100 text-green-700' :
                    user.status === 'trial' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {user.plan}
                  </span>
                  <p className="text-gray-400 text-xs mt-1">{user.joined}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Activity</h2>
            <a href="/admin/activity" className="text-[#54A0FF] text-sm font-medium hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-100">
            {recentActivity.map((activity, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50">
                <div className="w-8 h-8 bg-[#54A0FF]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-[#54A0FF]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs truncate">{activity.details}</p>
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Revenue Overview</h2>
        <div className="h-64 bg-gradient-to-r from-[#9FE870]/10 to-[#54A0FF]/10 rounded-xl flex items-center justify-center">
          <p className="text-gray-500">Chart visualization would go here</p>
        </div>
      </div>
    </div>
  );
}
