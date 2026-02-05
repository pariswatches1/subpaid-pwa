import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BlogContent } from '@/components/BlogContent';

export const metadata: Metadata = {
  title: 'Blog - SubPaid',
  description: 'Tips, insights, and news for subcontractors. Learn about invoicing best practices, payment collection, and running a successful contracting business.',
  alternates: {
    canonical: 'https://www.subpaid.com/blog',
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <BlogContent />
      </main>
      <Footer />
    </>
  );
}
