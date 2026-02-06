import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Payment Prophet - Predict When You Will Get Paid',
  description: 'Know exactly when to expect payment with AI-powered predictions. Payment Prophet analyzes payment patterns to forecast when invoices will be paid, helping you plan cash flow.',
  keywords: ['payment prediction', 'cash flow forecast', 'invoice payment', 'payment timing', 'contractor cash flow', 'payment analytics'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features/payment-prophet',
  },
  openGraph: {
    title: 'Payment Prophet | Know When You Will Get Paid',
    description: 'AI-powered payment predictions. Plan your cash flow with confidence.',
    url: 'https://subpaid-pwa.vercel.app/features/payment-prophet',
    type: 'website',
  },
};

export default function PaymentProphetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
