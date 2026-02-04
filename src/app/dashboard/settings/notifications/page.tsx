'use client';

import { useState } from 'react';
import { Bell, Mail, Smartphone, Save } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const initialSettings: NotificationSetting[] = [
  {
    id: 'payment_received',
    label: 'Payment Received',
    description: 'When a client pays an invoice',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'invoice_viewed',
    label: 'Invoice Viewed',
    description: 'When a client opens your invoice',
    email: true,
    push: true,
    sms: false,
  },
  {
    id: 'payment_overdue',
    label: 'Payment Overdue',
    description: 'When an invoice becomes overdue',
    email: true,
    push: true,
    sms: true,
  },
  {
    id: 'payment_reminder',
    label: 'Payment Reminder Sent',
    description: 'When automated reminders are sent',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'weekly_summary',
    label: 'Weekly Summary',
    description: 'Weekly report of your activity',
    email: true,
    push: false,
    sms: false,
  },
  {
    id: 'team_activity',
    label: 'Team Activity',
    description: 'When team members take actions',
    email: false,
    push: true,
    sms: false,
  },
  {
    id: 'new_job',
    label: 'New Job Created',
    description: 'When a new job is added',
    email: true,
    push: true,
    sms: false,
  },
  {
    id: 'payscore_alert',
    label: 'PayScore™ Alerts',
    description: 'When a client\'s payment reliability changes',
    email: true,
    push: true,
    sms: false,
  },
];

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string, channel: 'email' | 'push' | 'sms') => {
    setSettings(settings.map(setting =>
      setting.id === id ? { ...setting, [channel]: !setting[channel] } : setting
    ));
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  const handleToggleAll = (channel: 'email' | 'push' | 'sms', enabled: boolean) => {
    setSettings(settings.map(setting => ({ ...setting, [channel]: enabled })));
    setSaved(false);
  };

  return (
    <div className="space-y-6">
      {/* Channel Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Notification Channels</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-[#54A0FF]" />
              <span className="font-medium text-[#1a1a2e]">Email</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">sam@electricalpros.com</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAll('email', true)}
                className="text-xs text-[#54A0FF] hover:underline"
              >
                Enable all
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleToggleAll('email', false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Disable all
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Bell className="w-5 h-5 text-[#9FE870]" />
              <span className="font-medium text-[#1a1a2e]">Push</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Browser notifications</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAll('push', true)}
                className="text-xs text-[#54A0FF] hover:underline"
              >
                Enable all
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleToggleAll('push', false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Disable all
              </button>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-5 h-5 text-[#FF9F43]" />
              <span className="font-medium text-[#1a1a2e]">SMS</span>
            </div>
            <p className="text-sm text-gray-500 mb-3">(555) 123-4567</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggleAll('sms', true)}
                className="text-xs text-[#54A0FF] hover:underline"
              >
                Enable all
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => handleToggleAll('sms', false)}
                className="text-xs text-gray-500 hover:underline"
              >
                Disable all
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-[#1a1a2e]">Notification Preferences</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Notification</th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">
                <Mail className="w-4 h-4 inline" />
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">
                <Bell className="w-4 h-4 inline" />
              </th>
              <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">
                <Smartphone className="w-4 h-4 inline" />
              </th>
            </tr>
          </thead>
          <tbody>
            {settings.map((setting) => (
              <tr key={setting.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-medium text-[#1a1a2e]">{setting.label}</p>
                  <p className="text-sm text-gray-500">{setting.description}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.email}
                      onChange={() => handleToggle(setting.id, 'email')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.push}
                      onChange={() => handleToggle(setting.id, 'push')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </td>
                <td className="px-6 py-4 text-center">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={setting.sms}
                      onChange={() => handleToggle(setting.id, 'sms')}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-4"></div>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}
