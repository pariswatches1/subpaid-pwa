import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Get Help with SubPaid',
  description: 'Contact SubPaid support team. Get help with invoicing, payment collections, or technical issues. Email, phone, and live chat support available.',
  keywords: ['contact SubPaid', 'SubPaid support', 'invoicing help', 'customer service'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/contact',
  },
  openGraph: {
    title: 'Contact SubPaid | Get Help',
    description: 'Reach our support team via email, phone, or live chat. We are here to help.',
    url: 'https://subpaid-pwa.vercel.app/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
