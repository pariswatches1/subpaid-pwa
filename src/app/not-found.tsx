'use client';

import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        {/* 404 Visual */}
        <div className="mb-8">
          <div className="text-[120px] md:text-[160px] font-bold leading-none bg-gradient-to-r from-[#9FE870] to-[#54A0FF] bg-clip-text text-transparent">
            404
          </div>
        </div>

        {/* Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-4">
          Page not found
        </h1>
        <p className="text-[#1a1a2e]/60 mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
          It might have been moved or doesn&apos;t exist.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            <Home className="w-5 h-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#1a1a2e]/5 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Help links */}
        <div className="mt-12 pt-8 border-t border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/50 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/dashboard/invoices"
              className="text-sm text-[#54A0FF] hover:underline"
            >
              Invoices
            </Link>
            <span className="text-[#1a1a2e]/20">•</span>
            <Link
              href="/dashboard/jobs"
              className="text-sm text-[#54A0FF] hover:underline"
            >
              Jobs
            </Link>
            <span className="text-[#1a1a2e]/20">•</span>
            <Link
              href="/dashboard/payments"
              className="text-sm text-[#54A0FF] hover:underline"
            >
              Payments
            </Link>
            <span className="text-[#1a1a2e]/20">•</span>
            <Link
              href="/dashboard/settings"
              className="text-sm text-[#54A0FF] hover:underline"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
