import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, Briefcase, ArrowRight, Heart, Zap, Users, Coffee } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Careers - SubPaid',
  description: 'Join the SubPaid team. Help us build the future of invoicing for subcontractors.',
  alternates: {
    canonical: 'https://www.subpaid.com/careers',
  },
};

const benefits = [
  {
    icon: Heart,
    title: 'Health & Wellness',
    description: 'Comprehensive health, dental, and vision insurance for you and your family.',
  },
  {
    icon: Zap,
    title: 'Equity',
    description: 'Competitive equity packages so you share in our success.',
  },
  {
    icon: Users,
    title: 'Remote-First',
    description: 'Work from anywhere. We have team members across the US.',
  },
  {
    icon: Coffee,
    title: 'Unlimited PTO',
    description: 'Take the time you need. We trust you to manage your schedule.',
  },
];

const openPositions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    title: 'Machine Learning Engineer',
    department: 'AI/ML',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote (US)',
    type: 'Full-time',
  },
  {
    title: 'Content Marketing Manager',
    department: 'Marketing',
    location: 'Remote (US)',
    type: 'Full-time',
  },
];

const values = [
  {
    title: 'Customer Obsessed',
    description: 'Every decision starts with "how does this help our customers get paid faster?"',
  },
  {
    title: 'Move Fast',
    description: 'We ship quickly, learn from feedback, and iterate. Perfect is the enemy of good.',
  },
  {
    title: 'Own It',
    description: 'Take ownership of your work. If you see a problem, fix it.',
  },
  {
    title: 'Stay Curious',
    description: 'Ask questions. Challenge assumptions. There\'s always a better way.',
  },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] text-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build the Future of Invoicing
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
              Join a team that&apos;s passionate about helping subcontractors get paid for their hard work. We&apos;re growing fast and looking for talented people.
            </p>
            <a
              href="#positions"
              className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
            >
              View Open Positions
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* Why SubPaid */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Join SubPaid?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We&apos;re a small team making a big impact. Here&apos;s what makes working here special.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="text-center">
                  <div className="w-14 h-14 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-7 h-7 text-[#9FE870]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Our Values</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These principles guide how we work and who we hire.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={value.title} className="bg-white rounded-xl p-6 flex gap-4">
                  <div className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[#1a1a2e] font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1a1a2e] mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section id="positions" className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Open Positions</h2>
              <p className="text-gray-600">
                Don&apos;t see a role that fits? Email us at{' '}
                <a href="mailto:careers@subpaid.com" className="text-[#54A0FF] hover:underline">
                  careers@subpaid.com
                </a>
              </p>
            </div>

            <div className="space-y-4">
              {openPositions.map((position) => (
                <a
                  key={position.title}
                  href="#"
                  className="block bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-[#1a1a2e] group-hover:text-[#54A0FF] transition-colors">
                        {position.title}
                      </h3>
                      <p className="text-gray-500">{position.department}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-sm text-gray-600">
                        <Briefcase className="w-4 h-4" />
                        {position.type}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to make an impact?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              We&apos;re excited to hear from you. Apply to one of our open positions or reach out directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#positions"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                View Open Positions
              </a>
              <a
                href="mailto:careers@subpaid.com"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Email Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
