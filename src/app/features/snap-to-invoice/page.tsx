'use client';

import Link from 'next/link';
import { Camera, Zap, FileText, CheckCircle, ArrowRight, Clock, Shield, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const steps = [
  {
    number: '1',
    title: 'Snap a Photo',
    description: 'Take a picture of your completed work, materials receipt, delivery slip, or even handwritten notes.',
  },
  {
    number: '2',
    title: 'AI Extracts Details',
    description: 'Our AI instantly reads and understands the content, extracting line items, quantities, prices, and descriptions.',
  },
  {
    number: '3',
    title: 'Review & Send',
    description: 'Review the professional invoice, make any edits, and send it to your client in seconds.',
  },
];

const benefits = [
  {
    icon: Clock,
    title: 'Save Hours Every Week',
    description: 'Stop manually typing invoice details. Create invoices in seconds instead of minutes.',
  },
  {
    icon: CheckCircle,
    title: '99% Accuracy',
    description: 'Our AI is trained on construction and trade documents for industry-leading accuracy.',
  },
  {
    icon: Shield,
    title: 'Secure Processing',
    description: 'Your photos are processed securely and never stored longer than necessary.',
  },
  {
    icon: Sparkles,
    title: 'Smart Suggestions',
    description: 'AI suggests descriptions and pricing based on your history and industry standards.',
  },
];

const useCases = [
  'Material receipts and delivery slips',
  'Completed job site photos',
  'Handwritten time sheets',
  'Work orders and change orders',
  'Supplier invoices for cost-plus billing',
  'Equipment rental receipts',
];

export default function SnapToInvoicePage() {
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
                  <Camera className="w-8 h-8 text-[#9FE870]" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
                  Snap to Invoice
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Transform any photo into a professional invoice in seconds. No typing, no templates, no hassle. Just snap and send.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
                  >
                    Try It Free
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[#2d2d44] transition-all"
                  >
                    Watch Demo
                  </Link>
                </div>
              </div>
              <div className="flex-1">
                <div className="aspect-square bg-[#9FE870]/10 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-32 h-32 text-[#9FE870]/50 mx-auto mb-4" />
                    <p className="text-gray-500">Interactive demo</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Three simple steps to go from job site to invoice.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="w-16 h-16 bg-[#9FE870] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-[#1a1a2e]">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#1a1a2e] mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 bg-[#9FE870]/10 px-6 py-3 rounded-full">
                <Zap className="w-5 h-5 text-[#9FE870]" />
                <span className="text-[#1a1a2e] font-medium">Average time: 5 seconds from photo to invoice</span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#1a1a2e] mb-4">Why Subcontractors Love It</h2>
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

        {/* Use Cases */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-12 items-center">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-[#1a1a2e] mb-6">
                  Works With Everything
                </h2>
                <p className="text-gray-600 mb-8">
                  Our AI is trained to understand all types of construction and trade documents. Snap a photo of:
                </p>
                <ul className="space-y-4">
                  {useCases.map((useCase) => (
                    <li key={useCase} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#9FE870]/20 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-[#9FE870]" />
                      </div>
                      <span className="text-gray-700">{useCase}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1">
                <div className="bg-gray-100 rounded-2xl p-8">
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#9FE870]" />
                        <span className="font-medium">Material_Receipt.jpg</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Converted to Invoice #1234</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#9FE870]" />
                        <span className="font-medium">Job_Site_Photo.jpg</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Converted to Invoice #1235</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#9FE870]" />
                        <span className="font-medium">Timesheet_Notes.jpg</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">Converted to Invoice #1236</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#9FE870]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">
              Stop typing. Start snapping.
            </h2>
            <p className="text-xl text-[#1a1a2e]/70 mb-8">
              Try Snap to Invoice free for 14 days. No credit card required.
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
