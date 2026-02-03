'use client';

import { useState } from 'react';
import {
  Zap,
  Clock,
  Calendar,
  DollarSign,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building2,
  AlertCircle,
  Sparkles,
  ChevronDown,
  Shield
} from 'lucide-react';

interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: number;
  dueDate: string;
  gcScore: number;
  status: 'pending' | 'eligible' | 'funded';
}

const eligibleInvoices: Invoice[] = [
  {
    id: 'INV-001',
    client: 'Metro Builders Inc',
    project: 'Highland Shopping Center',
    amount: 38500,
    dueDate: '2026-03-03',
    gcScore: 87,
    status: 'eligible',
  },
  {
    id: 'INV-002',
    client: 'Thompson Construction',
    project: 'Medical Office Build-out',
    amount: 24300,
    dueDate: '2026-02-28',
    gcScore: 94,
    status: 'eligible',
  },
  {
    id: 'INV-003',
    client: 'Downtown Development LLC',
    project: 'Riverside Apartments',
    amount: 67500,
    dueDate: '2026-03-15',
    gcScore: 78,
    status: 'pending',
  },
];

const fundedHistory = [
  { id: 'INV-098', client: 'ABC Contractors', amount: 12500, fundedDate: '2026-01-15', fee: 312.50, type: 'instant' },
  { id: 'INV-097', client: 'Metro Builders', amount: 8750, fundedDate: '2026-01-10', fee: 87.50, type: 'nextday' },
  { id: 'INV-096', client: 'Thompson Construction', amount: 23000, fundedDate: '2026-01-05', fee: 230, type: 'nextday' },
];

type PaymentSpeed = 'instant' | 'nextday' | 'standard';

