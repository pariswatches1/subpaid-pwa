'use client';

import { useState } from 'react';
import { Shield, Star, TrendingUp, TrendingDown, Clock, DollarSign, Search, ChevronRight, AlertTriangle, CheckCircle } from 'lucide-react';

const gcData = [
  {
    id: 1,
    name: 'Metro Builders Inc',
    payScore: 92,
    trend: 'up',
    avgPaymentDays: 18,
    totalPaid: 127000,
    invoiceCount: 6,
    onTimeRate: 100,
    rating: 'Excellent',
    reviews: 24,
    lastPayment: '3 days ago'
  },
  {
    id: 2,
    name: 'Smith Builders',
    payScore: 87,
    trend: 'stable',
    avgPaymentDays: 24,
    totalPaid: 89000,
    invoiceCount: 4,
    onTimeRate: 92,
    rating: 'Good',
    reviews: 18,
    lastPayment: '12 days ago'
  },
  {
    id: 3,
    name: 'Downtown Development LLC',
    payScore: 81,
    trend: 'up',
    avgPaymentDays: 28,
    totalPaid: 156000,
    invoiceCount: 3,
    onTimeRate: 85,
    rating: 'Good',
    reviews: 31,
    lastPayment: '8 days ago'
  },
  {
    id: 4,
    name: 'ABC General Contractors',
    payScore: 58,
    trend: 'down',
    avgPaymentDays: 45,
    totalPaid: 85000,
    invoiceCount: 5,
    onTimeRate: 40,
    rating: 'Poor',
    reviews: 42,
    lastPayment: '17 days overdue'
  },
  {
    id: 5,
    name: 'Thompson Construction',
    payScore: 76,
    trend: 'stable',
    avgPaymentDays: 32,
    totalPaid: 45000,
    invoiceCount: 2,
    onTimeRate: 75,
    rating: 'Fair',
    reviews: 15,
    lastPayment: '5 days ago'
  }
];

export default function PayScorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGC, setSelectedGC] = useState(gcData[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#22C55E]';
    if (score >= 70) return 'text-[#FECA57]';
    if (score >= 50) return 'text-[#FF9F43]';
    return 'text-[#EF4444]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-[#22C55E]';
    if (score >= 70) return 'bg-[#FECA57]';
    if (score >= 50) return 'bg-[#FF9F43]';
    return 'bg-[#EF4444]';
  };

  const getRatingBadge = (rating: string) => {
    const colors: { [key: string]: string } = {
      'Excellent': 'bg-[#22C55E]/10 text-[#22C55E]',
      'Good': 'bg-[#54A0FF]/10 text-[#54A0FF]',
      'Fair': 'bg-[#FECA57]/10 text-[#b8860b]',
      'Poor': 'bg-[#EF4444]/10 text-[#EF4444]'
    };
    return colors[rating] || 'bg-gray-100 text-gray-600';
  };

  const filteredGCs = gcData.filter(gc => 
    gc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FECA57] rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#1a1a2e]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">PayScore™</h1>
            <p className="text-[#1a1a2e]/60">GC payment reliability ratings</p>
          </div>
        </div>
        <button className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2">
          <Star className="w-4 h-4" />
          Rate a GC
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">GCs Tracked</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">5</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Avg PayScore</p>
          <p className="text-2xl font-bold text-[#9FE870]">79</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Community Reviews</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">130</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Total Collected</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">$502K</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search contractors..."
          className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#9FE870] focus:outline-none"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* GC List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredGCs.map((gc) => (
            <button
              key={gc.id}
              onClick={() => setSelectedGC(gc)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedGC.id === gc.id
                  ? 'bg-[#9FE870]/10 border-[#9FE870]'
                  : 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#1a1a2e]">{gc.name}</span>
                <div className="flex items-center gap-1">
                  {gc.trend === 'up' && <TrendingUp className="w-4 h-4 text-[#22C55E]" />}
                  {gc.trend === 'down' && <TrendingDown className="w-4 h-4 text-[#EF4444]" />}
                  <span className={`text-xl font-bold ${getScoreColor(gc.payScore)}`}>
                    {gc.payScore}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1a1a2e]/60">{gc.avgPaymentDays} day avg</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRatingBadge(gc.rating)}`}>
                  {gc.rating}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* GC Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
          <div className="p-6 border-b border-[#1a1a2e]/10 bg-[#F7FBF4]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedGC.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRatingBadge(selectedGC.rating)}`}>
                    {selectedGC.rating}
                  </span>
                  <span className="text-sm text-[#1a1a2e]/60">
                    Based on {selectedGC.reviews} reviews
                  </span>
                </div>
              </div>
              <div className="text-center">
                <div className={`w-20 h-20 ${getScoreBg(selectedGC.payScore)} rounded-full flex items-center justify-center`}>
                  <span className="text-3xl font-bold text-white">{selectedGC.payScore}</span>
                </div>
                <p className="text-sm text-[#1a1a2e]/60 mt-1">PayScore</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F7FBF4]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#1a1a2e]/60" />
                  <span className="text-sm text-[#1a1a2e]/60">Avg Payment Time</span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a2e]">{selectedGC.avgPaymentDays} days</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7FBF4]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#1a1a2e]/60" />
                  <span className="text-sm text-[#1a1a2e]/60">On-Time Rate</span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a2e]">{selectedGC.onTimeRate}%</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7FBF4]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-[#1a1a2e]/60" />
                  <span className="text-sm text-[#1a1a2e]/60">Total Collected</span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(selectedGC.totalPaid)}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F7FBF4]">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-[#1a1a2e]/60" />
                  <span className="text-sm text-[#1a1a2e]/60">Invoices</span>
                </div>
                <p className="text-2xl font-bold text-[#1a1a2e]">{selectedGC.invoiceCount}</p>
              </div>
            </div>

            {/* Warning/Success Box */}
            {selectedGC.payScore < 70 ? (
              <div className="p-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#EF4444] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#EF4444]">Payment Risk Warning</p>
                    <p className="text-sm text-[#1a1a2e]/70">
                      This contractor has a history of late payments. Consider requesting larger deposits or milestone payments.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#22C55E]/10 border border-[#22C55E]/20">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#22C55E] mt-0.5" />
                  <div>
                    <p className="font-semibold text-[#22C55E]">Reliable Payer</p>
                    <p className="text-sm text-[#1a1a2e]/70">
                      This contractor has a strong payment history. Standard payment terms recommended.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#9FE870] text-[#1a1a2e] py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                Create Invoice
              </button>
              <button className="flex-1 bg-[#1a1a2e] text-white py-3 rounded-full font-semibold hover:bg-[#1e4400] transition-all">
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
