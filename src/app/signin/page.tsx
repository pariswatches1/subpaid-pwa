'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isValidEmail } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui';

export default function SignInPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your email address');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBF4]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7FBF4] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <span className="text-[#1a1a2e] font-bold text-xl">S</span>
            </div>
            <span className="text-[#1a1a2e] font-bold text-xl">SubPaid</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Welcome back</h1>
          <p className="text-[#1a1a2e]/60 mb-8">Sign in to your account to continue</p>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="you@company.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all"
                  required
                  autoComplete="email"
                  aria-describedby={error ? 'form-error' : undefined}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all"
                  required
                  autoComplete="current-password"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#1a1a2e]/20 text-[#9FE870] focus:ring-[#9FE870]"
                />
                <span className="text-sm text-[#1a1a2e]/70">Remember me</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#9FE870] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-full font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" color="border-[#1a1a2e]" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 p-4 bg-[#54A0FF]/10 rounded-xl">
            <p className="text-sm text-[#1a1a2e]/70 text-center">
              <span className="font-medium">Demo:</span> Use any email and password (min 6 chars) to sign in.
              <br />
              <span className="text-[#1a1a2e]/50">Admin: admin@subpaid.com / admin123</span>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-[#1a1a2e]/60">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-[#9FE870] font-medium hover:underline">
                Start free trial
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#1a1a2e] items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-[#9FE870] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-[#1a1a2e] font-bold text-4xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Get Paid While You Work</h2>
          <p className="text-white/60 mb-8">
            AI-powered invoicing that creates invoices from photos and collects payments automatically.
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-[#9FE870] text-2xl font-bold">5 sec</p>
              <p className="text-white/60 text-sm">To create an invoice</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-[#9FE870] text-2xl font-bold">2x</p>
              <p className="text-white/60 text-sm">Faster payments</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
