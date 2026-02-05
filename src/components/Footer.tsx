'use client';

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail } from 'lucide-react';

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { name: 'Features', href: '/features' },
      { name: 'Snap to Invoice', href: '/features/snap-to-invoice' },
      { name: 'SAM Voice Agent', href: '/features/voice-agent' },
      { name: 'Payment Prophet', href: '/features/payment-prophet' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Contractor Directory', href: '/directory' },
      { name: 'Integrations', href: '/integrations' },
    ]
  },
  company: {
    title: 'Company',
    links: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
    ]
  },
  resources: {
    title: 'Resources',
    links: [
      { name: 'Help Center', href: '/help' },
      { name: 'API Documentation', href: '/docs/api' },
      { name: 'Webinars', href: '/webinars' },
      { name: 'Case Studies', href: '/case-studies' },
      { name: 'Invoice Templates', href: '/templates' },
    ]
  },
  legal: {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Security', href: '/security' },
      { name: 'GDPR', href: '/gdpr' },
    ]
  }
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/subpaid' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/subpaid' },
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/subpaid' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/subpaid' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/subpaid' },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a2e] text-white">
      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand column */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
              <span className="text-xl font-bold">SubPaid</span>
            </Link>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              AI-powered invoicing built for subcontractors. Get paid faster with smart automation.
            </p>

            {/* Newsletter signup */}
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm placeholder:text-white/40 focus:outline-none focus:border-[#9FE870]"
                />
                <button className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium text-sm hover:bg-[#8FD860] transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © {new Date().getFullYear()} SubPaid Inc. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-2">
                🇺🇸 Made in USA
              </span>
              <span>SOC 2 Compliant</span>
              <span>256-bit Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
