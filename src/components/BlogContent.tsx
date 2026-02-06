'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { BlogImage } from '@/components/BlogImage';

const featuredPost = {
  title: 'How to Get Paid Faster as a Subcontractor: 7 Proven Strategies',
  excerpt: 'Learn 7 proven strategies to get paid faster as a subcontractor. From same-day invoicing to automated follow-ups, stop chasing payments for good.',
  date: 'February 5, 2026',
  readTime: '12 min read',
  author: 'Michael Chen',
  category: 'Best Practices',
  slug: 'how-to-get-paid-faster-as-a-subcontractor',
};

const allPosts = [
  {
    title: 'What to Do When a General Contractor Won\'t Pay You',
    excerpt: 'GC won\'t pay? Here\'s your step-by-step playbook — from demand letters to mechanics liens. Protect your rights and get the money you earned.',
    date: 'February 4, 2026',
    readTime: '14 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'general-contractor-wont-pay-subcontractor',
  },
  {
    title: 'How to Write a Construction Invoice That Gets Paid Fast',
    excerpt: 'Step-by-step guide to writing a professional construction invoice. Includes what to include, common mistakes, and a faster way using AI.',
    date: 'February 3, 2026',
    readTime: '10 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'how-to-write-a-construction-invoice',
  },
  {
    title: 'Free Contractor Invoice Templates for Every Trade',
    excerpt: 'Download free invoice templates for electricians, plumbers, HVAC techs, roofers, and more. Customizable PDF, Word, and Excel formats.',
    date: 'February 2, 2026',
    readTime: '8 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'free-contractor-invoice-templates',
  },
  {
    title: 'How to Check if a Contractor is Licensed: State-by-State Guide',
    excerpt: 'How to verify a contractor\'s license in all 50 states. Includes direct links to state licensing boards and what red flags to look for.',
    date: 'February 1, 2026',
    readTime: '15 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'how-to-check-contractor-license',
  },
  {
    title: 'The Ultimate Cash Flow Management Guide for Subcontractors in 2026',
    excerpt: 'Master the art of cash flow management with proven strategies that keep your contracting business solvent, profitable, and ready for growth.',
    date: 'January 31, 2026',
    readTime: '12 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'subcontractor-cash-flow-management-guide',
  },
  {
    title: 'How AI is Transforming Invoicing for Subcontractors',
    excerpt: 'Discover how AI is revolutionizing how subcontractors create invoices, collect payments, and manage cash flow.',
    date: 'January 30, 2026',
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
  // 15 New SEO-Optimized Blog Posts
  {
    title: 'Construction Retainage Explained: What Subcontractors Need to Know',
    excerpt: 'What is retainage in construction? Learn how it works, state laws, and strategies to get your withheld money released faster.',
    date: 'January 10, 2026',
    readTime: '11 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-retainage-explained',
  },
  {
    title: 'How to Start a Subcontracting Business: Complete 2026 Guide',
    excerpt: 'Step-by-step guide to starting your own subcontracting business. From licenses to insurance to landing your first contract.',
    date: 'January 9, 2026',
    readTime: '16 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'how-to-start-subcontracting-business',
  },
  {
    title: '10 Construction Contract Red Flags That Cost Subcontractors Thousands',
    excerpt: 'Learn to spot dangerous contract clauses before signing. Pay-when-paid, indemnification, and other terms that can sink your business.',
    date: 'January 8, 2026',
    readTime: '13 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-contract-red-flags',
  },
  {
    title: 'Subcontractor Bonding Guide: Surety Bonds Explained',
    excerpt: 'Everything subcontractors need to know about surety bonds. Types, costs, how to qualify, and when you need them.',
    date: 'January 7, 2026',
    readTime: '12 min read',
    author: 'Emily Thompson',
    category: 'Legal',
    slug: 'subcontractor-bonding-guide',
  },
  {
    title: 'Prevailing Wage Requirements for Contractors: State-by-State Guide',
    excerpt: 'Navigate prevailing wage laws for government construction projects. Compliance tips, certified payroll, and avoiding penalties.',
    date: 'January 6, 2026',
    readTime: '14 min read',
    author: 'Sarah Martinez',
    category: 'Legal',
    slug: 'prevailing-wage-requirements-contractors',
  },
  {
    title: 'Commercial vs. Residential Subcontracting: Which Is More Profitable?',
    excerpt: 'Compare commercial and residential subcontracting. Profit margins, payment terms, risks, and how to choose the right path.',
    date: 'January 5, 2026',
    readTime: '10 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'commercial-vs-residential-subcontracting',
  },
  {
    title: 'Subcontractor Insurance Requirements: Complete Coverage Guide',
    excerpt: 'What insurance do subcontractors need? General liability, workers comp, umbrella policies, and certificate requirements explained.',
    date: 'January 4, 2026',
    readTime: '11 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'subcontractor-insurance-requirements',
  },
  {
    title: 'How to Handle Construction Material Price Increases in Contracts',
    excerpt: 'Protect your margins when material costs spike. Escalation clauses, renegotiation strategies, and contract language that works.',
    date: 'January 3, 2026',
    readTime: '9 min read',
    author: 'Emily Thompson',
    category: 'Finance',
    slug: 'construction-material-price-increases',
  },
  {
    title: 'Construction Project Delays: Subcontractor Rights and Remedies',
    excerpt: 'When projects get delayed, who pays? Learn your rights for delay damages, acceleration costs, and schedule impacts.',
    date: 'January 2, 2026',
    readTime: '12 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-project-delays-subcontractor',
  },
  {
    title: 'Subcontractor Estimating Tips: Win More Bids Without Losing Money',
    excerpt: 'Master construction estimating. Takeoff best practices, markup strategies, and common mistakes that kill profit margins.',
    date: 'January 1, 2026',
    readTime: '13 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'subcontractor-estimating-tips',
  },
  {
    title: 'Construction Warranty Claims: A Subcontractor\'s Guide',
    excerpt: 'Handle warranty callbacks professionally. What\'s covered, time limits, documentation requirements, and protecting your business.',
    date: 'December 31, 2025',
    readTime: '10 min read',
    author: 'Emily Thompson',
    category: 'Legal',
    slug: 'construction-warranty-claims',
  },
  {
    title: 'Change Order Management for Subcontractors: Get Paid for Extra Work',
    excerpt: 'Don\'t work for free. Document changes, price them correctly, and get approval before doing any extra work.',
    date: 'December 30, 2025',
    readTime: '11 min read',
    author: 'Sarah Martinez',
    category: 'Best Practices',
    slug: 'subcontractor-change-order-management',
  },
  {
    title: 'Construction Lien Waiver Guide: Conditional vs. Unconditional',
    excerpt: 'Understand lien waivers before you sign. Types, state requirements, and how to protect your payment rights.',
    date: 'December 29, 2025',
    readTime: '9 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-lien-waiver-guide',
  },
  {
    title: 'Networking Tips for Subcontractors: Land More GC Relationships',
    excerpt: 'Build a steady pipeline of work through strategic networking. Where to meet GCs, how to follow up, and relationship building.',
    date: 'December 28, 2025',
    readTime: '8 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'subcontractor-networking-tips',
  },
  {
    title: 'Construction Project Closeout Checklist for Subcontractors',
    excerpt: 'Finish strong and get your final payment. Punch lists, documentation, warranties, and retainage release procedures.',
    date: 'December 27, 2025',
    readTime: '10 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'construction-project-closeout-checklist',
  },
  // 20 New SEO-Optimized Blog Posts
  {
    title: 'How Long Do Contractors Have to Pay Subcontractors? State Laws Explained',
    excerpt: 'State-by-state breakdown of contractor payment deadlines. Learn your rights under prompt payment laws and what to do when deadlines are missed.',
    date: 'December 26, 2025',
    readTime: '14 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'how-long-to-pay-subcontractors',
  },
  {
    title: 'Subcontractor Payment Application: Step-by-Step Process',
    excerpt: 'Master the payment application process. Templates, timelines, and tips to submit apps that get approved and paid on the first try.',
    date: 'December 25, 2025',
    readTime: '12 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'subcontractor-payment-application',
  },
  {
    title: 'Construction Back Charges: How to Avoid and Dispute Them',
    excerpt: 'Don\'t let back charges eat your profits. Learn what they are, when they\'re legitimate, and how to fight unfair deductions from your payments.',
    date: 'December 24, 2025',
    readTime: '15 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-back-charges-guide',
  },
  {
    title: 'Best Accounting Software for Subcontractors in 2026',
    excerpt: 'Comprehensive comparison of accounting software for subcontractors. QuickBooks, Foundation, Sage, and construction-specific tools reviewed.',
    date: 'December 23, 2025',
    readTime: '16 min read',
    author: 'Sarah Martinez',
    category: 'Product',
    slug: 'best-accounting-software-subcontractors',
  },
  {
    title: 'Construction Draw Schedule Explained: Getting Paid on Schedule',
    excerpt: 'Understand construction draw schedules and how they affect subcontractor payments. Learn to plan your cash flow around project milestones.',
    date: 'December 22, 2025',
    readTime: '12 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'construction-draw-schedule-explained',
  },
  {
    title: 'How to Handle Scope Creep as a Subcontractor',
    excerpt: 'Scope creep kills profit margins. Learn how to identify it, document it, and get paid for the extra work you\'re asked to do.',
    date: 'December 21, 2025',
    readTime: '13 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'subcontractor-scope-creep-management',
  },
  {
    title: 'Joint Check Agreements in Construction: Pros and Cons',
    excerpt: 'What is a joint check agreement and should you sign one? Learn how these payment arrangements affect subcontractors and suppliers.',
    date: 'December 20, 2025',
    readTime: '11 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'joint-check-agreements-construction',
  },
  {
    title: 'Subcontractor Default Insurance (SDI): Is It Worth It?',
    excerpt: 'What is subcontractor default insurance, how does it work, and should you care about it? A guide for subcontractors working with SDI-protected projects.',
    date: 'December 19, 2025',
    readTime: '10 min read',
    author: 'Sarah Martinez',
    category: 'Legal',
    slug: 'subcontractor-default-insurance-guide',
  },
  {
    title: 'How to Write a Construction Demand Letter That Gets Results',
    excerpt: 'Step-by-step guide to writing a demand letter that gets you paid. Includes templates, legal requirements, and follow-up strategies.',
    date: 'December 18, 2025',
    readTime: '14 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-demand-letter-template',
  },
  {
    title: 'Notice to Owner Requirements by State: Complete Guide',
    excerpt: 'Don\'t lose your lien rights. State-by-state breakdown of preliminary notice requirements, deadlines, and forms for construction projects.',
    date: 'December 17, 2025',
    readTime: '18 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'notice-to-owner-requirements-states',
  },
  {
    title: 'Construction Mediation vs Arbitration: Which Is Better?',
    excerpt: 'Understand the key differences between mediation and arbitration for construction disputes. Pros, cons, and when to use each approach.',
    date: 'December 16, 2025',
    readTime: '13 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-mediation-vs-arbitration',
  },
  {
    title: 'How to Fire a General Contractor: A Subcontractor\'s Guide',
    excerpt: 'When a GC relationship goes bad, how do you exit? Legal steps to terminate, protect your rights, and get paid for work you\'ve completed.',
    date: 'December 15, 2025',
    readTime: '12 min read',
    author: 'Emily Thompson',
    category: 'Legal',
    slug: 'how-to-fire-general-contractor',
  },
  {
    title: 'Construction Payment Bond Claims: When and How to File',
    excerpt: 'A complete guide to filing payment bond claims on construction projects. Timelines, requirements, and strategies to get paid when the GC won\'t pay.',
    date: 'December 14, 2025',
    readTime: '15 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-payment-bond-claims',
  },
  {
    title: 'Time and Materials Contracts: Subcontractor Pros and Cons',
    excerpt: 'Is time and materials the right choice? Learn when T&M makes sense, how to structure contracts, and avoid the pitfalls that eat your profits.',
    date: 'December 13, 2025',
    readTime: '12 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'time-and-materials-contracts-guide',
  },
  {
    title: 'Contractor Credit: How to Build Business Credit for Subcontractors',
    excerpt: 'Build business credit to unlock better rates, larger credit lines, and more opportunities. A step-by-step guide for subcontractors.',
    date: 'December 12, 2025',
    readTime: '14 min read',
    author: 'Sarah Martinez',
    category: 'Finance',
    slug: 'subcontractor-business-credit-building',
  },
  {
    title: 'Stop Work Notice in Construction: Legal Rights and Process',
    excerpt: 'When can you stop work on a construction project? Understanding stop work rights, proper notice requirements, and protecting yourself from liability.',
    date: 'December 11, 2025',
    readTime: '11 min read',
    author: 'David Kim',
    category: 'Legal',
    slug: 'construction-stop-work-notice',
  },
  {
    title: 'Progress Billing for Subcontractors: Best Practices',
    excerpt: 'Master progress billing to improve cash flow. How to structure schedules of values, bill accurately, and get approvals faster.',
    date: 'December 10, 2025',
    readTime: '13 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'subcontractor-progress-billing-guide',
  },
  {
    title: 'Construction Punch List Tips: Close Out Projects Faster',
    excerpt: 'Complete punch lists efficiently and get your final payment sooner. Organization strategies, communication tips, and technology tools.',
    date: 'December 9, 2025',
    readTime: '10 min read',
    author: 'Michael Chen',
    category: 'Best Practices',
    slug: 'construction-punch-list-tips',
  },
  {
    title: 'Subcontractor vs Prime Contractor: Key Differences Explained',
    excerpt: 'Understand the differences between subcontractors and prime contractors. Roles, responsibilities, risks, and which path is right for your business.',
    date: 'December 8, 2025',
    readTime: '12 min read',
    author: 'Emily Thompson',
    category: 'Best Practices',
    slug: 'subcontractor-vs-prime-contractor',
  },
  {
    title: 'Construction Cost Plus Contracts: Subcontractor Guide',
    excerpt: 'How do cost plus contracts work for subcontractors? Learn the fee structures, documentation requirements, and profit potential.',
    date: 'December 7, 2025',
    readTime: '12 min read',
    author: 'Michael Chen',
    category: 'Finance',
    slug: 'construction-cost-plus-contracts',
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

export function BlogContent() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);

  const filteredPosts = activeCategory === 'All'
    ? allPosts
    : allPosts.filter((post) => post.category === activeCategory);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setVisibleCount(9);
  };

  // Count posts per category for badges
  const categoryCounts: Record<string, number> = {
    'All': allPosts.length,
  };
  allPosts.forEach((post) => {
    categoryCounts[post.category] = (categoryCounts[post.category] || 0) + 1;
  });

  // Show featured post only when "All" or matching category is selected
  const showFeatured = activeCategory === 'All' || activeCategory === featuredPost.category;

  return (
    <>
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
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-[#1a1a2e] text-white shadow-md scale-105'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-[1.02]'
                }`}
              >
                {category}
                <span className={`ml-1.5 text-xs ${
                  activeCategory === category ? 'text-white/60' : 'text-gray-400'
                }`}>
                  {categoryCounts[category] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {showFeatured && (
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
                <div className="lg:w-1/2 min-h-[300px] overflow-hidden">
                  <BlogImage slug={featuredPost.slug} size="featured" className="w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-[#1a1a2e]">
              {activeCategory === 'All' ? 'Latest Articles' : activeCategory}
            </h2>
            <span className="text-sm text-gray-500">
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No articles found in this category.</p>
              <button
                onClick={() => handleCategoryChange('All')}
                className="mt-4 text-[#54A0FF] font-medium hover:underline"
              >
                View all articles
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visiblePosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link href={`/blog/${post.slug}`}>
                    <div className="rounded-xl h-48 mb-4 overflow-hidden">
                      <BlogImage slug={post.slug} size="card" className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  </Link>
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
          )}

          {/* Load More */}
          {hasMore && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 9)}
                className="inline-flex items-center gap-2 bg-gray-100 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Load More Articles ({filteredPosts.length - visibleCount} remaining)
              </button>
            </div>
          )}
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
    </>
  );
}
