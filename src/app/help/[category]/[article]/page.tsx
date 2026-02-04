'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, ThumbsUp, ThumbsDown, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// Article database
const articles: Record<string, Record<string, { title: string; content: string; relatedArticles: string[] }>> = {
  'getting-started': {
    'creating-your-first-invoice': {
      title: 'Creating Your First Invoice',
      content: `
## Getting Started with Invoicing

Creating your first invoice in SubPaid is quick and easy. Follow these steps to get started.

### Step 1: Navigate to Invoices

From your dashboard, click on "Invoices" in the left sidebar, then click the "New Invoice" button.

### Step 2: Select a Client

Choose an existing client from the dropdown, or click "Add New Client" to create a new one.

### Step 3: Add Line Items

Add your services or products by filling in:
- Description of the work
- Quantity
- Rate per unit

The total will calculate automatically.

### Step 4: Set Payment Terms

Choose your due date and payment terms. We recommend Net 15 or Net 30 for most clients.

### Step 5: Review and Send

Preview your invoice, make any final edits, then click "Send" to email it directly to your client.

### Pro Tip: Use Snap to Invoice

For even faster invoicing, try our Snap to Invoice feature! Just take a photo of your completed work, materials receipt, or notes, and our AI will create the invoice automatically.
      `,
      relatedArticles: ['setting-up-your-account', 'using-snap-to-invoice'],
    },
    'setting-up-your-account': {
      title: 'Setting Up Your Account',
      content: `
## Account Setup Guide

Welcome to SubPaid! Let's get your account set up so you can start getting paid faster.

### Step 1: Complete Your Profile

Add your business information:
- Business name
- Address
- Phone number
- Email
- Logo (optional but recommended)

### Step 2: Connect Your Bank Account

Link your bank account or Stripe to receive payments directly. This is required to accept online payments.

### Step 3: Add Your Clients

Import existing clients or add them manually. You can add:
- Company name
- Contact person
- Email and phone
- Billing address

### Step 4: Customize Invoice Settings

Set your default payment terms, invoice numbering, and branding preferences.

### Step 5: Explore Features

Take some time to explore our AI features:
- Snap to Invoice
- SAM Voice Agent
- Payment Prophet
      `,
      relatedArticles: ['creating-your-first-invoice', 'connecting-payment-methods'],
    },
  },
  'invoicing': {
    'using-snap-to-invoice': {
      title: 'Using Snap to Invoice',
      content: `
## Snap to Invoice Guide

Snap to Invoice uses AI to convert photos into professional invoices in seconds.

### What You Can Photograph

- Material receipts
- Completed work
- Handwritten notes
- Work orders
- Delivery slips

### How to Use

1. Open the Snap to Invoice feature from your dashboard
2. Take a photo or upload an image
3. Our AI will extract all relevant information
4. Review and edit the generated invoice
5. Send to your client

### Tips for Best Results

- Ensure good lighting
- Capture the entire document
- Keep the image in focus
- Use a plain background when possible

### Accuracy

Our AI has a 99% accuracy rate on text extraction. Always review the generated invoice before sending.
      `,
      relatedArticles: ['creating-your-first-invoice', 'customizing-invoice-templates'],
    },
  },
  'voice-agent': {
    'how-sam-works': {
      title: 'How SAM Works',
      content: `
## Understanding SAM Voice Agent

SAM is your AI assistant that makes payment collection calls on your behalf.

### How It Works

1. SAM monitors your overdue invoices
2. When triggered, SAM calls your client
3. SAM has a natural conversation about the outstanding invoice
4. SAM reports back with the outcome

### What SAM Says

SAM introduces itself as calling on your behalf, mentions the specific invoice, and professionally requests payment information.

### Customization Options

- Call timing preferences
- Tone (friendly, professional, firm)
- Follow-up frequency
- Client-specific rules

### Compliance

SAM is fully compliant with TCPA, FDCPA, and other regulations. Calls are made during appropriate hours with proper identification.
      `,
      relatedArticles: ['configuring-call-settings', 'reviewing-call-recordings'],
    },
  },
};

const categoryNames: Record<string, string> = {
  'getting-started': 'Getting Started',
  'invoicing': 'Invoicing',
  'voice-agent': 'SAM Voice Agent',
  'payment-prophet': 'Payment Prophet',
  'account-billing': 'Account & Billing',
};

export default function HelpArticlePage() {
  const params = useParams();
  const category = params.category as string;
  const articleSlug = params.article as string;

  const categoryArticles = articles[category];
  const article = categoryArticles?.[articleSlug];

  if (!article) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">Sorry, we couldn&apos;t find this help article.</p>
            <Link href="/help" className="text-[#54A0FF] hover:underline">
              Back to Help Center
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
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <Link href="/help" className="hover:text-[#54A0FF]">Help Center</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/help" className="hover:text-[#54A0FF]">{categoryNames[category] || category}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-[#1a1a2e]">{article.title}</span>
          </div>

          {/* Article */}
          <article className="bg-white rounded-xl border border-gray-200 p-8 md:p-12">
            <h1 className="text-3xl font-bold text-[#1a1a2e] mb-8">{article.title}</h1>

            <div className="prose prose-lg max-w-none prose-headings:text-[#1a1a2e] prose-a:text-[#54A0FF]">
              {article.content.split('\n').map((line, index) => {
                if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{line.replace('## ', '')}</h2>;
                }
                if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-xl font-semibold mt-6 mb-3">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('- ')) {
                  return <li key={index} className="ml-4">{line.replace('- ', '')}</li>;
                }
                if (line.trim()) {
                  return <p key={index} className="text-gray-600 mb-4">{line}</p>;
                }
                return null;
              })}
            </div>
          </article>

          {/* Feedback */}
          <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6 text-center">
            <p className="text-gray-600 mb-4">Was this article helpful?</p>
            <div className="flex justify-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#9FE870]/20 transition-colors">
                <ThumbsUp className="w-5 h-5" /> Yes
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-red-50 transition-colors">
                <ThumbsDown className="w-5 h-5" /> No
              </button>
            </div>
          </div>

          {/* Related Articles */}
          {article.relatedArticles && article.relatedArticles.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-bold text-[#1a1a2e] mb-4">Related Articles</h2>
              <div className="space-y-2">
                {article.relatedArticles.map((slug) => {
                  // Find the article across all categories
                  for (const [cat, catArticles] of Object.entries(articles)) {
                    if (catArticles[slug]) {
                      return (
                        <Link
                          key={slug}
                          href={`/help/${cat}/${slug}`}
                          className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#9FE870] transition-colors"
                        >
                          <BookOpen className="w-5 h-5 text-gray-400" />
                          <span className="font-medium text-[#1a1a2e]">{catArticles[slug].title}</span>
                        </Link>
                      );
                    }
                  }
                  return null;
                })}
              </div>
            </div>
          )}

          {/* Back Link */}
          <div className="mt-8">
            <Link href="/help" className="inline-flex items-center gap-2 text-[#54A0FF] hover:underline">
              <ArrowLeft className="w-4 h-4" /> Back to Help Center
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
