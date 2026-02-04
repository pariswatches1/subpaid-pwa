'use client';

import Link from 'next/link';
import { Camera, Phone, Sparkles, TrendingUp, Zap, Shield, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const mainFeatures = [
  {
    icon: Camera,
    name: 'Snap to Invoice',
    tagline: 'Photo to Invoice in 5 Seconds',
    description: 'Take a photo of your completed work, materials receipt, or handwritten notes. Our AI instantly creates a professional, itemized invoice ready to send.',
    color: '#9FE870',
    href: '/features/snap-to-invoice',
    benefits: ['No manual data entry', 'Accurate itemization', 'Professional formatting'],
  },
  {
    icon: Phone,
    name: 'SAM Voice Agent',
    tagline: 'AI That Collects Your Payments',
    description: 'SAM is your AI assistant that calls clients to follow up on unpaid invoices. Professional, persistent, and available 24/7 to help you get paid faster.',
    color: '#54A0FF',
    href: '/features/voice-agent',
    benefits: ['Automated follow-ups', 'Professional tone', 'Available 24/7'],
  },
  {
    icon: Sparkles,
    name: 'Payment Prophet',
    tagline: 'Predict When You\'ll Get Paid',
    description: 'Our AI analyzes payment patterns and client history to predict exactly when each invoice will be paid. Plan your cash flow with confidence.',
    color: '#FF9F43',
    href: '/features/payment-prophet',
    benefits: ['Cash flow forecasting', 'Client insights', 'Payment patterns'],
  },
];

const additionalFeatures = [
  {
    icon: TrendingUp,
    title: 'Advanced Reports',
    description: 'Track revenue, outstanding invoices, and payment trends with visual dashboards.',
  },
  {
    icon: Zap,
    title: 'Instant Payments',
    description: 'Let clients pay directly from invoices via credit card, ACH, or other methods.',
  },
  {
    icon: Shield,
    title: 'Lien Protection',
    description: 'Automated lien right notices and tracking to protect your payment rights.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description: 'Track hours on jobs and automatically generate invoices from timesheets.',
  },
  {
    icon: DollarSign,
    title: 'Multi-Currency',
    description: 'Invoice clients in their preferred currency with automatic conversion.',
  },
];

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              AI-Powered Features
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Everything You Need to Get Paid Faster
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              SubPaid combines powerful AI with intuitive tools designed specifically for subcontractors. Stop chasing payments and start growing your business.
            </p>
          </div>
        </section>

        {/* Main AI Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                Three AI Features That Change Everything
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our AI-powered tools automate the most time-consuming parts of invoicing and payment collection.
              </p>
            </div>

            <div className="space-y-16">
              {mainFeatures.map((feature, index) => (
                <div
                  key={feature.name}
                  className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}
                >
                  <div className="flex-1">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                      style={{ backgroundColor: `${feature.color}20` }}
                    >
                      <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                    </div>
                    <span
                      className="text-sm font-semibold uppercase tracking-wider"
                      style={{ color: feature.color }}
                    >
                      {feature.tagline}
                    </span>
                    <h3 className="text-3xl font-bold text-[#1a1a2e] mt-2 mb-4">{feature.name}</h3>
                    <p className="text-gray-600 text-lg mb-6">{feature.description}</p>
                    <ul className="space-y-3 mb-6">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${feature.color}20` }}
                          >
                            <svg className="w-4 h-4" style={{ color: feature.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                      style={{ color: feature.color }}
                    >
                      Learn more about {feature.name}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  <div className="flex-1">
                    <div
                      className="aspect-video rounded-2xl flex items-center justify-center"
                      style={{ backgroundColor: `${feature.color}10` }}
                    >
                      <feature.icon className="w-24 h-24" style={{ color: `${feature.color}50` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Features */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">And So Much More</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Beyond our AI features, SubPaid includes everything you need to manage your invoicing.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {additionalFeatures.map((feature) => (
                <div key={feature.title} className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-[#1a1a2e]/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-[#1a1a2e]" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to transform your invoicing?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join 500+ subcontractors who get paid faster with SubPaid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
