'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "How does Snap to Invoice work?",
    answer: "Simply take a photo of your completed work, materials receipt, or even handwritten notes. Our AI instantly extracts all relevant information - client details, line items, quantities, and prices - and generates a professional invoice in under 5 seconds. You can review and edit before sending."
  },
  {
    question: "What is SAM Voice Agent?",
    answer: "SAM (SubPaid Accounts Manager) is our AI-powered voice agent that automatically calls your clients to follow up on unpaid invoices. SAM sounds natural, handles objections professionally, and reports back on every conversation. It's like having a dedicated collections specialist working 24/7."
  },
  {
    question: "How accurate is Payment Prophet?",
    answer: "Payment Prophet uses machine learning trained on millions of payment patterns to predict when you'll get paid. Our predictions are 94% accurate within a 3-day window. It analyzes factors like client payment history, invoice amount, industry, and day of week to give you reliable cash flow forecasts."
  },
  {
    question: "Can I try SubPaid for free?",
    answer: "Yes! We offer a 14-day free trial with full access to all features including Snap to Invoice, SAM Voice Agent, and Payment Prophet. No credit card required to start. You can upgrade to a paid plan anytime during or after your trial."
  },
  {
    question: "Does SubPaid integrate with my accounting software?",
    answer: "SubPaid integrates seamlessly with QuickBooks, Xero, FreshBooks, and Wave. We also connect with payment processors like Stripe, PayPal, and Square. Your invoices and payments sync automatically, eliminating double data entry."
  },
  {
    question: "How secure is my data?",
    answer: "We take security seriously. SubPaid is SOC 2 Type II compliant and uses 256-bit encryption for all data transmission and storage. We never share your data with third parties, and you can export or delete your data at any time."
  },
  {
    question: "What types of contractors use SubPaid?",
    answer: "SubPaid is built specifically for subcontractors and trade professionals including electricians, plumbers, HVAC technicians, roofers, painters, drywall contractors, and general contractors. Any trade professional who needs to invoice for their work can benefit."
  },
  {
    question: "Can I customize my invoices with my logo and branding?",
    answer: "Absolutely! All plans allow you to add your company logo, customize colors, and include your payment terms. Pro and Business plans include additional customization options like custom email templates and branded client portals."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-[#D4EBF2] to-[#E8F4F8]">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#FF9F43]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#D4EBF2] overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#E8F4F8] transition-colors"
                aria-expanded={openIndex === index}
              >
                <span className="font-semibold text-[#1a1a2e] pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 text-[#54A0FF] font-semibold hover:underline"
          >
            <HelpCircle className="w-5 h-5" />
            Contact our support team
          </a>
        </div>
      </div>
    </section>
  );
}
