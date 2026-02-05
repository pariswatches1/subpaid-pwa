import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog - SubPaid',
  description: 'Tips, insights, and news for subcontractors. Learn about invoicing best practices, payment collection, and running a successful contracting business.',
  alternates: {
    canonical: 'https://www.subpaid.com/blog',
  },
};

const featuredPost = {
  title: 'The Ultimate Cash Flow Management Guide for Subcontractors in 2026',
  excerpt: 'Master the art of cash flow management with proven strategies that keep your contracting business solvent, profitable, and ready for growth.',
  date: 'February 4, 2026',
  readTime: '12 min read',
  author: 'Michael Chen',
  category: 'Finance',
  slug: 'subcontractor-cash-flow-management-guide',
};

const posts = [
  {
    title: 'How AI is Transforming Invoicing for Subcontractors',
    excerpt: 'Discover how AI is revolutionizing how subcontractors create invoices, collect payments, and manage cash flow.',
    date: 'February 1, 2026',
    readTime: '8 min read',
    author: 'Michael Chen',
    category: 'Industry Trends',
    slug: 'how-ai-is-transforming-invoicing',
  },
  {
    title: 'How to Write a Construction Invoice That Gets Paid Fast',
    excerpt: 'A step-by-step guide to creating professional construction invoices that minimize disputes and accelerate payment.',
    date: 'February 3, 2026',
    readTime: '10 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'how-to-write-construction-invoice',
  },
  {
    title: '7 Red Flags Your General Contractor Won\'t Pay on Time',
    excerpt: 'Learn to spot the warning signs of a slow-paying GC before you sign the contract.',
    date: 'February 2, 2026',
    readTime: '8 min read',
    author: 'David Kim',
    category: 'Best Practices',
    slug: 'general-contractor-payment-problems',
  },
  {
    title: 'Construction Payment Terms Explained: Net-30, Retainage & More',
    excerpt: 'Decode the payment language in your construction contracts so you know exactly when you\'ll get paid.',
    date: 'January 31, 2026',
    readTime: '11 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-payment-terms-explained',
  },
  {
    title: 'Best Invoicing Apps for Subcontractors: 2026 Comparison Guide',
    excerpt: 'We compare the top invoicing solutions designed for construction subcontractors.',
    date: 'January 30, 2026',
    readTime: '14 min read',
    author: 'Sarah Martinez',
    category: 'Product',
    slug: 'best-invoicing-apps-subcontractors',
  },
  {
    title: 'How to File a Mechanics Lien: Step-by-Step Guide for Every State',
    excerpt: 'A practical walkthrough of the mechanics lien process, including deadlines and common mistakes.',
    date: 'January 29, 2026',
    readTime: '15 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'mechanics-lien-filing-guide',
  },
  {
    title: '5 Tips to Get Paid Faster as a Subcontractor',
    excerpt: 'Practical strategies to reduce payment delays and improve your cash flow.',
    date: 'January 28, 2026',
    readTime: '5 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: '5-tips-to-get-paid-faster',
  },
  {
    title: 'What Profit Margin Should a Subcontractor Aim For?',
    excerpt: 'Understand industry benchmarks, calculate your true costs, and learn strategies to protect your margins.',
    date: 'January 27, 2026',
    readTime: '9 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'subcontractor-profit-margin-guide',
  },
  {
    title: 'AIA Billing for Subcontractors: The Complete G702 & G703 Guide',
    excerpt: 'Master the AIA billing process used on commercial construction projects.',
    date: 'January 26, 2026',
    readTime: '13 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'aia-billing-guide-subcontractors',
  },
  {
    title: '15 Tax Deductions Every Subcontractor Should Know About',
    excerpt: 'Don\'t leave money on the table. These commonly overlooked deductions can save thousands.',
    date: 'January 25, 2026',
    readTime: '10 min read',
    author: 'Sarah Martinez',
    category: 'Finance',
    slug: 'construction-business-tax-deductions',
  },
  {
    title: 'How to Bid on Construction Jobs and Win',
    excerpt: 'Win more profitable projects with a proven bidding strategy that balances pricing with margins.',
    date: 'January 24, 2026',
    readTime: '11 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'how-to-bid-construction-jobs',
  },
  {
    title: 'How to Handle Payment Disputes Without Burning Bridges',
    excerpt: 'Resolve payment disagreements professionally while protecting your rights.',
    date: 'January 23, 2026',
    readTime: '8 min read',
    author: 'Emily Thompson',
    category: 'Legal',
    slug: 'construction-payment-disputes-resolution',
  },
  {
    title: 'Understanding Lien Rights: A Guide for Subcontractors',
    excerpt: 'Everything you need to know about protecting your payment rights on construction projects.',
    date: 'January 22, 2026',
    readTime: '10 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'understanding-lien-rights',
  },
  {
    title: 'How to Grow Your Subcontracting Business from $500K to $2M',
    excerpt: 'A roadmap for scaling your company from hiring first employees to building systems that run without you.',
    date: 'January 21, 2026',
    readTime: '14 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'grow-subcontracting-business',
  },
  {
    title: 'Workers Comp Insurance for Contractors: What You Need to Know',
    excerpt: 'Navigate workers compensation requirements, reduce premiums, and protect your business.',
    date: 'January 20, 2026',
    readTime: '9 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'workers-comp-insurance-contractors',
  },
  {
    title: 'Invoice Factoring for Subcontractors: Is It Worth the Fee?',
    excerpt: 'Understand how construction invoice factoring works and when it makes smart financial sense.',
    date: 'January 19, 2026',
    readTime: '8 min read',
    author: 'Sarah Martinez',
    category: 'Finance',
    slug: 'invoice-factoring-construction',
  },
  {
    title: 'How to Get Prequalified Faster: Tips for Winning GC Approval',
    excerpt: 'Streamline your prequalification process and make a strong first impression on GCs.',
    date: 'January 18, 2026',
    readTime: '7 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'prequalification-tips-subcontractors',
  },
  {
    title: '10 Proven Ways to Reduce Payment Delays in Construction',
    excerpt: 'Actionable strategies subcontractors are using right now to get paid faster.',
    date: 'January 17, 2026',
    readTime: '9 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'reduce-construction-payment-delays',
  },
  {
    title: 'Time Tracking Tips That Save Subcontractors Thousands',
    excerpt: 'How accurate time tracking impacts your bottom line, from better bids to reduced labor costs.',
    date: 'January 16, 2026',
    readTime: '7 min read',
    author: 'Sarah Martinez',
    category: 'Best Practices',
    slug: 'construction-scheduling-tips',
  },
  {
    title: 'The True Cost of Late Payments',
    excerpt: 'How delayed payments impact your business and what you can do about it.',
    date: 'January 15, 2026',
    readTime: '6 min read',
    author: 'Sarah Martinez',
    category: 'Finance',
    slug: 'the-true-cost-of-late-payments',
  },
  {
    title: 'Subcontractor vs. Employee: Classification Rules That Could Cost $100K+',
    excerpt: 'Understand the legal differences between subcontractors and employees before the IRS knocks.',
    date: 'January 14, 2026',
    readTime: '10 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'subcontractor-vs-employee',
  },
  {
    title: 'Building a Safety Program That Lowers Insurance and Wins Bids',
    excerpt: 'Create a safety program that protects workers, reduces costs, and makes your company competitive.',
    date: 'January 13, 2026',
    readTime: '8 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'construction-safety-program-guide',
  },
  {
    title: 'AI Voice Agents: The Future of Construction Payment Collections',
    excerpt: 'How AI-powered voice technology is replacing awkward collection calls and recovering more money.',
    date: 'January 12, 2026',
    readTime: '7 min read',
    author: 'Sarah Martinez',
    category: 'Industry Trends',
    slug: 'ai-voice-agents-construction-collections',
  },
  {
    title: 'Payment Prediction: Know When You\'ll Get Paid Before You Invoice',
    excerpt: 'How machine learning analyzes payment patterns to forecast your cash flow with 94% accuracy.',
    date: 'January 11, 2026',
    readTime: '6 min read',
    author: 'Michael Chen',
    category: 'Industry Trends',
    slug: 'payment-prediction-construction',
  },
];

