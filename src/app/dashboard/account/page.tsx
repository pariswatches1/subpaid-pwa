'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building, User, CreditCard, Shield, Bell,
  ChevronRight, CheckCircle, AlertTriangle, Camera
} from 'lucide-react';

const accountSections = [
  {
    title: 'Profile',
    description: 'Your personal information',
    icon: User,
    href: '/dashboard/settings/profile',
    status: 'complete',
  },
  {
    title: 'Company',
    description: 'Business details and branding',
    icon: Building,
    href: '/dashboard/account/company',
    status: 'incomplete',
  },
  {
    title: 'Billing',
    description: 'Subscription and payment methods',
    icon: CreditCard,
    href: '/dashboard/settings/billing',
    status: 'complete',
  },
  {
    title: 'Security',
    description: 'Password and two-factor auth',
    icon: Shield,
    href: '/dashboard/settings/security',
    status: 'warning',
  },
  {
    title: 'Notifications',
    description: 'Email and push preferences',
    icon: Bell,
    href: '/dashboard/settings/notifications',
    status: 'complete',
  },
];

export default function AccountPage() {
  const [companyData, setCompanyData] = useState({
    name: 'Electrical Pros LLC',
    address: '123 Main St, Orlando, FL 32801',
    phone: '(555) 123-4567',
    website: 'www.electricalpros.com',
    taxId: '**-***1234',
    industry: 'Electrical Contracting',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">My Account</h1>
          <p className="text-[#1a1a2e]/60">Manage your account settings and preferences</p>
        </div>
      </div>

      {/* Account Completion */}
      <div className="bg-gradient-to-r from-[#9FE870]/20 to-[#54A0FF]/20 rounded-xl border border-[#9FE870]/30 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-[#1a1a2e]">Account Setup</h2>
            <p className="text-sm text-gray-600">Complete your account to unlock all features</p>
          </div>
          <span className="text-2xl font-bold text-[#1a1a2e]">80%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-[#9FE870] h-2 rounded-full" style={{ width: '80%' }}></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">2 items remaining</p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accountSections.map((section) => (
          <Link
            key={section.title}
            href={section.href}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-[#9FE870]/20 transition-colors">
                  <section.icon className="w-5 h-5 text-gray-600 group-hover:text-[#1a1a2e]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#1a1a2e]">{section.title}</h3>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {section.status === 'complete' && (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                {section.status === 'incomplete' && (
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                )}
                {section.status === 'warning' && (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                )}
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#1a1a2e]" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-[#54A0FF]" />
            <h2 className="font-semibold text-[#1a1a2e]">Company Information</h2>
          </div>
          <Link
            href="/dashboard/settings/profile"
            className="text-[#54A0FF] text-sm font-medium hover:underline"
          >
            Edit
          </Link>
        </div>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center relative group cursor-pointer">
              <Building className="w-10 h-10 text-gray-400" />
              <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Company Name</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.industry}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.address}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.website}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tax ID</p>
                <p className="font-medium text-[#1a1a2e]">{companyData.taxId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Overview */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-[#9FE870]" />
            <h2 className="font-semibold text-[#1a1a2e]">Subscription</h2>
          </div>
          <Link
            href="/dashboard/settings/billing"
            className="text-[#54A0FF] text-sm font-medium hover:underline"
          >
            Manage
          </Link>
        </div>
        <div className="flex items-center justify-between p-4 bg-[#9FE870]/10 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1a1a2e]">Pro Plan</span>
              <span className="px-2 py-0.5 bg-[#9FE870] text-[#1a1a2e] text-xs font-medium rounded">Active</span>
            </div>
            <p className="text-sm text-gray-500">$49/month • Renews Feb 15, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">This billing period</p>
            <p className="font-semibold text-[#1a1a2e]">$49.00</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50">
          <h2 className="font-semibold text-red-700">Danger Zone</h2>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-[#1a1a2e]">Export Data</p>
              <p className="text-sm text-gray-500">Download all your data as a ZIP file</p>
            </div>
            <button className="px-4 py-2 border border-gray-200 rounded-lg text-[#1a1a2e] font-medium hover:bg-gray-50 transition-colors">
              Export
            </button>
          </div>
          <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-red-600">Delete Account</p>
              <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 border border-red-200 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
