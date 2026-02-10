'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  X,
  Camera,
  Phone,
  TrendingUp,
  ChevronRight,
  ChevronLeft,
  Check,
  FileText,
  DollarSign,
  Clock,
  Sparkles,
  Mic,
  BarChart3,
  ArrowRight,
  Play,
  Pause,
  Briefcase,
  Users,
  Shield,
  Zap,
  Banknote,
  Star,
  Scale,
  PieChart,
  BadgeCheck,
  Receipt,
  MessageSquare,
  AlertTriangle,
  CalendarDays,
  CreditCard,
  CircleDollarSign,
  Building2,
  Video,
  MousePointer,
} from 'lucide-react';

interface WatchDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

/* ──────────────────────────────────────
   Feature Categories & Steps
   ────────────────────────────────────── */

interface DemoStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  category: string;
}

const demoSteps: DemoStep[] = [
  // ─── Core ───
  { id: 'dashboard', title: 'Dashboard', subtitle: 'Your command center — see everything at a glance', icon: BarChart3, color: '#54A0FF', category: 'Core' },
  { id: 'jobs', title: 'Jobs', subtitle: 'Track all your projects, crews, and budgets', icon: Briefcase, color: '#9FE870', category: 'Core' },
  { id: 'estimates', title: 'Estimates', subtitle: 'Create professional quotes and win more work', icon: FileText, color: '#FF9F43', category: 'Core' },
  { id: 'invoices', title: 'Invoices', subtitle: 'Create, send, and track invoices in seconds', icon: Receipt, color: '#54A0FF', category: 'Core' },
  { id: 'payments', title: 'Payments', subtitle: 'Track every payment across all clients', icon: DollarSign, color: '#9FE870', category: 'Core' },
  { id: 'crew', title: 'Crew', subtitle: 'Manage your team members, roles, and rates', icon: Users, color: '#FF9F43', category: 'Core' },
  { id: 'time', title: 'Time Tracking', subtitle: 'Clock in/out and track billable hours', icon: Clock, color: '#54A0FF', category: 'Core' },
  // ─── AI ───
  { id: 'snap', title: 'Snap to Invoice', subtitle: 'Photo → professional invoice in 5 seconds', icon: Camera, color: '#9FE870', category: 'AI-Powered' },
  { id: 'sam', title: 'SAM Voice Agent', subtitle: 'AI calls your clients to collect payment', icon: Phone, color: '#54A0FF', category: 'AI-Powered' },
  { id: 'prophet', title: 'Payment Prophet', subtitle: 'Predict exactly when you\'ll get paid', icon: TrendingUp, color: '#FF9F43', category: 'AI-Powered' },
  { id: 'payscore', title: 'PayScore\u2122', subtitle: 'Rate and review GC payment reliability', icon: Star, color: '#FECA57', category: 'AI-Powered' },
  { id: 'autopilot', title: 'Autopilot', subtitle: 'Fully automated collection workflow', icon: Zap, color: '#54A0FF', category: 'AI-Powered' },
  { id: 'ask', title: 'Ask SubPaid', subtitle: 'Chat with AI about your business', icon: MessageSquare, color: '#9FE870', category: 'AI-Powered' },
  // ─── Premium ───
  { id: 'paynow', title: 'PayNow', subtitle: 'Get paid in 30 min with invoice factoring', icon: Banknote, color: '#9FE870', category: 'Premium' },
  { id: 'gcscore', title: 'GCScore\u2122', subtitle: 'Know-before-you-bid GC intelligence', icon: Building2, color: '#54A0FF', category: 'Premium' },
  { id: 'lienguard', title: 'LienGuard', subtitle: 'Protect your payment rights automatically', icon: Shield, color: '#FF9F43', category: 'Premium' },
  { id: 'profitguard', title: 'ProfitGuard', subtitle: 'Track margins and job profitability', icon: PieChart, color: '#9FE870', category: 'Premium' },
  { id: 'prequal', title: 'PreQual Passport', subtitle: 'One profile for every GC application', icon: BadgeCheck, color: '#54A0FF', category: 'Premium' },
  { id: 'aia', title: 'AIA Billing', subtitle: 'Industry-standard AIA G702/G703 billing', icon: Scale, color: '#FF9F43', category: 'Premium' },
];

const categories = ['Core', 'AI-Powered', 'Premium'];

/* ──────────────────────────────────────
   Component
   ────────────────────────────────────── */

