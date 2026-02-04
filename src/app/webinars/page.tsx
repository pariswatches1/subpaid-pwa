import type { Metadata } from 'next';
import Link from 'next/link';
import { Play, Calendar, Clock, Users, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Webinars - SubPaid',
  description: 'Join our free webinars to learn invoicing best practices, SubPaid tips, and business strategies for subcontractors.',
  alternates: {
    canonical: 'https://www.subpaid.com/webinars',
  },
};

const upcomingWebinars = [
  {
    title: 'Mastering Cash Flow: Strategies for Subcontractors',
    date: 'February 15, 2026',
    time: '2:00 PM PST',
    duration: '45 min',
    host: 'Emily Thompson',
    hostRole: 'Head of Customer Success',
    spots: '150 spots left',
    description: 'Learn proven strategies to manage cash flow, predict payment timing, and reduce financial stress in your contracting business.',
  },
  {
    title: 'Getting Started with SubPaid: Complete Walkthrough',
    date: 'February 22, 2026',
    time: '11:00 AM PST',
    duration: '30 min',
    host: 'David Kim',
    hostRole: 'Head of Product',
    spots: '200 spots left',
    description: 'A comprehensive tour of SubPaid features including Snap to Invoice, SAM Voice Agent, and Payment Prophet.',
  },
];

const pastWebinars = [
  {
    title: 'AI-Powered Invoicing: The Future is Here',
    date: 'January 18, 2026',
    duration: '52 min',
    views: '1,234',
    thumbnail: '/webinars/ai-invoicing.jpg',
  },
  {
    title: 'How to Get Clients to Pay On Time',
    date: 'January 4, 2026',
    duration: '48 min',
    views: '2,156',
    thumbnail: '/webinars/on-time.jpg',
  },
  {
    title: 'Understanding Lien Rights for Subcontractors',
    date: 'December 14, 2025',
    duration: '55 min',
    views: '987',
    thumbnail: '/webinars/lien-rights.jpg',
  },
  {
    title: 'Year-End Tax Tips for Contractors',
    date: 'December 7, 2025',
    duration: '42 min',
    views: '1,567',
    thumbnail: '/webinars/tax-tips.jpg',
  },
  {
    title: 'Snap to Invoice: Tips & Tricks',
    date: 'November 16, 2025',
    duration: '35 min',
    views: '3,245',
    thumbnail: '/webinars/snap-tips.jpg',
  },
  {
    title: 'Building Better Client Relationships',
    date: 'November 2, 2025',
    duration: '45 min',
    views: '1,890',
    thumbnail: '/webinars/client-relationships.jpg',
  },
];

export default function WebinarsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-[#F8FAFC] to-white">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] mb-6">
              Free Webinars for Subcontractors
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Learn invoicing best practices, SubPaid tips, and business strategies from industry experts.
            </p>
          </div>
        </section>

        {/* Upcoming Webinars */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Upcoming Webinars</h2>

            {upcomingWebinars.length > 0 ? (
              <div className="space-y-6">
                {upcomingWebinars.map((webinar) => (
                  <div
                    key={webinar.title}
                    className="bg-gradient-to-r from-[#9FE870]/10 to-[#54A0FF]/10 rounded-2xl p-8"
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      <div className="flex-1">
                        <span className="inline-block px-3 py-1 bg-[#9FE870] text-[#1a1a2e] rounded-full text-xs font-bold mb-4">
                          UPCOMING
                        </span>
                        <h3 className="text-2xl font-bold text-[#1a1a2e] mb-4">{webinar.title}</h3>
                        <p className="text-gray-600 mb-6">{webinar.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {webinar.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {webinar.time} ({webinar.duration})
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {webinar.spots}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 bg-gray-200 rounded-full" />
                          <div>
                            <p className="font-medium text-[#1a1a2e]">{webinar.host}</p>
                            <p className="text-sm text-gray-500">{webinar.hostRole}</p>
                          </div>
                        </div>

                        <button className="inline-flex items-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full font-bold hover:bg-[#2d2d44] transition-all">
                          Register Now
                          <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="lg:w-80">
                        <div className="bg-gray-100 rounded-xl aspect-video flex items-center justify-center">
                          <span className="text-gray-400">Preview</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-12 text-center">
                <p className="text-gray-600 mb-4">No upcoming webinars scheduled at this time.</p>
                <p className="text-gray-500">Check back soon or browse our recordings below.</p>
              </div>
            )}
          </div>
        </section>

        {/* Past Webinars */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-[#1a1a2e] mb-8">Watch On-Demand</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastWebinars.map((webinar) => (
                <div
                  key={webinar.title}
                  className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                    <span className="text-gray-400">Thumbnail</span>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#1a1a2e] ml-1" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {webinar.duration}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-[#1a1a2e] mb-2 group-hover:text-[#54A0FF] transition-colors">
                      {webinar.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{webinar.date}</span>
                      <span>{webinar.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-[#1a1a2e] text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Want to be notified of new webinars?</h2>
            <p className="text-white/70 mb-8">
              Join our mailing list to get updates on upcoming webinars and exclusive content.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#9FE870]"
              />
              <button
                type="submit"
                className="bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
