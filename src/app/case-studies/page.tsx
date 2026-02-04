import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Clock, DollarSign, Quote } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Case Studies - SubPaid',
  description: 'See how subcontractors are getting paid faster with SubPaid. Real results from real customers.',
  alternates: {
    canonical: 'https://www.subpaid.com/case-studies',
  },
};

const caseStudies = [
  {
    company: 'Rodriguez Electric',
    industry: 'Electrical',
    location: 'Phoenix, AZ',
    employees: '12',
    logo: '/logos/rodriguez.png',
    quote: 'SubPaid cut my invoice collection time from 2 weeks to 2 days. The voice agent is a game-changer.',
    author: 'Mike Rodriguez',
    role: 'Owner',
    image: '/case-studies/mike.jpg',
    results: [
      { metric: 'Faster Payments', value: '10 days', icon: Clock },
      { metric: 'Revenue Increase', value: '23%', icon: TrendingUp },
      { metric: 'Time Saved', value: '15 hrs/mo', icon: Clock },
    ],
    challenge: 'Mike spent 10+ hours weekly creating invoices and chasing payments. Cash flow was unpredictable.',
    solution: 'Implemented Snap to Invoice and SAM Voice Agent to automate the entire invoicing and collection process.',
    featured: true,
  },
  {
    company: 'Chen Construction',
    industry: 'General Contractor',
    location: 'Los Angeles, CA',
    employees: '25',
    logo: '/logos/chen.png',
    quote: 'I used to spend hours creating invoices. Now I just snap a photo and I\'m done. More time on the job site.',
    author: 'Sarah Chen',
    role: 'General Contractor',
    image: '/case-studies/sarah.jpg',
    results: [
      { metric: 'Invoice Creation', value: '90% faster', icon: Clock },
      { metric: 'Outstanding AR', value: '-45%', icon: DollarSign },
      { metric: 'Cash Flow Visibility', value: '30 days', icon: TrendingUp },
    ],
    challenge: 'Managing invoices for multiple projects with different billing requirements was overwhelming.',
    solution: 'Used Snap to Invoice for quick billing and Payment Prophet to forecast cash flow across projects.',
    featured: false,
  },
  {
    company: 'Wilson Plumbing Co.',
    industry: 'Plumbing',
    location: 'Austin, TX',
    employees: '8',
    logo: '/logos/wilson.png',
    quote: 'The payment predictions are scary accurate. I can finally plan my cash flow with confidence.',
    author: 'James Wilson',
    role: 'Owner',
    image: '/case-studies/james.jpg',
    results: [
      { metric: 'Prediction Accuracy', value: '94%', icon: TrendingUp },
      { metric: 'Late Payments', value: '-60%', icon: Clock },
      { metric: 'Collection Rate', value: '98%', icon: DollarSign },
    ],
    challenge: 'Unpredictable payment timing made it difficult to manage expenses and payroll.',
    solution: 'Leveraged Payment Prophet for cash flow forecasting and SAM for proactive payment collection.',
    featured: false,
  },
];

const stats = [
  { value: '500+', label: 'Active Customers' },
  { value: '14 days', label: 'Avg. Faster Payment' },
  { value: '$50M+', label: 'Invoices Processed' },
  { value: '4.9/5', label: 'Customer Rating' },
];

export default function CaseStudiesPage() {
  const featuredStudy = caseStudies.find((s) => s.featured);
  const otherStudies = caseStudies.filter((s) => !s.featured);

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Customer Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See how subcontractors across the country are transforming their businesses with SubPaid.
            </p>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-8 bg-[#1a1a2e]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold text-[#9FE870]">{stat.value}</div>
                  <div className="text-white/70 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Case Study */}
        {featuredStudy && (
          <section className="py-20 bg-white">
            <div className="max-w-6xl mx-auto px-4">
              <span className="inline-block px-3 py-1 bg-[#9FE870] text-[#1a1a2e] rounded-full text-xs font-bold mb-8">
                FEATURED STORY
              </span>

              <div className="flex flex-col lg:flex-row gap-12">
                <div className="lg:w-1/2">
                  <h2 className="text-3xl font-bold text-[#1a1a2e] mb-2">{featuredStudy.company}</h2>
                  <p className="text-gray-500 mb-6">
                    {featuredStudy.industry} | {featuredStudy.location} | {featuredStudy.employees} employees
                  </p>

                  <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <Quote className="w-8 h-8 text-[#9FE870] mb-4" />
                    <p className="text-lg text-[#1a1a2e] italic mb-4">&quot;{featuredStudy.quote}&quot;</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full" />
                      <div>
                        <p className="font-semibold text-[#1a1a2e]">{featuredStudy.author}</p>
                        <p className="text-sm text-gray-500">{featuredStudy.role}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-[#1a1a2e] mb-2">The Challenge</h3>
                      <p className="text-gray-600">{featuredStudy.challenge}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#1a1a2e] mb-2">The Solution</h3>
                      <p className="text-gray-600">{featuredStudy.solution}</p>
                    </div>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="bg-gray-100 rounded-xl h-64 mb-8 flex items-center justify-center">
                    <span className="text-gray-400">Customer Photo</span>
                  </div>

                  <h3 className="font-semibold text-[#1a1a2e] mb-4">Results</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {featuredStudy.results.map((result) => (
                      <div key={result.metric} className="bg-[#9FE870]/10 rounded-xl p-4 text-center">
                        <result.icon className="w-6 h-6 text-[#9FE870] mx-auto mb-2" />
                        <div className="text-2xl font-bold text-[#1a1a2e]">{result.value}</div>
                        <div className="text-xs text-gray-600">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Case Studies */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">More Success Stories</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {otherStudies.map((study) => (
                <div key={study.company} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <div className="bg-gray-100 h-48 flex items-center justify-center">
                    <span className="text-gray-400">Customer Photo</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1a1a2e] mb-1">{study.company}</h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {study.industry} | {study.location}
                    </p>

                    <p className="text-gray-600 italic mb-4">&quot;{study.quote}&quot;</p>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gray-200 rounded-full" />
                      <div>
                        <p className="font-medium text-[#1a1a2e] text-sm">{study.author}</p>
                        <p className="text-xs text-gray-500">{study.role}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                      {study.results.map((result) => (
                        <div key={result.metric} className="text-center">
                          <div className="text-lg font-bold text-[#9FE870]">{result.value}</div>
                          <div className="text-xs text-gray-500">{result.metric}</div>
                        </div>
                      ))}
                    </div>

                    <Link
                      href="#"
                      className="inline-flex items-center gap-2 text-[#54A0FF] font-medium hover:gap-3 transition-all"
                    >
                      Read Full Story
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to write your success story?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join 500+ subcontractors who get paid faster with SubPaid.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all"
              >
                Book a Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
