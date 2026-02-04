'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Shield, Users, Settings, Activity, Database,
  AlertTriangle, CheckCircle, Clock, TrendingUp,
  Server, HardDrive, Cpu, Wifi
} from 'lucide-react';

const systemStats = [
  { label: 'Active Users', value: '1,247', change: '+12%', icon: Users, color: 'text-blue-500' },
  { label: 'API Requests (24h)', value: '48.2K', change: '+8%', icon: Activity, color: 'text-green-500' },
  { label: 'Database Size', value: '2.4 GB', change: '+0.3%', icon: Database, color: 'text-purple-500' },
  { label: 'Uptime', value: '99.98%', change: '', icon: Server, color: 'text-cyan-500' },
];

const recentActivity = [
  { id: 1, action: 'User signup', user: 'john@example.com', time: '2 minutes ago', status: 'success' },
  { id: 2, action: 'Invoice created', user: 'sarah@company.com', time: '5 minutes ago', status: 'success' },
  { id: 3, action: 'Payment failed', user: 'mike@business.com', time: '12 minutes ago', status: 'error' },
  { id: 4, action: 'Password reset', user: 'lisa@startup.io', time: '18 minutes ago', status: 'success' },
  { id: 5, action: 'API rate limit', user: 'api-key-xxx', time: '25 minutes ago', status: 'warning' },
];

const systemHealth = [
  { name: 'Web Server', status: 'healthy', latency: '45ms', icon: Server },
  { name: 'Database', status: 'healthy', latency: '12ms', icon: Database },
  { name: 'Storage', status: 'healthy', latency: '8ms', icon: HardDrive },
  { name: 'API Gateway', status: 'healthy', latency: '23ms', icon: Wifi },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Admin Dashboard</h1>
            <p className="text-[#1a1a2e]/60">System administration and monitoring</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/dashboard/users"
            className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Users className="w-4 h-4" /> Manage Users
          </Link>
          <Link
            href="/dashboard/settings"
            className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Settings className="w-4 h-4" /> Settings
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              {stat.change && (
                <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {stat.change}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-[#1a1a2e]">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#9FE870]" />
            System Health
          </h2>
          <div className="space-y-3">
            {systemHealth.map((system) => (
              <div key={system.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <system.icon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-[#1a1a2e]">{system.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">{system.latency}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${
                    system.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <CheckCircle className="w-3 h-3" />
                    {system.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#54A0FF]" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'error' ? 'bg-red-100' : 'bg-yellow-100'
                  }`}>
                    {activity.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : activity.status === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1a2e]">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.user}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 text-center text-[#54A0FF] text-sm font-medium hover:underline">
            View all activity
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/dashboard/users" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Users className="w-6 h-6 text-[#54A0FF] mb-2" />
            <p className="font-medium text-[#1a1a2e]">Manage Users</p>
            <p className="text-sm text-gray-500">View and edit users</p>
          </Link>
          <Link href="/dashboard/settings/security" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Shield className="w-6 h-6 text-[#9FE870] mb-2" />
            <p className="font-medium text-[#1a1a2e]">Security Settings</p>
            <p className="text-sm text-gray-500">Configure security</p>
          </Link>
          <Link href="/dashboard/settings/integrations" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Database className="w-6 h-6 text-purple-500 mb-2" />
            <p className="font-medium text-[#1a1a2e]">Integrations</p>
            <p className="text-sm text-gray-500">Manage connections</p>
          </Link>
          <Link href="/dashboard/settings/billing" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <Activity className="w-6 h-6 text-[#FF9F43] mb-2" />
            <p className="font-medium text-[#1a1a2e]">Billing</p>
            <p className="text-sm text-gray-500">View billing info</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
