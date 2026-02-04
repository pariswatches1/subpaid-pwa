import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Lock, Server, Eye, CheckCircle, FileCheck } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Security - SubPaid',
  description: 'Learn about SubPaid security practices. SOC 2 compliant, 256-bit encryption, and enterprise-grade protection for your invoicing data.',
  alternates: {
    canonical: 'https://www.subpaid.com/security',
  },
};

const securityFeatures = [
  {
    icon: Lock,
    title: '256-bit Encryption',
    description: 'All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption.',
  },
  {
    icon: Shield,
    title: 'SOC 2 Type II Compliant',
    description: 'We undergo annual SOC 2 audits to ensure our security controls meet the highest standards.',
  },
  {
    icon: Server,
    title: 'Secure Infrastructure',
    description: 'Hosted on AWS with enterprise-grade security, redundancy, and 99.9% uptime SLA.',
  },
  {
    icon: Eye,
    title: '24/7 Monitoring',
    description: 'Continuous security monitoring and threat detection to protect your data around the clock.',
  },
  {
    icon: CheckCircle,
    title: 'Regular Penetration Testing',
    description: 'Third-party security experts conduct regular penetration tests to identify vulnerabilities.',
  },
  {
    icon: FileCheck,
    title: 'Data Privacy Controls',
    description: 'Granular access controls and audit logs ensure your data is only accessed by authorized users.',
  },
];

const certifications = [
  { name: 'SOC 2 Type II', status: 'Certified' },
  { name: 'GDPR', status: 'Compliant' },
  { name: 'CCPA', status: 'Compliant' },
  { name: 'PCI DSS', status: 'Level 1 (via Stripe)' },
  { name: 'HIPAA', status: 'Available on Enterprise' },
];

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#9FE870]/20 rounded-full mb-6">
              <Shield className="w-10 h-10 text-[#9FE870]" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise-Grade Security
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Your financial data deserves the highest level of protection. SubPaid is built with security at its core.
            </p>
          </div>
        </section>

        {/* Security Features Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">How We Protect Your Data</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We implement multiple layers of security to ensure your invoices, client information, and payment data are always protected.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {securityFeatures.map((feature) => (
                <div key={feature.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#9FE870]/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#9FE870]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Compliance & Certifications</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                SubPaid maintains compliance with industry-leading security standards and regulations.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden max-w-2xl mx-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Standard</th>
                    <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {certifications.map((cert) => (
                    <tr key={cert.name}>
                      <td className="px-6 py-4 font-medium text-[#1a1a2e]">{cert.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-2 text-[#22C55E]">
                          <CheckCircle className="w-4 h-4" />
                          {cert.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Data Handling */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8 text-center">Data Handling Practices</h2>

            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Data Encryption</h3>
                <p className="text-gray-700">
                  All data transmitted to and from SubPaid is encrypted using TLS 1.3. Data stored in our databases is encrypted at rest using AES-256. Encryption keys are managed through AWS KMS with automatic rotation.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Access Controls</h3>
                <p className="text-gray-700">
                  We implement role-based access control (RBAC) and the principle of least privilege. Employee access to customer data is logged and audited. Multi-factor authentication is required for all internal systems.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Data Retention</h3>
                <p className="text-gray-700">
                  Your data is retained while your account is active. Upon account deletion, data is permanently removed within 90 days. Backups are encrypted and retained for disaster recovery purposes only.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">Incident Response</h3>
                <p className="text-gray-700">
                  We maintain a comprehensive incident response plan. In the event of a security incident, affected users will be notified within 72 hours as required by GDPR and other regulations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Report Vulnerability */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Report a Security Vulnerability</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              We take security seriously and appreciate responsible disclosure. If you discover a vulnerability, please report it to our security team.
            </p>
            <a
              href="mailto:security@subpaid.com"
              className="inline-flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
            >
              security@subpaid.com
            </a>
            <p className="text-white/50 mt-4 text-sm">
              We respond to all security reports within 24 hours.
            </p>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              Learn more: <Link href="/privacy" className="text-[#54A0FF] hover:underline">Privacy Policy</Link> | <Link href="/terms" className="text-[#54A0FF] hover:underline">Terms of Service</Link> | <Link href="/gdpr" className="text-[#54A0FF] hover:underline">GDPR Compliance</Link>
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
