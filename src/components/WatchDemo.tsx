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
} from 'lucide-react';

interface WatchDemoProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoSteps = [
  {
    id: 1,
    title: 'Snap to Invoice',
    subtitle: 'Photo to professional invoice in 5 seconds',
    icon: Camera,
    color: '#9FE870',
    bgGradient: 'from-[#9FE870]/20 to-[#9FE870]/5',
  },
  {
    id: 2,
    title: 'SAM Voice Agent',
    subtitle: 'AI calls your clients to collect payment',
    icon: Phone,
    color: '#54A0FF',
    bgGradient: 'from-[#54A0FF]/20 to-[#54A0FF]/5',
  },
  {
    id: 3,
    title: 'Payment Prophet',
    subtitle: 'Predict exactly when you\'ll get paid',
    icon: TrendingUp,
    color: '#FF9F43',
    bgGradient: 'from-[#FF9F43]/20 to-[#FF9F43]/5',
  },
];

export function WatchDemo({ isOpen, onClose }: WatchDemoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [animationPhase, setAnimationPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  // Entrance animation
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(0);
      setAnimationPhase(0);
      setIsPlaying(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Auto-advance animation phases within each step
  useEffect(() => {
    if (!isPlaying || !isOpen) return;

    const timer = setTimeout(() => {
      if (animationPhase < 4) {
        setAnimationPhase(prev => prev + 1);
      } else {
        // Move to next step or loop back
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(prev => prev + 1);
          setAnimationPhase(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, animationPhase === 0 ? 800 : 1200);

    return () => clearTimeout(timer);
  }, [animationPhase, currentStep, isPlaying, isOpen]);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(step);
    setAnimationPhase(0);
    setIsPlaying(true);
  }, []);

  const handleNext = useCallback(() => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
      setAnimationPhase(0);
      setIsPlaying(true);
    }
  }, [currentStep]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setAnimationPhase(0);
      setIsPlaying(true);
    }
  }, [currentStep]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  if (!isOpen) return null;

  const step = demoSteps[currentStep];
  const progress = ((currentStep * 5 + animationPhase) / (demoSteps.length * 5)) * 100;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'}`}
      >
        {/* Top progress bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full transition-all duration-500 ease-out rounded-r-full"
            style={{ width: `${progress}%`, backgroundColor: step.color }}
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${step.color}20` }}
            >
              <Play className="w-5 h-5" style={{ color: step.color }} />
            </div>
            <div>
              <h3 className="font-bold text-[#1a1a2e] text-lg">Product Demo</h3>
              <p className="text-sm text-gray-500">See SubPaid in action</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-gray-500" />
              ) : (
                <Play className="w-5 h-5 text-gray-500" />
              )}
            </button>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close demo"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Step navigation tabs */}
        <div className="flex border-b border-gray-100">
          {demoSteps.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goToStep(i)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all relative ${
                i === currentStep
                  ? 'text-[#1a1a2e]'
                  : i < currentStep
                  ? 'text-gray-500'
                  : 'text-gray-400'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  i < currentStep
                    ? 'text-white'
                    : i === currentStep
                    ? 'text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
                style={{
                  backgroundColor: i <= currentStep ? s.color : undefined,
                }}
              >
                {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
              {i === currentStep && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: s.color }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Demo content area */}
        <div className="grid md:grid-cols-2 min-h-[420px]">
          {/* Left side - Description */}
          <div className={`p-8 flex flex-col justify-center bg-gradient-to-br ${step.bgGradient}`}>
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
              style={{ backgroundColor: step.color }}
            >
              <step.icon className="w-8 h-8 text-white" />
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a2e] mb-3">
              {step.title}
            </h2>
            <p className="text-gray-600 text-lg mb-6">
              {step.subtitle}
            </p>

            {/* Step-specific feature bullets */}
            {currentStep === 0 && (
              <ul className="space-y-3">
                {[
                  { text: 'Take a photo of any receipt or notes', delay: 1 },
                  { text: 'AI extracts all line items automatically', delay: 2 },
                  { text: 'Professional invoice generated in 5 seconds', delay: 3 },
                  { text: 'Send directly to your client via email', delay: 4 },
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      animationPhase >= item.delay ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#9FE870] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentStep === 1 && (
              <ul className="space-y-3">
                {[
                  { text: 'SAM calls your client professionally', delay: 1 },
                  { text: 'Handles objections and answers questions', delay: 2 },
                  { text: 'Negotiates payment schedules if needed', delay: 3 },
                  { text: 'Reports back with full call summary', delay: 4 },
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      animationPhase >= item.delay ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#54A0FF] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}

            {currentStep === 2 && (
              <ul className="space-y-3">
                {[
                  { text: 'AI analyzes client payment history', delay: 1 },
                  { text: '94% accuracy within a 3-day window', delay: 2 },
                  { text: 'Forecasts your cash flow automatically', delay: 3 },
                  { text: 'Alerts you about potential late payments', delay: 4 },
                ].map((item, i) => (
                  <li
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      animationPhase >= item.delay ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FF9F43] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right side - Interactive mockup */}
          <div className="p-8 flex items-center justify-center bg-[#F8FAFC]">
            {/* Step 1: Snap to Invoice Animation */}
            {currentStep === 0 && (
              <div className="w-full max-w-sm">
                {/* Phone mockup */}
                <div className="bg-[#1a1a2e] rounded-3xl p-3 shadow-2xl mx-auto w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Phone header */}
                    <div className="bg-[#9FE870] px-4 py-3 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-[#1a1a2e]" />
                      <span className="font-semibold text-[#1a1a2e] text-sm">Snap to Invoice</span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Camera capture area */}
                      <div
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-700 ${
                          animationPhase >= 1 ? 'border-[#9FE870] bg-[#9FE870]/10' : 'border-gray-300 bg-gray-50'
                        }`}
                      >
                        {animationPhase < 1 ? (
                          <div className="text-gray-400">
                            <Camera className="w-10 h-10 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Tap to capture</p>
                          </div>
                        ) : (
                          <div className="text-[#9FE870]">
                            <Check className="w-10 h-10 mx-auto mb-2" />
                            <p className="text-xs font-medium text-[#1a1a2e]">Photo captured!</p>
                          </div>
                        )}
                      </div>

                      {/* AI Processing indicator */}
                      <div
                        className={`transition-all duration-500 ${
                          animationPhase >= 2 ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                      >
                        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2">
                          <Sparkles className="w-4 h-4 text-[#54A0FF] animate-pulse" />
                          <span className="text-xs text-[#54A0FF] font-medium">AI extracting details...</span>
                        </div>
                      </div>

                      {/* Generated Invoice preview */}
                      <div
                        className={`transition-all duration-700 ${
                          animationPhase >= 3 ? 'opacity-100 max-h-60' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                      >
                        <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[#1a1a2e]">Invoice #1047</span>
                            <span className="text-[10px] bg-[#9FE870]/20 text-[#1a1a2e] px-2 py-0.5 rounded-full font-medium">Draft</span>
                          </div>
                          <div className="space-y-1 text-[10px] text-gray-600">
                            <div className="flex justify-between">
                              <span>Electrical wiring - 2nd floor</span>
                              <span className="font-medium">$2,400</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Materials (copper wire, outlets)</span>
                              <span className="font-medium">$850</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Panel upgrade labor</span>
                              <span className="font-medium">$1,200</span>
                            </div>
                            <div className="border-t border-gray-200 pt-1 flex justify-between font-bold text-[#1a1a2e]">
                              <span>Total</span>
                              <span>$4,450</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Send button */}
                      <div
                        className={`transition-all duration-500 ${
                          animationPhase >= 4 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="bg-[#9FE870] rounded-lg py-2 text-center">
                          <span className="text-sm font-semibold text-[#1a1a2e]">Send Invoice</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: SAM Voice Agent Animation */}
            {currentStep === 1 && (
              <div className="w-full max-w-sm">
                <div className="bg-[#1a1a2e] rounded-3xl p-3 shadow-2xl mx-auto w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#54A0FF] px-4 py-3 flex items-center gap-2">
                      <Phone className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white text-sm">SAM Voice Agent</span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Call status */}
                      <div
                        className={`text-center py-4 transition-all duration-500 ${
                          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <div className="w-16 h-16 bg-[#54A0FF]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Mic className={`w-8 h-8 text-[#54A0FF] ${animationPhase >= 1 && animationPhase < 4 ? 'animate-pulse' : ''}`} />
                        </div>
                        <p className="font-semibold text-[#1a1a2e] text-sm">
                          {animationPhase < 2 ? 'Calling Metro Builders...' : animationPhase < 4 ? 'Speaking with John...' : 'Call Complete'}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {animationPhase < 4 ? 'RE: Invoice #1042 — $8,500' : 'Duration: 2m 34s'}
                        </p>
                      </div>

                      {/* Live transcript */}
                      <div
                        className={`transition-all duration-700 ${
                          animationPhase >= 2 ? 'opacity-100 max-h-40' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                      >
                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Live Transcript</p>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <span className="text-[10px] font-bold text-[#54A0FF] shrink-0">SAM:</span>
                              <span className="text-[10px] text-gray-600">&quot;Hi John, this is SAM calling on behalf of Rodriguez Electric regarding invoice #1042...&quot;</span>
                            </div>
                            <div
                              className={`flex gap-2 transition-all duration-500 ${
                                animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
                              }`}
                            >
                              <span className="text-[10px] font-bold text-gray-400 shrink-0">John:</span>
                              <span className="text-[10px] text-gray-600">&quot;Oh yes, I was going to send that this week...&quot;</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Result */}
                      <div
                        className={`transition-all duration-700 ${
                          animationPhase >= 4 ? 'opacity-100 max-h-20' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                      >
                        <div className="bg-[#9FE870]/10 rounded-xl p-3 flex items-center gap-3 border border-[#9FE870]/30">
                          <div className="w-8 h-8 bg-[#9FE870] rounded-full flex items-center justify-center shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-[#1a1a2e]">Payment Confirmed</p>
                            <p className="text-[10px] text-gray-500">Client will pay by Friday</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Payment Prophet Animation */}
            {currentStep === 2 && (
              <div className="w-full max-w-sm">
                <div className="bg-[#1a1a2e] rounded-3xl p-3 shadow-2xl mx-auto w-[280px]">
                  <div className="bg-white rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#FF9F43] px-4 py-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-white" />
                      <span className="font-semibold text-white text-sm">Payment Prophet</span>
                    </div>

                    <div className="p-4 space-y-3">
                      {/* Predictions */}
                      <div
                        className={`transition-all duration-500 ${
                          animationPhase >= 1 ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">Payment Predictions</p>
                        <div className="space-y-2">
                          <div className="bg-[#9FE870]/10 rounded-lg p-2.5 border border-[#9FE870]/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-semibold text-[#1a1a2e]">Metro Builders</p>
                                <p className="text-[10px] text-gray-400">INV-1042 &bull; $8,500</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-[#9FE870]">2 days</p>
                                <p className="text-[8px] text-gray-400">98% confidence</p>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`bg-[#FF9F43]/10 rounded-lg p-2.5 border border-[#FF9F43]/20 transition-all duration-500 ${
                              animationPhase >= 2 ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-semibold text-[#1a1a2e]">Chen Construction</p>
                                <p className="text-[10px] text-gray-400">INV-1045 &bull; $4,200</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-[#FF9F43]">7 days</p>
                                <p className="text-[8px] text-gray-400">87% confidence</p>
                              </div>
                            </div>
                          </div>

                          <div
                            className={`bg-red-50 rounded-lg p-2.5 border border-red-200 transition-all duration-500 ${
                              animationPhase >= 3 ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-[10px] font-semibold text-[#1a1a2e]">Wilson Plumbing</p>
                                <p className="text-[10px] text-gray-400">INV-1039 &bull; $3,100</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] font-bold text-red-500">21 days</p>
                                <p className="text-[8px] text-gray-400">At risk</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cash flow forecast */}
                      <div
                        className={`transition-all duration-700 ${
                          animationPhase >= 4 ? 'opacity-100 max-h-32' : 'opacity-0 max-h-0'
                        } overflow-hidden`}
                      >
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-2">30-Day Cash Flow</p>
                          <div className="flex items-end gap-1 h-12">
                            {[30, 45, 65, 50, 80, 95, 70, 85, 90, 60, 75, 88].map((h, i) => (
                              <div
                                key={i}
                                className="flex-1 rounded-t transition-all duration-300"
                                style={{
                                  height: `${h}%`,
                                  backgroundColor: h > 70 ? '#9FE870' : h > 50 ? '#FF9F43' : '#54A0FF',
                                  transitionDelay: `${i * 50}ms`,
                                }}
                              />
                            ))}
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-[8px] text-gray-400">Week 1</span>
                            <span className="text-[8px] text-gray-400">Week 4</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              currentStep === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {demoSteps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentStep ? 'w-6' : ''
                }`}
                style={{
                  backgroundColor: i === currentStep ? step.color : '#D1D5DB',
                }}
              />
            ))}
          </div>

          {currentStep < demoSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-white transition-all hover:shadow-lg"
              style={{ backgroundColor: step.color }}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <a
              href="/signup"
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] rounded-lg font-medium text-sm text-white transition-all hover:shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
