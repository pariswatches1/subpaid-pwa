'use client';

import Link from 'next/link';
import { Zap, Clock, Mail, Phone, CheckCircle, ArrowRight, Settings, Calendar, TrendingUp, Shield } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const automations = [
  {
    trigger: 'Invoice Sent',
    action: 'Send payment reminder email after 3 days',
    icon: Mail,
  },
  {
    trigger: 'Invoice Due',
    action: 'Send due date reminder 1 day before',
    icon: Calendar,
  },
  {
    trigger: 'Invoice Overdue (3 days)',
    action: 'Send friendly reminder email',
    icon: Mail,
  },
  {
    trigger: 'Invoice Overdue (7 days)',
    action: 'SAM Voice Agent makes first call',
    icon: Phone,
  },
  {
    trigger: 'Invoice Overdue (14 days)',
    action: 'Send formal payment demand email',
    icon: Mail,
  },
  {
    trigger: 'Invoice Overdue (21 days)',
    action: 'SAM Voice Agent makes follow-up call',
    icon: Phone,
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Save 10+ Hours Per Month',
    description: 'No more manually tracking due dates and sending reminders. Autopilot handles it all.',
  },
  {
    icon: TrendingUp,
    title: 'Get Paid 40% Faster',
    description: 'Consistent, timely follow-ups dramatically reduce average days to payment.',
  },
  {
    icon: Shield,
    title: 'Protect Client Relationships',
    description: 'Professional, friendly communications that maintain positive relationships.',
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Set your own timing, messages, and escalation rules for each client.',
  },
];

const features = [
  'Smart timing based on client behavior',
  'Customizable email templates',
  'Automatic SAM Voice Agent escalation',
  'Client-specific rule overrides',
  'Holiday and weekend awareness',
  'Payment received auto-detection',
  'Escalation pause on partial payment',
  'Detailed activity logs',
];

export default function AutopilotPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#9FE870]/10 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#9FE870]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-[#9FE870]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  Autopilot Mode
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Set it and forget it. Autopilot automatically sends reminders, follows up on overdue invoices, and escalates to SAM Voice Agent when needed – all while you focus on your work.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
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
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#1a1a2e]">Autopilot Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-[#22C55E]">Active</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#9FE870]/10 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      <span className="text-sm">12 invoices monitored</span>
                    </div>
                    <div className="bg-[#54A0FF]/10 rounded-lg p-3 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#54A0FF]" />
                      <span className="text-sm">3 reminders sent today</span>
                    </div>
                    <div className="bg-[#FF9F43]/10 rounded-lg p-3 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#FF9F43]" />
                      <span className="text-sm">1 SAM call scheduled</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <span className="text-sm">Avg. collection: 14 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Timeline */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">How Autopilot Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Autopilot follows a proven escalation sequence to get you paid, automatically adjusting based on client responses.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#9FE870]" />
              <div className="space-y-6">
                {automations.map((item, index) => (
                  <div key={index} className="relative flex gap-6 pl-8">
                    <div className="absolute left-0 w-16 h-16 bg-white border-4 border-[#9FE870] rounded-full flex items-center justify-center z-10">
                      <item.icon className="w-6 h-6 text-[#1a1a2e]" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-6 ml-8">
                      <p className="text-sm text-[#9FE870] font-medium mb-1">{item.trigger}</p>
                      <p className="text-[#1a1a2e] font-medium">{item.action}</p>
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
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Use Autopilot</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#9FE870]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#9FE870]" />
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

        {/* Features List */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                  Full Control, Zero Effort
                </h2>
                <p className="text-gray-600 mb-8">
                  Autopilot is smart enough to handle everything automatically, but you can customize every aspect of the collection process.
                </p>
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#9FE870] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="font-semibold text-[#1a1a2e] mb-6">Customization Options</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">First Reminder</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>3 days after</option>
                          <option>5 days after</option>
                          <option>7 days after</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">SAM Call Trigger</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>7 days overdue</option>
                          <option>10 days overdue</option>
                          <option>14 days overdue</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">Email Tone</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>Friendly</option>
                          <option>Professional</option>
                          <option>Firm</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#1a1a2e]">Weekend Sends</span>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">40%</div>
                <p className="text-white/70">Faster payments</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">10+ hrs</div>
                <p className="text-white/70">Saved per month</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">98%</div>
                <p className="text-white/70">Collection rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#9FE870]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">
              Put your collections on autopilot
            </h2>
            <p className="text-xl text-[#1a1a2e]/70 mb-8">
              Start your 14-day free trial and let Autopilot handle the follow-ups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
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
