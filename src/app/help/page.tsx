'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Book, MessageSquare, Video, FileText, ChevronRight, Mail, Phone, HelpCircle } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const categories = [
  {
    icon: Book,
    title: 'Getting Started',
    description: 'Learn the basics of SubPaid',
    articles: ['Creating your first invoice', 'Setting up your account', 'Importing clients', 'Connecting payment methods'],
  },
  {
    icon: FileText,
    title: 'Invoicing',
    description: 'Everything about invoices',
    articles: ['Creating invoices manually', 'Using Snap to Invoice', 'Customizing invoice templates', 'Sending and tracking invoices'],
  },
  {
    icon: MessageSquare,
    title: 'SAM Voice Agent',
    description: 'AI-powered payment calls',
    articles: ['How SAM works', 'Configuring call settings', 'Reviewing call recordings', 'SAM best practices'],
  },
  {
    icon: HelpCircle,
    title: 'Payment Prophet',
    description: 'Prediction and forecasting',
    articles: ['Understanding predictions', 'Cash flow forecasting', 'Client scoring explained', 'Improving prediction accuracy'],
  },
  {
    icon: Video,
    title: 'Account & Billing',
    description: 'Manage your subscription',
    articles: ['Upgrading your plan', 'Managing team members', 'Billing and invoices', 'Cancellation policy'],
  },
];

const popularArticles = [
  { title: 'How to use Snap to Invoice', category: 'Getting Started' },
  { title: 'Setting up SAM Voice Agent', category: 'SAM Voice Agent' },
  { title: 'Understanding Payment Prophet predictions', category: 'Payment Prophet' },
  { title: 'Customizing invoice templates', category: 'Invoicing' },
  { title: 'Connecting Stripe for payments', category: 'Getting Started' },
];

const faqs = [
  {
    question: 'How does the free trial work?',
    answer: 'You get 14 days of full access to all Pro features. No credit card required. At the end of the trial, you can choose to subscribe or continue with limited features.',
  },
  {
    question: 'Can I import my existing invoices?',
    answer: 'Yes! SubPaid supports importing invoices from QuickBooks, FreshBooks, and CSV files. Contact support for help with migration.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Absolutely. We use 256-bit encryption, are SOC 2 compliant, and never share your data with third parties. See our Security page for details.',
  },
  {
    question: 'How accurate is Payment Prophet?',
    answer: 'Payment Prophet has an average accuracy of 91% on payment date predictions. Accuracy improves over time as it learns from your specific client patterns.',
  },
  {
    question: 'Can I use SubPaid on mobile?',
    answer: 'Yes! SubPaid works on any device with a web browser. We also have dedicated iOS and Android apps for Snap to Invoice on the go.',
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              How can we help?
            </h1>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent text-lg"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <div
                  key={category.title}
                  className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-[#9FE870]/20 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="w-6 h-6 text-[#9FE870]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#1a1a2e] mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{category.description}</p>
                  <ul className="space-y-2">
                    {category.articles.map((article) => (
                      <li key={article}>
                        <a
                          href="#"
                          className="text-sm text-gray-600 hover:text-[#54A0FF] flex items-center gap-1"
                        >
                          <ChevronRight className="w-4 h-4" />
                          {article}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Popular Articles</h2>
            <div className="bg-white rounded-xl divide-y">
              {popularArticles.map((article) => (
                <a
                  key={article.title}
                  href="#"
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-[#1a1a2e]">{article.title}</h3>
                    <p className="text-sm text-gray-500">{article.category}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-medium text-[#1a1a2e]">{faq.question}</span>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === index ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still need help?</h2>
            <p className="text-white/70 mb-8">
              Our support team is available Monday through Friday, 9am-6pm PST.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@subpaid.com"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <a
                href="tel:1-800-782-7243"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-all"
              >
                <Phone className="w-5 h-5" />
                Call 1-800-SUBPAID
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
