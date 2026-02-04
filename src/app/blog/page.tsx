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
  title: 'How AI is Transforming Invoicing for Subcontractors',
  excerpt: 'Discover how artificial intelligence is revolutionizing the way subcontractors create invoices, collect payments, and manage their cash flow.',
  date: 'February 1, 2026',
  readTime: '8 min read',
  author: 'Michael Chen',
  category: 'Industry Trends',
  image: '/blog/ai-invoicing.jpg',
};

const posts = [
  {
    title: '5 Tips to Get Paid Faster as a Subcontractor',
    excerpt: 'Practical strategies to reduce payment delays and improve your cash flow.',
    date: 'January 28, 2026',
    readTime: '5 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
  },
  {
    title: 'Understanding Lien Rights: A Guide for Subcontractors',
    excerpt: 'Everything you need to know about protecting your payment rights on construction projects.',
    date: 'January 22, 2026',
    readTime: '10 min read',
    author: 'David Kim',
    category: 'Legal',
  },
  {
    title: 'The True Cost of Late Payments',
    excerpt: 'How delayed payments impact your business and what you can do about it.',
    date: 'January 15, 2026',
    readTime: '6 min read',
    author: 'Sarah Martinez',
    category: 'Finance',
  },
  {
    title: 'Snap to Invoice: Behind the Technology',
    excerpt: 'A deep dive into how our AI converts photos to professional invoices.',
    date: 'January 8, 2026',
    readTime: '7 min read',
    author: 'Sarah Martinez',
    category: 'Product',
  },
  {
    title: 'Building Client Relationships That Pay',
    excerpt: 'How to maintain positive client relationships while ensuring timely payments.',
    date: 'January 2, 2026',
    readTime: '5 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
  },
  {
    title: '2025 Construction Industry Payment Report',
    excerpt: 'Key findings from our annual survey of payment trends in the construction industry.',
    date: 'December 20, 2025',
    readTime: '12 min read',
    author: 'Michael Chen',
    category: 'Research',
  },
];

const categories = [
  'All',
  'Best Practices',
  'Industry Trends',
  'Product',
  'Finance',
  'Legal',
  'Research',
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
                    href="#"
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
                    <Link href="#">{post.title}</Link>
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
