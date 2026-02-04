'use client';

import Link from 'next/link';
import { Sparkles, TrendingUp, Calendar, AlertTriangle, ArrowRight, CheckCircle, BarChart3, Target, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const benefits = [
  {
    icon: Calendar,
    title: 'Cash Flow Forecasting',
    description: 'See exactly when payments are expected so you can plan expenses, payroll, and investments.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk Alerts',
    description: 'Get early warnings about invoices that are likely to be late based on client behavior patterns.',
  },
  {
    icon: Target,
    title: 'Client Scoring',
    description: 'Each client gets a payment reliability score so you know who to prioritize or require deposits from.',
  },
  {
    icon: BarChart3,
    title: 'Industry Insights',
    description: 'Benchmark your payment times against industry averages to identify opportunities.',
  },
];

const predictions = [
  {
    client: 'ABC Construction',
    invoice: '#1234',
    amount: '$4,500',
    predicted: 'Feb 15, 2026',
    confidence: 94,
    status: 'on-time',
  },
  {
    client: 'Smith Developments',
    invoice: '#1235',
    amount: '$2,800',
    predicted: 'Feb 22, 2026',
    confidence: 87,
    status: 'on-time',
  },
  {
    client: 'Metro Builders',
    invoice: '#1236',
    amount: '$6,200',
    predicted: 'Mar 5, 2026',
    confidence: 72,
    status: 'at-risk',
  },
];

const howItWorks = [
  {
    title: 'Analyzes Payment History',
    description: 'Reviews how long each client typically takes to pay and identifies patterns.',
  },
  {
    title: 'Considers External Factors',
    description: 'Accounts for seasonality, industry trends, and economic indicators.',
  },
  {
    title: 'Machine Learning Models',
    description: 'Uses advanced AI trained on millions of invoices to improve accuracy over time.',
  },
  {
    title: 'Updates in Real-Time',
    description: 'Predictions adjust as new information becomes available.',
  },
];

export default function PaymentProphetPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#FF9F43]/10 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#FF9F43]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#FF9F43]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  Payment Prophet
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Predict when you&apos;ll get paid with AI-powered forecasting. Plan your cash flow with confidence, not guesswork.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#FF9F43] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Try It Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d2d44] transition-all"
                  >
                    See It in Action
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-[#FF9F43]/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-32 h-32 text-[#FF9F43]/50 mx-auto mb-4" />
                    <p className="text-gray-500">Prediction demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#FF9F43] mb-2">91%</div>
                <p className="text-white/70">Prediction accuracy</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF9F43] mb-2">14 days</div>
                <p className="text-white/70">Average advance notice</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#FF9F43] mb-2">$50K+</div>
                <p className="text-white/70">Average cash flow visibility</p>
              </div>
            </div>
          </div>
        </section>

        {/* Live Predictions Demo */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">See Your Payment Future</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Payment Prophet gives you a clear view of when each invoice will be paid.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="space-y-4">
                {predictions.map((pred) => (
                  <div key={pred.invoice} className="bg-white rounded-xl p-6 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                    <div className="flex-1">
                      <p className="font-semibold text-[#1a1a2e]">{pred.client}</p>
                      <p className="text-sm text-gray-500">{pred.invoice}</p>
                    </div>
                    <div className="text-right md:text-left">
                      <p className="font-bold text-[#1a1a2e]">{pred.amount}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{pred.predicted}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            pred.status === 'on-time' ? 'bg-[#22C55E]' : 'bg-[#FF9F43]'
                          }`}
                          style={{ width: `${pred.confidence}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{pred.confidence}%</span>
                    </div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          pred.status === 'on-time'
                            ? 'bg-[#22C55E]/10 text-[#22C55E]'
                            : 'bg-[#FF9F43]/10 text-[#FF9F43]'
                        }`}
                      >
                        {pred.status === 'on-time' ? 'On Time' : 'At Risk'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Prediction Matters</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stop wondering when you&apos;ll get paid. Start planning with confidence.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#FF9F43]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#FF9F43]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                  How Payment Prophet Works
                </h2>
                <p className="text-gray-600 mb-8">
                  Our AI analyzes multiple data points to predict payment timing with remarkable accuracy.
                </p>
                <ul className="space-y-6">
                  {howItWorks.map((item, index) => (
                    <li key={item.title} className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-[#FF9F43] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#1a1a2e] mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-[#FF9F43]/10 rounded-2xl p-8">
                  <div className="bg-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-[#1a1a2e]">Cash Flow Forecast</h3>
                      <span className="text-sm text-gray-500">Next 30 days</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Week 1</span>
                        <span className="font-bold text-[#22C55E]">+$8,500</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Week 2</span>
                        <span className="font-bold text-[#22C55E]">+$12,300</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Week 3</span>
                        <span className="font-bold text-[#22C55E]">+$6,200</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Week 4</span>
                        <span className="font-bold text-[#FF9F43]">+$4,800</span>
                      </div>
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#1a1a2e]">Total Expected</span>
                          <span className="font-bold text-xl text-[#1a1a2e]">$31,800</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#FF9F43]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Know your future. Plan your present.
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start predicting your cash flow today with a 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#FF9F43] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              >
                See All Features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
