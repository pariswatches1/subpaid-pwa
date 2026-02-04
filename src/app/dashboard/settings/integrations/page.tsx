'use client';

import { useState } from 'react';
import { Check, ExternalLink, Settings, Trash2 } from 'lucide-react';

const availableIntegrations = [
  {
    id: 'quickbooks',
    name: 'QuickBooks',
    description: 'Sync invoices and payments with QuickBooks Online',
    icon: '📊',
    connected: true,
    lastSync: '2 hours ago',
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Accept credit card payments directly',
    icon: '💳',
    connected: true,
    lastSync: '1 hour ago',
  },
  {
    id: 'xero',
    name: 'Xero',
    description: 'Sync with Xero accounting software',
    icon: '📈',
    connected: false,
    lastSync: null,
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync job schedules with your calendar',
    icon: '📅',
    connected: true,
    lastSync: '30 minutes ago',
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Get payment notifications in Slack',
    icon: '💬',
    connected: false,
    lastSync: null,
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 5000+ apps via Zapier',
    icon: '⚡',
    connected: false,
    lastSync: null,
  },
  {
    id: 'docusign',
    name: 'DocuSign',
    description: 'Send contracts for e-signature',
    icon: '✍️',
    connected: false,
    lastSync: null,
  },
  {
    id: 'plaid',
    name: 'Plaid',
    description: 'Bank account verification for ACH payments',
    icon: '🏦',
    connected: true,
    lastSync: '5 hours ago',
  },
];

export default function IntegrationsSettingsPage() {
  const [integrations, setIntegrations] = useState(availableIntegrations);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setIntegrations(integrations.map(int =>
      int.id === id ? { ...int, connected: true, lastSync: 'Just now' } : int
    ));
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(integrations.map(int =>
      int.id === id ? { ...int, connected: false, lastSync: null } : int
    ));
  };

  const connectedIntegrations = integrations.filter(i => i.connected);
  const availableToConnect = integrations.filter(i => !i.connected);

  return (
    <div className="space-y-6">
      {/* Connected Integrations */}
      <div>
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Connected Integrations</h2>
        {connectedIntegrations.length > 0 ? (
          <div className="grid gap-4">
            {connectedIntegrations.map((integration) => (
              <div
                key={integration.id}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-[#1a1a2e]">{integration.name}</h3>
                      <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{integration.description}</p>
                    <p className="text-xs text-gray-400 mt-1">Last synced: {integration.lastSync}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowConfigModal(integration.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Configure"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleDisconnect(integration.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No integrations connected yet</p>
          </div>
        )}
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Available Integrations</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {availableToConnect.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-xl border border-gray-200 p-4"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                  {integration.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[#1a1a2e]">{integration.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{integration.description}</p>
                  <button
                    onClick={() => handleConnect(integration.id)}
                    className="flex items-center gap-1 text-[#54A0FF] text-sm font-medium hover:underline"
                  >
                    Connect <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API Access */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-2">API Access</h2>
        <p className="text-sm text-gray-500 mb-4">
          Build custom integrations using our REST API
        </p>
        <div className="p-4 bg-gray-50 rounded-lg font-mono text-sm mb-4">
          <span className="text-gray-500">API Key:</span>{' '}
          <span className="text-[#1a1a2e]">sk_live_••••••••••••••••</span>
          <button className="ml-2 text-[#54A0FF] hover:underline">Show</button>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors">
            Regenerate Key
          </button>
          <a
            href="/docs/api"
            className="px-4 py-2 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#1a1a2e]/90 transition-colors inline-flex items-center gap-2"
          >
            View API Docs <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-4">
              Configure {integrations.find(i => i.id === showConfigModal)?.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sync Frequency</label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none">
                  <option>Every 15 minutes</option>
                  <option>Every hour</option>
                  <option>Every 6 hours</option>
                  <option>Daily</option>
                </select>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Sync invoices</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Sync payments</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-700">Sync contacts</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfigModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfigModal(null)}
                className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
