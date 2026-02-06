import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Licensed Contractors in All 50 States | Contractor Directory',
  description: 'Search 5,000+ verified contractors across all 50 US states. View PayScores, license details, reviews, and find trusted licensed contractors near you.',
  keywords: ['contractor directory', 'licensed contractors', 'find contractors', 'contractor search', 'verified contractors', 'PayScore', 'contractor reviews'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/directory',
  },
  openGraph: {
    title: 'Find Licensed Contractors | SubPaid Directory',
    description: 'Search 5,000+ verified contractors. View PayScores, license details, and reviews.',
    url: 'https://subpaid-pwa.vercel.app/directory',
    type: 'website',
  },
};

export default function DirectoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