const categories = [
  'All',
  'Best Practices',
  'Finance',
  'Legal',
  'Industry Trends',
  'Product',
];

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-4">
                SubPaid Blog
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Insights, tips, and news to help subcontractors get paid faster and grow their business.
              </p>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category === 'All'
                      ? 'bg-[#1a1a2e] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="bg-gradient-to-r from-[#9FE870]/10 to-[#54A0FF]/10 rounded-2xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-1/2 p-8 lg:p-12">
                  <span className="inline-block px-3 py-1 bg-[#9FE870] text-[#1a1a2e] rounded-full text-xs font-bold mb-4">
                    FEATURED
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{featuredPost.category}</span>
                  <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a2e] mb-4">
                    {featuredPost.title}
                  </h2>
                  <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 text-[#54A0FF] font-semibold hover:gap-3 transition-all"
                  >
                    Read Article
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="lg:w-1/2 bg-gray-200 min-h-[300px] flex items-center justify-center">
                  <span className="text-gray-400">Featured Image</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post.title} className="group">
                  <div className="bg-gray-100 rounded-xl h-48 mb-4 flex items-center justify-center">
                    <span className="text-gray-400">Image</span>
                  </div>
                  <span className="text-sm text-[#54A0FF] font-medium">{post.category}</span>
                  <h3 className="text-xl font-bold text-[#1a1a2e] mt-2 mb-3 group-hover:text-[#54A0FF] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="inline-flex items-center gap-2 bg-gray-100 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated
            </h2>
            <p className="text-white/70 mb-8">
              Get the latest invoicing tips and industry insights delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
              />
              <button
                type="submit"
                className="bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
            <p className="text-white/50 text-sm mt-4">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
