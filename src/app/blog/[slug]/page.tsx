import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, Share2, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Blog post database
const posts: Record<string, {
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  category: string;
}> = {
  'how-ai-is-transforming-invoicing': {
    title: 'How AI is Transforming Invoicing for Subcontractors',
    excerpt: 'Discover how artificial intelligence is revolutionizing the way subcontractors create invoices, collect payments, and manage their cash flow.',
    date: 'February 1, 2026',
    readTime: '8 min read',
    author: 'Michael Chen',
    authorRole: 'CEO & Co-Founder',
    category: 'Industry Trends',
    content: `
The invoicing landscape for subcontractors is undergoing a dramatic transformation, driven by advances in artificial intelligence. What once required hours of manual data entry and follow-up can now be accomplished in seconds.

## The Old Way vs. The New Way

Traditional invoicing for subcontractors typically involved:
- Manually typing line items from receipts and work orders
- Calculating totals by hand or in spreadsheets
- Sending invoices via mail or email
- Making uncomfortable phone calls to chase payments
- Guessing when payments might arrive

Today's AI-powered solutions handle all of this automatically.

## Photo-Based Invoice Creation

One of the most significant innovations is the ability to create invoices from photos. Simply snap a picture of your materials receipt, completed work, or even handwritten notes, and AI extracts all the relevant information to create a professional invoice.

This technology uses computer vision and natural language processing to:
- Identify item descriptions
- Extract quantities and prices
- Calculate totals automatically
- Format everything professionally

## AI Voice Assistants for Collections

Perhaps even more revolutionary is the use of AI voice assistants for payment collection. These systems can:
- Call clients automatically when invoices become overdue
- Have natural, professional conversations
- Record outcomes and schedule follow-ups
- Maintain positive client relationships

## Predictive Analytics for Cash Flow

AI can now analyze payment patterns to predict when you'll receive payment from each client. This helps with:
- Planning expenses and payroll
- Identifying clients who may need extra attention
- Making informed decisions about new projects

## The Bottom Line

Subcontractors who embrace AI-powered invoicing tools are getting paid faster, spending less time on administrative tasks, and making better business decisions. The technology is here today, and it's more accessible than ever.
    `,
  },
  '5-tips-to-get-paid-faster': {
    title: '5 Tips to Get Paid Faster as a Subcontractor',
    excerpt: 'Practical strategies to reduce payment delays and improve your cash flow.',
    date: 'January 28, 2026',
    readTime: '5 min read',
    author: 'Emily Thompson',
    authorRole: 'Head of Customer Success',
    category: 'Best Practices',
    content: `
Late payments are one of the biggest challenges facing subcontractors today. Here are five proven strategies to get paid faster.

## 1. Invoice Immediately

Don't wait until the end of the week or month to send invoices. The sooner you invoice, the sooner you get paid. With tools like Snap to Invoice, you can create and send invoices from the job site in seconds.

## 2. Be Clear About Payment Terms

Make sure your payment terms are crystal clear from the start. Include them in your contracts and on every invoice. Consider offering early payment discounts to incentivize faster payment.

## 3. Follow Up Consistently

The squeaky wheel gets the grease. Set up automatic reminders for overdue invoices, or use an AI voice assistant to make follow-up calls on your behalf.

## 4. Make Payment Easy

Accept multiple payment methods including credit cards, ACH transfers, and online payments. The easier you make it to pay, the faster you'll get paid.

## 5. Know Your Clients

Use payment prediction tools to understand each client's payment patterns. For clients with poor payment histories, consider requiring deposits or progress payments.

## Bonus: Document Everything

Good documentation protects you and helps resolve disputes faster. Take photos of completed work, get sign-offs, and keep records of all communications.
    `,
  },
  'understanding-lien-rights': {
    title: 'Understanding Lien Rights: A Guide for Subcontractors',
    excerpt: 'Everything you need to know about protecting your payment rights on construction projects.',
    date: 'January 22, 2026',
    readTime: '10 min read',
    author: 'David Kim',
    authorRole: 'Head of Product',
    category: 'Legal',
    content: `
Lien rights are one of the most powerful tools subcontractors have to protect their right to payment. Here's what you need to know.

## What is a Mechanic's Lien?

A mechanic's lien is a legal claim against a property that secures payment for work performed or materials supplied. If you're not paid, you can potentially force the sale of the property to collect what you're owed.

## Key Steps to Protect Your Rights

### 1. Send Preliminary Notices

In most states, you must send a preliminary notice within a certain number of days of starting work. This notice preserves your right to file a lien later.

### 2. Track Your Deadlines

Lien rights have strict deadlines that vary by state. Missing a deadline can mean losing your rights entirely.

### 3. Document Your Work

Keep detailed records of:
- All work performed
- Materials supplied
- Dates and locations
- Communications with the client

### 4. File Your Lien on Time

If you're not paid, file your lien before the deadline expires. This typically must be done within a certain number of months after completing work.

## State Variations

Lien laws vary significantly by state. What works in California may not work in Texas. Always consult with a local attorney for specific guidance.

## Prevention is Better Than Cure

While lien rights are important, it's better to avoid payment problems in the first place. Use payment prediction tools, require deposits from new clients, and follow up quickly on overdue invoices.
    `,
  },
  'the-true-cost-of-late-payments': {
    title: 'The True Cost of Late Payments',
    excerpt: 'How delayed payments impact your business and what you can do about it.',
    date: 'January 15, 2026',
    readTime: '6 min read',
    author: 'Sarah Martinez',
    authorRole: 'CTO & Co-Founder',
    category: 'Finance',
    content: `
Late payments cost subcontractors far more than most realize. Let's break down the true impact.

## Direct Costs

### Interest and Financing
When payments are late, you may need to:
- Use credit lines to cover expenses
- Delay paying your own suppliers
- Miss out on early payment discounts

### Collection Efforts
Chasing payments takes time and money:
- Hours spent on phone calls and emails
- Potential legal fees
- Stress and frustration

## Indirect Costs

### Cash Flow Disruption
Poor cash flow affects your ability to:
- Pay employees on time
- Buy materials for new jobs
- Invest in equipment and growth

### Opportunity Cost
Time spent chasing payments is time you could spend:
- Bidding on new projects
- Building client relationships
- Growing your business

## The Numbers

Studies show that:
- The average subcontractor waits 83 days for payment
- 1 in 6 invoices are paid late
- Late payments cost small businesses over $3 trillion annually

## What You Can Do

1. Use automated invoicing and follow-up tools
2. Implement payment prediction to identify risks early
3. Consider requiring deposits from new clients
4. Build relationships with reliable payers
5. Know your lien rights and use them when necessary

The technology exists today to dramatically reduce late payments. The question is whether you're using it.
    `,
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return { title: 'Post Not Found - SubPaid Blog' };
  }

  return {
    title: `${post.title} - SubPaid Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts[slug];

  if (!post) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn&apos;t find this blog post.</p>
            <Link href="/blog" className="text-[#54A0FF] hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-12 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-4xl mx-auto px-4">
            <Link href="/blog" className="inline-flex items-center gap-2 text-[#54A0FF] hover:underline mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>
            <span className="inline-block px-3 py-1 bg-[#9FE870]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-500">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" /> {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" /> {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> {post.readTime}
              </span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <article className="prose prose-lg max-w-none">
              {post.content.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold text-[#1a1a2e] mt-8 mb-4">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold text-[#1a1a2e] mt-6 mb-3">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="text-gray-600 ml-4">{line.replace('- ', '')}</li>;
                }
                if (line.trim()) {
                  return <p key={index} className="text-gray-600 mb-4">{line}</p>;
                }
                return null;
              })}
            </article>

            {/* Author */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{post.author}</p>
                  <p className="text-gray-500">{post.authorRole}</p>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="mt-8 flex items-center gap-4">
              <span className="text-gray-500">Share this article:</span>
              <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-[#1a1a2e] mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(posts)
                .filter(([s]) => s !== slug)
                .slice(0, 2)
                .map(([postSlug, p]) => (
                  <Link
                    key={postSlug}
                    href={`/blog/${postSlug}`}
                    className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <span className="text-sm text-[#54A0FF] font-medium">{p.category}</span>
                    <h3 className="font-semibold text-[#1a1a2e] mt-2 mb-2">{p.title}</h3>
                    <p className="text-sm text-gray-600">{p.excerpt}</p>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
