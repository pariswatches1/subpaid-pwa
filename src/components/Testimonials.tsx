'use client';

import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "SubPaid cut my invoice collection time from 2 weeks to 2 days. The voice agent is a game-changer.",
    author: "Mike Rodriguez",
    role: "Owner",
    company: "Rodriguez Electric",
    rating: 5,
    initials: "MR",
    color: "from-[#9FE870] to-[#54A0FF]"
  },
  {
    quote: "I used to spend hours creating invoices. Now I just snap a photo and I'm done. More time on the job site.",
    author: "Sarah Chen",
    role: "General Contractor",
    company: "Chen Construction",
    rating: 5,
    initials: "SC",
    color: "from-[#54A0FF] to-[#FF9F43]"
  },
  {
    quote: "The payment predictions are scary accurate. I can finally plan my cash flow with confidence.",
    author: "James Wilson",
    role: "Plumbing Contractor",
    company: "Wilson Plumbing Co.",
    rating: 5,
    initials: "JW",
    color: "from-[#FF9F43] to-[#FECA57]"
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#E8F4F8]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 bg-[#54A0FF]/20 text-[#1a1a2e] rounded-full text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4">
            Don&apos;t Take Our Word For It
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            See what subcontractors are saying about SubPaid
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 relative hover:shadow-lg transition-shadow"
            >
              {/* Quote icon */}
              <div className="absolute -top-4 left-8">
                <div className="w-8 h-8 bg-[#9FE870] rounded-full flex items-center justify-center">
                  <Quote className="w-4 h-4 text-white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4 pt-2">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 mb-6 leading-relaxed">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${t.color} rounded-full flex items-center justify-center text-white font-semibold`}>
                  {t.initials}
                </div>
                <div>
                  <p className="font-semibold text-[#1a1a2e]">{t.author}</p>
                  <p className="text-sm text-gray-500">{t.role}, {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
