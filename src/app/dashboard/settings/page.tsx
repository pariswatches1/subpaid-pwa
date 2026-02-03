'use client';

import { useState } from 'react';
import { User, Building, Bell, CreditCard, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    name: 'Sam Johnson',
    email: 'sam@electricalpros.com',
    company: 'Electrical Pros LLC',
    phone: '(555) 123-4567',
    address: '123 Main St, Orlando, FL 32801',
    emailNotifications: true,
    smsNotifications: true,
    paymentReminders: true,
    weeklyReports: true,
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Settings</h1>
          <p className="text-[#1a1a2e]/60">Manage your account preferences</p>
        </div>
        <button className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <User className="w-5 h-5 text-[#54A0FF]" />
          <h2 className="font-semibold text-[#1a1a2e]">Profile</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Full Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Company Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Building className="w-5 h-5 text-[#9FE870]" />
          <h2 className="font-semibold text-[#1a1a2e]">Company</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Company Name</label>
            <input
              type="text"
              value={settings.company}
              onChange={(e) => setSettings({ ...settings, company: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#1a1a2e] mb-2">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Bell className="w-5 h-5 text-[#FF9F43]" />
          <h2 className="font-semibold text-[#1a1a2e]">Notifications</h2>
        </div>
        <div className="p-6 space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive text message alerts' },
            { key: 'paymentReminders', label: 'Payment Reminders', desc: 'Get notified about upcoming payments' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Receive weekly summary reports' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-medium text-[#1a1a2e]">{item.label}</p>
                <p className="text-sm text-[#1a1a2e]/60">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[item.key as keyof typeof settings] as boolean}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#54A0FF]" />
          <h2 className="font-semibold text-[#1a1a2e]">Subscription</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-[#1a1a2e]">Pro Plan</p>
              <p className="text-sm text-[#1a1a2e]/60">$79/month • Renews Feb 15, 2026</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
