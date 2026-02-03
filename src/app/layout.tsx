import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SubPaid - Get Paid While You Work',
  description: 'AI-powered invoicing for subcontractors. Snap a photo, AI creates the invoice. Our voice agent calls to collect. Stop chasing payments.',
  keywords: ['invoicing', 'subcontractor', 'construction', 'payment', 'AI', 'voice agent'],
  authors: [{ name: 'SubPaid' }],
  creator: 'SubPaid',
  publisher: 'SubPaid',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://subpaid.com',
    siteName: 'SubPaid',
    title: 'SubPaid - Get Paid While You Work',
    description: 'AI-powered invoicing for subcontractors. Stop chasing payments.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SubPaid - AI-Powered Invoicing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SubPaid - Get Paid While You Work',
    description: 'AI-powered invoicing for subcontractors.',
    images: ['/og-image.png'],
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#9FE870',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
