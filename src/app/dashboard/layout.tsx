'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  CreditCard,
  Clock,
  Users,
  Settings,
  Bell,
  Menu,
  X,
  Camera,
  MessageSquare,
  TrendingUp,
  Shield,
  Zap,
  ClipboardList,
  Building2,
  ShieldCheck,
  Banknote,
  Calculator,
  BadgeCheck,
  Receipt,
  Search,
  Target,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Jobs', href: '/dashboard/jobs', icon: Briefcase },
  { name: 'Estimates', href: '/dashboard/estimates', icon: ClipboardList },
  { name: 'Invoices', href: '/dashboard/invoices', icon: FileText },
  { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
  { name: 'Time Tracking', href: '/dashboard/time', icon: Clock },
  { name: 'Crew', href: '/dashboard/crew', icon: Users },
];

const aiFeatures = [
  { name: 'Snap to Invoice', href: '/dashboard/snap', icon: Camera, color: 'bg-[#9FE870]' },
  { name: 'Ask SubPaid', href: '/dashboard/ask', icon: MessageSquare, color: 'bg-[#54A0FF]' },
  { name: 'Payment Prophet', href: '/dashboard/prophet', icon: TrendingUp, color: 'bg-[#FF9F43]' },
  { name: 'PayScore™', href: '/dashboard/payscore', icon: Shield, color: 'bg-[#FECA57]' },
  { name: 'Autopilot', href: '/dashboard/autopilot', icon: Zap, color: 'bg-[#FF6B6B]' },
  { name: 'Find More Work', href: '/dashboard/keywords', icon: Briefcase, color: 'bg-[#A855F7]' },
  { name: 'Lead Sources', href: '/dashboard/lead-sources', icon: Target, color: 'bg-[#22C55E]' },
];

const premiumFeatures = [
  { name: 'PayNow', href: '/dashboard/paynow', icon: Banknote, color: 'bg-gradient-to-r from-[#9FE870] to-[#54A0FF]', badge: 'INSTANT' },
  { name: 'GCScore', href: '/dashboard/gcscore', icon: Building2, color: 'bg-[#FECA57]', badge: 'NEW' },
  { name: 'LienGuard', href: '/dashboard/lienguard', icon: ShieldCheck, color: 'bg-[#22C55E]', badge: 'NEW' },
  { name: 'ProfitGuard', href: '/dashboard/profitguard', icon: Calculator, color: 'bg-[#54A0FF]', badge: 'NEW' },
  { name: 'PreQual', href: '/dashboard/prequal', icon: BadgeCheck, color: 'bg-[#9FE870]', badge: 'NEW' },
  { name: 'AIA Billing', href: '/dashboard/aia-billing', icon: Receipt, color: 'bg-[#FF9F43]', badge: 'FREE' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar with gradient */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-10 h-10 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <div>
            <div className="text-white font-semibold">SubPaid</div>
            <div className="text-white/50 text-xs">Get Paid Faster</div>
          </div>
          <button 
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#9FE870] to-[#7DD3A8] text-[#1a1a2e]'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Premium Features Section */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <div className="px-3 mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Premium</span>
              <span className="text-[10px] bg-gradient-to-r from-[#FF9F43] to-[#FF6B6B] text-white px-2 py-0.5 rounded-full font-medium">PRO</span>
            </div>
            <ul className="space-y-1">
              {premiumFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`w-6 h-6 ${item.color} rounded-md flex items-center justify-center`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="flex-1">{item.name}</span>
                      <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded font-bold">{item.badge}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* AI Features Section */}
          <div className="mt-6 pt-4 border-t border-white/10">
            <div className="px-3 mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">AI Features</span>
              <span className="text-[10px] bg-gradient-to-r from-[#9FE870] to-[#54A0FF] text-white px-2 py-0.5 rounded-full font-medium">AI</span>
            </div>
            <ul className="space-y-1">
              {aiFeatures.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/70 hover:bg-white/10 hover:text-white'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={`w-6 h-6 ${item.color} rounded-md flex items-center justify-center`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {/* Money Owed Summary */}
        <div className="absolute bottom-20 left-3 right-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
            <div className="text-white/50 text-xs uppercase tracking-wider mb-1">Money Owed</div>
            <div className="text-white text-2xl font-bold">$40,000</div>
            <div className="flex items-center gap-1 text-[#FF6B6B] text-sm mt-1">
              <span className="w-2 h-2 bg-[#FF6B6B] rounded-full animate-pulse" />
              $20,000 overdue
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
          <div className="flex items-center justify-between px-4 py-3">
            <button 
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:text-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex-1 lg:flex-none" />

            <div className="flex items-center gap-4">
              {/* Quick Actions */}
              <Link 
                href="/dashboard/snap"
                className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-[#9FE870] to-[#7DD3A8] text-[#1a1a2e] px-4 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all"
              >
                <Camera className="w-4 h-4" />
                Create Invoice
              </Link>
              <Link
                href="/dashboard/ask"
                className="hidden sm:flex items-center gap-2 bg-[#54A0FF]/10 text-[#54A0FF] px-4 py-2 rounded-full text-sm font-medium hover:bg-[#54A0FF]/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Ask AI
              </Link>

              <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full" />
              </button>
              <div className="w-9 h-9 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                S
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
