'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Users, CreditCard, Shield, Puzzle, Bell } from 'lucide-react';

const tabs = [
  { name: 'Profile', href: '/dashboard/settings/profile', icon: User },
  { name: 'Team', href: '/dashboard/settings/team', icon: Users },
  { name: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  { name: 'Security', href: '/dashboard/settings/security', icon: Shield },
  { name: 'Integrations', href: '/dashboard/settings/integrations', icon: Puzzle },
  { name: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Settings</h1>
        <p className="text-[#1a1a2e]/60">Manage your account and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (pathname === '/dashboard/settings' && tab.href === '/dashboard/settings/profile');
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-[#9FE870] text-[#1a1a2e]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-4xl">
        {children}
      </div>
    </div>
  );
}
