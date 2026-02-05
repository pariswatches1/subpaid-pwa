'use client';

import { Shield, Award, CheckCircle } from 'lucide-react';

export function TrustBar() {
  return (
    <section className="py-8 bg-gradient-to-b from-white to-[#E8F4F8] border-b border-[#D4EBF2]/30">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Trusted by <span className="font-semibold text-gray-900">500+</span> subcontractors across the US
          </p>
          <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">4.9 on G2</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-500 text-sm">★</span>
                ))}
              </div>
              <span className="text-sm text-gray-600">4.8 on Capterra</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Shield className="w-4 h-4 text-[#22C55E]" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-[#54A0FF]" />
              256-bit Encryption
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
