'use client';

import { useState } from 'react';
import { Zap, Mail, MessageSquare, Phone, AlertTriangle, Check, Settings, Play, Pause, ChevronRight, Clock } from 'lucide-react';

const autopilotSteps = [
  { day: 0, action: 'Invoice Sent', icon: Mail, description: 'Professional invoice delivered via email', status: 'complete' },
  { day: 7, action: 'Email Reminder', icon: Mail, description: 'Friendly payment reminder sent', status: 'complete' },
  { day: 14, action: 'SMS Reminder', icon: MessageSquare, description: 'Text message follow-up', status: 'current' },
  { day: 21, action: 'SAM Voice Call', icon: Phone, description: 'AI agent calls to discuss payment', status: 'upcoming' },
  { day: 30, action: 'Lien Warning', icon: AlertTriangle, description: 'Formal notice of intent to file lien', status: 'upcoming' },
];

const activeAutopilots = [
  {
    id: 'INV-003',
    client: 'ABC General Contractors',
    amount: 20000,
    daysOverdue: 17,
    currentStep: 2,
    nextAction: 'SMS Reminder tomorrow',
    status: 'active'
  },
  {
    id: 'INV-006',
    client: 'Highland Construction',
    amount: 8500,
    daysOverdue: 8,
    currentStep: 1,
    nextAction: 'Email reminder in 6 days',
    status: 'active'
  }
];

