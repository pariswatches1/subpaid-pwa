import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, Key, Book, Terminal, ArrowRight, FileJson, Shield, Zap } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'API Documentation - SubPaid',
  description: 'SubPaid API documentation. Integrate SubPaid invoicing into your applications with our REST API.',
  alternates: {
    canonical: 'https://www.subpaid.com/docs/api',
  },
};

const endpoints = [
  {
    method: 'GET',
    path: '/invoices',
    description: 'List all invoices',
  },
  {
    method: 'POST',
    path: '/invoices',
    description: 'Create a new invoice',
  },
  {
    method: 'GET',
    path: '/invoices/:id',
    description: 'Get invoice details',
  },
  {
    method: 'PUT',
    path: '/invoices/:id',
    description: 'Update an invoice',
  },
  {
    method: 'DELETE',
    path: '/invoices/:id',
    description: 'Delete an invoice',
  },
  {
    method: 'POST',
    path: '/invoices/:id/send',
    description: 'Send invoice to client',
  },
  {
    method: 'GET',
    path: '/clients',
    description: 'List all clients',
  },
  {
    method: 'POST',
    path: '/clients',
    description: 'Create a new client',
  },
  {
    method: 'GET',
    path: '/payments',
    description: 'List all payments',
  },
  {
    method: 'GET',
    path: '/predictions',
    description: 'Get payment predictions',
  },
];

const features = [
  {
    icon: Zap,
    title: 'RESTful API',
    description: 'Simple, predictable REST endpoints for all SubPaid features.',
  },
  {
    icon: Shield,
    title: 'Secure Authentication',
    description: 'API key authentication with optional OAuth 2.0 support.',
  },
  {
    icon: FileJson,
    title: 'JSON Responses',
    description: 'All responses in clean, well-documented JSON format.',
  },
  {
    icon: Book,
    title: 'Webhooks',
    description: 'Real-time notifications for invoice and payment events.',
  },
];

export default function APIDocsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#9FE870]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Code className="w-8 h-8 text-[#9FE870]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  SubPaid API
                </h1>
                <p className="text-xl text-white/70 mb-8">
                  Integrate SubPaid&apos;s powerful invoicing features into your applications. Create invoices, manage clients, and access payment predictions programmatically.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="#getting-started"
                    className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Get Started
                    <ArrowRight className="w-5 h-5" />
                  </a>
                  <a
                    href="#endpoints"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
                  >
                    View Endpoints
                  </a>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-[#0d0d1a] rounded-xl p-6 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <pre className="text-gray-300 overflow-x-auto">
{`curl -X POST https://api.subpaid.com/v1/invoices \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "client_id": "cli_123",
    "items": [{
      "description": "Electrical work",
      "quantity": 8,
      "rate": 75.00
    }],
    "due_date": "2026-02-28"
  }'`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-12 h-12 bg-[#9FE870]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-[#9FE870]" />
                  </div>
                  <h3 className="font-semibold text-[#1a1a2e] mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Getting Started */}
        <section id="getting-started" className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Getting Started</h2>

            <div className="space-y-8">
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center">
                    <span className="text-[#1a1a2e] font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e]">Get Your API Key</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Generate an API key from your SubPaid dashboard. Go to Settings → API → Generate New Key.
                </p>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
                  <Key className="w-5 h-5 text-gray-500" />
                  <code className="text-sm text-gray-700">sk_live_xxxxxxxxxxxxxxxxxxxx</code>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center">
                    <span className="text-[#1a1a2e] font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e]">Make Your First Request</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Include your API key in the Authorization header of every request.
                </p>
                <div className="bg-[#1a1a2e] rounded-lg p-4 font-mono text-sm">
                  <pre className="text-gray-300 overflow-x-auto">
{`curl https://api.subpaid.com/v1/invoices \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center">
                    <span className="text-[#1a1a2e] font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e]">Base URL</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  All API requests should be made to:
                </p>
                <div className="bg-gray-100 rounded-lg px-4 py-3">
                  <code className="text-sm text-[#54A0FF]">https://api.subpaid.com/v1</code>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Endpoints */}
        <section id="endpoints" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">API Endpoints</h2>

            <div className="bg-gray-50 rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Method</th>
                    <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Endpoint</th>
                    <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {endpoints.map((endpoint) => (
                    <tr key={`${endpoint.method}-${endpoint.path}`} className="hover:bg-gray-100">
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            endpoint.method === 'GET'
                              ? 'bg-[#22C55E]/20 text-[#22C55E]'
                              : endpoint.method === 'POST'
                              ? 'bg-[#54A0FF]/20 text-[#54A0FF]'
                              : endpoint.method === 'PUT'
                              ? 'bg-[#FF9F43]/20 text-[#FF9F43]'
                              : 'bg-[#EF4444]/20 text-[#EF4444]'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-sm text-gray-700">{endpoint.path}</code>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{endpoint.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-gray-500 mt-6 text-center">
              Full documentation with request/response examples coming soon.
            </p>
          </div>
        </section>

        {/* SDKs */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8 text-center">Official SDKs</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 text-center">
                <Terminal className="w-10 h-10 text-[#1a1a2e] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1a1a2e] mb-2">Node.js</h3>
                <code className="text-sm text-gray-500">npm install @subpaid/sdk</code>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <Terminal className="w-10 h-10 text-[#1a1a2e] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1a1a2e] mb-2">Python</h3>
                <code className="text-sm text-gray-500">pip install subpaid</code>
              </div>
              <div className="bg-white rounded-xl p-6 text-center">
                <Terminal className="w-10 h-10 text-[#1a1a2e] mx-auto mb-4" />
                <h3 className="font-semibold text-[#1a1a2e] mb-2">Ruby</h3>
                <code className="text-sm text-gray-500">gem install subpaid</code>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to integrate?</h2>
            <p className="text-white/70 mb-8">
              API access is available on Business and Enterprise plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                View Pricing
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
