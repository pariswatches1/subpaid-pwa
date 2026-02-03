'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ChevronDown,
  Camera,
  Phone,
  TrendingUp,
  Shield,
  Zap,
  FileText,
  HelpCircle,
  BookOpen,
  Users
} from 'lucide-react';

const features = [
  { name: 'Snap to Invoice', description: 'Photo to invoice in 5 seconds', icon: Camera, href: '/features/snap-to-invoice' },
  { name: 'SAM Voice Agent', description: 'AI that calls to collect payments', icon: Phone, href: '/features/voice-agent' },
  { name: 'Payment Prophet', description: 'Predict when you\'ll get paid', icon: TrendingUp, href: '/features/payment-prophet' },
  { name: 'PayScore™', description: 'Know your payment reliability', icon: Shield, href: '/features/payscore' },
  { name: 'Autopilot Mode', description: 'Fully automated collections', icon: Zap, href: '/features/autopilot' },
];

const resources = [
  { name: 'Help Center', description: 'Get help and support', icon: HelpCircle, href: '/help' },
  { name: 'Blog', description: 'Tips and industry news', icon: BookOpen, href: '/blog' },
  { name: 'Case Studies', description: 'Customer success stories', icon: Users, href: '/case-studies' },
  { name: 'API Docs', description: 'Developer documentation', icon: FileText, href: '/docs/api' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-[#1a1a2e]">SubPaid</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Features Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setFeaturesOpen(true)}
                onMouseLeave={() => setFeaturesOpen(false)}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-[#1a1a2e] font-medium transition-colors"
              >
                Features
                <ChevronDown className={`w-4 h-4 transition-transform ${featuresOpen ? 'rotate-180' : ''}`} />
              </button>

              {featuresOpen && (
                <div
                  onMouseEnter={() => setFeaturesOpen(true)}
                  onMouseLeave={() => setFeaturesOpen(false)}
                  className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-4 mt-2"
                >
                  {features.map((feature) => (
                    <Link
                      key={feature.name}
                      href={feature.href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-[#9FE870]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-[#1a1a2e]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a2e]">{feature.name}</p>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                    <Link
                      href="/features"
                      className="text-[#54A0FF] text-sm font-medium hover:underline"
                    >
                      View all features →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/pricing"
              className="px-4 py-2 text-gray-600 hover:text-[#1a1a2e] font-medium transition-colors"
            >
              Pricing
            </Link>

            {/* Resources Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setResourcesOpen(true)}
                onMouseLeave={() => setResourcesOpen(false)}
                className="flex items-center gap-1 px-4 py-2 text-gray-600 hover:text-[#1a1a2e] font-medium transition-colors"
              >
                Resources
                <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>

              {resourcesOpen && (
                <div
                  onMouseEnter={() => setResourcesOpen(true)}
                  onMouseLeave={() => setResourcesOpen(false)}
                  className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-4 mt-2"
                >
                  {resources.map((resource) => (
                    <Link
                      key={resource.name}
                      href={resource.href}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-[#54A0FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <resource.icon className="w-5 h-5 text-[#1a1a2e]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1a1a2e]">{resource.name}</p>
                        <p className="text-sm text-gray-500">{resource.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/contact"
              className="px-4 py-2 text-gray-600 hover:text-[#1a1a2e] font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/signin"
              className="px-4 py-2 text-gray-600 hover:text-[#1a1a2e] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 bg-[#9FE870] text-[#1a1a2e] rounded-full font-semibold hover:shadow-lg transition-all"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#1a1a2e]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1a1a2e]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="space-y-1">
              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Features
              </p>
              {features.map((feature) => (
                <Link
                  key={feature.name}
                  href={feature.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <feature.icon className="w-5 h-5" />
                  {feature.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2" />

              <Link
                href="/pricing"
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>

              <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Resources
              </p>
              {resources.map((resource) => (
                <Link
                  key={resource.name}
                  href={resource.href}
                  className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <resource.icon className="w-5 h-5" />
                  {resource.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 my-2" />

              <div className="px-4 py-4 space-y-3">
                <Link
                  href="/signin"
                  className="block w-full text-center px-4 py-3 border border-gray-200 rounded-full font-medium text-[#1a1a2e]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center px-4 py-3 bg-[#9FE870] rounded-full font-semibold text-[#1a1a2e]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
