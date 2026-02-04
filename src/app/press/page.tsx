import type { Metadata } from 'next';
import Link from 'next/link';
import { Download, Mail, ExternalLink, Calendar } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Press & Media - SubPaid',
  description: 'SubPaid press kit, media resources, and company information for journalists and media professionals.',
  alternates: {
    canonical: 'https://www.subpaid.com/press',
  },
};

const pressReleases = [
  {
    date: 'January 15, 2026',
    title: 'SubPaid Reaches 500 Active Customers Milestone',
    excerpt: 'AI-powered invoicing platform continues rapid growth among subcontractors.',
  },
  {
    date: 'November 1, 2025',
    title: 'SubPaid Launches Payment Prophet AI Feature',
    excerpt: 'New predictive analytics help subcontractors forecast cash flow with 91% accuracy.',
  },
  {
    date: 'June 15, 2025',
    title: 'SubPaid Introduces SAM Voice Agent',
    excerpt: 'Industry-first AI voice assistant automates payment collection calls for subcontractors.',
  },
  {
    date: 'January 10, 2024',
    title: 'SubPaid Launches Snap to Invoice Feature',
    excerpt: 'Revolutionary photo-to-invoice technology helps subcontractors create invoices in seconds.',
  },
];

const mediaResources = [
  { name: 'SubPaid Logo Pack', format: 'ZIP (PNG, SVG)', size: '2.4 MB' },
  { name: 'Brand Guidelines', format: 'PDF', size: '1.8 MB' },
  { name: 'Product Screenshots', format: 'ZIP (PNG)', size: '8.2 MB' },
  { name: 'Founder Headshots', format: 'ZIP (JPG)', size: '4.1 MB' },
];

const facts = [
  { label: 'Founded', value: '2023' },
  { label: 'Headquarters', value: 'San Francisco, CA' },
  { label: 'Employees', value: '25+' },
  { label: 'Customers', value: '500+' },
  { label: 'Invoices Processed', value: '$50M+' },
  { label: 'Funding', value: 'Seed Stage' },
];

export default function PressPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Press & Media
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Resources for journalists and media professionals covering SubPaid.
            </p>
            <a
              href="mailto:press@subpaid.com"
              className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2d2d44] transition-all"
            >
              <Mail className="w-5 h-5" />
              Contact Press Team
            </a>
          </div>
        </section>

        {/* Company Facts */}
        <section className="py-16 bg-[#1a1a2e] text-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8 text-center">Company at a Glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {facts.map((fact) => (
                <div key={fact.label} className="text-center">
                  <div className="text-2xl font-bold text-[#9FE870]">{fact.value}</div>
                  <div className="text-white/70 text-sm">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About SubPaid */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">About SubPaid</h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                SubPaid is an AI-powered invoicing platform designed specifically for subcontractors in the construction and trades industries. Founded in 2023 by Michael Chen, a former electrical contractor, and Sarah Martinez, an AI researcher, SubPaid addresses the critical pain point of late payments that affects millions of subcontractors across the United States.
              </p>
              <p>
                The platform&apos;s flagship features include Snap to Invoice, which uses computer vision to convert photos of completed work into professional invoices in seconds; SAM Voice Agent, an AI-powered assistant that makes payment collection calls; and Payment Prophet, which predicts payment timing with 91% accuracy to help subcontractors manage cash flow.
              </p>
              <p>
                SubPaid has grown to serve over 500 subcontractors across the US, processing more than $50 million in invoices. The company is headquartered in San Francisco and operates as a fully remote team.
              </p>
            </div>
          </div>
        </section>

        {/* Press Releases */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Press Releases</h2>
            <div className="space-y-4">
              {pressReleases.map((release) => (
                <a
                  key={release.title}
                  href="#"
                  className="block bg-white rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    {release.date}
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] group-hover:text-[#54A0FF] transition-colors mb-2">
                    {release.title}
                  </h3>
                  <p className="text-gray-600">{release.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-[#54A0FF] font-medium mt-4">
                    Read More
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Media Resources */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Media Resources</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mediaResources.map((resource) => (
                <div
                  key={resource.name}
                  className="bg-gray-50 rounded-xl p-6 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e]">{resource.name}</h3>
                    <p className="text-sm text-gray-500">
                      {resource.format} • {resource.size}
                    </p>
                  </div>
                  <button className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center hover:shadow-lg transition-all">
                    <Download className="w-5 h-5 text-[#1a1a2e]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
            <p className="text-white/70 mb-8">
              For press inquiries, interview requests, or additional information, please contact our press team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:press@subpaid.com"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                <Mail className="w-5 h-5" />
                press@subpaid.com
              </a>
            </div>
            <p className="text-white/50 text-sm mt-6">
              We typically respond to media inquiries within 24 hours.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
