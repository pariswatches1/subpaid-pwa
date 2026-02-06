import { MetadataRoute } from 'next';
import { contractorsData } from '@/lib/contractors-data';

const BASE_URL = 'https://subpaid-pwa.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/directory`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/features`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/features/snap-to-invoice`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/voice-agent`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/payment-prophet`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/payscore`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/features/autopilot`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/demo`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/case-studies`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/integrations`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/help`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/docs/api`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/security`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // Blog posts - All SEO-optimized posts
  const blogSlugs = [
    // Priority 1 - Highest Impact SEO Posts
    'how-to-get-paid-faster-as-a-subcontractor',
    'general-contractor-wont-pay-subcontractor',
    'how-to-write-a-construction-invoice',
    'free-contractor-invoice-templates',
    'how-to-check-contractor-license',
    // Priority 2 - Core Content
    'subcontractor-cash-flow-management-guide',
    'how-to-write-construction-invoice',
    'general-contractor-payment-problems',
    'construction-payment-terms-explained',
    'best-invoicing-apps-subcontractors',
    'mechanics-lien-filing-guide',
    '5-tips-to-get-paid-faster',
    'subcontractor-profit-margin-guide',
    'aia-billing-guide-subcontractors',
    'construction-business-tax-deductions',
    'how-to-bid-construction-jobs',
    'construction-payment-disputes-resolution',
    'understanding-lien-rights',
    'grow-subcontracting-business',
    'workers-comp-insurance-contractors',
    'invoice-factoring-construction',
    'prequalification-tips-subcontractors',
    'reduce-construction-payment-delays',
    'construction-scheduling-tips',
    'the-true-cost-of-late-payments',
    'subcontractor-vs-employee',
    'construction-safety-program-guide',
    'ai-voice-agents-construction-collections',
    'payment-prediction-construction',
    'how-ai-is-transforming-invoicing',
  ];

  const blogPosts: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  // Contractor directory pages (5,000+ pages)
  const contractorPages: MetadataRoute.Sitemap = contractorsData.map((contractor) => ({
    url: `${BASE_URL}/directory/${contractor.id}`,
    lastModified: contractor.updatedAt || now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticPages, ...blogPosts, ...contractorPages];
}
