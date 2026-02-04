import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy - SubPaid',
  description: 'SubPaid Privacy Policy. Learn how we collect, use, and protect your personal information.',
  alternates: {
    canonical: 'https://www.subpaid.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Privacy Policy</h1>
            <p className="text-gray-600 mb-8">Last updated: February 3, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered invoicing platform and related services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">2. Information We Collect</h2>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Personal Information</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Name, email address, phone number</li>
                  <li>Business name and address</li>
                  <li>Payment and billing information</li>
                  <li>Account credentials</li>
                </ul>

                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Usage Information</h3>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Invoice data and client information you input</li>
                  <li>Photos uploaded for Snap-to-Invoice feature</li>
                  <li>Voice recordings from SAM Voice Agent calls (with consent)</li>
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">3. How We Use Your Information</h2>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Provide and maintain our invoicing services</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Power AI features including Snap-to-Invoice and Payment Prophet</li>
                  <li>Conduct SAM Voice Agent calls on your behalf</li>
                  <li>Send notifications about invoices and payments</li>
                  <li>Improve and personalize our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">4. Data Sharing and Disclosure</h2>
                <p className="text-gray-700 mb-4">We do not sell your personal information. We may share data with:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Service Providers:</strong> Payment processors (Stripe), cloud infrastructure (AWS), communication services</li>
                  <li><strong>Your Clients:</strong> Invoice information you choose to send</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect rights</li>
                  <li><strong>Business Transfers:</strong> In connection with mergers or acquisitions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">5. Data Security</h2>
                <p className="text-gray-700 mb-4">
                  We implement industry-standard security measures including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>256-bit SSL/TLS encryption for data in transit</li>
                  <li>AES-256 encryption for data at rest</li>
                  <li>SOC 2 Type II compliance</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Multi-factor authentication options</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">6. Data Retention</h2>
                <p className="text-gray-700 mb-4">
                  We retain your information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time, subject to legal retention requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">7. Your Rights</h2>
                <p className="text-gray-700 mb-4">Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-4">
                  We use cookies and similar technologies to improve user experience, analyze usage, and personalize content. You can control cookies through your browser settings.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">9. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid is not intended for users under 18 years of age. We do not knowingly collect information from children.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">10. Changes to This Policy</h2>
                <p className="text-gray-700 mb-4">
                  We may update this Privacy Policy periodically. We will notify you of significant changes via email or through our platform.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">11. Contact Us</h2>
                <p className="text-gray-700 mb-4">
                  For privacy-related questions or to exercise your rights, contact us at:
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@subpaid.com<br />
                  <strong>Address:</strong> SubPaid, Inc., 123 Main Street, San Francisco, CA 94102
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                See also: <Link href="/terms" className="text-[#54A0FF] hover:underline">Terms of Service</Link> | <Link href="/security" className="text-[#54A0FF] hover:underline">Security</Link> | <Link href="/gdpr" className="text-[#54A0FF] hover:underline">GDPR</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
