'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Zap, Clock, Mail, Phone, CheckCircle, ArrowRight, Settings, Calendar, TrendingUp, Shield, Play, Pause, RotateCcw, FileText, DollarSign } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const automations = [
  {
    trigger: 'Invoice Sent',
    action: 'Send payment reminder email after 3 days',
    icon: Mail,
  },
  {
    trigger: 'Invoice Due',
    action: 'Send due date reminder 1 day before',
    icon: Calendar,
  },
  {
    trigger: 'Invoice Overdue (3 days)',
    action: 'Send friendly reminder email',
    icon: Mail,
  },
  {
    trigger: 'Invoice Overdue (7 days)',
    action: 'SAM Voice Agent makes first call',
    icon: Phone,
  },
  {
    trigger: 'Invoice Overdue (14 days)',
    action: 'Send formal payment demand email',
    icon: Mail,
  },
  {
    trigger: 'Invoice Overdue (21 days)',
    action: 'SAM Voice Agent makes follow-up call',
    icon: Phone,
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Save 10+ Hours Per Month',
    description: 'No more manually tracking due dates and sending reminders. Autopilot handles it all.',
  },
  {
    icon: TrendingUp,
    title: 'Get Paid 40% Faster',
    description: 'Consistent, timely follow-ups dramatically reduce average days to payment.',
  },
  {
    icon: Shield,
    title: 'Protect Client Relationships',
    description: 'Professional, friendly communications that maintain positive relationships.',
  },
  {
    icon: Settings,
    title: 'Fully Customizable',
    description: 'Set your own timing, messages, and escalation rules for each client.',
  },
];

const features = [
  'Smart timing based on client behavior',
  'Customizable email templates',
  'Automatic SAM Voice Agent escalation',
  'Client-specific rule overrides',
  'Holiday and weekend awareness',
  'Payment received auto-detection',
  'Escalation pause on partial payment',
  'Detailed activity logs',
];

// Demo steps for the interactive animation
const demoSteps = [
  {
    day: 0,
    action: 'Invoice Sent',
    icon: FileText,
    color: 'bg-[#54A0FF]',
    description: 'Invoice #1042 sent to ABC General Contractors',
    status: 'Sent',
    statusColor: 'text-[#54A0FF]',
  },
  {
    day: 3,
    action: 'Reminder Email',
    icon: Mail,
    color: 'bg-[#9FE870]',
    description: 'Friendly payment reminder sent automatically',
    status: 'Reminder Sent',
    statusColor: 'text-[#9FE870]',
  },
  {
    day: 7,
    action: 'SAM Voice Call',
    icon: Phone,
    color: 'bg-[#FF9F43]',
    description: 'SAM calls to follow up on payment',
    status: 'Calling...',
    statusColor: 'text-[#FF9F43]',
    hasTranscript: true,
    transcript: "Hi, this is SAM calling on behalf of Smith Electric regarding invoice #1042 for $4,500. We wanted to check in on the payment status and see if there's anything we can help with...",
  },
  {
    day: 14,
    action: 'Demand Email',
    icon: Mail,
    color: 'bg-[#FF6B6B]',
    description: 'Formal payment demand sent',
    status: 'Overdue - 14 days',
    statusColor: 'text-[#FF6B6B]',
  },
  {
    day: 21,
    action: 'Follow-up Call',
    icon: Phone,
    color: 'bg-[#FF6B6B]',
    description: 'SAM makes follow-up call',
    status: 'Final Notice',
    statusColor: 'text-[#FF6B6B]',
    hasTranscript: true,
    transcript: "Hi, this is SAM following up on invoice #1042 for $4,500 which is now 21 days overdue. We'd like to resolve this matter today. What arrangement can we make?",
  },
  {
    day: 23,
    action: 'Payment Received!',
    icon: DollarSign,
    color: 'bg-[#22C55E]',
    description: 'Client paid $4,500 - Invoice complete!',
    status: 'PAID',
    statusColor: 'text-[#22C55E]',
    isPaid: true,
  },
];

