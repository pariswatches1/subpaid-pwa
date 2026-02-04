import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, FileText, ArrowRight, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Free Invoice Templates - SubPaid',
  description: 'Download free professional invoice templates for subcontractors. Available in PDF, Word, and Excel formats.',
  alternates: {
    canonical: 'https://www.subpaid.com/templates',
  },
};

const templates = [
  {
    name: 'Standard Invoice',
    description: 'Clean, professional invoice template suitable for any trade.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '12,345',
    featured: true,
  },
  {
    name: 'Electrician Invoice',
    description: 'Specialized template with common electrical work line items.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '4,567',
    featured: false,
  },
  {
    name: 'Plumbing Invoice',
    description: 'Template designed for plumbing contractors with material categories.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '3,892',
    featured: false,
  },
  {
    name: 'HVAC Invoice',
    description: 'HVAC-specific template with equipment and labor breakdowns.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '2,156',
    featured: false,
  },
  {
    name: 'General Contractor Invoice',
    description: 'Comprehensive template for general contracting work.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '5,234',
    featured: false,
  },
  {
    name: 'Time & Materials Invoice',
    description: 'Template for T&M billing with hourly rate calculations.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '3,456',
    featured: false,
  },
  {
    name: 'Progress Billing Invoice',
    description: 'For invoicing based on project completion percentage.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '2,789',
    featured: false,
  },
  {
    name: 'Change Order Invoice',
    description: 'Template specifically for change order billing.',
    formats: ['PDF', 'Word', 'Excel'],
    downloads: '1,890',
    featured: false,
  },
];

const benefits = [
  'Professional design that builds trust',
  'Pre-filled with common line items',
  'Easy to customize for your business',
  'Includes payment terms and conditions',
  'Mobile-friendly PDF format',
];

export default function TemplatesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Free Invoice Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Professional invoice templates designed specifically for subcontractors. Download free in PDF, Word, or Excel format.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#9FE870]/10 text-[#1a1a2e] rounded-full text-sm"
                >
                  <Check className="w-4 h-4 text-[#9FE870]" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template) => (
                <div
                  key={template.name}
                  className={`rounded-xl overflow-hidden ${
                    template.featured
                      ? 'bg-gradient-to-br from-[#9FE870]/10 to-[#54A0FF]/10 ring-2 ring-[#9FE870]'
                      : 'bg-gray-50'
                  }`}
                >
                  {template.featured && (
                    <div className="bg-[#9FE870] text-[#1a1a2e] text-center py-1 text-xs font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="p-6">
                    <div className="w-full h-40 bg-white rounded-lg border border-gray-200 flex items-center justify-center mb-4">
                      <FileText className="w-16 h-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{template.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-2">
                        {template.formats.map((format) => (
                          <span
                            key={format}
                            className="px-2 py-1 bg-white rounded text-xs font-medium text-gray-600 border border-gray-200"
                          >
                            {format}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">{template.downloads} downloads</span>
                    </div>

                    <button className="w-full flex items-center justify-center gap-2 bg-[#1a1a2e] text-white py-3 rounded-lg font-medium hover:bg-[#2d2d44] transition-all">
                      <Download className="w-4 h-4" />
                      Download Free
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Templates Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                Why Use Professional Invoice Templates?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Build Trust with Clients</h3>
                <p className="text-gray-600">
                  A professional invoice shows clients you run a legitimate business. It sets the tone for the payment relationship and increases the likelihood of on-time payment.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Save Time</h3>
                <p className="text-gray-600">
                  Pre-designed templates with common line items mean you spend less time formatting and more time doing billable work.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Reduce Errors</h3>
                <p className="text-gray-600">
                  Templates ensure you include all necessary information every time: payment terms, tax IDs, and itemized breakdowns.
                </p>
              </div>
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-3">Legal Protection</h3>
                <p className="text-gray-600">
                  Proper invoices create a paper trail that protects you in payment disputes and supports lien rights.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Want even faster invoicing?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              With SubPaid, just snap a photo and our AI creates a professional invoice instantly. No templates needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Try SubPaid Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features/snap-to-invoice"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Learn About Snap to Invoice
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
