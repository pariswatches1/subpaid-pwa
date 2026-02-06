import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing - Plans Starting at $19/month',
  description: 'Simple, transparent pricing for SubPaid. Free 14-day trial, no credit card required. Plans for solo contractors to large teams. Snap-to-Invoice, Voice Agent, and more included.',
  keywords: ['invoicing pricing', 'contractor software pricing', 'SubPaid plans', 'invoicing subscription', 'construction software cost'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/pricing',
  },
  openGraph: {
    title: 'SubPaid Pricing | Plans Starting at $19/month',
    description: 'Free 14-day trial. No credit card required. Choose the plan that fits your business.',
    url: 'https://subpaid-pwa.vercel.app/pricing',
    type: 'website',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
