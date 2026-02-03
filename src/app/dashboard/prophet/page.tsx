'use client';

import { useState } from 'react';
import { TrendingUp, Calendar, DollarSign, AlertTriangle, CheckCircle, Clock, ChevronRight, Zap } from 'lucide-react';

const predictions = [
  {
    id: 'INV-003',
    client: 'ABC General Contractors',
    project: 'HVAC Installation',
    amount: 20000,
    dueDate: 'Jan 15, 2026',
    status: 'overdue',
    daysOverdue: 17,
    prediction: {
      expectedDate: 'Feb 18, 2026',
      daysFromNow: 17,
      confidence: 72,
      factors: ['History of late payments (avg 45 days)', 'Large invoice amount', 'End of month timing'],
      recommendation: 'Activate SAM Voice Agent for immediate follow-up',
      risk: 'high'
    }
  },
  {
    id: 'INV-002',
    client: 'Metro Builders Inc',
    project: 'Electrical Work',
    amount: 8500,
    dueDate: 'Feb 6, 2026',
    status: 'pending',
    prediction: {
      expectedDate: 'Feb 5, 2026',
      daysFromNow: 4,
      confidence: 94,
      factors: ['Excellent payment history (PayScore 92)', 'Regular client', 'Standard invoice amount'],
      recommendation: 'No action needed - high likelihood of early payment',
      risk: 'low'
    }
  },
  {
    id: 'INV-004',
    client: 'Smith Builders',
    project: 'Plumbing Rough-in',
    amount: 11500,
    dueDate: 'Feb 13, 2026',
    status: 'pending',
    prediction: {
      expectedDate: 'Feb 14, 2026',
      daysFromNow: 13,
      confidence: 87,
      factors: ['Good payment history (PayScore 87)', 'First large project together', 'Net 30 terms'],
      recommendation: 'Send friendly reminder 3 days before due date',
      risk: 'low'
    }
  }
];

const cashFlowForecast = [
  { week: 'This Week', expected: 8500, confidence: 94 },
  { week: 'Week 2', expected: 11500, confidence: 87 },
  { week: 'Week 3', expected: 20000, confidence: 72 },
  { week: 'Week 4', expected: 15000, confidence: 65 },
];

export default function PaymentProphetPage() {
  const [selectedInvoice, setSelectedInvoice] = useState(predictions[0]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-[#EF4444] bg-[#EF4444]/10';
      case 'medium': return 'text-[#F8BF24] bg-[#F8BF24]/10';
      case 'low': return 'text-[#22C55E] bg-[#22C55E]/10';
      default: return 'text-[#1a1a2e]/60 bg-[#1a1a2e]/5';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-[#22C55E]';
    if (confidence >= 70) return 'text-[#F8BF24]';
    return 'text-[#EF4444]';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-[#FF9F43] rounded-xl flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Payment Prophet</h1>
          <p className="text-[#1a1a2e]/60">AI-powered payment predictions</p>
        </div>
      </div>

      {/* Cash Flow Forecast */}
      <div className="bg-white rounded-xl p-6 border border-[#1a1a2e]/10">
        <h2 className="font-semibold text-[#1a1a2e] mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#FF9F43]" />
          4-Week Cash Flow Forecast
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {cashFlowForecast.map((week, i) => (
            <div key={i} className="text-center p-4 rounded-xl bg-[#F7FBF4]">
              <p className="text-sm text-[#1a1a2e]/60 mb-1">{week.week}</p>
              <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(week.expected)}</p>
              <p className={`text-sm font-medium ${getConfidenceColor(week.confidence)}`}>
                {week.confidence}% confidence
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#1a1a2e]/10 flex items-center justify-between">
          <span className="text-[#1a1a2e]/60">Total Predicted (4 weeks)</span>
          <span className="text-2xl font-bold text-[#1a1a2e]">
            {formatCurrency(cashFlowForecast.reduce((a, b) => a + b.expected, 0))}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Predictions List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-[#1a1a2e]">Active Predictions</h2>
          {predictions.map((pred) => (
            <button
              key={pred.id}
              onClick={() => setSelectedInvoice(pred)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${
                selectedInvoice.id === pred.id
                  ? 'bg-[#9FE870]/10 border-[#9FE870]'
                  : 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[#1a1a2e]">{pred.id}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pred.prediction.risk)}`}>
                  {pred.prediction.risk} risk
                </span>
              </div>
              <p className="text-sm text-[#1a1a2e]/70 mb-1">{pred.client}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1a1a2e]">{formatCurrency(pred.amount)}</span>
                <span className={`text-sm font-medium ${getConfidenceColor(pred.prediction.confidence)}`}>
                  {pred.prediction.confidence}%
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Prediction Details */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
          <div className="p-6 border-b border-[#1a1a2e]/10 bg-[#F7FBF4]">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedInvoice.client}</h2>
                <p className="text-[#1a1a2e]/60">{selectedInvoice.project}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(selectedInvoice.amount)}</p>
                <p className="text-sm text-[#1a1a2e]/60">Due: {selectedInvoice.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Prediction */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#FF9F43]/10 to-[#FECA57]/10 border border-[#FF9F43]/20">
              <div className="w-12 h-12 bg-[#FF9F43] rounded-full flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-[#1a1a2e]/60">Expected Payment Date</p>
                <p className="text-xl font-bold text-[#1a1a2e]">{selectedInvoice.prediction.expectedDate}</p>
                <p className="text-sm text-[#1a1a2e]/70">
                  {selectedInvoice.prediction.daysFromNow} days from now
                </p>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${getConfidenceColor(selectedInvoice.prediction.confidence)}`}>
                  {selectedInvoice.prediction.confidence}%
                </p>
                <p className="text-sm text-[#1a1a2e]/60">confidence</p>
              </div>
            </div>

            {/* Factors */}
            <div>
              <h3 className="font-semibold text-[#1a1a2e] mb-3">Prediction Factors</h3>
              <ul className="space-y-2">
                {selectedInvoice.prediction.factors.map((factor, i) => (
                  <li key={i} className="flex items-start gap-2 text-[#1a1a2e]/70">
                    <ChevronRight className="w-4 h-4 mt-0.5 text-[#FF9F43]" />
                    {factor}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendation */}
            <div className={`p-4 rounded-xl ${getRiskColor(selectedInvoice.prediction.risk)}`}>
              <div className="flex items-start gap-3">
                {selectedInvoice.prediction.risk === 'high' ? (
                  <AlertTriangle className="w-5 h-5 mt-0.5" />
                ) : selectedInvoice.prediction.risk === 'low' ? (
                  <CheckCircle className="w-5 h-5 mt-0.5" />
                ) : (
                  <Clock className="w-5 h-5 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">Recommendation</p>
                  <p className="text-sm opacity-80">{selectedInvoice.prediction.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#9FE870] text-[#1a1a2e] py-3 rounded-full font-semibold hover:shadow-lg transition-all">
                Activate SAM Agent
              </button>
              <button className="flex-1 bg-[#1a1a2e] text-white py-3 rounded-full font-semibold hover:bg-[#1e4400] transition-all">
                Send Reminder
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
