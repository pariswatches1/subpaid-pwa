'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#1a1a2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <Link
            href="/signin"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#1a1a2e] mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </Link>

          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#22C55E]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Check Your Email</h1>
              <p className="text-gray-600 mb-6">
                We sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions.
              </p>
              <Link
                href="/signin"
                className="inline-block bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Return to Sign In
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-[#1a1a2e] mb-2">Reset Your Password</h1>
                <p className="text-gray-600">
                  Enter your email address and we&apos;ll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="sam@company.com"
                      required
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
