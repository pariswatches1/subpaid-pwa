'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Play, Calendar, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const demoTopics = [
  'Complete platform walkthrough',
  'Snap to Invoice demonstration',
  'SAM Voice Agent in action',
  'Payment Prophet predictions',
  'Custom setup for your business',
  'Q&A with our team',
];

export default function DemoPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    teamSize: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] text-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#9FE870] rounded-full text-sm font-medium mb-4">
                  See SubPaid in Action
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Book a Personalized Demo
                </h1>
                <p className="text-xl text-white/70 mb-8">
                  See how SubPaid can transform your invoicing workflow. Our team will walk you through every feature and answer all your questions.
                </p>
                <div className="flex flex-wrap gap-4 text-white/70">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#9FE870]" />
                    <span>30 minutes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#9FE870]" />
                    <span>1-on-1 with an expert</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#9FE870]" />
                    <span>Available Mon-Fri</span>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-video bg-[#1a1a2e] rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#9FE870]/10 to-[#54A0FF]/10" />
                  <button className="relative z-10 w-20 h-20 bg-[#9FE870] rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-[#1a1a2e] ml-1" />
                  </button>
                  <p className="absolute bottom-4 text-white/50 text-sm">Watch 2-minute overview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Content */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* What You'll See */}
              <div className="lg:w-1/3">
                <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">What You&apos;ll See</h2>
                <ul className="space-y-4">
                  {demoTopics.map((topic) => (
                    <li key={topic} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#9FE870] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{topic}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="font-semibold text-[#1a1a2e] mb-2">Prefer to explore on your own?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Start a free trial and test all features with your own data.
                  </p>
                  <Link
                    href="/signup"
                    className="text-[#54A0FF] font-medium hover:underline"
                  >
                    Start Free Trial →
                  </Link>
                </div>
              </div>

              {/* Booking Form */}
              <div className="lg:w-2/3">
                <div className="bg-gray-50 rounded-2xl p-8">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-8 h-8 text-[#22C55E]" />
                      </div>
                      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-4">Demo Booked!</h2>
                      <p className="text-gray-600 mb-2">
                        Thanks for your interest in SubPaid.
                      </p>
                      <p className="text-gray-600 mb-8">
                        We&apos;ll send you a calendar invite within the next few hours.
                      </p>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[#54A0FF] font-medium hover:gap-3 transition-all"
                      >
                        Back to Home
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Schedule Your Demo</h2>
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name *
                            </label>
                            <input
                              type="text"
                              id="name"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
                              placeholder="John Smith"
                            />
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                              Work Email *
                            </label>
                            <input
                              type="email"
                              id="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
                              placeholder="john@company.com"
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name *
                            </label>
                            <input
                              type="text"
                              id="company"
                              required
                              value={formData.company}
                              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
                              placeholder="ABC Construction"
                            />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
                              placeholder="(555) 123-4567"
                            />
                          </div>
                        </div>

                        <div>
                          <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">
                            Team Size *
                          </label>
                          <select
                            id="teamSize"
                            required
                            value={formData.teamSize}
                            onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent"
                          >
                            <option value="">Select team size</option>
                            <option value="1">Just me</option>
                            <option value="2-5">2-5 employees</option>
                            <option value="6-10">6-10 employees</option>
                            <option value="11-25">11-25 employees</option>
                            <option value="26+">26+ employees</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                            What would you like to see in the demo?
                          </label>
                          <textarea
                            id="message"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent resize-none"
                            placeholder="Tell us about your current invoicing challenges..."
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-[#9FE870] text-[#1a1a2e] py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                        >
                          {isSubmitting ? 'Submitting...' : 'Request Demo'}
                        </button>

                        <p className="text-center text-sm text-gray-500">
                          We&apos;ll reach out within 1 business day to schedule your demo.
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600 mb-6">Trusted by 500+ subcontractors across the US</p>
            <div className="flex justify-center items-center gap-8 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-sm text-gray-500">4.9 on G2</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★★★★★</span>
                <span className="text-sm text-gray-500">4.8 on Capterra</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
