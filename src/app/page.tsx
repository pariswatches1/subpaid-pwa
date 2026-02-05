'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Phone, Sparkles, ChevronRight, ArrowRight, Play } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { TrustBar } from '@/components/TrustBar';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Integrations } from '@/components/Integrations';
import { FAQ } from '@/components/FAQ';
import { FinalCTA } from '@/components/FinalCTA';
import { Footer } from '@/components/Footer';
import { WatchDemo } from '@/components/WatchDemo';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section with sky blue gradient background */}
      <section className="relative pt-24 pb-12 overflow-hidden">
        {/* Sky Blue Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#A8D8EA] via-[#C5E4F0] to-white" />

        {/* Subtle pattern overlay for depth */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }} />

        <div className="relative z-10 pt-12 pb-20 px-6 max-w-5xl mx-auto text-center">
          {/* Floating badge */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
          >
            <span className="w-2 h-2 bg-[#9FE870] rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">AI-Powered Invoicing for Subcontractors</span>
          </div>

          {/* Main headline */}
          <h1
            className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#1a1a2e] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Get Paid While{' '}
            <span className="text-[#2563EB]">You Work</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-[#1a1a2e]/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            Snap a photo, AI creates the invoice. Our voice agent calls to collect.
            Stop chasing payments — let SubPaid handle it.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          >
            <Link
              href="/signup"
              className="group bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex items-center gap-2"
            >
              Start Free Trial
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => setShowDemo(true)}
              className="bg-white text-[#1a1a2e] px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all shadow-lg flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>

          {/* Trust indicators */}
          <p
            className={`text-[#1a1a2e]/50 text-sm transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* Product Demo / Screenshot Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#E8F4F8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 bg-[#54A0FF]/20 text-[#2563EB] rounded-full text-sm font-medium mb-4">
              See It In Action
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              The Simplest Way to Get Paid
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              From photo to payment in minutes, not weeks
            </p>
          </div>

          {/* App Screenshot Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-2xl p-4 shadow-2xl">
              <div className="bg-[#F8FAFC] rounded-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-red-400 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                    <div className="w-3 h-3 bg-green-400 rounded-full" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-100 rounded-lg px-4 py-1.5 text-sm text-gray-500 max-w-md mx-auto">
                      app.subpaid.com/dashboard
                    </div>
                  </div>
                </div>

                {/* App content preview */}
                <div className="p-8 bg-[#F8FAFC]">
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Stat cards */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Money Owed</p>
                      <p className="text-3xl font-bold text-[#1a1a2e]">$42,500</p>
                      <p className="text-sm text-[#22C55E] mt-1">↑ 12% this month</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Collected (30d)</p>
                      <p className="text-3xl font-bold text-[#22C55E]">$38,750</p>
                      <p className="text-sm text-gray-400 mt-1">91% collection rate</p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <p className="text-sm text-gray-500 mb-1">Avg. Days to Pay</p>
                      <p className="text-3xl font-bold text-[#54A0FF]">14 days</p>
                      <p className="text-sm text-[#22C55E] mt-1">↓ 42 days faster</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#9FE870]/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#54A0FF]/20 rounded-full blur-2xl" />
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 bg-[#E8F4F8]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              Core Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Everything You Need to Get Paid
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Three powerful AI features that work together to eliminate late payments
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Snap to Invoice */}
            <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#9FE870] rounded-xl flex items-center justify-center mb-6">
                <Camera className="w-7 h-7 text-[#1a1a2e]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a2e]">Snap to Invoice</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Photo → Invoice in 5 seconds. AI extracts all the details automatically from receipts, notes, or job photos.
              </p>
              <Link href="/features/snap-to-invoice" className="inline-flex items-center gap-1 text-[#54A0FF] font-medium hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* SAM Voice Agent */}
            <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#54A0FF] rounded-xl flex items-center justify-center mb-6">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a2e]">SAM Voice Agent</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                AI that actually calls your clients to collect payments. Professional, persistent, and works 24/7.
              </p>
              <Link href="/features/voice-agent" className="inline-flex items-center gap-1 text-[#54A0FF] font-medium hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Payment Prophet */}
            <div className="group p-8 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="w-14 h-14 bg-[#FF9F43] rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#1a1a2e]">Payment Prophet</h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Know when you&apos;ll get paid before you even send the invoice. 94% prediction accuracy.
              </p>
              <Link href="/features/payment-prophet" className="inline-flex items-center gap-1 text-[#54A0FF] font-medium hover:gap-2 transition-all">
                Learn more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-[#E8F4F8] to-[#D4EBF2]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1a1a2e] rounded-3xl p-10 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#9FE870] mb-2">$280B</div>
                <div className="text-white/60 text-sm">Late payments in construction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#54A0FF] mb-2">56 days</div>
                <div className="text-white/60 text-sm">Industry average payment delay</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#9FE870] mb-2">5 sec</div>
                <div className="text-white/60 text-sm">To create an invoice with AI</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#54A0FF] mb-2">2x</div>
                <div className="text-white/60 text-sm">Faster payments with SubPaid</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Use Cases / Industries */}
      <section className="py-20 bg-[#E8F4F8]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-[#FF9F43]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              Built For Your Trade
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
              Trusted by Contractors Across Every Trade
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Whether you&apos;re an electrician, plumber, or GC — SubPaid speaks your language
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { trade: 'Electricians', icon: '⚡', color: 'from-yellow-400 to-orange-400' },
              { trade: 'Plumbers', icon: '🔧', color: 'from-blue-400 to-cyan-400' },
              { trade: 'HVAC', icon: '❄️', color: 'from-cyan-400 to-blue-400' },
              { trade: 'Roofers', icon: '🏠', color: 'from-red-400 to-orange-400' },
              { trade: 'Painters', icon: '🎨', color: 'from-purple-400 to-pink-400' },
              { trade: 'Drywall', icon: '🧱', color: 'from-amber-400 to-yellow-400' },
              { trade: 'Flooring', icon: '🪵', color: 'from-amber-600 to-yellow-600' },
              { trade: 'General Contractors', icon: '👷', color: 'from-gray-400 to-gray-600' },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-3xl group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <p className="font-semibold text-[#1a1a2e]">{item.trade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <Testimonials />

      {/* Integrations */}
      <Integrations />

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <FinalCTA />

      {/* Footer */}
      <Footer />

      {/* Watch Demo Modal */}
      <WatchDemo isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  );
}
