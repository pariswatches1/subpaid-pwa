'use client';

import { useState } from 'react';
import { Shield, Key, Smartphone, Globe, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';

const sessions = [
  { id: 1, device: 'Chrome on Windows', location: 'Orlando, FL', current: true, lastActive: 'Now' },
  { id: 2, device: 'Safari on iPhone', location: 'Orlando, FL', current: false, lastActive: '2 hours ago' },
  { id: 3, device: 'Firefox on Mac', location: 'Miami, FL', current: false, lastActive: '3 days ago' },
];

export default function SecuritySettingsPage() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handlePasswordChange = () => {
    // Handle password change logic
    console.log('Changing password...');
    setShowPasswordModal(false);
    setPasswords({ current: '', new: '', confirm: '' });
  };

  const handleEnable2FA = () => {
    setTwoFAEnabled(true);
    setShow2FAModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#9FE870]/20 rounded-xl flex items-center justify-center">
              <Key className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">Password</h2>
              <p className="text-sm text-gray-500">Last changed 30 days ago</p>
            </div>
          </div>
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors"
          >
            Change Password
          </button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${twoFAEnabled ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Smartphone className={`w-6 h-6 ${twoFAEnabled ? 'text-green-600' : 'text-yellow-600'}`} />
            </div>
            <div>
              <h2 className="font-semibold text-[#1a1a2e]">Two-Factor Authentication</h2>
              <p className="text-sm text-gray-500">
                {twoFAEnabled ? 'Enabled - Your account is more secure' : 'Add an extra layer of security to your account'}
              </p>
            </div>
          </div>
          {twoFAEnabled ? (
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                <Check className="w-4 h-4" /> Enabled
              </span>
              <button
                onClick={() => setTwoFAEnabled(false)}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors"
              >
                Disable
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShow2FAModal(true)}
              className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
            >
              Enable 2FA
            </button>
          )}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#54A0FF]" />
            <h2 className="font-semibold text-[#1a1a2e]">Active Sessions</h2>
          </div>
          <button className="text-red-500 text-sm font-medium hover:underline">
            Sign out all other sessions
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <div key={session.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${session.current ? 'bg-green-500' : 'bg-gray-300'}`} />
                <div>
                  <p className="font-medium text-[#1a1a2e]">
                    {session.device}
                    {session.current && <span className="ml-2 text-xs text-green-600">(This device)</span>}
                  </p>
                  <p className="text-sm text-gray-500">{session.location} • {session.lastActive}</p>
                </div>
              </div>
              {!session.current && (
                <button className="text-red-500 text-sm font-medium hover:underline">
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-yellow-800 mb-2">Security Recommendations</h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              {!twoFAEnabled && <li>• Enable two-factor authentication for better security</li>}
              <li>• Use a password manager for unique, strong passwords</li>
              <li>• Review your active sessions regularly</li>
              <li>• Never share your login credentials</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">Enable Two-Factor Authentication</h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="w-40 h-40 bg-white rounded-lg flex items-center justify-center text-gray-400">
                  [QR Code]
                </div>
              </div>
              <p className="text-sm text-gray-600 text-center">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Enter Code</label>
                <input
                  type="text"
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none text-center text-2xl tracking-widest"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShow2FAModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEnable2FA}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Verify & Enable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
