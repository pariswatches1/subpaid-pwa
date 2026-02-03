'use client';

import { ArrowRight, Play, CheckCircle } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#9FE870] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#54A0FF] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Paid Faster?
          </h2>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
            Join 500+ subcontractors who&apos;ve cut their invoice collection time by 80% with SubPaid
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle className="w-5 h-5 text-[#9FE870]" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle className="w-5 h-5 text-[#9FE870]" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <CheckCircle className="w-5 h-5 text-[#9FE870]" />
              <span>Cancel anytime</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-[#9FE870]/20 transition-all"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="/demo"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/20"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex items-center justify-center gap-2">
            <div className="flex -space-x-3">
              {['MR', 'SC', 'JW', 'DL'].map((initials, i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-[#1a1a2e]"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-white/70 text-sm ml-2">
              <span className="text-white font-semibold">500+</span> contractors already using SubPaid
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
