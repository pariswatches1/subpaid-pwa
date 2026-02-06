import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Features - AI-Powered Invoicing Tools',
  description: 'Discover SubPaid features: Snap-to-Invoice photo invoicing, SAM Voice Agent for collections, Payment Prophet predictions, PayScore ratings, and AutoPilot automation. Get paid faster.',
  keywords: ['invoicing features', 'AI invoicing', 'snap to invoice', 'voice agent', 'payment prediction', 'contractor tools'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features',
  },
  openGraph: {
    title: 'SubPaid Features | AI-Powered Invoicing Tools',
    description: 'Snap-to-Invoice, Voice Agent collections, Payment Prophet, and more. Everything you need to get paid faster.',
    url: 'https://subpaid-pwa.vercel.app/features',
    type: 'website',
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