export function WatchDemo({ isOpen, onClose }: WatchDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animPhase, setAnimPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [activeView, setActiveView] = useState<'video' | 'interactive'>('video');

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
      setAnimPhase(0);
      setIsPlaying(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Auto-advance phases
  useEffect(() => {
    if (!isPlaying || !isOpen) return;
    const timer = setTimeout(() => {
      if (animPhase < 3) {
        setAnimPhase(p => p + 1);
      } else if (currentStep < demoSteps.length - 1) {
        setCurrentStep(p => p + 1);
        setAnimPhase(0);
      } else {
        setIsPlaying(false);
      }
    }, animPhase === 0 ? 600 : 900);
    return () => clearTimeout(timer);
  }, [animPhase, currentStep, isPlaying, isOpen]);

  const goTo = useCallback((i: number) => { setCurrentStep(i); setAnimPhase(0); setIsPlaying(true); }, []);
  const next = useCallback(() => { if (currentStep < demoSteps.length - 1) { setCurrentStep(p => p + 1); setAnimPhase(0); setIsPlaying(true); } }, [currentStep]);
  const prev = useCallback(() => { if (currentStep > 0) { setCurrentStep(p => p - 1); setAnimPhase(0); setIsPlaying(true); } }, [currentStep]);
  const close = useCallback(() => { setIsVisible(false); setTimeout(onClose, 300); }, [onClose]);

  if (!isOpen) return null;

  const step = demoSteps[currentStep];
  const progress = ((currentStep + (animPhase / 3)) / demoSteps.length) * 100;
  const catIndex = categories.indexOf(step.category);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      <div className={`relative w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}>

        {/* Progress bar */}
        <div className="h-1 bg-gray-100 flex-shrink-0">
          <div className="h-full transition-all duration-500 ease-out rounded-r-full" style={{ width: `${progress}%`, backgroundColor: step.color }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <h3 className="font-bold text-[#1a1a2e] text-base">SubPaid Full Demo</h3>
              <p className="text-xs text-gray-400">{activeView === 'video' ? 'Watch the video' : `${currentStep + 1} of ${demoSteps.length} features`}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {activeView === 'interactive' && (
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label={isPlaying ? 'Pause' : 'Play'}>
                {isPlaying ? <Pause className="w-4 h-4 text-gray-500" /> : <Play className="w-4 h-4 text-gray-500" />}
              </button>
            )}
            <button onClick={close} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close"><X className="w-4 h-4 text-gray-500" /></button>
          </div>
        </div>

        {/* View Toggle - Video vs Interactive */}
        <div className="flex border-b border-gray-100 flex-shrink-0 bg-gray-50">
          <button
            onClick={() => setActiveView('video')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              activeView === 'video'
                ? 'text-[#1a1a2e] bg-white border-b-2 border-[#9FE870]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Video className="w-4 h-4" />
            Video Demo
          </button>
          <button
            onClick={() => setActiveView('interactive')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              activeView === 'interactive'
                ? 'text-[#1a1a2e] bg-white border-b-2 border-[#54A0FF]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MousePointer className="w-4 h-4" />
            Interactive Tour
          </button>
        </div>

        {/* Video View */}
        {activeView === 'video' && (
          <div className="flex-1 flex items-center justify-center bg-black p-4">
            <video
              src="/videos/demo.mp4"
              controls
              autoPlay
              className="w-full max-h-[70vh] rounded-lg"
            />
          </div>
        )}

        {/* Interactive View - Category tabs */}
        {activeView === 'interactive' && (<>
        {/* Category tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          {categories.map((cat, ci) => {
            const catSteps = demoSteps.filter(s => s.category === cat);
            const firstIdx = demoSteps.findIndex(s => s.category === cat);
            const lastIdx = firstIdx + catSteps.length - 1;
            const isActive = currentStep >= firstIdx && currentStep <= lastIdx;
            const isDone = currentStep > lastIdx;
            return (
              <button key={cat} onClick={() => goTo(firstIdx)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-medium transition-all relative ${isActive ? 'text-[#1a1a2e]' : isDone ? 'text-gray-400' : 'text-gray-400'}`}>
                <span className={`inline-flex items-center gap-1.5 ${isActive ? '' : ''}`}>
                  {isDone && <Check className="w-3.5 h-3.5 text-[#9FE870]" />}
                  {cat}
                  <span className="text-[10px] text-gray-300">({catSteps.length})</span>
                </span>
                {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: step.color }} />}
              </button>
            );
          })}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="grid md:grid-cols-5 min-h-[400px]">

            {/* Left sidebar — feature list for current category */}
            <div className="md:col-span-2 border-r border-gray-100 bg-gray-50/50 overflow-y-auto max-h-[400px]">
              {categories.map(cat => {
                const catSteps = demoSteps.filter(s => s.category === cat);
                const firstIdx = demoSteps.findIndex(s => s.category === cat);
                const isCurrentCat = step.category === cat;
                if (!isCurrentCat) return null;
                return (
                  <div key={cat}>
                    <div className="px-4 pt-3 pb-1">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{cat} Features</p>
                    </div>
                    {catSteps.map((s, si) => {
                      const idx = firstIdx + si;
                      const active = idx === currentStep;
                      const done = idx < currentStep;
                      return (
                        <button key={s.id} onClick={() => goTo(idx)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all ${active ? 'bg-white shadow-sm' : 'hover:bg-white/50'}`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all ${active ? 'shadow-md' : ''}`}
                            style={{ backgroundColor: active ? s.color : done ? `${s.color}30` : '#F1F5F9' }}>
                            <s.icon className={`w-4 h-4 ${active ? 'text-white' : done ? 'text-gray-500' : 'text-gray-400'}`} />
                          </div>
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold truncate ${active ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>{s.title}</p>
                            <p className="text-[10px] text-gray-400 truncate">{s.subtitle}</p>
                          </div>
                          {done && <Check className="w-3.5 h-3.5 text-[#9FE870] ml-auto flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Right — animated demo preview */}
            <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-center bg-[#FAFBFC]">
              {/* Feature title */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{ backgroundColor: step.color }}>
                  <step.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e]">{step.title}</h2>
                  <p className="text-xs text-gray-500">{step.subtitle}</p>
                </div>
              </div>

              {/* Animated mockup — one per feature */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <FeatureMockup stepId={step.id} phase={animPhase} color={step.color} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-100 bg-white flex-shrink-0">
          <button onClick={prev} disabled={currentStep === 0}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ChevronLeft className="w-3.5 h-3.5" /> Prev
          </button>

          <div className="flex items-center gap-1.5">
            {demoSteps.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`rounded-full transition-all ${i === currentStep ? 'w-5 h-1.5' : 'w-1.5 h-1.5'}`}
                style={{ backgroundColor: i === currentStep ? step.color : i < currentStep ? `${step.color}60` : '#D1D5DB' }} />
            ))}
          </div>

          {currentStep < demoSteps.length - 1 ? (
            <button onClick={next}
              className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: step.color }}>
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <a href="/signup" className="flex items-center gap-1 px-3 py-2 bg-[#1a1a2e] rounded-lg text-xs font-medium text-white transition-all hover:shadow-lg">
              Start Free Trial <ArrowRight className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        </>)}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   Animated Mockups per Feature
   ────────────────────────────────────── */

function FeatureMockup({ stepId, phase, color }: { stepId: string; phase: number; color: string }) {
  const show = (n: number) => phase >= n;
  const anim = (n: number) => `transition-all duration-500 ${show(n) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`;

  switch (stepId) {

    /* ═══ DASHBOARD ═══ */
    case 'dashboard':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-3 gap-3 ${anim(0)}`}>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">Total Owed</p><p className="text-lg font-bold text-[#1a1a2e]">$42,500</p><p className="text-[10px] text-[#9FE870]">+12%</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">Collected</p><p className="text-lg font-bold text-[#9FE870]">$38,750</p><p className="text-[10px] text-gray-400">91% rate</p></div>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400">Avg Days</p><p className="text-lg font-bold text-[#54A0FF]">14d</p><p className="text-[10px] text-[#9FE870]">-42d faster</p></div>
          </div>
          <div className={anim(1)}>
            <p className="text-[10px] font-medium text-gray-400 mb-2">RECENT INVOICES</p>
            {[{ c: 'Metro Builders', a: '$8,500', s: 'Paid', sc: '#9FE870' }, { c: 'Chen Const.', a: '$4,200', s: 'Pending', sc: '#FF9F43' }, { c: 'Wilson Plumbing', a: '$3,100', s: 'Overdue', sc: '#EF4444' }].map((r, i) => (
              <div key={i} className={`flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0 ${anim(1 + (i > 0 ? 1 : 0))}`}>
                <span className="text-xs text-gray-700">{r.c}</span>
                <div className="flex items-center gap-2"><span className="text-xs font-medium">{r.a}</span><span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${r.sc}20`, color: r.sc }}>{r.s}</span></div>
              </div>
            ))}
          </div>
          <div className={`flex items-center gap-2 ${anim(3)}`}>
            <div className="flex-1 bg-[#54A0FF]/10 rounded-lg p-2.5"><p className="text-[10px] text-gray-400">Prophet Insight</p><p className="text-[10px] font-medium text-[#1a1a2e]">$12,700 expected this week</p></div>
            <div className="flex-1 bg-[#9FE870]/10 rounded-lg p-2.5"><p className="text-[10px] text-gray-400">Quick Action</p><p className="text-[10px] font-medium text-[#1a1a2e]">2 invoices ready to send</p></div>
          </div>
        </div>
      );

    /* ═══ JOBS ═══ */
    case 'jobs':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex items-center justify-between ${anim(0)}`}>
            <p className="text-xs font-semibold text-[#1a1a2e]">Active Jobs</p>
            <span className="text-[10px] bg-[#9FE870]/20 text-[#1a1a2e] px-2 py-0.5 rounded-full font-medium">4 active</span>
          </div>
          {[
            { name: 'Highland Shopping Center', crew: 3, val: '$85,000', pct: 72 },
            { name: 'Riverside Apartments', crew: 2, val: '$42,500', pct: 45 },
            { name: 'Downtown Office Tower', crew: 4, val: '$120,000', pct: 15 },
          ].map((j, i) => (
            <div key={i} className={`bg-gray-50 rounded-xl p-3 ${anim(i)}`}>
              <div className="flex justify-between items-start mb-2">
                <div><p className="text-xs font-semibold text-[#1a1a2e]">{j.name}</p><p className="text-[10px] text-gray-400">{j.crew} crew &bull; {j.val}</p></div>
                <span className="text-[10px] font-bold" style={{ color }}>{j.pct}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-700" style={{ width: `${j.pct}%`, backgroundColor: color }} /></div>
            </div>
          ))}
        </div>
      );

    /* ═══ ESTIMATES ═══ */
    case 'estimates':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-3 gap-2 ${anim(0)}`}>
            <div className="bg-[#9FE870]/10 rounded-lg p-2 text-center"><p className="text-lg font-bold text-[#9FE870]">12</p><p className="text-[9px] text-gray-500">Accepted</p></div>
            <div className="bg-[#FF9F43]/10 rounded-lg p-2 text-center"><p className="text-lg font-bold text-[#FF9F43]">5</p><p className="text-[9px] text-gray-500">Pending</p></div>
            <div className="bg-gray-100 rounded-lg p-2 text-center"><p className="text-lg font-bold text-gray-500">3</p><p className="text-[9px] text-gray-500">Draft</p></div>
          </div>
          {[{ id: 'EST-001', c: 'Metro Builders', a: '$24,500', s: 'Accepted' }, { id: 'EST-002', c: 'Chen Const.', a: '$18,200', s: 'Sent' }, { id: 'EST-003', c: 'Wilson Co.', a: '$12,800', s: 'Draft' }].map((e, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{e.c}</p><p className="text-[10px] text-gray-400">{e.id}</p></div>
              <div className="text-right"><p className="text-xs font-bold">{e.a}</p><p className="text-[10px]" style={{ color: e.s === 'Accepted' ? '#9FE870' : e.s === 'Sent' ? '#FF9F43' : '#999' }}>{e.s}</p></div>
            </div>
          ))}
        </div>
      );

    /* ═══ INVOICES ═══ */
    case 'invoices':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-3 gap-2 ${anim(0)}`}>
            <div className="bg-[#9FE870]/10 rounded-lg p-2 text-center"><p className="text-sm font-bold text-[#9FE870]">$38,750</p><p className="text-[9px] text-gray-500">Paid</p></div>
            <div className="bg-[#FF9F43]/10 rounded-lg p-2 text-center"><p className="text-sm font-bold text-[#FF9F43]">$12,700</p><p className="text-[9px] text-gray-500">Pending</p></div>
            <div className="bg-red-50 rounded-lg p-2 text-center"><p className="text-sm font-bold text-red-500">$3,100</p><p className="text-[9px] text-gray-500">Overdue</p></div>
          </div>
          <div className={anim(1)}>
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex justify-between mb-2"><span className="text-xs font-bold text-[#1a1a2e]">INV-1047</span><span className="text-[10px] bg-[#9FE870]/20 px-2 py-0.5 rounded-full text-[#1a1a2e] font-medium">Paid</span></div>
              <div className="space-y-1 text-[10px] text-gray-600">
                <div className="flex justify-between"><span>Electrical wiring</span><span>$2,400</span></div>
                <div className="flex justify-between"><span>Materials</span><span>$850</span></div>
                <div className="flex justify-between font-bold text-[#1a1a2e] border-t border-gray-200 pt-1"><span>Total</span><span>$4,450</span></div>
              </div>
            </div>
          </div>
          <div className={`flex gap-2 ${anim(3)}`}>
            <div className="flex-1 bg-[#54A0FF] text-white text-center py-2 rounded-lg text-xs font-semibold">Send Reminder</div>
            <div className="flex-1 bg-gray-100 text-[#1a1a2e] text-center py-2 rounded-lg text-xs font-semibold">Export PDF</div>
          </div>
        </div>
      );

    /* ═══ PAYMENTS ═══ */
    case 'payments':
      return (
        <div className="p-4 space-y-3">
          <div className={`bg-[#9FE870]/10 rounded-xl p-3 text-center ${anim(0)}`}>
            <p className="text-[10px] text-gray-400">Received This Month</p>
            <p className="text-2xl font-bold text-[#9FE870]">$38,750</p>
          </div>
          {[{ c: 'Metro Builders', a: '$8,500', m: 'ACH Transfer', d: 'Jan 28' }, { c: 'Smith Builders', a: '$4,200', m: 'Check #1842', d: 'Jan 25' }, { c: 'Chen Const.', a: '$6,100', m: 'Wire Transfer', d: 'Jan 22' }].map((p, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{p.c}</p><p className="text-[10px] text-gray-400">{p.m} &bull; {p.d}</p></div>
              <span className="text-xs font-bold text-[#9FE870]">+{p.a}</span>
            </div>
          ))}
        </div>
      );

    /* ═══ CREW ═══ */
    case 'crew':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex items-center justify-between ${anim(0)}`}>
            <p className="text-xs font-semibold">Team Members</p><span className="text-[10px] bg-[#9FE870]/20 px-2 py-0.5 rounded-full font-medium">6 active</span>
          </div>
          {[{ n: 'Jose Martinez', r: 'Lead Electrician', rate: '$45/hr', h: '164h' }, { n: 'Carlos Rivera', r: 'Electrician', rate: '$38/hr', h: '152h' }, { n: 'David Chen', r: 'Apprentice', rate: '$25/hr', h: '160h' }, { n: 'Mike Thompson', r: 'Foreman', rate: '$52/hr', h: '148h' }].map((c, i) => (
            <div key={i} className={`flex items-center gap-3 py-2 border-b border-gray-100 ${anim(i)}`}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: ['#54A0FF', '#FF9F43', '#9FE870', '#FECA57'][i] }}>{c.n.split(' ').map(w => w[0]).join('')}</div>
              <div className="flex-1 min-w-0"><p className="text-xs font-medium text-[#1a1a2e] truncate">{c.n}</p><p className="text-[10px] text-gray-400">{c.r}</p></div>
              <div className="text-right"><p className="text-[10px] font-semibold">{c.rate}</p><p className="text-[10px] text-gray-400">{c.h}</p></div>
            </div>
          ))}
        </div>
      );

    /* ═══ TIME TRACKING ═══ */
    case 'time':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-2 gap-3 ${anim(0)}`}>
            <div className="bg-[#9FE870]/10 rounded-xl p-3 text-center"><p className="text-[10px] text-gray-400">Active Now</p><p className="text-xl font-bold text-[#9FE870]">3</p><p className="text-[10px] text-gray-400">workers clocked in</p></div>
            <div className="bg-[#54A0FF]/10 rounded-xl p-3 text-center"><p className="text-[10px] text-gray-400">This Week</p><p className="text-xl font-bold text-[#54A0FF]">186h</p><p className="text-[10px] text-gray-400">total hours</p></div>
          </div>
          {[{ n: 'Jose Martinez', job: 'Highland Center', t: '6h 23m', live: true }, { n: 'Carlos Rivera', job: 'Riverside Apts', t: '4h 12m', live: true }, { n: 'David Chen', job: 'Highland Center', t: '7h 45m', live: false }].map((e, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{e.n}</p><p className="text-[10px] text-gray-400">{e.job}</p></div>
              <div className="flex items-center gap-2"><span className="text-xs font-mono font-medium">{e.t}</span>{e.live && <span className="w-2 h-2 rounded-full bg-[#9FE870] animate-pulse" />}</div>
            </div>
          ))}
        </div>
      );

    /* ═══ SNAP TO INVOICE ═══ */
    case 'snap':
      return (
        <div className="p-4 space-y-3">
          <div className={`border-2 border-dashed rounded-xl p-5 text-center transition-all duration-700 ${show(1) ? 'border-[#9FE870] bg-[#9FE870]/10' : 'border-gray-300 bg-gray-50'}`}>
            {!show(1) ? <><Camera className="w-10 h-10 mx-auto mb-2 text-gray-300" /><p className="text-xs text-gray-400">Tap to capture receipt or notes</p></> : <><Check className="w-10 h-10 mx-auto mb-2 text-[#9FE870]" /><p className="text-xs font-medium text-[#1a1a2e]">Photo captured!</p></>}
          </div>
          <div className={`flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 ${anim(1)}`}><Sparkles className="w-4 h-4 text-[#54A0FF] animate-pulse" /><span className="text-xs text-[#54A0FF] font-medium">AI extracting line items... 94% confidence</span></div>
          <div className={anim(2)}>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
              <div className="flex justify-between mb-2"><span className="text-xs font-bold">Invoice #1047</span><span className="text-[10px] bg-[#9FE870]/20 px-2 py-0.5 rounded-full font-medium">Generated</span></div>
              <div className="space-y-1 text-[10px] text-gray-600">
                <div className="flex justify-between"><span>Electrical wiring - 2nd floor</span><span>$2,400</span></div>
                <div className="flex justify-between"><span>Materials (wire, outlets)</span><span>$850</span></div>
                <div className="flex justify-between"><span>Panel upgrade labor</span><span>$1,200</span></div>
                <div className="border-t pt-1 flex justify-between font-bold text-[#1a1a2e]"><span>Total</span><span>$4,450</span></div>
              </div>
            </div>
          </div>
          <div className={`bg-[#9FE870] rounded-lg py-2 text-center ${anim(3)}`}><span className="text-sm font-semibold text-[#1a1a2e]">Send to Client</span></div>
        </div>
      );

    /* ═══ SAM VOICE AGENT ═══ */
    case 'sam':
      return (
        <div className="p-4 space-y-3">
          <div className={`text-center py-3 ${anim(0)}`}>
            <div className="w-14 h-14 bg-[#54A0FF]/10 rounded-full flex items-center justify-center mx-auto mb-2"><Mic className={`w-7 h-7 text-[#54A0FF] ${show(1) && !show(3) ? 'animate-pulse' : ''}`} /></div>
            <p className="text-sm font-semibold text-[#1a1a2e]">{!show(1) ? 'Calling Metro Builders...' : !show(3) ? 'Speaking with John...' : 'Call Complete'}</p>
            <p className="text-[10px] text-gray-400">{!show(3) ? 'RE: Invoice #1042 — $8,500' : 'Duration: 2m 34s'}</p>
          </div>
          <div className={anim(1)}>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Live Transcript</p>
              <div className="flex gap-2"><span className="text-[10px] font-bold text-[#54A0FF] shrink-0">SAM:</span><span className="text-[10px] text-gray-600">&quot;Hi John, calling on behalf of Rodriguez Electric about invoice #1042...&quot;</span></div>
              <div className={`flex gap-2 ${anim(2)}`}><span className="text-[10px] font-bold text-gray-400 shrink-0">John:</span><span className="text-[10px] text-gray-600">&quot;Right, I&apos;ll process that payment by Friday.&quot;</span></div>
            </div>
          </div>
          <div className={anim(3)}>
            <div className="bg-[#9FE870]/10 rounded-xl p-3 flex items-center gap-3 border border-[#9FE870]/30">
              <div className="w-8 h-8 bg-[#9FE870] rounded-full flex items-center justify-center shrink-0"><Check className="w-4 h-4 text-white" /></div>
              <div><p className="text-xs font-semibold text-[#1a1a2e]">Payment Confirmed — $8,500</p><p className="text-[10px] text-gray-500">Client will pay by Friday</p></div>
            </div>
          </div>
        </div>
      );

    /* ═══ PAYMENT PROPHET ═══ */
    case 'prophet':
      return (
        <div className="p-4 space-y-3">
          <p className={`text-[10px] font-medium text-gray-400 uppercase ${anim(0)}`}>Payment Predictions</p>
          {[{ c: 'Metro Builders', inv: 'INV-1042', a: '$8,500', d: '2 days', conf: '98%', clr: '#9FE870' }, { c: 'Chen Const.', inv: 'INV-1045', a: '$4,200', d: '7 days', conf: '87%', clr: '#FF9F43' }, { c: 'Wilson Plumbing', inv: 'INV-1039', a: '$3,100', d: '21 days', conf: 'At risk', clr: '#EF4444' }].map((p, i) => (
            <div key={i} className={`rounded-lg p-2.5 border ${anim(i)}`} style={{ backgroundColor: `${p.clr}10`, borderColor: `${p.clr}30` }}>
              <div className="flex justify-between"><div><p className="text-[10px] font-semibold text-[#1a1a2e]">{p.c}</p><p className="text-[10px] text-gray-400">{p.inv} &bull; {p.a}</p></div><div className="text-right"><p className="text-[10px] font-bold" style={{ color: p.clr }}>{p.d}</p><p className="text-[8px] text-gray-400">{p.conf}</p></div></div>
            </div>
          ))}
          <div className={anim(3)}>
            <div className="bg-gray-50 rounded-xl p-3"><p className="text-[10px] text-gray-400 mb-2">30-Day Cash Flow</p>
              <div className="flex items-end gap-1 h-10">{[30, 45, 65, 50, 80, 95, 70, 85, 90, 60, 75, 88].map((h, i) => (<div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: h > 70 ? '#9FE870' : h > 50 ? '#FF9F43' : '#54A0FF' }} />))}</div>
            </div>
          </div>
        </div>
      );

    /* ═══ PAYSCORE ═══ */
    case 'payscore':
      return (
        <div className="p-4 space-y-3">
          <div className={`text-center ${anim(0)}`}><p className="text-[10px] text-gray-400">Your PayScore</p><p className="text-4xl font-bold" style={{ color }}>92</p><p className="text-[10px] text-gray-400">Excellent — Top 5% of contractors</p></div>
          {[{ gc: 'Metro Builders Inc.', score: 88, days: '18 days', rate: '94%' }, { gc: 'Chen Construction', score: 72, days: '28 days', rate: '78%' }, { gc: 'Wilson Plumbing Co.', score: 45, days: '52 days', rate: '55%' }].map((g, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{g.gc}</p><p className="text-[10px] text-gray-400">Avg {g.days} &bull; {g.rate} on-time</p></div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: g.score > 80 ? '#9FE870' : g.score > 60 ? '#FF9F43' : '#EF4444' }}>{g.score}</div>
            </div>
          ))}
        </div>
      );

    /* ═══ AUTOPILOT ═══ */
    case 'autopilot':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex items-center justify-between ${anim(0)}`}>
            <div><p className="text-xs font-semibold text-[#1a1a2e]">Autopilot Active</p><p className="text-[10px] text-gray-400">94% success rate</p></div>
            <div className="w-10 h-5 bg-[#9FE870] rounded-full relative"><div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow" /></div>
          </div>
          <div className="space-y-0">
            {[{ day: 'Day 0', a: 'Invoice Sent', icon: '📧', done: true }, { day: 'Day 7', a: 'Email Reminder', icon: '📨', done: true }, { day: 'Day 14', a: 'SMS Reminder', icon: '💬', done: true }, { day: 'Day 21', a: 'SAM Voice Call', icon: '📞', done: false }, { day: 'Day 30', a: 'Lien Warning', icon: '⚠️', done: false }].map((s, i) => (
              <div key={i} className={`flex items-center gap-3 py-2 ${anim(i < 3 ? 1 : i < 4 ? 2 : 3)}`}>
                <div className="flex flex-col items-center w-6"><div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${s.done ? 'bg-[#9FE870]' : 'bg-gray-200'}`}>{s.done ? <Check className="w-3 h-3 text-white" /> : <span className="text-gray-400">{i + 1}</span>}</div>{i < 4 && <div className="w-px h-4 bg-gray-200" />}</div>
                <div><p className="text-xs font-medium text-[#1a1a2e]">{s.a}</p><p className="text-[10px] text-gray-400">{s.day}</p></div>
              </div>
            ))}
          </div>
        </div>
      );

    /* ═══ ASK SUBPAID ═══ */
    case 'ask':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex gap-2 justify-end ${anim(0)}`}>
            <div className="bg-[#54A0FF] text-white rounded-2xl rounded-br-md px-3 py-2 text-xs max-w-[200px]">Who owes me the most money right now?</div>
          </div>
          <div className={`flex gap-2 ${anim(1)}`}>
            <div className="w-7 h-7 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center shrink-0"><span className="text-white text-[10px] font-bold">S</span></div>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-3 py-2 text-xs text-gray-700 max-w-[240px]">
              Here are your top outstanding balances:
              <div className="mt-1.5 space-y-1">
                <div className="flex justify-between"><span>Metro Builders</span><span className="font-bold">$8,500</span></div>
                <div className="flex justify-between"><span>Chen Construction</span><span className="font-bold">$4,200</span></div>
                <div className="flex justify-between"><span>Wilson Plumbing</span><span className="font-bold">$3,100</span></div>
              </div>
            </div>
          </div>
          <div className={`flex flex-wrap gap-1 ${anim(2)}`}>
            {['Which GCs pay fastest?', 'Cash flow this month?', 'Overdue invoices?'].map((q, i) => (
              <span key={i} className="text-[10px] bg-[#54A0FF]/10 text-[#54A0FF] px-2 py-1 rounded-full cursor-pointer hover:bg-[#54A0FF]/20">{q}</span>
            ))}
          </div>
          <div className={`flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 ${anim(3)}`}>
            <MessageSquare className="w-4 h-4 text-gray-300" /><span className="text-xs text-gray-400">Ask anything about your business...</span>
          </div>
        </div>
      );

    /* ═══ PAYNOW ═══ */
    case 'paynow':
      return (
        <div className="p-4 space-y-3">
          <div className={`text-center ${anim(0)}`}><p className="text-[10px] text-gray-400">Select your invoice to fund</p><p className="text-xs font-semibold text-[#1a1a2e] mt-1">INV-1042 &bull; Metro Builders &bull; $8,500</p></div>
          {[{ speed: 'Instant', time: '30 min', fee: '2.5%', net: '$8,288', clr: '#9FE870', rec: true }, { speed: 'Next Day', time: 'By 5pm tomorrow', fee: '1%', net: '$8,415', clr: '#54A0FF', rec: false }, { speed: 'Standard', time: 'Wait for GC', fee: '0%', net: '$8,500', clr: '#999', rec: false }].map((o, i) => (
            <div key={i} className={`rounded-xl p-3 border-2 cursor-pointer transition-all ${o.rec ? 'border-[#9FE870] bg-[#9FE870]/5' : 'border-gray-200'} ${anim(i)}`}>
              <div className="flex justify-between items-center">
                <div><p className="text-xs font-semibold text-[#1a1a2e]">{o.speed} {o.rec && <span className="text-[9px] bg-[#9FE870]/20 px-1.5 py-0.5 rounded-full ml-1">Best</span>}</p><p className="text-[10px] text-gray-400">{o.time} &bull; {o.fee} fee</p></div>
                <p className="text-sm font-bold" style={{ color: o.clr }}>{o.net}</p>
              </div>
            </div>
          ))}
          <div className={`bg-[#9FE870] rounded-lg py-2 text-center ${anim(3)}`}><span className="text-sm font-semibold text-[#1a1a2e]">Get Paid Now</span></div>
        </div>
      );

    /* ═══ GCSCORE ═══ */
    case 'gcscore':
      return (
        <div className="p-4 space-y-3">
          <div className={`text-center ${anim(0)}`}><p className="text-[10px] text-gray-400">Know Before You Bid</p><p className="text-xs font-semibold text-[#1a1a2e] mt-1">Search any General Contractor</p></div>
          <div className={`bg-gray-50 rounded-xl p-3 ${anim(1)}`}>
            <div className="flex items-center justify-between mb-2"><div><p className="text-xs font-bold text-[#1a1a2e]">Metro Builders Inc.</p><p className="text-[10px] text-gray-400">Denver, CO &bull; Since 2008</p></div><div className="w-12 h-12 rounded-full bg-[#9FE870] flex items-center justify-center text-white font-bold text-sm">88</div></div>
            <div className="grid grid-cols-4 gap-2">
              {[{ l: 'Avg Days', v: '18' }, { l: 'On-time', v: '94%' }, { l: 'Disputes', v: '2%' }, { l: 'Liens', v: '0' }].map((m, i) => (
                <div key={i} className="text-center"><p className="text-xs font-bold text-[#1a1a2e]">{m.v}</p><p className="text-[8px] text-gray-400">{m.l}</p></div>
              ))}
            </div>
          </div>
          <div className={anim(2)}>
            <p className="text-[10px] text-gray-400 mb-1">Verified Reviews</p>
            <div className="bg-gray-50 rounded-lg p-2"><div className="flex items-center gap-1 mb-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-yellow-500 fill-yellow-500" />)}</div><p className="text-[10px] text-gray-600">&quot;Always pays on time. Great to work with.&quot;</p><p className="text-[9px] text-gray-400 mt-1">— Rodriguez Electric, Jan 2025</p></div>
          </div>
          <div className={`bg-[#54A0FF]/10 rounded-lg p-2 ${anim(3)}`}><p className="text-[10px] text-[#54A0FF] font-medium">Bid Recommendation: Standard terms. Low risk.</p></div>
        </div>
      );

    /* ═══ LIENGUARD ═══ */
    case 'lienguard':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-2 gap-3 ${anim(0)}`}>
            <div className="bg-[#FF9F43]/10 rounded-xl p-2.5 text-center"><AlertTriangle className="w-5 h-5 text-[#FF9F43] mx-auto mb-1" /><p className="text-[10px] font-semibold">2 Deadlines</p><p className="text-[9px] text-gray-400">within 30 days</p></div>
            <div className="bg-[#9FE870]/10 rounded-xl p-2.5 text-center"><Shield className="w-5 h-5 text-[#9FE870] mx-auto mb-1" /><p className="text-[10px] font-semibold">$205K</p><p className="text-[9px] text-gray-400">amount protected</p></div>
          </div>
          {[{ proj: 'Highland Shopping Center', dl: 'Prelim Notice Due', days: '14 days', clr: '#FF9F43' }, { proj: 'Riverside Apartments', dl: 'Lien Deadline', days: '28 days', clr: '#54A0FF' }, { proj: 'Downtown Tower', dl: 'Notice Sent', days: 'Complete', clr: '#9FE870' }].map((l, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{l.proj}</p><p className="text-[10px] text-gray-400">{l.dl}</p></div>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${l.clr}20`, color: l.clr }}>{l.days}</span>
            </div>
          ))}
        </div>
      );

    /* ═══ PROFITGUARD ═══ */
    case 'profitguard':
      return (
        <div className="p-4 space-y-3">
          <div className={`grid grid-cols-3 gap-2 ${anim(0)}`}>
            <div className="bg-[#9FE870]/10 rounded-lg p-2.5 text-center"><p className="text-lg font-bold text-[#9FE870]">34%</p><p className="text-[9px] text-gray-400">Avg Margin</p></div>
            <div className="bg-[#54A0FF]/10 rounded-lg p-2.5 text-center"><p className="text-lg font-bold text-[#54A0FF]">$247K</p><p className="text-[9px] text-gray-400">Revenue YTD</p></div>
            <div className="bg-[#FF9F43]/10 rounded-lg p-2.5 text-center"><p className="text-lg font-bold text-[#FF9F43]">$84K</p><p className="text-[9px] text-gray-400">Profit YTD</p></div>
          </div>
          {[{ job: 'Highland Shopping', rev: '$85K', cost: '$54K', margin: '36%', clr: '#9FE870' }, { job: 'Riverside Apts', rev: '$42K', cost: '$29K', margin: '31%', clr: '#9FE870' }, { job: 'Downtown Tower', rev: '$120K', cost: '$98K', margin: '18%', clr: '#FF9F43' }].map((j, i) => (
            <div key={i} className={`flex items-center justify-between py-2 border-b border-gray-100 ${anim(1 + i)}`}>
              <div><p className="text-xs font-medium text-[#1a1a2e]">{j.job}</p><p className="text-[10px] text-gray-400">{j.rev} revenue &bull; {j.cost} cost</p></div>
              <span className="text-xs font-bold" style={{ color: j.clr }}>{j.margin}</span>
            </div>
          ))}
        </div>
      );

    /* ═══ PREQUAL PASSPORT ═══ */
    case 'prequal':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex items-center gap-3 ${anim(0)}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#54A0FF] to-[#9FE870] rounded-xl flex items-center justify-center"><BadgeCheck className="w-5 h-5 text-white" /></div>
            <div><p className="text-xs font-bold text-[#1a1a2e]">Rodriguez Electric LLC</p><p className="text-[10px] text-gray-400">Profile 95% complete &bull; Shared with 4 GCs</p></div>
          </div>
          <div className={`grid grid-cols-2 gap-2 ${anim(1)}`}>
            {[{ l: 'Insurance', s: 'Valid', clr: '#9FE870' }, { l: 'License', s: 'Valid', clr: '#9FE870' }, { l: 'Safety Cert', s: 'Expiring', clr: '#FF9F43' }, { l: 'Financials', s: 'Updated', clr: '#9FE870' }].map((d, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-2 flex items-center justify-between"><span className="text-[10px] text-gray-600">{d.l}</span><span className="text-[9px] font-medium" style={{ color: d.clr }}>{d.s}</span></div>
            ))}
          </div>
          <div className={anim(2)}>
            <p className="text-[10px] text-gray-400 mb-1">Performance Metrics</p>
            <div className="grid grid-cols-3 gap-2">
              {[{ l: 'On-time', v: '96%' }, { l: 'Safety', v: '0 incidents' }, { l: 'EMR', v: '0.82' }].map((m, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-2 text-center"><p className="text-xs font-bold text-[#1a1a2e]">{m.v}</p><p className="text-[9px] text-gray-400">{m.l}</p></div>
              ))}
            </div>
          </div>
          <div className={`bg-[#54A0FF] rounded-lg py-2 text-center ${anim(3)}`}><span className="text-xs font-semibold text-white">Share Profile with GC</span></div>
        </div>
      );

    /* ═══ AIA BILLING ═══ */
    case 'aia':
      return (
        <div className="p-4 space-y-3">
          <div className={`flex items-center justify-between ${anim(0)}`}>
            <p className="text-xs font-semibold text-[#1a1a2e]">AIA G702/G703 Applications</p>
            <span className="text-[10px] bg-[#FF9F43]/20 text-[#FF9F43] px-2 py-0.5 rounded-full font-medium">4 active</span>
          </div>
          {[{ proj: 'Highland Shopping Center', app: '#3', sch: '$85,000', comp: '72%', due: '$24,500' }, { proj: 'Riverside Apartments', app: '#2', sch: '$42,500', comp: '45%', due: '$12,800' }, { proj: 'Medical Office', app: '#1', sch: '$35,000', comp: '15%', due: '$5,250' }].map((a, i) => (
            <div key={i} className={`bg-gray-50 rounded-xl p-3 ${anim(1 + i)}`}>
              <div className="flex justify-between mb-1"><p className="text-xs font-semibold text-[#1a1a2e]">{a.proj}</p><p className="text-[10px] text-gray-400">App {a.app}</p></div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div><p className="text-[10px] font-bold text-[#1a1a2e]">{a.sch}</p><p className="text-[8px] text-gray-400">Scheduled</p></div>
                <div><p className="text-[10px] font-bold text-[#54A0FF]">{a.comp}</p><p className="text-[8px] text-gray-400">Complete</p></div>
                <div><p className="text-[10px] font-bold text-[#9FE870]">{a.due}</p><p className="text-[8px] text-gray-400">Due</p></div>
              </div>
            </div>
          ))}
        </div>
      );

    default:
      return (
        <div className="p-8 text-center text-gray-400">
          <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Feature preview</p>
        </div>
      );
  }
}
