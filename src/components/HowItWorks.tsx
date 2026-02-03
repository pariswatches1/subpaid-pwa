'use client';

import { Camera, Sparkles, DollarSign, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: "1",
    title: "Snap a Photo",
    description: "Take a picture of your completed work, materials receipt, or handwritten notes",
    icon: Camera,
    color: "bg-[#9FE870]"
  },
  {
    number: "2",
    title: "AI Creates Invoice",
    description: "Our AI extracts all details and generates a professional invoice in under 5 seconds",
    icon: Sparkles,
    color: "bg-[#54A0FF]"
  },
  {
    number: "3",
    title: "Get Paid Automatically",
    description: "SAM Voice Agent follows up with your clients to collect payment on your behalf",
    icon: DollarSign,
    color: "bg-[#FF9F43]"
  }
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            How It Works
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Get from job completion to payment in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#9FE870] via-[#54A0FF] to-[#FF9F43]" />

          {steps.map((step, index) => (
            <div key={step.number} className="text-center relative">
              {/* Step number circle */}
              <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg relative z-10`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>

              {/* Step number badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                <span className="inline-block w-6 h-6 bg-[#1a1a2e] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="text-xl font-bold text-[#1a1a2e] mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>

              {/* Arrow for mobile */}
              {index < steps.length - 1 && (
                <div className="md:hidden flex justify-center my-6">
                  <ArrowRight className="w-6 h-6 text-gray-300 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/signup"
            className="inline-flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
