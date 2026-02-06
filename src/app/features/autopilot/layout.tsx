import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AutoPilot - Automated Invoice Management',
  description: 'Set your invoicing on autopilot. Automatic payment reminders, recurring invoices, late fee calculations, and smart follow-ups. Spend less time chasing payments.',
  keywords: ['invoice automation', 'automatic reminders', 'recurring invoices', 'payment automation', 'invoice management', 'auto follow-up'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features/autopilot',
  },
  openGraph: {
    title: 'AutoPilot | Automated Invoice Management',
    description: 'Automatic reminders, recurring invoices, and smart follow-ups. Set it and forget it.',
    url: 'https://subpaid-pwa.vercel.app/features/autopilot',
    type: 'website',
  },
};

export default function AutoPilotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
