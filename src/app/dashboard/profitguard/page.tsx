'use client';

import { useState } from 'react';
import {
  Calculator,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  Building2,
  Percent,
  ChevronDown,
  CheckCircle,
  Info,
  Sparkles,
  BarChart3
} from 'lucide-react';

interface BidCalculation {
  baseMaterials: number;
  baseLabor: number;
  baseOverhead: number;
  targetProfit: number;
  gcPayDays: number;
  gcDisputeRate: number;
  costOfCapital: number;
  workingCapitalCost: number;
  riskBuffer: number;
  recommendedMarkup: number;
  recommendedBid: number;
}

const recentGCs = [
  { name: 'Metro Builders Inc', score: 87, avgPayDays: 34, disputeRate: 4 },
  { name: 'Thompson Construction', score: 94, avgPayDays: 21, disputeRate: 1 },
  { name: 'Apex Development', score: 62, avgPayDays: 67, disputeRate: 12 },
  { name: 'Sunrise Contractors', score: 78, avgPayDays: 42, disputeRate: 6 },
];

export default function ProfitGuardPage() {
  const [selectedGC, setSelectedGC] = useState(recentGCs[0]);
  const [showGCDropdown, setShowGCDropdown] = useState(false);

  const [inputs, setInputs] = useState({
    materials: 45000,
    labor: 32000,
    overhead: 8500,
    targetProfit: 15,
    capitalRate: 8,
  });

  const calculateBid = (): BidCalculation => {
    const subtotal = inputs.materials + inputs.labor + inputs.overhead;
    const baseProfit = subtotal * (inputs.targetProfit / 100);
    const baseBid = subtotal + baseProfit;

    // Working capital cost based on GC payment time
    const dailyCapitalCost = (inputs.capitalRate / 100) / 365;
    const workingCapitalCost = baseBid * dailyCapitalCost * selectedGC.avgPayDays;

    // Risk buffer based on dispute rate
    const riskBuffer = baseBid * (selectedGC.disputeRate / 100) * 0.5;

    // Total recommended markup
    const totalAdjustment = workingCapitalCost + riskBuffer;
    const recommendedMarkup = (totalAdjustment / baseBid) * 100;
    const recommendedBid = baseBid + totalAdjustment;

    return {
      baseMaterials: inputs.materials,
      baseLabor: inputs.labor,
      baseOverhead: inputs.overhead,
      targetProfit: baseProfit,
      gcPayDays: selectedGC.avgPayDays,
      gcDisputeRate: selectedGC.disputeRate,
      costOfCapital: inputs.capitalRate,
      workingCapitalCost,
      riskBuffer,
      recommendedMarkup,
      recommendedBid,
    };
  };

  const calc = calculateBid();

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-[#22C55E]';
    if (score >= 70) return 'text-[#9FE870]';
    if (score >= 50) return 'text-[#FF9F43]';
    return 'text-[#FF6B6B]';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#54A0FF] to-[#9FE870] rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">ProfitGuard</h1>
            <p className="text-[#1a1a2e]/60">Smart bid calculator with working capital insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#54A0FF]/10 rounded-full">
          <Sparkles className="w-4 h-4 text-[#54A0FF]" />
          <span className="text-sm font-medium text-[#1a1a2e]">
            Subs using ProfitGuard average 24% profit margin
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* GC Selection */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#54A0FF]" />
              General Contractor
            </h2>
            <div className="relative">
              <button
                onClick={() => setShowGCDropdown(!showGCDropdown)}
                className="w-full p-4 border border-[#1a1a2e]/10 rounded-xl flex items-center justify-between hover:border-[#54A0FF] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#FECA57]/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#FECA57]" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-[#1a1a2e]">{selectedGC.name}</p>
                    <p className="text-sm text-[#1a1a2e]/60">
                      GCScore: <span className={`font-medium ${getScoreColor(selectedGC.score)}`}>{selectedGC.score}</span>
                      {' • '}{selectedGC.avgPayDays}d avg pay
                    </p>
                  </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#1a1a2e]/40 transition-transform ${showGCDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showGCDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#1a1a2e]/10 rounded-xl shadow-lg z-10 overflow-hidden">
                  {recentGCs.map((gc) => (
                    <button
                      key={gc.name}
                      onClick={() => {
                        setSelectedGC(gc);
                        setShowGCDropdown(false);
                      }}
                      className={`w-full p-3 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors ${
                        selectedGC.name === gc.name ? 'bg-[#54A0FF]/5' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#1a1a2e]">{gc.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className={`font-medium ${getScoreColor(gc.score)}`}>{gc.score}</span>
                        <span className="text-[#1a1a2e]/50">{gc.avgPayDays}d</span>
                        {selectedGC.name === gc.name && <CheckCircle className="w-4 h-4 text-[#54A0FF]" />}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Cost Inputs */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#9FE870]" />
              Base Estimate
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#1a1a2e]/60 mb-1">Materials</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40">$</span>
                  <input
                    type="number"
                    value={inputs.materials}
                    onChange={(e) => setInputs({ ...inputs, materials: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 border border-[#1a1a2e]/10 rounded-xl focus:border-[#54A0FF] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#1a1a2e]/60 mb-1">Labor</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40">$</span>
                  <input
                    type="number"
                    value={inputs.labor}
                    onChange={(e) => setInputs({ ...inputs, labor: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 border border-[#1a1a2e]/10 rounded-xl focus:border-[#54A0FF] focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#1a1a2e]/60 mb-1">Overhead</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40">$</span>
                  <input
                    type="number"
                    value={inputs.overhead}
                    onChange={(e) => setInputs({ ...inputs, overhead: Number(e.target.value) })}
                    className="w-full pl-8 pr-4 py-3 border border-[#1a1a2e]/10 rounded-xl focus:border-[#54A0FF] focus:outline-none"
                  />
                </div>
              </div>
              <div className="pt-2 border-t border-[#1a1a2e]/10">
                <div className="flex justify-between">
                  <span className="text-[#1a1a2e]/60">Subtotal</span>
                  <span className="font-semibold text-[#1a1a2e]">
                    {formatCurrency(inputs.materials + inputs.labor + inputs.overhead)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit & Capital Settings */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
              <Percent className="w-5 h-5 text-[#FF9F43]" />
              Profit & Capital
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-[#1a1a2e]/60 mb-1">Target Profit Margin</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.targetProfit}
                    onChange={(e) => setInputs({ ...inputs, targetProfit: Number(e.target.value) })}
                    className="w-full pr-8 pl-4 py-3 border border-[#1a1a2e]/10 rounded-xl focus:border-[#54A0FF] focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40">%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#1a1a2e]/60 mb-1">
                  Cost of Capital (APR)
                  <button className="ml-1 text-[#54A0FF]" title="Your borrowing rate or opportunity cost of tying up cash">
                    <Info className="w-3 h-3 inline" />
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.capitalRate}
                    onChange={(e) => setInputs({ ...inputs, capitalRate: Number(e.target.value) })}
                    className="w-full pr-8 pl-4 py-3 border border-[#1a1a2e]/10 rounded-xl focus:border-[#54A0FF] focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/40">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Recommended Bid */}
          <div className="bg-gradient-to-br from-[#54A0FF] to-[#9FE870] rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recommended Bid
              </h2>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                +{calc.recommendedMarkup.toFixed(1)}% adjustment
              </span>
            </div>
            <p className="text-5xl font-bold mb-2">{formatCurrency(calc.recommendedBid)}</p>
            <p className="text-white/80 text-sm">
              Based on {selectedGC.name}&apos;s {selectedGC.avgPayDays}-day payment history
            </p>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#54A0FF]" />
              Bid Breakdown
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-[#1a1a2e]/60">Materials</span>
                <span className="font-medium text-[#1a1a2e]">{formatCurrency(calc.baseMaterials)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#1a1a2e]/60">Labor</span>
                <span className="font-medium text-[#1a1a2e]">{formatCurrency(calc.baseLabor)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[#1a1a2e]/60">Overhead</span>
                <span className="font-medium text-[#1a1a2e]">{formatCurrency(calc.baseOverhead)}</span>
              </div>
              <div className="flex justify-between py-2 border-t border-[#1a1a2e]/10">
                <span className="text-[#1a1a2e]/60">Target Profit ({inputs.targetProfit}%)</span>
                <span className="font-medium text-[#22C55E]">{formatCurrency(calc.targetProfit)}</span>
              </div>
              <div className="flex justify-between py-2 bg-[#FF9F43]/10 -mx-6 px-6 rounded-lg">
                <span className="text-[#FF9F43] flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Working Capital Cost ({calc.gcPayDays}d)
                </span>
                <span className="font-medium text-[#FF9F43]">+{formatCurrency(calc.workingCapitalCost)}</span>
              </div>
              <div className="flex justify-between py-2 bg-[#FF6B6B]/10 -mx-6 px-6 rounded-lg">
                <span className="text-[#FF6B6B] flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" />
                  Risk Buffer ({calc.gcDisputeRate}% dispute rate)
                </span>
                <span className="font-medium text-[#FF6B6B]">+{formatCurrency(calc.riskBuffer)}</span>
              </div>
              <div className="flex justify-between py-3 border-t-2 border-[#1a1a2e]/10 font-bold text-lg">
                <span className="text-[#1a1a2e]">Total Recommended Bid</span>
                <span className="text-[#54A0FF]">{formatCurrency(calc.recommendedBid)}</span>
              </div>
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-[#F8FAFC] rounded-xl border border-[#1a1a2e]/10 p-6">
            <h3 className="font-semibold text-[#1a1a2e] mb-4">Bid Comparison</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border border-[#1a1a2e]/10">
                <p className="text-sm text-[#1a1a2e]/60 mb-1">Without ProfitGuard</p>
                <p className="text-xl font-bold text-[#1a1a2e]">
                  {formatCurrency(inputs.materials + inputs.labor + inputs.overhead + calc.targetProfit)}
                </p>
                <p className="text-xs text-[#FF6B6B] mt-1">
                  Missing {formatCurrency(calc.workingCapitalCost + calc.riskBuffer)} in hidden costs
                </p>
              </div>
              <div className="p-4 bg-[#54A0FF]/10 rounded-lg border border-[#54A0FF]/30">
                <p className="text-sm text-[#54A0FF] mb-1">With ProfitGuard</p>
                <p className="text-xl font-bold text-[#54A0FF]">{formatCurrency(calc.recommendedBid)}</p>
                <p className="text-xs text-[#22C55E] mt-1">
                  True profit protected: {formatCurrency(calc.targetProfit)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 bg-[#9FE870] text-[#1a1a2e] font-semibold rounded-xl hover:shadow-lg transition-all">
              Use This Bid
            </button>
            <button className="flex-1 py-3 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] font-medium rounded-xl hover:bg-[#F8FAFC] transition-all">
              Save as Estimate
            </button>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#54A0FF]/20 to-[#9FE870]/20 rounded-xl p-6 border border-[#54A0FF]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#54A0FF] rounded-full flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Why Working Capital Matters</h3>
            <p className="text-sm text-[#1a1a2e]/70">
              Subcontractors who don&apos;t account for payment delays average <span className="font-medium">17% profit margins</span>.
              Those who use working capital adjustments achieve <span className="font-medium text-[#22C55E]">24% margins</span>.
              The difference? Pricing in the real cost of waiting 60+ days for payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
