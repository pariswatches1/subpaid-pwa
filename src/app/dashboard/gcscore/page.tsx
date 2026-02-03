'use client';

import { useState } from 'react';
import {
  Search,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  Building2,
  DollarSign,
  FileText,
  Shield,
  ChevronRight,
  Plus,
  Filter,
  MapPin
} from 'lucide-react';

interface GCData {
  id: string;
  name: string;
  score: number;
  rating: 'excellent' | 'good' | 'average' | 'poor';
  avgPayDays: number;
  onTimeRate: number;
  disputeRate: number;
  totalPaid12mo: number;
  totalProjects: number;
  liens: number;
  location: string;
  reviews: {
    text: string;
    trade: string;
    date: string;
    rating: number;
  }[];
  alerts: string[];
  inNetwork: boolean;
}

const gcDatabase: GCData[] = [
  {
    id: '1',
    name: 'Metro Builders Inc',
    score: 87,
    rating: 'good',
    avgPayDays: 34,
    onTimeRate: 78,
    disputeRate: 4,
    totalPaid12mo: 2400000,
    totalProjects: 45,
    liens: 2,
    location: 'Denver, CO',
    reviews: [
      { text: 'Pays consistently at Net 30. Good communication.', trade: 'Electrical', date: 'Oct 2025', rating: 4 },
      { text: 'Had one late payment but resolved quickly after follow-up.', trade: 'HVAC', date: 'Sep 2025', rating: 4 },
      { text: 'Professional team, clear change order process.', trade: 'Plumbing', date: 'Aug 2025', rating: 5 },
    ],
    alerts: ['2 liens filed in past 12 months'],
    inNetwork: true,
  },
  {
    id: '2',
    name: 'Thompson Construction',
    score: 94,
    rating: 'excellent',
    avgPayDays: 21,
    onTimeRate: 95,
    disputeRate: 1,
    totalPaid12mo: 5800000,
    totalProjects: 78,
    liens: 0,
    location: 'Phoenix, AZ',
    reviews: [
      { text: 'Best GC I work with. Always pays early.', trade: 'Electrical', date: 'Nov 2025', rating: 5 },
      { text: 'Clear expectations, no payment surprises.', trade: 'Fire Protection', date: 'Oct 2025', rating: 5 },
    ],
    alerts: [],
    inNetwork: true,
  },
  {
    id: '3',
    name: 'Apex Development Group',
    score: 62,
    rating: 'average',
    avgPayDays: 67,
    onTimeRate: 45,
    disputeRate: 12,
    totalPaid12mo: 890000,
    totalProjects: 12,
    liens: 5,
    location: 'Las Vegas, NV',
    reviews: [
      { text: 'Slow payer. Had to file preliminary notice to get attention.', trade: 'Drywall', date: 'Oct 2025', rating: 2 },
      { text: 'Payment always comes late. Budget extra time.', trade: 'Electrical', date: 'Sep 2025', rating: 2 },
    ],
    alerts: ['5 liens filed in past 12 months', 'Payment times trending slower', 'High dispute rate'],
    inNetwork: false,
  },
  {
    id: '4',
    name: 'Sunrise Contractors LLC',
    score: 78,
    rating: 'good',
    avgPayDays: 42,
    onTimeRate: 68,
    disputeRate: 6,
    totalPaid12mo: 1200000,
    totalProjects: 23,
    liens: 1,
    location: 'San Diego, CA',
    reviews: [
      { text: 'Decent payer, sometimes slow in Q4.', trade: 'Roofing', date: 'Nov 2025', rating: 3 },
    ],
    alerts: ['Payment delays common in Q4'],
    inNetwork: false,
  },
];

