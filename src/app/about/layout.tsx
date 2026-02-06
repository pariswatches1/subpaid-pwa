import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About SubPaid - Built by Contractors, for Contractors',
  description: 'SubPaid was founded by contractors who were tired of chasing payments. Learn about our mission to help subcontractors get paid faster with AI-powered invoicing tools.',
  keywords: ['about SubPaid', 'contractor invoicing company', 'SubPaid team', 'invoicing software company'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/about',
  },
  openGraph: {
    title: 'About SubPaid | Built by Contractors, for Contractors',
    description: 'Our mission: Help subcontractors get paid faster. Learn about the team behind SubPaid.',
    url: 'https://subpaid-pwa.vercel.app/about',
    type: 'website',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