export default function AutopilotPage() {
  const [demoStep, setDemoStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const demoRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Handle demo animation
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setDemoStep((prev) => (prev + 1) % demoSteps.length);
      }, 3000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleRestart = () => {
    setDemoStep(0);
    setIsPlaying(true);
  };

  const currentStep = demoSteps[demoStep];
  const StepIcon = currentStep.icon;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#9FE870]/10 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#9FE870]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-[#9FE870]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  Autopilot Mode
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Set it and forget it. Autopilot automatically sends reminders, follows up on overdue invoices, and escalates to SAM Voice Agent when needed – all while you focus on your work.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Try It Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={scrollToDemo}
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d2d44] transition-all"
                  >
                    <Play className="w-5 h-5" />
                    See Demo
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-[#1a1a2e]">Autopilot Status</h3>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-[#22C55E] rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-[#22C55E]">Active</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-[#9FE870]/10 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                      <span className="text-sm">12 invoices monitored</span>
                    </div>
                    <div className="bg-[#54A0FF]/10 rounded-lg p-3 flex items-center gap-3">
                      <Mail className="w-5 h-5 text-[#54A0FF]" />
                      <span className="text-sm">3 reminders sent today</span>
                    </div>
                    <div className="bg-[#FF9F43]/10 rounded-lg p-3 flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#FF9F43]" />
                      <span className="text-sm">1 SAM call scheduled</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <span className="text-sm">Avg. collection: 14 days</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demo Section */}
        <section ref={demoRef} className="py-20 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44]">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-[#9FE870] text-sm font-medium mb-2">
                ↓ This is exactly what happens after you send an invoice in SubPaid — automatically.
              </p>
              <h2 className="text-3xl font-bold text-white mb-4">See Autopilot in Action</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Watch how Autopilot automatically handles the entire collection process from invoice to payment
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Invoice Card */}
              <div className="bg-white rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500">INVOICE</p>
                    <p className="text-2xl font-bold text-[#1a1a2e]">#1042</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">AMOUNT</p>
                    <p className="text-2xl font-bold text-[#1a1a2e]">$4,500</p>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <p className="text-sm text-gray-500 mb-1">Client</p>
                  <p className="font-semibold text-[#1a1a2e]">ABC General Contractors</p>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className={`font-bold ${currentStep.statusColor} transition-all duration-500`}>
                    {currentStep.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className={`absolute inset-y-0 left-0 ${currentStep.isPaid ? 'bg-[#22C55E]' : 'bg-gradient-to-r from-[#9FE870] to-[#54A0FF]'} transition-all duration-500 rounded-full`}
                    style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-400">
                  <span>Day 0</span>
                  <span>Day {currentStep.day}</span>
                  <span>Paid</span>
                </div>

                {/* Paid Celebration */}
                {currentStep.isPaid && (
                  <div className="mt-6 p-4 bg-[#22C55E]/10 rounded-xl border-2 border-[#22C55E] text-center animate-pulse">
                    <CheckCircle className="w-10 h-10 text-[#22C55E] mx-auto mb-2" />
                    <p className="text-[#22C55E] font-bold text-lg">Payment Received!</p>
                    <p className="text-[#22C55E]/70 text-sm">Invoice collected in 23 days</p>
                  </div>
                )}
              </div>

              {/* Timeline & Activity */}
              <div className="space-y-6">
                {/* Current Action Card */}
                <div className={`${currentStep.color} rounded-2xl p-6 shadow-2xl transition-all duration-500`}>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                      <StepIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-sm">Day {currentStep.day}</p>
                      <p className="text-white font-bold text-xl">{currentStep.action}</p>
                    </div>
                  </div>
                  <p className="text-white/90">{currentStep.description}</p>

                  {/* Transcript for calls */}
                  {currentStep.hasTranscript && (
                    <div className="mt-4 p-4 bg-white/10 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4 text-white/70" />
                        <span className="text-white/70 text-sm">SAM Voice Agent</span>
                        <span className="ml-auto flex items-center gap-1 text-white/70 text-xs">
                          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          Live
                        </span>
                      </div>
                      <p className="text-white/90 text-sm italic">&ldquo;{currentStep.transcript}&rdquo;</p>
                    </div>
                  )}
                </div>

                {/* Timeline */}
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <p className="text-white/50 text-xs uppercase tracking-wider mb-4">Timeline</p>
                  <div className="space-y-3">
                    {demoSteps.map((step, index) => {
                      const Icon = step.icon;
                      const isCompleted = index <= demoStep;
                      const isCurrent = index === demoStep;
                      return (
                        <div
                          key={index}
                          className={`flex items-center gap-3 transition-all duration-300 ${isCurrent ? 'scale-105' : ''}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isCompleted ? step.color : 'bg-white/10'
                            }`}
                          >
                            {isCompleted ? (
                              <Icon className="w-4 h-4 text-white" />
                            ) : (
                              <div className="w-2 h-2 bg-white/30 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-white/40'}`}>
                              Day {step.day}: {step.action}
                            </p>
                          </div>
                          {isCurrent && (
                            <span className="text-xs bg-white/20 text-white px-2 py-1 rounded-full">
                              NOW
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleRestart}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Restart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Automation Timeline */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">How Autopilot Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Autopilot follows a proven escalation sequence to get you paid, automatically adjusting based on client responses.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#9FE870]" />
              <div className="space-y-6">
                {automations.map((item, index) => (
                  <div key={index} className="relative flex gap-6 pl-8">
                    <div className="absolute left-0 w-16 h-16 bg-white border-4 border-[#9FE870] rounded-full flex items-center justify-center z-10">
                      <item.icon className="w-6 h-6 text-[#1a1a2e]" />
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-xl p-6 ml-8">
                      <p className="text-sm text-[#9FE870] font-medium mb-1">{item.trigger}</p>
                      <p className="text-[#1a1a2e] font-medium">{item.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Use Autopilot</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#9FE870]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-[#9FE870]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features List */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                  Full Control, Zero Effort
                </h2>
                <p className="text-gray-600 mb-8">
                  Autopilot is smart enough to handle everything automatically, but you can customize every aspect of the collection process.
                </p>
                <ul className="space-y-4">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#9FE870] rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h3 className="font-semibold text-[#1a1a2e] mb-6">Customization Options</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">First Reminder</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>3 days after</option>
                          <option>5 days after</option>
                          <option>7 days after</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">SAM Call Trigger</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>7 days overdue</option>
                          <option>10 days overdue</option>
                          <option>14 days overdue</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[#1a1a2e]">Email Tone</span>
                        <select className="text-sm border rounded px-2 py-1">
                          <option>Friendly</option>
                          <option>Professional</option>
                          <option>Firm</option>
                        </select>
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#1a1a2e]">Weekend Sends</span>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative">
                          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">40%</div>
                <p className="text-white/70">Faster payments</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">10+ hrs</div>
                <p className="text-white/70">Saved per month</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-[#9FE870] mb-2">98%</div>
                <p className="text-white/70">Collection rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#9FE870]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">
              Put your collections on autopilot
            </h2>
            <p className="text-xl text-[#1a1a2e]/70 mb-8">
              Start your 14-day free trial and let Autopilot handle the follow-ups.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all"
              >
                See All Features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
