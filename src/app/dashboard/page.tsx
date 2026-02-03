'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, 
  DollarSign, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  ChevronRight,
  Send,
  Phone,
  TrendingUp,
  Zap,
  ArrowUpRight,
  Camera,
  MessageSquare
} from 'lucide-react';

// Demo data matching the Capture.JPG design
const demoData = {
  user: { name: 'Sam' },
  stats: {
    totalOwed: 40000,
    owedChange: 12,
    overdue: 20000,
    overdueCount: 1,
    pending: 20000,
    pendingCount: 1,
    paidThisMonth: 85000,
  },
  invoices: [
    {
      id: 'INV-001',
      description: 'Office Renovation',
      client: 'ABC General Contractors',
      amount: 12400,
      status: 'paid'
    },
    {
      id: 'INV-002',
      description: 'Electrical Work',
      client: 'Metro Builders Inc',
      amount: 8500,
      status: 'due_soon',
      dueIn: 5
    },
    {
      id: 'INV-003',
      description: 'HVAC Installation',
      client: 'Smith Builders',
      amount: 20000,
      status: 'overdue',
      daysOverdue: 17
    }
  ],
  aiInsight: {
    prediction: 'Based on ABC General Contractors payment history, expect payment around Feb 18. Consider sending a reminder today.',
    confidence: 78
  }
};

export default function DashboardPage() {
  const [data] = useState(demoData);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string, daysOverdue?: number, dueIn?: number) => {
    switch (status) {
      case 'paid':
        return <span className="px-3 py-1 bg-[#22C55E]/15 text-[#22C55E] text-xs font-medium rounded-full">Paid</span>;
      case 'due_soon':
        return <span className="px-3 py-1 bg-[#F8BF24]/15 text-[#b8860b] text-xs font-medium rounded-full">Due in {dueIn} days</span>;
      case 'overdue':
        return <span className="px-3 py-1 bg-[#EF4444]/15 text-[#EF4444] text-xs font-medium rounded-full">{daysOverdue} days overdue</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Good morning, {data.user.name}</h1>
          <p className="text-[#1a1a2e]/60">Here's what's happening with your jobs today</p>
        </div>
        <Link
          href="/dashboard/jobs/new"
          className="hidden md:flex items-center gap-2 bg-[#1a1a2e] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#1e4400] transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Job
        </Link>
      </div>

      {/* Stats Grid - Matching Capture.JPG "Dashboard — Light Mode" */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Owed */}
        <div className="bg-white rounded-xl p-5 border border-[#1a1a2e]/10 hover:shadow-md transition-all">
          <p className="text-[#1a1a2e]/60 text-sm">Total Owed</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{formatCurrency(data.stats.totalOwed)}</p>
        </div>

        {/* Overdue */}
        <div className="bg-white rounded-xl p-5 border border-[#1a1a2e]/10 hover:shadow-md transition-all">
          <p className="text-[#1a1a2e]/60 text-sm">Overdue</p>
          <p className="text-3xl font-bold text-[#EF4444] mt-1">{formatCurrency(data.stats.overdue)}</p>
        </div>

        {/* Pending */}
        <div className="bg-white rounded-xl p-5 border border-[#1a1a2e]/10 hover:shadow-md transition-all">
          <p className="text-[#1a1a2e]/60 text-sm">Pending</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{formatCurrency(data.stats.pending)}</p>
        </div>

        {/* Paid This Month */}
        <div className="bg-white rounded-xl p-5 border border-[#1a1a2e]/10 hover:shadow-md transition-all">
          <p className="text-[#1a1a2e]/60 text-sm">Paid This Month</p>
          <p className="text-3xl font-bold text-[#22C55E] mt-1">{formatCurrency(data.stats.paidThisMonth)}</p>
        </div>
      </div>

      {/* Quick Actions - Matching Capture.JPG buttons */}
      <div className="flex flex-wrap gap-3">
        <Link
          href="/dashboard/invoices/new"
          className="flex items-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-4 py-2.5 rounded-lg font-medium hover:bg-[#1a1a2e]/5 transition-all"
        >
          <Camera className="w-4 h-4" />
          Create Invoice
        </Link>
        <Link
          href="/dashboard/ask"
          className="flex items-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-4 py-2.5 rounded-lg font-medium hover:bg-[#1a1a2e]/5 transition-all"
        >
          <MessageSquare className="w-4 h-4" />
          Ask SubPaid AI
        </Link>
        <Link
          href="/dashboard/invoices"
          className="flex items-center gap-2 text-[#1a1a2e]/70 px-4 py-2.5 rounded-lg font-medium hover:text-[#1a1a2e] transition-all"
        >
          View All
        </Link>
        <Link
          href="/dashboard/autopilot"
          className="flex items-center gap-2 bg-[#EF4444] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-[#dc3545] transition-all ml-auto"
        >
          <AlertTriangle className="w-4 h-4" />
          Send Reminder
        </Link>
      </div>

      {/* Invoice List - Matching Capture.JPG design */}
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
        <div className="divide-y divide-[#1a1a2e]/5">
          {data.invoices.map((invoice) => (
            <Link 
              key={invoice.id}
              href={`/dashboard/invoices/${invoice.id}`}
              className="flex items-center justify-between p-4 hover:bg-[#F7FBF4] transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-1 h-12 rounded-full ${
                  invoice.status === 'paid' ? 'bg-[#22C55E]' : 
                  invoice.status === 'due_soon' ? 'bg-[#F8BF24]' : 'bg-[#EF4444]'
                }`} />
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{invoice.id} — {invoice.description}</p>
                  <p className="text-sm text-[#1a1a2e]/60">{invoice.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold text-[#1a1a2e]">{formatCurrency(invoice.amount)}</span>
                {getStatusBadge(invoice.status, invoice.daysOverdue, invoice.dueIn)}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-[#9FE870]/10 via-[#54A0FF]/5 to-[#FF9F43]/10 rounded-xl p-5 border border-[#9FE870]/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#9FE870] rounded-full flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-[#1a1a2e]" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-[#1a1a2e]">Payment Prophet Insight</h3>
              <span className="text-xs bg-[#9FE870]/30 text-[#1a1a2e] px-2 py-0.5 rounded-full">
                {data.aiInsight.confidence}% confidence
              </span>
            </div>
            <p className="text-[#1a1a2e]/70">{data.aiInsight.prediction}</p>
          </div>
        </div>
      </div>

      {/* vs. Competitors Section - From Capture.JPG */}
      <div className="bg-white rounded-xl p-6 border border-[#1a1a2e]/10">
        <h3 className="text-sm font-semibold text-[#1a1a2e]/50 uppercase tracking-wider mb-4">vs. Competitors</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#22C55E] rounded-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1a1a2e]">QuickBooks</p>
            <p className="text-xs text-[#1a1a2e]/50">Corporate green</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#54A0FF] rounded-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1a1a2e]">Jobber</p>
            <p className="text-xs text-[#1a1a2e]/50">Generic blue</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#9FE870]/50 rounded-2xl mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1a1a2e]">Wise</p>
            <p className="text-xs text-[#1a1a2e]/50">Our inspiration 💚</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-[#9FE870] rounded-2xl mx-auto mb-2 shadow-lg shadow-[#9FE870]/30" />
            <p className="text-sm font-medium text-[#1a1a2e]">SubPaid</p>
            <p className="text-xs text-[#9FE870]">✓ Fresh & Trustworthy</p>
          </div>
        </div>
      </div>
    </div>
  );
}
