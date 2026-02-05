'use client';

import Link from 'next/link';
import { Shield, Star, CheckCircle, Clock, MapPin, Navigation } from 'lucide-react';
import type { Contractor } from '@/lib/db';

interface ContractorCardProps {
  contractor: Contractor;
  distance?: string;
}

function getPayScoreColor(score: number): string {
  if (score >= 85) return 'bg-[#22C55E]';
  if (score >= 70) return 'bg-[#9FE870]';
  if (score >= 50) return 'bg-[#FF9F43]';
  return 'bg-red-500';
}

function getPayScoreLabel(score: number): string {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Poor';
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return { bg: 'bg-green-100', text: 'text-green-700', label: 'Active' };
    case 'inactive':
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Inactive' };
    case 'suspended':
      return { bg: 'bg-red-100', text: 'text-red-700', label: 'Suspended' };
    case 'expired':
      return { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expired' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  }
}

export function ContractorCard({ contractor, distance }: ContractorCardProps) {
  const status = getStatusBadge(contractor.licenseStatus);

  return (
    <Link href={`/directory/${contractor.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-[#9FE870]/40 transition-all group h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="font-bold text-[#1a1a2e] group-hover:text-[#54A0FF] transition-colors truncate">
              {contractor.businessName}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{contractor.city}, {contractor.state}</span>
            </div>
            {distance && (
              <div className="flex items-center gap-1 mt-1 text-sm text-[#54A0FF] font-medium">
                <Navigation className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{distance}</span>
              </div>
            )}
          </div>
          {contractor.payScore != null && (
            <div className={`w-12 h-12 ${getPayScoreColor(contractor.payScore)} rounded-full flex items-center justify-center flex-shrink-0`}>
              <span className="text-lg font-bold text-white">{contractor.payScore}</span>
            </div>
          )}
        </div>

        {/* License Info */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 font-mono text-xs">{contractor.licenseNumber}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
              {status.label}
            </span>
            <span className="text-xs text-gray-500">{contractor.licenseType}</span>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="pt-3 border-t border-gray-100">
          {contractor.reviewCount != null && contractor.reviewCount > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5 text-gray-600">
                <Star className="w-3.5 h-3.5 text-[#FECA57]" />
                <span>{contractor.reviewCount} review{contractor.reviewCount !== 1 ? 's' : ''}</span>
              </div>
              {contractor.avgPaymentDays != null && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{contractor.avgPaymentDays}d avg</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No reviews yet</p>
          )}

          {contractor.claimed && (
            <div className="flex items-center gap-1.5 mt-2 text-sm text-[#22C55E]">
              <CheckCircle className="w-3.5 h-3.5" />
              <span className="font-medium">Verified Business</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
