'use client';

import Link from 'next/link';
import { Phone, MessageSquare, Clock, Shield, ArrowRight, CheckCircle, Volume2, Calendar, TrendingUp } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Conversations',
    description: 'SAM uses advanced AI to have natural, professional conversations with your clients about payment.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'SAM can call clients at optimal times based on their time zone and response patterns.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Automatically schedules follow-ups based on client promises and payment history.',
  },
  {
    icon: TrendingUp,
    title: 'Proven Results',
    description: 'On average, SAM helps collect payments 3x faster than email reminders alone.',
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'You Create an Invoice',
    description: 'Create and send an invoice to your client as usual.',
  },
  {
    step: '2',
    title: 'Invoice Goes Overdue',
    description: 'When the due date passes, SAM automatically starts the follow-up sequence.',
  },
  {
    step: '3',
    title: 'SAM Makes the Call',
    description: 'SAM calls your client with a professional, friendly tone to discuss the invoice.',
  },
  {
    step: '4',
    title: 'You Get Paid',
    description: 'SAM reports back on the call outcome and continues following up until you\'re paid.',
  },
];

const sampleScript = [
  { speaker: 'SAM', text: 'Hi, this is SAM calling on behalf of Rodriguez Electric. Is this John from ABC Construction?' },
  { speaker: 'Client', text: 'Yes, this is John.' },
  { speaker: 'SAM', text: 'Great! I\'m calling about invoice #1234 for $3,500, which was due on January 15th. I wanted to check in and see when we might expect payment?' },
  { speaker: 'Client', text: 'Oh right, I meant to send that. Can I pay next Friday?' },
  { speaker: 'SAM', text: 'Absolutely! I\'ll note that down. Would you like me to send you a payment link so it\'s ready when you are?' },
];

export default function VoiceAgentPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#54A0FF]/10 to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <div className="w-16 h-16 bg-[#54A0FF]/20 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="w-8 h-8 text-[#54A0FF]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  SAM Voice Agent
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Meet SAM, your AI-powered payment collection assistant. SAM calls your clients to follow up on unpaid invoices so you don&apos;t have to.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#54A0FF] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Try SAM Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d2d44] transition-all"
                  >
                    Hear a Sample Call
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-[#54A0FF]/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Phone className="w-32 h-32 text-[#54A0FF]/50 mx-auto mb-4" />
                    <p className="text-gray-500">Voice demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Chasing payments is exhausting. Let SAM do it.
            </h2>
            <p className="text-xl text-white/70 mb-8">
              You became a subcontractor to do great work, not to spend hours on the phone asking for money. SAM handles the awkward payment conversations so you can focus on your craft.
            </p>
            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#54A0FF] mb-2">3x</div>
                <p className="text-white/70">Faster payment collection</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#54A0FF] mb-2">85%</div>
                <p className="text-white/70">First-call resolution rate</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#54A0FF] mb-2">10+</div>
                <p className="text-white/70">Hours saved per month</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">How SAM Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                SAM integrates seamlessly into your invoicing workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {howItWorks.map((item, index) => (
                <div key={item.step} className="relative">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-[#54A0FF]/20 -translate-x-1/2 z-0" />
                  )}
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-[#54A0FF] rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sample Conversation */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">What a SAM Call Sounds Like</h2>
              <p className="text-gray-600">
                SAM has natural, professional conversations that preserve your client relationships.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="space-y-6">
                {sampleScript.map((line, index) => (
                  <div
                    key={index}
                    className={`flex gap-4 ${line.speaker === 'SAM' ? '' : 'flex-row-reverse'}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        line.speaker === 'SAM' ? 'bg-[#54A0FF]' : 'bg-gray-200'
                      }`}
                    >
                      {line.speaker === 'SAM' ? (
                        <Volume2 className="w-5 h-5 text-white" />
                      ) : (
                        <span className="text-gray-600 text-sm font-medium">JD</span>
                      )}
                    </div>
                    <div
                      className={`flex-1 p-4 rounded-2xl ${
                        line.speaker === 'SAM'
                          ? 'bg-[#54A0FF]/10 rounded-tl-none'
                          : 'bg-gray-100 rounded-tr-none'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-500 mb-1">{line.speaker}</p>
                      <p className="text-gray-700">{line.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">SAM&apos;s Capabilities</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {features.map((feature) => (
                <div key={feature.title} className="bg-gray-50 rounded-xl p-6 flex gap-4">
                  <div className="w-12 h-12 bg-[#54A0FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-[#54A0FF]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-start gap-4 bg-white rounded-xl p-6">
              <div className="w-12 h-12 bg-[#22C55E]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-[#22C55E]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1a1a2e] mb-2">Fully Compliant</h3>
                <p className="text-gray-600">
                  SAM is designed to comply with TCPA, FDCPA, and other telecommunications regulations. Calls are made during appropriate hours, with proper identification, and following all legal requirements for payment collection calls.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#54A0FF]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Let SAM handle the calls
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Start your 14-day free trial. Pro plan includes 100 calls per month.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#54A0FF] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 bg-white/20 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
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