export default function AutopilotPage() {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#FF6B6B] rounded-xl flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Autopilot Mode</h1>
            <p className="text-[#1a1a2e]/60">Fully autonomous payment collection</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.location.href = '/dashboard/settings/notifications'}
            className="flex items-center gap-2 text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
          <button
            onClick={() => setAutopilotEnabled(!autopilotEnabled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
              autopilotEnabled 
                ? 'bg-[#22C55E] text-white hover:bg-[#1ea550]' 
                : 'bg-[#1a1a2e]/10 text-[#1a1a2e] hover:bg-[#1a1a2e]/20'
            }`}
          >
            {autopilotEnabled ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {autopilotEnabled ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Active Autopilots</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">2</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Amount in Collection</p>
          <p className="text-2xl font-bold text-[#FF6B6B]">$28,500</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Collected This Month</p>
          <p className="text-2xl font-bold text-[#22C55E]">$45,000</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Success Rate</p>
          <p className="text-2xl font-bold text-[#9FE870]">94%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* How Autopilot Works */}
        <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
          <div className="p-4 border-b border-[#1a1a2e]/10 bg-[#F7FBF4]">
            <h2 className="font-semibold text-[#1a1a2e]">How Autopilot Works</h2>
            <p className="text-sm text-[#1a1a2e]/60">Automated collection sequence</p>
          </div>
          <div className="p-4">
            <div className="relative">
              {autopilotSteps.map((step, index) => (
                <div key={index} className="flex items-start gap-4 pb-6 last:pb-0">
                  {/* Timeline line */}
                  {index < autopilotSteps.length - 1 && (
                    <div className="absolute left-5 top-10 w-0.5 h-[calc(100%-40px)] bg-[#1a1a2e]/10" style={{ top: `${index * 80 + 40}px`, height: '60px' }} />
                  )}
                  
                  {/* Icon */}
                  <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.status === 'complete' ? 'bg-[#22C55E]' :
                    step.status === 'current' ? 'bg-[#FF9F43] animate-pulse' :
                    'bg-[#1a1a2e]/10'
                  }`}>
                    {step.status === 'complete' ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <step.icon className={`w-5 h-5 ${step.status === 'current' ? 'text-white' : 'text-[#1a1a2e]/40'}`} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        step.status === 'complete' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                        step.status === 'current' ? 'bg-[#FF9F43]/10 text-[#FF9F43]' :
                        'bg-[#1a1a2e]/5 text-[#1a1a2e]/50'
                      }`}>
                        Day {step.day}
                      </span>
                      {step.status === 'current' && (
                        <span className="text-xs text-[#FF9F43] font-medium">Active Now</span>
                      )}
                    </div>
                    <p className={`font-medium mt-1 ${step.status === 'upcoming' ? 'text-[#1a1a2e]/50' : 'text-[#1a1a2e]'}`}>
                      {step.action}
                    </p>
                    <p className={`text-sm ${step.status === 'upcoming' ? 'text-[#1a1a2e]/30' : 'text-[#1a1a2e]/60'}`}>
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Autopilots */}
        <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
          <div className="p-4 border-b border-[#1a1a2e]/10 bg-[#F7FBF4]">
            <h2 className="font-semibold text-[#1a1a2e]">Active Collections</h2>
            <p className="text-sm text-[#1a1a2e]/60">Invoices being collected</p>
          </div>
          <div className="divide-y divide-[#1a1a2e]/5">
            {activeAutopilots.map((invoice) => (
              <div key={invoice.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#1a1a2e]">{invoice.id}</p>
                    <p className="text-sm text-[#1a1a2e]/60">{invoice.client}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#1a1a2e]">{formatCurrency(invoice.amount)}</p>
                    <p className="text-sm text-[#EF4444]">{invoice.daysOverdue} days overdue</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-[#1a1a2e]/50 mb-1">
                    <span>Step {invoice.currentStep + 1} of 5</span>
                    <span>{((invoice.currentStep + 1) / 5 * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FF6B6B] rounded-full transition-all"
                      style={{ width: `${(invoice.currentStep + 1) / 5 * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/70">
                    <Clock className="w-4 h-4" />
                    <span>Next: {invoice.nextAction}</span>
                  </div>
                  <button
                    onClick={() => alert(`Invoice ${invoice.id}\nClient: ${invoice.client}\nAmount: ${formatCurrency(invoice.amount)}\n${invoice.daysOverdue} days overdue\nCurrent step: ${invoice.currentStep + 1}/5\nNext: ${invoice.nextAction}`)}
                    className="text-sm text-[#1a1a2e] font-medium hover:text-[#9FE870] transition-colors flex items-center gap-1"
                  >
                    Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Enable for new invoice */}
          <div className="p-4 bg-[#9FE870]/10 border-t border-[#9FE870]/20">
            <button
              onClick={() => window.location.href = '/dashboard/invoices'}
              className="w-full flex items-center justify-center gap-2 text-[#1a1a2e] font-medium hover:text-[#9FE870] transition-colors"
            >
              <Zap className="w-4 h-4" />
              Enable Autopilot for New Invoice
            </button>
          </div>
        </div>
      </div>

      {/* SAM Voice Agent Section */}
      <div className="bg-gradient-to-r from-[#54A0FF]/10 to-[#9FE870]/10 rounded-xl p-6 border border-[#54A0FF]/20">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#54A0FF] rounded-full flex items-center justify-center flex-shrink-0">
            <Phone className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a1a2e] text-lg">SAM Voice Agent Ready</h3>
            <p className="text-[#1a1a2e]/70 mb-4">
              When invoices reach Day 21, SAM will automatically call your clients to discuss payment. 
              SAM speaks naturally, captures promise-to-pay dates, and logs all conversations.
            </p>
            <div className="flex gap-3">
              <button
                onClick={async () => {
                  try {
                    const res = await fetch('/api/sam-agent/test', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ testPhone: '+1555000000' }),
                    });
                    if (res.ok) alert('Test call initiated! SAM will call your test number momentarily.');
                    else alert('Failed to initiate test call');
                  } catch { alert('Failed to initiate test call'); }
                }}
                className="bg-[#54A0FF] text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Test SAM Now
              </button>
              <button
                onClick={() => alert('SAM Script Configuration:\n\n1. Introduction: "Hi, this is SAM calling on behalf of [Company]"\n2. Payment inquiry: "I\'m reaching out regarding invoice [ID]"\n3. Promise-to-pay: "When can we expect payment?"\n4. Closing: "Thank you for your time"\n\nCustomize scripts in Settings > Autopilot > Scripts.')}
                className="bg-white text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:bg-[#1a1a2e]/5 transition-all"
              >
                Configure Scripts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
