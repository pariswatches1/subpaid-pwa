'use client';

import { ArrowRight } from 'lucide-react';

const integrations = [
  { name: 'QuickBooks', category: 'Accounting' },
  { name: 'Xero', category: 'Accounting' },
  { name: 'FreshBooks', category: 'Accounting' },
  { name: 'Stripe', category: 'Payments' },
  { name: 'PayPal', category: 'Payments' },
  { name: 'Square', category: 'Payments' },
  { name: 'Wave', category: 'Accounting' },
  { name: 'Plaid', category: 'Banking' },
];

export function Integrations() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
            Integrations
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Works With Your Favorite Tools
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            SubPaid connects seamlessly with the apps you already use
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className="bg-[#F8FAFC] rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="text-2xl font-bold text-[#1a1a2e]">
                  {integration.name.charAt(0)}
                </span>
              </div>
              <p className="font-semibold text-[#1a1a2e]">{integration.name}</p>
              <p className="text-sm text-gray-500">{integration.category}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="/integrations"
            className="inline-flex items-center gap-2 text-[#54A0FF] font-semibold hover:underline"
          >
            View all 50+ integrations
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