export default function GCScorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGC, setSelectedGC] = useState<GCData | null>(null);
  const [filterNetwork, setFilterNetwork] = useState(false);

  const filteredGCs = gcDatabase.filter(gc => {
    const matchesSearch = gc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gc.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesNetwork = !filterNetwork || gc.inNetwork;
    return matchesSearch && matchesNetwork;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#22C55E]';
    if (score >= 70) return 'text-[#9FE870]';
    if (score >= 50) return 'text-[#FF9F43]';
    return 'text-[#FF6B6B]';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-[#22C55E]';
    if (score >= 70) return 'bg-[#9FE870]';
    if (score >= 50) return 'bg-[#FF9F43]';
    return 'bg-[#FF6B6B]';
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'Excellent Payer';
      case 'good': return 'Good Payer';
      case 'average': return 'Average Payer';
      case 'poor': return 'High Risk';
      default: return rating;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
    return `$${amount}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FECA57] to-[#FF9F43] rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">GCScore</h1>
            <p className="text-[#1a1a2e]/60">Know before you bid - GC payment intelligence</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium">
            {gcDatabase.length} GCs Rated
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a2e]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search GCs by name or location..."
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-[#1a1a2e]/10 focus:border-[#FECA57] focus:outline-none focus:ring-2 focus:ring-[#FECA57]/20"
            aria-label="Search general contractors"
          />
        </div>
        <button
          onClick={() => setFilterNetwork(!filterNetwork)}
          className={`px-4 py-3 rounded-xl border font-medium transition-all flex items-center gap-2 ${
            filterNetwork
              ? 'bg-[#1a1a2e] text-white border-[#1a1a2e]'
              : 'bg-white text-[#1a1a2e]/70 border-[#1a1a2e]/10 hover:border-[#FECA57]'
          }`}
        >
          <Filter className="w-4 h-4" />
          My Network
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* GC List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-[#1a1a2e]">General Contractors</h2>
          <div className="space-y-2">
            {filteredGCs.map((gc) => (
              <button
                key={gc.id}
                onClick={() => setSelectedGC(gc)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedGC?.id === gc.id
                    ? 'bg-[#FECA57]/10 border-[#FECA57]'
                    : 'bg-white border-[#1a1a2e]/10 hover:border-[#FECA57]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1a1a2e]">{gc.name}</span>
                    {gc.inNetwork && (
                      <CheckCircle className="w-4 h-4 text-[#22C55E]" />
                    )}
                  </div>
                  <div className={`text-lg font-bold ${getScoreColor(gc.score)}`}>
                    {gc.score}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#1a1a2e]/60">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {gc.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {gc.avgPayDays}d avg
                  </span>
                </div>
                {gc.alerts.length > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#FF6B6B]">
                    <AlertTriangle className="w-3 h-3" />
                    {gc.alerts.length} alert{gc.alerts.length > 1 ? 's' : ''}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* GC Detail */}
        <div className="lg:col-span-2">
          {selectedGC ? (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
              {/* Score Header */}
              <div className={`p-6 ${getScoreBg(selectedGC.score)} text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{selectedGC.name}</h2>
                    <p className="text-white/80">{selectedGC.location}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold">{selectedGC.score}</div>
                    <div className="text-white/80 text-sm">{getRatingLabel(selectedGC.rating)}</div>
                  </div>
                </div>
              </div>

              {/* Metrics */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Payment Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                      <Clock className="w-4 h-4" />
                      Avg Days to Pay
                    </div>
                    <div className="text-xl font-bold text-[#1a1a2e]">
                      {selectedGC.avgPayDays} days
                    </div>
                    <div className={`text-xs ${selectedGC.avgPayDays <= 30 ? 'text-[#22C55E]' : selectedGC.avgPayDays <= 45 ? 'text-[#FF9F43]' : 'text-[#FF6B6B]'}`}>
                      Industry avg: 74 days
                    </div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                      <CheckCircle className="w-4 h-4" />
                      On-Time Rate
                    </div>
                    <div className="text-xl font-bold text-[#1a1a2e]">
                      {selectedGC.onTimeRate}%
                    </div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                      <AlertTriangle className="w-4 h-4" />
                      Dispute Rate
                    </div>
                    <div className="text-xl font-bold text-[#1a1a2e]">
                      {selectedGC.disputeRate}%
                    </div>
                  </div>
                  <div className="p-3 bg-[#F8FAFC] rounded-lg">
                    <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                      <DollarSign className="w-4 h-4" />
                      Paid (12mo)
                    </div>
                    <div className="text-xl font-bold text-[#1a1a2e]">
                      {formatCurrency(selectedGC.totalPaid12mo)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Alerts */}
              {selectedGC.alerts.length > 0 && (
                <div className="p-6 border-b border-[#1a1a2e]/10 bg-[#FF6B6B]/5">
                  <h3 className="font-semibold text-[#FF6B6B] mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alerts
                  </h3>
                  <ul className="space-y-2">
                    {selectedGC.alerts.map((alert, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-[#1a1a2e]/70">
                        <span className="w-1.5 h-1.5 bg-[#FF6B6B] rounded-full" />
                        {alert}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reviews */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Verified Reviews</h3>
                <div className="space-y-4">
                  {selectedGC.reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-[#F8FAFC] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#1a1a2e]">{review.trade} Sub</span>
                          <span className="text-xs text-[#1a1a2e]/50">{review.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${i < review.rating ? 'text-[#FECA57] fill-[#FECA57]' : 'text-[#1a1a2e]/20'}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#1a1a2e]/70">&quot;{review.text}&quot;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bid Adjustment Calculator */}
              <div className="p-6 bg-[#54A0FF]/5">
                <h3 className="font-semibold text-[#1a1a2e] mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#54A0FF]" />
                  Bid Adjustment Recommendation
                </h3>
                <div className="p-4 bg-white rounded-lg border border-[#54A0FF]/20">
                  <p className="text-sm text-[#1a1a2e]/70 mb-3">
                    Based on {selectedGC.name}&apos;s {selectedGC.avgPayDays}-day average payment time and {selectedGC.disputeRate}% dispute rate:
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1a1a2e]">Recommended markup adjustment:</span>
                    <span className="text-xl font-bold text-[#54A0FF]">
                      +{Math.round((selectedGC.avgPayDays / 30) * 2 + selectedGC.disputeRate * 0.5)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 flex flex-wrap gap-3">
                {!selectedGC.inNetwork ? (
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                    <Plus className="w-5 h-5" />
                    Add to My Network
                  </button>
                ) : (
                  <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium">
                    <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                    In Your Network
                  </button>
                )}
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#F8FAFC] transition-all">
                  <FileText className="w-5 h-5" />
                  Full Report
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-12 text-center">
              <div className="w-16 h-16 bg-[#FECA57]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-[#FECA57]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">Select a GC to View Details</h3>
              <p className="text-[#1a1a2e]/60">
                Click on any general contractor to see their payment history, reviews, and recommendations.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#FECA57]/20 to-[#FF9F43]/20 rounded-xl p-6 border border-[#FECA57]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FECA57] rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">How GCScore Works</h3>
            <p className="text-sm text-[#1a1a2e]/70">
              GCScore aggregates anonymous payment data from verified SubPaid users. Only subcontractors with actual invoices
              to a GC can submit reviews. Scores are updated monthly based on payment behavior, dispute rates, and lien filings.
              <span className="text-[#FF9F43] font-medium ml-1">Help your fellow subs - rate GCs you&apos;ve worked with!</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
