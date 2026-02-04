'use client';

import Link from 'next/link';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Users, BarChart3, Star, Clock } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const benefits = [
  {
    icon: TrendingUp,
    title: 'Track Payment Reliability',
    description: 'Monitor how reliably each client pays over time with a simple score from 0-100.',
  },
  {
    icon: AlertTriangle,
    title: 'Early Warning System',
    description: 'Get alerts when a client\'s PayScore drops, indicating potential payment problems.',
  },
  {
    icon: Users,
    title: 'Client Comparison',
    description: 'Compare payment reliability across all your clients to prioritize your best payers.',
  },
  {
    icon: BarChart3,
    title: 'Industry Benchmarks',
    description: 'See how your clients compare to industry averages for similar businesses.',
  },
];

const scoreRanges = [
  { range: '90-100', label: 'Excellent', color: '#22C55E', description: 'Pays on time or early consistently' },
  { range: '70-89', label: 'Good', color: '#9FE870', description: 'Usually pays on time with rare delays' },
  { range: '50-69', label: 'Fair', color: '#FF9F43', description: 'Occasional late payments, monitor closely' },
  { range: '0-49', label: 'Poor', color: '#EF4444', description: 'Frequent late payments, consider deposits' },
];

const factors = [
  'Average days to payment',
  'Payment consistency over time',
  'Number of late payments',
  'Response to payment reminders',
  'Industry payment norms',
  'Seasonal payment patterns',
];

export default function PayScorePage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#54A0FF]/10 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#54A0FF]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-[#54A0FF]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  PayScore™
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Know your client&apos;s payment reliability before you start the job. PayScore analyzes payment history to give each client a reliability score, so you can make informed decisions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#54A0FF] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Try It Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d2d44] transition-all"
                  >
                    See Demo
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="text-center mb-6">
                    <p className="text-gray-500 text-sm mb-2">Sample Client PayScore</p>
                    <div className="text-6xl font-bold text-[#22C55E]">87</div>
                    <p className="text-lg font-medium text-[#22C55E] mt-2">Good</p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Avg. Days to Pay</span>
                      <span className="font-semibold">18 days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">On-Time Rate</span>
                      <span className="font-semibold">92%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Invoices</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Trend</span>
                      <span className="font-semibold text-[#22C55E] flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" /> Improving
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Score Ranges */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Understanding PayScore</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                PayScore rates clients from 0-100 based on their payment behavior. Here&apos;s what each range means.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {scoreRanges.map((score) => (
                <div
                  key={score.range}
                  className="bg-gray-50 rounded-xl p-6 text-center border-t-4"
                  style={{ borderColor: score.color }}
                >
                  <div className="text-3xl font-bold mb-2" style={{ color: score.color }}>
                    {score.range}
                  </div>
                  <div className="font-semibold text-[#1a1a2e] mb-2">{score.label}</div>
                  <p className="text-sm text-gray-600">{score.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It's Calculated */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                  How PayScore Is Calculated
                </h2>
                <p className="text-gray-600 mb-8">
                  PayScore uses machine learning to analyze multiple factors and produce an accurate reliability score for each client.
                </p>
                <ul className="space-y-4">
                  {factors.map((factor) => (
                    <li key={factor} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#54A0FF]/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-[#54A0FF]" />
                      </div>
                      <span className="text-gray-700">{factor}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
                  <h3 className="font-semibold text-[#1a1a2e] mb-6">Score Factors Breakdown</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Payment Speed</span>
                        <span className="text-sm font-medium">35%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#54A0FF] h-2 rounded-full" style={{ width: '35%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Consistency</span>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#9FE870] h-2 rounded-full" style={{ width: '25%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Late Payment History</span>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#FF9F43] h-2 rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Responsiveness</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#1a1a2e] h-2 rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-600">Industry Comparison</span>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-[#1a1a2e] h-2 rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why PayScore Matters</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-gray-50 rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#54A0FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#54A0FF]" />
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

        {/* Use Cases */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How Contractors Use PayScore</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 text-[#FF9F43]" />
                  Before Starting a New Job
                </h3>
                <p className="text-white/70">
                  Check a new client&apos;s PayScore before accepting a job. For low scores, consider requiring a deposit or progress payments.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#54A0FF]" />
                  Setting Payment Terms
                </h3>
                <p className="text-white/70">
                  Offer Net 30 to high-score clients, but require Net 15 or deposits from clients with lower scores.
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#9FE870]" />
                  Prioritizing Collections
                </h3>
                <p className="text-white/70">
                  Focus collection efforts on clients whose scores are dropping – they may need extra attention.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#54A0FF]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Know before you work
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start using PayScore today with your 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#54A0FF] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
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
