'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Camera, Phone, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Fresh Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#9FE870] via-[#6DD5A0] to-[#54A0FF]" />
      
      {/* Subtle pattern overlay for depth */}
      <div className="fixed inset-0 opacity-30" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '32px 32px'
      }} />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1a1a2e] rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-[#9FE870] font-bold text-xl">S</span>
          </div>
          <span className="text-[#1a1a2e] font-bold text-xl">SubPaid</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/signin" className="text-[#1a1a2e]/80 hover:text-[#1a1a2e] transition-colors font-medium">
            Sign In
          </Link>
          <Link 
            href="/signup" 
            className="bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-12 px-6 max-w-5xl mx-auto text-center">
        {/* Floating badge */}
        <div 
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a1a2e] mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
        >
          <span className="w-2 h-2 bg-[#9FE870] rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">AI-Powered Invoicing for Subcontractors</span>
        </div>

        {/* Main headline - DARK TEXT */}
        <h1 
          className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-[#1a1a2e] transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          Get Paid While{' '}
          <span className="text-[#1a1a2e]/80">You Work</span>
        </h1>

        {/* Subheadline - DARK TEXT */}
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
          <Link 
            href="/signin" 
            className="bg-white/80 backdrop-blur-sm text-[#1a1a2e] px-8 py-4 rounded-full font-semibold text-lg hover:bg-white transition-all shadow-lg"
          >
            Sign In
          </Link>
        </div>

        {/* Trust indicators */}
        <p 
          className={`text-[#1a1a2e]/50 text-sm transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}
        >
          No credit card required • 14-day free trial • Cancel anytime
        </p>
      </section>

      {/* Feature Cards - WHITE CARDS with dark text */}
      <section className="relative z-10 py-16 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Snap to Invoice */}
          <div 
            className={`group p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="w-12 h-12 bg-[#9FE870] rounded-xl flex items-center justify-center mb-4">
              <Camera className="w-6 h-6 text-[#1a1a2e]" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#1a1a2e]">Snap to Invoice</h3>
            <p className="text-[#1a1a2e]/60">
              Photo → Invoice in 5 seconds. AI extracts all the details automatically.
            </p>
          </div>

          {/* SAM Voice Agent */}
          <div 
            className={`group p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '600ms' }}
          >
            <div className="w-12 h-12 bg-[#54A0FF] rounded-xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#1a1a2e]">SAM Voice Agent</h3>
            <p className="text-[#1a1a2e]/60">
              AI that actually calls your clients to collect payments for you.
            </p>
          </div>

          {/* Payment Prophet */}
          <div 
            className={`group p-6 rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '700ms' }}
          >
            <div className="w-12 h-12 bg-[#FF9F43] rounded-xl flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#1a1a2e]">Payment Prophet</h3>
            <p className="text-[#1a1a2e]/60">
              Know when you'll get paid before you even send the invoice.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Dark card */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div 
            className={`bg-[#1a1a2e] rounded-3xl p-8 shadow-2xl transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '800ms' }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#9FE870] mb-2">$280B</div>
                <div className="text-white/60 text-sm">Late payments in construction</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#54A0FF] mb-2">56 days</div>
                <div className="text-white/60 text-sm">Average payment delay</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#9FE870] mb-2">5 sec</div>
                <div className="text-white/60 text-sm">To create an invoice</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold text-[#54A0FF] mb-2">2x</div>
                <div className="text-white/60 text-sm">Faster payments</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1a1a2e] rounded-lg flex items-center justify-center">
              <span className="text-[#9FE870] font-bold">S</span>
            </div>
            <span className="text-[#1a1a2e]/80">SubPaid © 2026</span>
          </div>
          <p className="text-[#1a1a2e]/50 text-sm">
            "Every subcontractor deserves to get paid on time, every time."
          </p>
        </div>
      </footer>
    </div>
  );
}
