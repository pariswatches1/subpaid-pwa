import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Snap to Invoice - Photo to Professional Invoice in 5 Seconds',
  description: 'Transform photos into professional invoices instantly with AI. Take a picture of your work, materials, or notes and get a ready-to-send invoice in seconds. Free trial available.',
  keywords: ['snap to invoice', 'photo invoice', 'AI invoice generator', 'mobile invoicing', 'construction invoice app', 'contractor invoice'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features/snap-to-invoice',
  },
  openGraph: {
    title: 'Snap to Invoice | Photo to Invoice in 5 Seconds',
    description: 'Take a photo, get an invoice. AI-powered invoicing for contractors.',
    url: 'https://subpaid-pwa.vercel.app/features/snap-to-invoice',
    type: 'website',
  },
};

export default function SnapToInvoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
