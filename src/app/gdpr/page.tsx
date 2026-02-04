import type { Metadata } from 'next';
import Link from 'next/link';
import { Globe, Shield, Download, Trash2, Edit, Eye } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'GDPR Compliance - SubPaid',
  description: 'SubPaid GDPR compliance information. Learn about your data rights and how we protect EU user data.',
  alternates: {
    canonical: 'https://www.subpaid.com/gdpr',
  },
};

const rights = [
  {
    icon: Eye,
    title: 'Right to Access',
    description: 'You can request a copy of all personal data we hold about you at any time.',
  },
  {
    icon: Edit,
    title: 'Right to Rectification',
    description: 'You can request correction of any inaccurate or incomplete personal data.',
  },
  {
    icon: Trash2,
    title: 'Right to Erasure',
    description: 'You can request deletion of your personal data, subject to legal retention requirements.',
  },
  {
    icon: Download,
    title: 'Right to Data Portability',
    description: 'You can request your data in a machine-readable format to transfer to another service.',
  },
];

export default function GDPRPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#54A0FF]/20 rounded-full mb-6">
              <Globe className="w-10 h-10 text-[#54A0FF]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              GDPR Compliance
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SubPaid is committed to protecting the privacy of our European Union users in accordance with the General Data Protection Regulation (GDPR).
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Your Data Rights Under GDPR</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                As an EU resident, you have specific rights regarding your personal data. Here&apos;s how SubPaid honors these rights.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {rights.map((right) => (
                <div key={right.title} className="bg-gray-50 rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#54A0FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <right.icon className="w-6 h-6 text-[#54A0FF]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{right.title}</h3>
                    <p className="text-gray-600">{right.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detailed Information */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Data Controller</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid, Inc. acts as the Data Controller for personal data processed through our platform. For any GDPR-related inquiries, contact our Data Protection Officer:
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> dpo@subpaid.com<br />
                  <strong>Address:</strong> SubPaid, Inc., 123 Main Street, San Francisco, CA 94102, USA
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Legal Basis for Processing</h2>
                <p className="text-gray-700 mb-4">We process your personal data under the following legal bases:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Contract Performance:</strong> To provide our invoicing services as agreed</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                  <li><strong>Consent:</strong> For marketing communications and optional features</li>
                  <li><strong>Legal Obligation:</strong> To comply with tax and financial regulations</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Data Processing Activities</h2>
                <p className="text-gray-700 mb-4">We process the following categories of personal data:</p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Identity Data:</strong> Name, business name, email address</li>
                  <li><strong>Financial Data:</strong> Invoice details, payment information</li>
                  <li><strong>Technical Data:</strong> IP address, browser type, device information</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform</li>
                  <li><strong>AI Processing Data:</strong> Photos for Snap-to-Invoice, voice recordings for SAM Agent</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">International Data Transfers</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid is based in the United States. When we transfer personal data from the EU to the US, we ensure appropriate safeguards are in place:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
                  <li>Data Processing Agreements with all sub-processors</li>
                  <li>Technical and organizational security measures</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Sub-Processors</h2>
                <p className="text-gray-700 mb-4">
                  We use the following third-party services to process your data:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Amazon Web Services (AWS):</strong> Cloud infrastructure and data storage</li>
                  <li><strong>Stripe:</strong> Payment processing</li>
                  <li><strong>OpenAI:</strong> AI processing for Snap-to-Invoice and Payment Prophet</li>
                  <li><strong>Twilio:</strong> Voice services for SAM Voice Agent</li>
                  <li><strong>SendGrid:</strong> Email delivery</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  All sub-processors are contractually bound to process data in accordance with GDPR requirements.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your personal data for as long as necessary to provide our services and comply with legal obligations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                  <li><strong>Closed Accounts:</strong> Data deleted within 90 days of account closure</li>
                  <li><strong>Financial Records:</strong> Retained for 7 years for tax compliance</li>
                  <li><strong>Marketing Data:</strong> Deleted upon withdrawal of consent</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Automated Decision-Making</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid uses AI for the following automated processes:
                </p>
                <ul className="list-disc pl-6 text-gray-700 space-y-2">
                  <li><strong>Snap-to-Invoice:</strong> Automated extraction of invoice details from photos</li>
                  <li><strong>Payment Prophet:</strong> Prediction of payment timing based on historical data</li>
                </ul>
                <p className="text-gray-700 mt-4">
                  These processes do not produce legal effects or similarly significant effects on you. You can always review and edit AI-generated content before use.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Exercise Your Rights */}
        <section className="py-20 bg-[#54A0FF] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Exercise Your Rights</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              To exercise any of your GDPR rights, please contact our Data Protection Officer. We will respond to your request within 30 days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:dpo@subpaid.com"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#54A0FF] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Contact DPO
              </a>
              <Link
                href="/dashboard/settings"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              >
                Manage Data in Settings
              </Link>
            </div>
          </div>
        </section>

        {/* Complaints */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Right to Lodge a Complaint</h3>
              <p className="text-gray-600">
                If you believe your data protection rights have been violated, you have the right to lodge a complaint with your local data protection authority. For a list of EU data protection authorities, visit the{' '}
                <a href="https://edpb.europa.eu/about-edpb/about-edpb/members_en" target="_blank" rel="noopener noreferrer" className="text-[#54A0FF] hover:underline">
                  European Data Protection Board website
                </a>.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              Related policies: <Link href="/privacy" className="text-[#54A0FF] hover:underline">Privacy Policy</Link> | <Link href="/terms" className="text-[#54A0FF] hover:underline">Terms of Service</Link> | <Link href="/security" className="text-[#54A0FF] hover:underline">Security</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
