'use client';

import Link from 'next/link';
import { Target, Heart, Zap, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const values = [
  {
    icon: Target,
    title: 'Mission-Driven',
    description: 'We exist to help subcontractors get paid for their hard work. Every feature we build serves this mission.',
  },
  {
    icon: Heart,
    title: 'Customer-First',
    description: 'Our customers are the backbone of the construction industry. Their success is our success.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We leverage cutting-edge AI to solve real problems, not for technology\'s sake.',
  },
  {
    icon: Users,
    title: 'Accessibility',
    description: 'Powerful tools should be available to businesses of all sizes, not just enterprises.',
  },
];

const team = [
  {
    name: 'Michael Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former contractor with 15 years in construction. Built SubPaid to solve the payment problems he experienced firsthand.',
  },
  {
    name: 'Sarah Martinez',
    role: 'CTO & Co-Founder',
    bio: 'AI researcher from Stanford. Passionate about applying machine learning to real-world business problems.',
  },
  {
    name: 'David Kim',
    role: 'Head of Product',
    bio: 'Previously led product at Stripe. Obsessed with making complex financial tools simple.',
  },
  {
    name: 'Emily Thompson',
    role: 'Head of Customer Success',
    bio: '10+ years in construction software. Ensures every SubPaid customer achieves their goals.',
  },
];

const milestones = [
  { year: '2023', event: 'SubPaid founded in San Francisco' },
  { year: '2024', event: 'Launched Snap to Invoice feature' },
  { year: '2024', event: 'Introduced SAM Voice Agent' },
  { year: '2025', event: 'Payment Prophet AI released' },
  { year: '2025', event: 'Reached 500+ active customers' },
  { year: '2026', event: 'Expanding nationwide' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Built by Contractors, for Contractors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We started SubPaid because we lived the problem. Late payments, chasing clients, cash flow stress - we knew there had to be a better way.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    SubPaid was born in 2023 when our founder, Michael Chen, was running his own electrical contracting business. Like most subcontractors, he spent countless hours creating invoices, following up on payments, and trying to predict his cash flow.
                  </p>
                  <p>
                    After one particularly frustrating week of phone calls chasing overdue payments, Michael had an idea: what if AI could handle all of this? What if you could just snap a photo and have a professional invoice created instantly? What if an AI assistant could make those awkward collection calls for you?
                  </p>
                  <p>
                    He partnered with Sarah Martinez, an AI researcher, and together they built the first version of SubPaid. Today, we&apos;re proud to serve 500+ subcontractors across the US, helping them get paid faster so they can focus on what they do best.
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-[#9FE870]/10 rounded-2xl p-8 text-center">
                  <div className="text-5xl font-bold text-[#9FE870] mb-2">500+</div>
                  <p className="text-gray-600">Subcontractors trust SubPaid</p>
                  <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-[#1a1a2e]">$50M+</div>
                      <p className="text-sm text-gray-500">Invoices processed</p>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-[#1a1a2e]">14 days</div>
                      <p className="text-sm text-gray-500">Avg. faster payment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Our Values</h2>
              <p className="text-gray-600">The principles that guide everything we do.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-xl p-6 text-center">
                  <div className="w-14 h-14 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-[#9FE870]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Leadership Team</h2>
              <p className="text-gray-600">The people building the future of invoicing.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#1a1a2e]">{member.name}</h3>
                  <p className="text-[#54A0FF] text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Our Journey</h2>
            </div>

            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-[#9FE870]" />
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'} pl-12 md:pl-0`}>
                      <span className="text-[#9FE870] font-bold">{milestone.year}</span>
                      <p className="text-[#1a1a2e]">{milestone.event}</p>
                    </div>
                    <div className="absolute left-4 md:relative md:left-0 w-8 h-8 bg-[#9FE870] rounded-full flex items-center justify-center z-10">
                      <div className="w-3 h-3 bg-white rounded-full" />
                    </div>
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join us on our mission
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Whether you&apos;re a subcontractor looking to get paid faster or someone who wants to help build the future of invoicing.
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
                href="/careers"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                View Careers
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
