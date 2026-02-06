import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'SubPaid - AI-Powered Invoicing for Subcontractors | Get Paid Faster',
    template: '%s | SubPaid',
  },
  description: 'Transform photos into professional invoices in seconds with AI. SubPaid helps subcontractors get paid faster with Snap-to-Invoice, Voice Agent collections, and Payment Prophet predictions.',
  keywords: ['invoicing software', 'subcontractor invoicing', 'AI invoice generator', 'snap to invoice', 'payment collection', 'invoice automation', 'construction invoicing', 'contractor billing'],
  authors: [{ name: 'SubPaid' }],
  creator: 'SubPaid',
  publisher: 'SubPaid',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.subpaid.com',
    siteName: 'SubPaid',
    title: 'SubPaid - AI-Powered Invoicing for Subcontractors',
    description: 'Transform photos into professional invoices in seconds. Get paid faster with AI-powered payment predictions and automated collections.',
    images: [
      {
        url: 'https://www.subpaid.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SubPaid - AI-Powered Invoicing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubPaid - AI-Powered Invoicing',
    description: 'Transform photos into professional invoices in seconds.',
    images: ['https://www.subpaid.com/twitter-image.png'],
    creator: '@subpaid',
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/favicon.svg',
  },
  alternates: {
    canonical: 'https://www.subpaid.com',
  },
  category: 'technology',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#9FE870',
};

// JSON-LD structured data for the organization
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'SubPaid',
  url: 'https://www.subpaid.com',
  logo: 'https://www.subpaid.com/logo.png',
  description: 'AI-powered invoicing software for subcontractors',
  sameAs: [
    'https://twitter.com/subpaid',
    'https://linkedin.com/company/subpaid',
    'https://facebook.com/subpaid',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-800-782-7243',
    contactType: 'customer service',
    email: 'support@subpaid.com',
  },
};

// JSON-LD for software application
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SubPaid',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free 14-day trial, plans starting at $19/month',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150',
    bestRating: '5',
    worstRating: '1',
  },
  featureList: [
    'Snap to Invoice - Photo to invoice in seconds',
    'SAM Voice Agent - AI payment collection calls',
    'Payment Prophet - Predict when you will get paid',
    'QuickBooks and Xero integration',
    'Stripe and PayPal payments',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
      </head>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
