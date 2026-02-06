'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Building, Eye, EyeOff, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { isValidEmail } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui';

const features = [
  'Snap to Invoice - Photo to invoice in 5 seconds',
  'SAM Voice Agent - AI calls to collect payments',
  'Payment Prophet - Know when you\'ll get paid',
  'PayScore - Check GC reliability before bidding',
];

export default function SignUpPage() {
  const router = useRouter();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Please enter your company name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Please create a password';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const success = await signup(
        formData.name.trim(),
        formData.email.trim(),
        formData.password,
        formData.company.trim()
      );

      if (success) {
        // Redirect to onboarding for new users
        router.push('/onboarding');
      } else {
        setErrors({ form: 'Unable to create account. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'An error occurred. Please try again.' });
      console.error('Signup error:', err);
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
      {/* Left side - Branding */}
      <div className="hidden lg:flex flex-1 bg-[#1a1a2e] items-center justify-center p-12">
        <div className="max-w-md">
          <div className="w-16 h-16 bg-[#9FE870] rounded-2xl flex items-center justify-center mb-6">
            <span className="text-[#1a1a2e] font-bold text-3xl">S</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Start getting paid faster today</h2>
          <p className="text-white/60 mb-8">
            Join thousands of subcontractors who use SubPaid to eliminate payment delays.
          </p>

          <ul className="space-y-4">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[#9FE870] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-4 h-4 text-[#1a1a2e]" />
                </div>
                <span className="text-white/80">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4">Trusted by contractors nationwide</p>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-[#9FE870] text-2xl font-bold">$10M+</p>
                <p className="text-white/40 text-xs">Collected</p>
              </div>
              <div className="text-center">
                <p className="text-[#9FE870] text-2xl font-bold">2,500+</p>
                <p className="text-white/40 text-xs">Users</p>
              </div>
              <div className="text-center">
                <p className="text-[#9FE870] text-2xl font-bold">94%</p>
                <p className="text-white/40 text-xs">Success rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <span className="text-[#1a1a2e] font-bold text-xl">S</span>
            </div>
            <span className="text-[#1a1a2e] font-bold text-xl">SubPaid</span>
          </Link>

          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-2">Start your free trial</h1>
          <p className="text-[#1a1a2e]/60 mb-8">No credit card required &bull; 14 days free</p>

          {/* Form error */}
          {errors.form && (
            <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#EF4444]">{errors.form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Smith"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                    errors.name ? 'border-[#EF4444]' : 'border-[#1a1a2e]/10'
                  } focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all`}
                  required
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-[#EF4444]">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Company Name
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Smith Electrical LLC"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                    errors.company ? 'border-[#EF4444]' : 'border-[#1a1a2e]/10'
                  } focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all`}
                  required
                  autoComplete="organization"
                />
              </div>
              {errors.company && <p className="mt-1 text-sm text-[#EF4444]">{errors.company}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1a1a2e] mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="john@smithelectrical.com"
                  className={`w-full pl-12 pr-4 py-3 rounded-xl bg-white border ${
                    errors.email ? 'border-[#EF4444]' : 'border-[#1a1a2e]/10'
                  } focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all`}
                  required
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-[#EF4444]">{errors.email}</p>}
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
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Create a password"
                  className={`w-full pl-12 pr-12 py-3 rounded-xl bg-white border ${
                    errors.password ? 'border-[#EF4444]' : 'border-[#1a1a2e]/10'
                  } focus:border-[#9FE870] focus:outline-none focus:ring-2 focus:ring-[#9FE870]/20 transition-all`}
                  required
                  autoComplete="new-password"
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
              {errors.password && <p className="mt-1 text-sm text-[#EF4444]">{errors.password}</p>}
              <p className="mt-1 text-xs text-[#1a1a2e]/50">Must be at least 6 characters</p>
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
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            <p className="text-xs text-[#1a1a2e]/50 text-center">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-[#9FE870] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#9FE870] hover:underline">Privacy Policy</Link>
            </p>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#1a1a2e]/60">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#9FE870] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
