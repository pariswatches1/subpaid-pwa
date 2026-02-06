import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAM Voice Agent - AI-Powered Payment Collection Calls',
  description: 'Let SAM, our AI voice agent, handle payment collection calls professionally. Natural conversations, perfect timing, and persistent follow-ups that get you paid without the awkwardness.',
  keywords: ['voice agent', 'AI collections', 'payment collection', 'automated calls', 'invoice follow-up', 'contractor collections'],
  alternates: {
    canonical: 'https://subpaid-pwa.vercel.app/features/voice-agent',
  },
  openGraph: {
    title: 'SAM Voice Agent | AI Payment Collection',
    description: 'AI-powered voice agent that makes collection calls for you. Professional, persistent, and effective.',
    url: 'https://subpaid-pwa.vercel.app/features/voice-agent',
    type: 'website',
  },
};

export default function VoiceAgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
