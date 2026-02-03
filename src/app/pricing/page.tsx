'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X, ArrowRight, Zap, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { FAQ } from '@/components/FAQ';
import { Footer } from '@/components/Footer';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: { text: string; included: boolean }[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const tiers: PricingTier[] = [
  {
    name: 'Starter',
    price: '$19',
    period: '/month',
    description: 'Perfect for solo contractors just getting started',
    features: [
      { text: 'Unlimited invoices', included: true },
      { text: 'Snap to Invoice (50 scans/mo)', included: true },
      { text: 'Email payment reminders', included: true },
      { text: '1 user', included: true },
      { text: 'Basic reports', included: true },
      { text: 'Email support', included: true },
      { text: 'SAM Voice Agent', included: false },
      { text: 'Payment Prophet', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'Best for growing businesses that need automation',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Snap to Invoice (unlimited)', included: true },
      { text: 'SAM Voice Agent (100 calls/mo)', included: true },
      { text: 'Payment Prophet predictions', included: true },
      { text: '3 users', included: true },
      { text: 'Advanced reports', included: true },
      { text: 'Priority email support', included: true },
      { text: 'Custom branding', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
    highlighted: true,
    badge: 'MOST POPULAR',
  },
  {
    name: 'Business',
    price: '$99',
    period: '/month',
    description: 'For established businesses with larger teams',
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'SAM Voice Agent (unlimited)', included: true },
      { text: 'Custom branding', included: true },
      { text: 'API access', included: true },
      { text: '10 users', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Phone support', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'SLA guarantee', included: false },
    ],
    cta: 'Start Free Trial',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large organizations with custom requirements',
    features: [
      { text: 'Everything in Business', included: true },
      { text: 'Unlimited users', included: true },
      { text: 'SLA guarantee (99.9%)', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated success manager', included: true },
      { text: 'On-premise deployment option', included: true },
      { text: 'Custom training', included: true },
      { text: 'Priority 24/7 support', included: true },
      { text: 'Volume discounts', included: true },
    ],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');

  return (
    <>
      <Navbar />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              Simple, Transparent Pricing
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Choose the plan that fits your business
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Start free for 14 days. No credit card required. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={`font-medium ${billingPeriod === 'monthly' ? 'text-[#1a1a2e]' : 'text-gray-400'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'annual' : 'monthly')}
                className="relative w-14 h-7 bg-[#1a1a2e] rounded-full transition-colors"
                aria-label="Toggle billing period"
              >
                <span
                  className={`absolute top-1 w-5 h-5 bg-[#9FE870] rounded-full transition-transform ${
                    billingPeriod === 'annual' ? 'translate-x-8' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`font-medium ${billingPeriod === 'annual' ? 'text-[#1a1a2e]' : 'text-gray-400'}`}>
                Annual
                <span className="ml-2 px-2 py-0.5 bg-[#9FE870] text-[#1a1a2e] text-xs font-bold rounded-full">
                  Save 20%
                </span>
              </span>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12 -mt-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-2xl p-8 ${
                    tier.highlighted
                      ? 'bg-[#1a1a2e] text-white ring-2 ring-[#9FE870] scale-105 relative z-10'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {tier.badge && (
                    <span className="inline-block bg-[#9FE870] text-[#1a1a2e] text-xs font-bold px-3 py-1 rounded-full mb-4">
                      {tier.badge}
                    </span>
                  )}

                  <h3 className="text-xl font-bold">{tier.name}</h3>
                  <p className={`text-sm mt-2 ${tier.highlighted ? 'text-gray-300' : 'text-gray-500'}`}>
                    {tier.description}
                  </p>

                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-bold">
                      {tier.price === 'Custom'
                        ? tier.price
                        : billingPeriod === 'annual'
                          ? `$${Math.round(parseInt(tier.price.slice(1)) * 0.8)}`
                          : tier.price
                      }
                    </span>
                    {tier.period && (
                      <span className={tier.highlighted ? 'text-gray-300' : 'text-gray-500'}>
                        {tier.period}
                      </span>
                    )}
                  </div>

                  <Link
                    href={tier.name === 'Enterprise' ? '/contact' : '/signup'}
                    className={`block w-full py-3 rounded-full font-semibold text-center transition-all ${
                      tier.highlighted
                        ? 'bg-[#9FE870] text-[#1a1a2e] hover:shadow-lg'
                        : 'bg-[#1a1a2e] text-white hover:bg-[#2d2d44]'
                    }`}
                  >
                    {tier.cta}
                  </Link>

                  <ul className="mt-8 space-y-4">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-[#9FE870]' : 'text-[#22C55E]'}`} />
                        ) : (
                          <X className={`w-5 h-5 flex-shrink-0 ${tier.highlighted ? 'text-gray-500' : 'text-gray-300'}`} />
                        )}
                        <span className={`text-sm ${
                          feature.included
                            ? tier.highlighted ? 'text-white' : 'text-gray-700'
                            : tier.highlighted ? 'text-gray-500' : 'text-gray-400'
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">
                Compare All Features
              </h2>
              <p className="text-gray-600">
                See exactly what&apos;s included in each plan
              </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-6 py-4 font-semibold text-[#1a1a2e]">Feature</th>
                      <th className="text-center px-6 py-4 font-semibold text-[#1a1a2e]">Starter</th>
                      <th className="text-center px-6 py-4 font-semibold text-[#9FE870] bg-[#1a1a2e]">Pro</th>
                      <th className="text-center px-6 py-4 font-semibold text-[#1a1a2e]">Business</th>
                      <th className="text-center px-6 py-4 font-semibold text-[#1a1a2e]">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { feature: 'Invoices', starter: 'Unlimited', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'Snap to Invoice', starter: '50/mo', pro: 'Unlimited', business: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'SAM Voice Agent', starter: '—', pro: '100 calls/mo', business: 'Unlimited', enterprise: 'Unlimited' },
                      { feature: 'Payment Prophet', starter: '—', pro: '✓', business: '✓', enterprise: '✓' },
                      { feature: 'Users', starter: '1', pro: '3', business: '10', enterprise: 'Unlimited' },
                      { feature: 'API Access', starter: '—', pro: '—', business: '✓', enterprise: '✓' },
                      { feature: 'Custom Branding', starter: '—', pro: '—', business: '✓', enterprise: '✓' },
                      { feature: 'Dedicated Support', starter: '—', pro: '—', business: '✓', enterprise: '24/7' },
                    ].map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 font-medium text-[#1a1a2e]">{row.feature}</td>
                        <td className="text-center px-6 py-4 text-gray-600">{row.starter}</td>
                        <td className="text-center px-6 py-4 text-white bg-[#1a1a2e]">{row.pro}</td>
                        <td className="text-center px-6 py-4 text-gray-600">{row.business}</td>
                        <td className="text-center px-6 py-4 text-gray-600">{row.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Money-back guarantee */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#9FE870]/20 rounded-full mb-6">
              <Zap className="w-8 h-8 text-[#9FE870]" />
            </div>
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">
              30-Day Money-Back Guarantee
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Try SubPaid risk-free. If you&apos;re not completely satisfied within 30 days of your purchase,
              we&apos;ll refund 100% of your money. No questions asked.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <FAQ />

        {/* Final CTA */}
        <section className="py-20 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to get paid faster?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
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
