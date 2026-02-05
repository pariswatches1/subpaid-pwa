'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Save, Mail, Bell, Shield, CreditCard, Globe, Zap, AlertTriangle, X } from 'lucide-react';

interface Settings {
  siteName: string;
  supportEmail: string;
  trialDays: number;
  enableSAM: boolean;
  enablePayScore: boolean;
  enableAutopilot: boolean;
  maintenanceMode: boolean;
  stripeTestMode: boolean;
}

const defaultSettings: Settings = {
  siteName: 'SubPaid',
  supportEmail: 'support@subpaid.com',
  trialDays: 14,
  enableSAM: true,
  enablePayScore: true,
  enableAutopilot: true,
  maintenanceMode: false,
  stripeTestMode: false,
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const savedSettingsRef = useRef<Settings>(defaultSettings);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Track unsaved changes
  useEffect(() => {
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(savedSettingsRef.current);
    setIsDirty(hasChanges);
  }, [settings]);

  // Warn on page unload if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleSave = () => {
    savedSettingsRef.current = { ...settings };
    setIsDirty(false);
    alert('Settings saved!');
  };

  const handleMaintenanceToggle = useCallback(() => {
    if (!settings.maintenanceMode) {
      // Trying to enable — show confirmation
      setShowMaintenanceModal(true);
    } else {
      // Disabling — no confirmation needed
      setSettings(prev => ({ ...prev, maintenanceMode: false }));
    }
  }, [settings.maintenanceMode]);

  const confirmMaintenanceMode = () => {
    setSettings(prev => ({ ...prev, maintenanceMode: true }));
    setShowMaintenanceModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500">Configure platform settings</p>
        </div>
        <button
          onClick={handleSave}
          className={`bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2 ${isDirty ? 'animate-pulse ring-2 ring-[#9FE870]/50' : ''}`}
        >
          <Save className="w-4 h-4" />
          Save Changes
          {isDirty && <span className="w-2 h-2 bg-[#1a1a2e] rounded-full" />}
        </button>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#54A0FF]" />
          <h2 className="font-semibold text-gray-900">General Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#54A0FF] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              value={settings.supportEmail}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#54A0FF] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Trial Period (days)</label>
            <input
              type="number"
              value={settings.trialDays}
              onChange={(e) => setSettings({ ...settings, trialDays: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#54A0FF] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <Zap className="w-5 h-5 text-[#FF9F43]" />
          <h2 className="font-semibold text-gray-900">Feature Toggles</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">SAM Voice Agent</p>
              <p className="text-sm text-gray-500">Enable AI voice collection calls</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableSAM}
                onChange={(e) => setSettings({ ...settings, enableSAM: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <p className="font-medium text-gray-900">PayScore&trade;</p>
              <p className="text-sm text-gray-500">Enable GC payment ratings</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enablePayScore}
                onChange={(e) => setSettings({ ...settings, enablePayScore: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Autopilot Mode</p>
              <p className="text-sm text-gray-500">Enable autonomous collection sequences</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableAutopilot}
                onChange={(e) => setSettings({ ...settings, enableAutopilot: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#9FE870] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Payment Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-[#9FE870]" />
          <h2 className="font-semibold text-gray-900">Payment Settings</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-900">Stripe Test Mode</p>
              <p className="text-sm text-gray-500">Use Stripe test environment</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.stripeTestMode}
                onChange={(e) => setSettings({ ...settings, stripeTestMode: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-[#FF9F43] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 flex items-center gap-3 bg-red-50">
          <Shield className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-red-600">Danger Zone</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-500">Temporarily disable the platform for all users</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={handleMaintenanceToggle}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-red-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Maintenance Mode Confirmation Modal */}
      {showMaintenanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowMaintenanceModal(false)}>
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-100">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-lg">Enable Maintenance Mode?</h3>
                <p className="text-gray-600 mt-1">
                  This will immediately disable the platform for all users. Active sessions will be terminated and no new logins will be allowed until maintenance mode is turned off.
                </p>
              </div>
              <button onClick={() => setShowMaintenanceModal(false)} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMaintenanceModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmMaintenanceMode}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Enable Maintenance Mode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
