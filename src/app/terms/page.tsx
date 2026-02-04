import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service - SubPaid',
  description: 'SubPaid Terms of Service. Read our terms and conditions for using the SubPaid platform.',
  alternates: {
    canonical: 'https://www.subpaid.com/terms',
  },
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Terms of Service</h1>
            <p className="text-gray-600 mb-8">Last updated: February 3, 2026</p>

            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 mb-4">
                  By accessing or using SubPaid (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">2. Description of Service</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid provides AI-powered invoicing software for subcontractors, including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li><strong>Snap-to-Invoice:</strong> Photo-based invoice creation using AI</li>
                  <li><strong>SAM Voice Agent:</strong> AI-powered payment collection calls</li>
                  <li><strong>Payment Prophet:</strong> Predictive payment analytics</li>
                  <li>Invoice management, payment tracking, and reporting tools</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">3. Account Registration</h2>
                <p className="text-gray-700 mb-4">
                  To use SubPaid, you must create an account. You agree to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your password</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">4. Subscription and Payment</h2>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Billing</h3>
                <p className="text-gray-700 mb-4">
                  Paid plans are billed in advance on a monthly or annual basis. Subscription fees are non-refundable except as required by law or as specified in our refund policy.
                </p>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Free Trial</h3>
                <p className="text-gray-700 mb-4">
                  We offer a 14-day free trial. No credit card is required. At the end of the trial, you must subscribe to continue using paid features.
                </p>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Price Changes</h3>
                <p className="text-gray-700 mb-4">
                  We may modify pricing with 30 days&apos; notice. Existing subscriptions will remain at their current price until renewal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">5. Acceptable Use</h2>
                <p className="text-gray-700 mb-4">You agree NOT to:</p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Use the Service for any unlawful purpose</li>
                  <li>Submit false or fraudulent invoices</li>
                  <li>Harass, abuse, or threaten others through SAM Voice Agent</li>
                  <li>Attempt to gain unauthorized access to our systems</li>
                  <li>Interfere with or disrupt the Service</li>
                  <li>Reverse engineer or copy our software</li>
                  <li>Resell or redistribute the Service without permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">6. SAM Voice Agent Terms</h2>
                <p className="text-gray-700 mb-4">
                  When using SAM Voice Agent, you agree that:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Calls will be made on your behalf to collect legitimate payments</li>
                  <li>You have the right to contact the recipients about the invoices</li>
                  <li>Calls will comply with applicable telemarketing and debt collection laws</li>
                  <li>Call recordings may be stored for quality and legal purposes</li>
                  <li>You will not use the service for harassment or illegal collection practices</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">7. Intellectual Property</h2>
                <p className="text-gray-700 mb-4">
                  SubPaid and its original content, features, and functionality are owned by SubPaid, Inc. and are protected by international copyright, trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-700 mb-4">
                  You retain ownership of your data, invoices, and content. By using our Service, you grant us a license to process your data as necessary to provide the Service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">8. Data and Privacy</h2>
                <p className="text-gray-700 mb-4">
                  Your use of SubPaid is also governed by our <Link href="/privacy" className="text-[#54A0FF] hover:underline">Privacy Policy</Link>. You agree to our collection and use of data as described therein.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">9. Disclaimer of Warranties</h2>
                <p className="text-gray-700 mb-4">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>The Service will be uninterrupted or error-free</li>
                  <li>AI predictions (Payment Prophet) will be accurate</li>
                  <li>SAM Voice Agent will successfully collect all payments</li>
                  <li>The Service will meet your specific requirements</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">10. Limitation of Liability</h2>
                <p className="text-gray-700 mb-4">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, SUBPAID SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITIES.
                </p>
                <p className="text-gray-700 mb-4">
                  Our total liability shall not exceed the amount you paid us in the 12 months preceding the claim.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">11. Indemnification</h2>
                <p className="text-gray-700 mb-4">
                  You agree to indemnify and hold harmless SubPaid from any claims, damages, or expenses arising from your use of the Service, violation of these Terms, or infringement of any third-party rights.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">12. Termination</h2>
                <p className="text-gray-700 mb-4">
                  We may terminate or suspend your account at any time for violation of these Terms. Upon termination:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-4">
                  <li>Your right to use the Service will cease immediately</li>
                  <li>You may export your data within 30 days</li>
                  <li>We may delete your data after 90 days</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">13. Governing Law</h2>
                <p className="text-gray-700 mb-4">
                  These Terms shall be governed by the laws of the State of California, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County, California.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">14. Changes to Terms</h2>
                <p className="text-gray-700 mb-4">
                  We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or through the Service. Continued use after changes constitutes acceptance.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">15. Contact Information</h2>
                <p className="text-gray-700">
                  For questions about these Terms, contact us at:<br />
                  <strong>Email:</strong> legal@subpaid.com<br />
                  <strong>Address:</strong> SubPaid, Inc., 123 Main Street, San Francisco, CA 94102
                </p>
              </section>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600">
                See also: <Link href="/privacy" className="text-[#54A0FF] hover:underline">Privacy Policy</Link> | <Link href="/security" className="text-[#54A0FF] hover:underline">Security</Link> | <Link href="/gdpr" className="text-[#54A0FF] hover:underline">GDPR</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