export default function PayNowPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentSpeed, setPaymentSpeed] = useState<PaymentSpeed>('instant');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getPaymentOptions = (amount: number, gcScore: number) => {
    // Better GC scores = lower fees
    const scoreFactor = gcScore >= 90 ? 0.8 : gcScore >= 80 ? 0.9 : gcScore >= 70 ? 1 : 1.1;

    return {
      instant: {
        fee: 2.5 * scoreFactor,
        time: '30 minutes',
        netAmount: amount * (1 - (2.5 * scoreFactor) / 100),
      },
      nextday: {
        fee: 1 * scoreFactor,
        time: 'Tomorrow by 5pm',
        netAmount: amount * (1 - (1 * scoreFactor) / 100),
      },
      standard: {
        fee: 0,
        time: 'Net terms',
        netAmount: amount,
      },
    };
  };

  const stats = {
    totalEligible: eligibleInvoices.filter(i => i.status === 'eligible').reduce((sum, i) => sum + i.amount, 0),
    totalFunded: fundedHistory.reduce((sum, i) => sum + i.amount, 0),
    totalSaved: 4200, // Example savings from faster cash flow
    avgDaysAccelerated: 42,
  };

  const handleFundInvoice = () => {
    setShowConfirmation(true);
    // In real app, this would trigger the funding process
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">PayNow</h1>
            <p className="text-[#1a1a2e]/60">Get paid today instead of waiting 60+ days</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[#9FE870]/20 rounded-full">
          <Sparkles className="w-4 h-4 text-[#9FE870]" />
          <span className="text-sm font-medium text-[#1a1a2e]">
            You&apos;ve saved {formatCurrency(stats.totalSaved)} this year
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Available to Fund
          </div>
          <p className="text-2xl font-bold text-[#9FE870]">{formatCurrency(stats.totalEligible)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <CheckCircle className="w-4 h-4" />
            Total Funded
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(stats.totalFunded)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Interest Saved
          </div>
          <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(stats.totalSaved)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <Clock className="w-4 h-4" />
            Days Accelerated
          </div>
          <p className="text-2xl font-bold text-[#54A0FF]">{stats.avgDaysAccelerated} avg</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Eligible Invoices */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-[#1a1a2e]">Eligible Invoices</h2>
          <div className="space-y-3">
            {eligibleInvoices.map((invoice) => (
              <button
                key={invoice.id}
                onClick={() => setSelectedInvoice(invoice)}
                disabled={invoice.status === 'pending'}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedInvoice?.id === invoice.id
                    ? 'bg-[#9FE870]/10 border-[#9FE870]'
                    : invoice.status === 'eligible'
                      ? 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'
                      : 'bg-[#1a1a2e]/5 border-[#1a1a2e]/10 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1a1a2e]">{invoice.id}</span>
                  {invoice.status === 'eligible' ? (
                    <span className="px-2 py-0.5 bg-[#9FE870]/20 text-[#22C55E] text-xs font-medium rounded-full">
                      Eligible
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 bg-[#FF9F43]/20 text-[#FF9F43] text-xs font-medium rounded-full">
                      Pending Review
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#1a1a2e]/70 mb-1">{invoice.client}</p>
                <p className="text-xs text-[#1a1a2e]/50 mb-2">{invoice.project}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(invoice.amount)}</span>
                  <span className="text-xs text-[#1a1a2e]/50">Due {formatDate(invoice.dueDate)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Payment Options */}
        <div className="lg:col-span-2">
          {selectedInvoice ? (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
              {/* Invoice Header */}
              <div className="p-6 border-b border-[#1a1a2e]/10 bg-gradient-to-r from-[#9FE870]/10 to-[#54A0FF]/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedInvoice.id}</h2>
                    <p className="text-[#1a1a2e]/60">{selectedInvoice.client} • {selectedInvoice.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#1a1a2e]">{formatCurrency(selectedInvoice.amount)}</p>
                    <div className="flex items-center gap-1 text-sm text-[#1a1a2e]/60">
                      <Building2 className="w-3 h-3" />
                      GCScore: <span className="font-medium text-[#22C55E]">{selectedInvoice.gcScore}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Speed Options */}
              <div className="p-6">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Choose How Fast You Get Paid</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {(['instant', 'nextday', 'standard'] as const).map((speed) => {
                    const options = getPaymentOptions(selectedInvoice.amount, selectedInvoice.gcScore);
                    const option = options[speed];
                    const isSelected = paymentSpeed === speed;

                    return (
                      <button
                        key={speed}
                        onClick={() => setPaymentSpeed(speed)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? speed === 'instant'
                              ? 'border-[#9FE870] bg-[#9FE870]/10'
                              : speed === 'nextday'
                                ? 'border-[#54A0FF] bg-[#54A0FF]/10'
                                : 'border-[#1a1a2e] bg-[#1a1a2e]/5'
                            : 'border-[#1a1a2e]/10 hover:border-[#1a1a2e]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                            speed === 'instant'
                              ? 'bg-[#9FE870] text-white'
                              : speed === 'nextday'
                                ? 'bg-[#54A0FF] text-white'
                                : 'bg-[#1a1a2e]/10 text-[#1a1a2e]'
                          }`}>
                            {speed === 'instant' ? 'Instant' : speed === 'nextday' ? 'Next Day' : 'Standard'}
                          </span>
                          {isSelected && <CheckCircle className="w-5 h-5 text-[#22C55E]" />}
                        </div>
                        <p className="text-2xl font-bold text-[#1a1a2e] mb-1">
                          {formatCurrency(option.netAmount)}
                        </p>
                        <p className="text-sm text-[#1a1a2e]/60 mb-2">
                          {option.fee > 0 ? `${option.fee.toFixed(1)}% fee` : 'No fee'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-[#1a1a2e]/50">
                          <Clock className="w-3 h-3" />
                          {option.time}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Fee Discount Notice */}
                {selectedInvoice.gcScore >= 85 && (
                  <div className="mt-4 p-3 bg-[#22C55E]/10 rounded-lg flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#22C55E]" />
                    <p className="text-sm text-[#1a1a2e]">
                      <span className="font-medium">Lower fees!</span> {selectedInvoice.client} has a high GCScore ({selectedInvoice.gcScore}),
                      qualifying you for reduced PayNow rates.
                    </p>
                  </div>
                )}
              </div>

              {/* Summary & Action */}
              <div className="p-6 bg-[#F8FAFC] border-t border-[#1a1a2e]/10">
                {paymentSpeed !== 'standard' ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-sm text-[#1a1a2e]/60">You&apos;ll receive</p>
                        <p className="text-3xl font-bold text-[#1a1a2e]">
                          {formatCurrency(getPaymentOptions(selectedInvoice.amount, selectedInvoice.gcScore)[paymentSpeed].netAmount)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-[#1a1a2e]/60">
                          {paymentSpeed === 'instant' ? 'In your account in' : 'Arriving'}
                        </p>
                        <p className="text-xl font-bold text-[#9FE870]">
                          {getPaymentOptions(selectedInvoice.amount, selectedInvoice.gcScore)[paymentSpeed].time}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleFundInvoice}
                      className="w-full py-4 bg-gradient-to-r from-[#9FE870] to-[#54A0FF] text-white font-bold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <Zap className="w-5 h-5" />
                      Get Paid {paymentSpeed === 'instant' ? 'Now' : 'Tomorrow'}
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-[#1a1a2e]/60 mb-2">Standard payment - wait for GC to pay on terms</p>
                    <p className="text-sm text-[#1a1a2e]/50">
                      Based on {selectedInvoice.client}&apos;s history, expect payment around{' '}
                      <span className="font-medium">{formatDate(selectedInvoice.dueDate)}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-12 text-center">
              <div className="w-16 h-16 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-[#9FE870]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">Select an Invoice to Fund</h3>
              <p className="text-[#1a1a2e]/60">
                Choose an eligible invoice from the list to see your payment options.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Funding History */}
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
        <div className="p-4 border-b border-[#1a1a2e]/10">
          <h3 className="font-semibold text-[#1a1a2e]">Recent PayNow Activity</h3>
        </div>
        <div className="divide-y divide-[#1a1a2e]/5">
          {fundedHistory.map((item) => (
            <div key={item.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  item.type === 'instant' ? 'bg-[#9FE870]/20' : 'bg-[#54A0FF]/20'
                }`}>
                  {item.type === 'instant' ? (
                    <Zap className="w-5 h-5 text-[#9FE870]" />
                  ) : (
                    <Clock className="w-5 h-5 text-[#54A0FF]" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">{item.id}</p>
                  <p className="text-sm text-[#1a1a2e]/60">{item.client}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1a1a2e]">{formatCurrency(item.amount)}</p>
                <p className="text-xs text-[#1a1a2e]/50">
                  Fee: {formatCurrency(item.fee)} • {formatDate(item.fundedDate)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-r from-[#9FE870]/20 to-[#54A0FF]/20 rounded-xl p-6 border border-[#9FE870]/30">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">How PayNow Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#9FE870] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a2e]">Select Invoice</p>
              <p className="text-sm text-[#1a1a2e]/60">Choose any eligible invoice to fund</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#54A0FF] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a2e]">Choose Speed</p>
              <p className="text-sm text-[#1a1a2e]/60">Instant, next-day, or standard terms</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-[#FF9F43] rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-[#1a1a2e]">Get Paid</p>
              <p className="text-sm text-[#1a1a2e]/60">Funds deposited, we collect from GC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="w-16 h-16 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#22C55E]" />
            </div>
            <h3 className="text-xl font-bold text-center text-[#1a1a2e] mb-2">Funding Initiated!</h3>
            <p className="text-center text-[#1a1a2e]/60 mb-6">
              Your funds are on the way. {paymentSpeed === 'instant' ? 'Check your account in 30 minutes.' : 'Funds will arrive tomorrow by 5pm.'}
            </p>
            <div className="p-4 bg-[#F8FAFC] rounded-xl mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-[#1a1a2e]/60">Invoice</span>
                <span className="font-medium text-[#1a1a2e]">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-[#1a1a2e]/60">Amount</span>
                <span className="font-bold text-[#1a1a2e]">
                  {formatCurrency(getPaymentOptions(selectedInvoice.amount, selectedInvoice.gcScore)[paymentSpeed].netAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#1a1a2e]/60">Delivery</span>
                <span className="font-medium text-[#9FE870]">
                  {paymentSpeed === 'instant' ? '30 minutes' : 'Tomorrow'}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setShowConfirmation(false);
                setSelectedInvoice(null);
              }}
              className="w-full py-3 bg-[#1a1a2e] text-white font-medium rounded-xl hover:bg-[#2a2a3e] transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
