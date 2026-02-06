import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PayScore - Contractor Payment Reliability Ratings',
  description: 'Check PayScore ratings before you work. See how reliably general contractors pay their subs. Make informed decisions with payment history data and community reviews.',
  keywords: ['PayScore', 'contractor ratings', 'payment reliability', 'GC reviews', 'contractor reviews', 'payment history'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features/payscore',
  },
  openGraph: {
    title: 'PayScore | Contractor Payment Ratings',
    description: 'Know who pays on time. Check PayScore ratings before accepting work.',
    url: 'https://subpaid-pwa.vercel.app/features/payscore',
    type: 'website',
  },
};

export default function PayScoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
