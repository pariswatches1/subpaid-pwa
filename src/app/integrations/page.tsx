'use client';

import Link from 'next/link';
import { ArrowRight, Search, CreditCard, Building, FileText, Calculator, Cloud, Mail, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const integrationCategories = [
  {
    name: 'Payments',
    icon: CreditCard,
    integrations: [
      { name: 'Stripe', description: 'Accept credit card payments directly on invoices', status: 'available' },
      { name: 'PayPal', description: 'Let clients pay with their PayPal account', status: 'available' },
      { name: 'Square', description: 'Accept payments via Square', status: 'coming-soon' },
      { name: 'Venmo', description: 'Accept Venmo payments for invoices', status: 'coming-soon' },
    ],
  },
  {
    name: 'Accounting',
    icon: Calculator,
    integrations: [
      { name: 'QuickBooks', description: 'Sync invoices and payments to QuickBooks', status: 'available' },
      { name: 'Xero', description: 'Two-way sync with Xero accounting', status: 'available' },
      { name: 'FreshBooks', description: 'Import and export with FreshBooks', status: 'coming-soon' },
      { name: 'Wave', description: 'Connect to Wave accounting', status: 'coming-soon' },
    ],
  },
  {
    name: 'Banking',
    icon: Building,
    integrations: [
      { name: 'Plaid', description: 'Connect bank accounts for ACH payments', status: 'available' },
      { name: 'Mercury', description: 'Direct integration with Mercury banking', status: 'coming-soon' },
    ],
  },
  {
    name: 'Project Management',
    icon: FileText,
    integrations: [
      { name: 'Buildertrend', description: 'Sync projects and create invoices from jobs', status: 'available' },
      { name: 'Procore', description: 'Integration with Procore construction software', status: 'available' },
      { name: 'CoConstruct', description: 'Connect to CoConstruct projects', status: 'coming-soon' },
      { name: 'Jobber', description: 'Sync with Jobber field service software', status: 'coming-soon' },
    ],
  },
  {
    name: 'Storage',
    icon: Cloud,
    integrations: [
      { name: 'Google Drive', description: 'Store invoice PDFs in Google Drive', status: 'available' },
      { name: 'Dropbox', description: 'Automatic backup to Dropbox', status: 'available' },
      { name: 'OneDrive', description: 'Sync with Microsoft OneDrive', status: 'coming-soon' },
    ],
  },
  {
    name: 'Communication',
    icon: Mail,
    integrations: [
      { name: 'Gmail', description: 'Send invoices directly from Gmail', status: 'available' },
      { name: 'Outlook', description: 'Microsoft Outlook integration', status: 'available' },
      { name: 'Slack', description: 'Get payment notifications in Slack', status: 'available' },
    ],
  },
  {
    name: 'Scheduling',
    icon: Calendar,
    integrations: [
      { name: 'Google Calendar', description: 'Sync jobs and reminders to Calendar', status: 'available' },
      { name: 'Calendly', description: 'Schedule meetings with clients', status: 'coming-soon' },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Connect Your Favorite Tools
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              SubPaid integrates with the tools you already use. Sync your data, automate workflows, and get more done.
            </p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search integrations..."
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Integration Categories */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            {integrationCategories.map((category) => (
              <div key={category.name} className="mb-16 last:mb-0">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-[#9FE870]/20 rounded-lg flex items-center justify-center">
                    <category.icon className="w-5 h-5 text-[#9FE870]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#1a1a2e]">{category.name}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {category.integrations.map((integration) => (
                    <div
                      key={integration.name}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-gray-200">
                          <span className="text-gray-400 text-xs font-medium">
                            {integration.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        {integration.status === 'coming-soon' && (
                          <span className="px-2 py-1 bg-[#FF9F43]/10 text-[#FF9F43] text-xs font-medium rounded-full">
                            Coming Soon
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-[#1a1a2e] mb-2">{integration.name}</h3>
                      <p className="text-gray-600 text-sm">{integration.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* API Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
              Build Your Own Integration
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Need a custom integration? Our REST API gives you full access to create invoices, manage clients, and retrieve payment data programmatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/docs/api"
                className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2d2d44] transition-all"
              >
                View API Docs
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1a1a2e] px-6 py-3 rounded-full font-bold border border-gray-200 hover:shadow-lg transition-all"
              >
                Request Integration
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to connect your workflow?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Start your free trial and set up integrations in minutes.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
