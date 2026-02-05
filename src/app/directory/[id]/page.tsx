'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Shield, Star, CheckCircle, Clock, MapPin, Phone, Mail, Globe, ChevronRight,
  Calendar, FileText, AlertTriangle, Loader2, ExternalLink, BadgeCheck
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GoogleMapEmbed } from '@/components/GoogleMapEmbed';
import { ContractorCard } from '@/components/directory/ContractorCard';
import { ClaimBusinessModal } from '@/components/directory/ClaimBusinessModal';
import type { Contractor } from '@/lib/db';
import { getStateName, getDataSourceLabel, getDataSourceFullName, type StateCode } from '@/lib/states-config';

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

interface ContractorWithExtras extends Contractor {
  ratings: Array<{
    id: string;
    gcName: string;
    paymentTimeliness: number;
    communication: number;
    overallRating: number;
    review?: string;
    avgPaymentDays?: number;
    userId: string;
    createdAt: string;
  }>;
  similar: Contractor[];
}

export default function ContractorProfilePage({ params }: { params: { id: string } }) {
  const [contractor, setContractor] = useState<ContractorWithExtras | null>(null);
  const [loading, setLoading] = useState(true);
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedResult, setVerifiedResult] = useState<{ verified: boolean; verifiedAt: string } | null>(null);

  useEffect(() => {
    fetchContractor();
  }, [params.id]);

  const fetchContractor = async () => {
    try {
      const res = await fetch(`/api/contractors/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setContractor(data);
      }
    } catch (err) {
      console.error('Failed to fetch contractor:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyLicense = async () => {
    if (!contractor) return;
    setVerifying(true);
    try {
      const res = await fetch(`/api/contractors/verify/${contractor.licenseNumber}?state=${contractor.state}`);
      if (res.ok) {
        const data = await res.json();
        setVerifiedResult(data);
      }
    } catch (err) {
      console.error('Verification failed:', err);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#9FE870]" />
        </main>
        <Footer />
      </>
    );
  }

  if (!contractor) {
    return (
      <>
        <Navbar />
        <main className="pt-16 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-gray-600 mb-2">Contractor Not Found</h1>
            <Link href="/directory" className="text-[#54A0FF] hover:underline">Back to Directory</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const status = getStatusBadge(contractor.licenseStatus);
  const fullAddress = `${contractor.address}, ${contractor.city}, ${contractor.state} ${contractor.zipCode}`;

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Link href="/directory" className="hover:text-[#54A0FF]">Directory</Link>
              <ChevronRight className="w-4 h-4" />
              <span>{getStateName(contractor.state as StateCode)}</span>
              <ChevronRight className="w-4 h-4" />
              <span>{contractor.city}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-[#1a1a2e] font-medium truncate">{contractor.businessName}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="py-8 bg-[#F8FAFC]">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Business Header */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl font-bold text-[#1a1a2e]">{contractor.businessName}</h1>
                        {contractor.claimed && (
                          <div className="flex items-center gap-1 bg-[#22C55E]/10 text-[#22C55E] px-2 py-0.5 rounded-full text-xs font-medium">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Verified
                          </div>
                        )}
                      </div>
                      {contractor.ownerName && (
                        <p className="text-gray-600">{contractor.ownerName}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{fullAddress}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                    {contractor.phone && (
                      <a href={`tel:${contractor.phone}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF]">
                        <Phone className="w-4 h-4" />
                        {contractor.phone}
                      </a>
                    )}
                    {contractor.email && (
                      <a href={`mailto:${contractor.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF]">
                        <Mail className="w-4 h-4" />
                        {contractor.email}
                      </a>
                    )}
                    {contractor.website && (
                      <a href={contractor.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF]">
                        <Globe className="w-4 h-4" />
                        Website
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>

                {/* License Details */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2">
                      <Shield className="w-5 h-5 text-[#54A0FF]" />
                      License Details
                    </h2>
                    <button
                      onClick={handleVerifyLicense}
                      disabled={verifying}
                      className="flex items-center gap-2 text-sm font-medium text-[#54A0FF] hover:underline disabled:opacity-50"
                    >
                      {verifying ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Verifying...</>
                      ) : verifiedResult?.verified ? (
                        <><CheckCircle className="w-4 h-4 text-[#22C55E]" /> <span className="text-[#22C55E]">Verified ✓</span></>
                      ) : (
                        'Verify License →'
                      )}
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">License Number</p>
                        <p className="font-mono font-bold text-[#1a1a2e]">{contractor.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">License Type</p>
                        <p className="font-medium text-gray-700">{contractor.licenseType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Classifications</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {contractor.classifications.map((cl) => (
                            <span key={cl} className="px-2 py-0.5 bg-[#54A0FF]/10 text-[#54A0FF] rounded text-xs font-medium">
                              {cl}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Status</p>
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Issue Date</p>
                        <p className="font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(contractor.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Expiration Date</p>
                        <p className="font-medium text-gray-700 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {new Date(contractor.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Source Link */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                      Data sourced from{' '}
                      {getDataSourceLabel(contractor.state as StateCode)}.{' '}
                      {contractor.sourceUrl && (
                        <a href={contractor.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-[#54A0FF] hover:underline">
                          View official record →
                        </a>
                      )}
                    </p>
                  </div>
                </div>

                {/* Location Map */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2 mb-4">
                    <MapPin className="w-5 h-5 text-[#FF9F43]" />
                    Location
                  </h2>
                  <GoogleMapEmbed
                    address={fullAddress}
                    height={350}
                    zoom={14}
                    className="rounded-lg overflow-hidden"
                  />
                  <p className="text-sm text-gray-500 mt-3">{fullAddress}</p>
                </div>

                {/* Reviews */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-bold text-[#1a1a2e] flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-[#FECA57]" />
                    Reviews ({contractor.reviewCount || 0})
                  </h2>

                  {contractor.ratings && contractor.ratings.length > 0 ? (
                    <div className="space-y-4">
                      {contractor.ratings.map((rating) => (
                        <div key={rating.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${i < rating.overallRating ? 'text-[#FECA57] fill-[#FECA57]' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {rating.review && (
                            <p className="text-gray-600 text-sm">{rating.review}</p>
                          )}
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            <span>Payment: {rating.paymentTimeliness}/5</span>
                            <span>Communication: {rating.communication}/5</span>
                            {rating.avgPaymentDays && <span>Avg {rating.avgPaymentDays} days</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-400">No reviews yet for this contractor</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Worked with {contractor.businessName}?{' '}
                        <Link href="/dashboard/payscore" className="text-[#54A0FF] hover:underline">Leave a review</Link>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* PayScore Card */}
                {contractor.payScore != null && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-4">PayScore™</h3>
                    <div className="text-center">
                      <div className={`w-24 h-24 ${getPayScoreColor(contractor.payScore)} rounded-full flex items-center justify-center mx-auto mb-3`}>
                        <span className="text-3xl font-bold text-white">{contractor.payScore}</span>
                      </div>
                      <p className="font-bold text-[#1a1a2e]">{getPayScoreLabel(contractor.payScore)}</p>
                      <p className="text-xs text-gray-400 mt-1">Payment Reliability Rating</p>
                    </div>

                    <div className="mt-6 space-y-3">
                      {contractor.avgPaymentDays != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Clock className="w-4 h-4" /> Avg Payment
                          </span>
                          <span className="font-medium text-[#1a1a2e]">{contractor.avgPaymentDays} days</span>
                        </div>
                      )}
                      {contractor.reviewCount != null && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 flex items-center gap-1.5">
                            <Star className="w-4 h-4" /> Reviews
                          </span>
                          <span className="font-medium text-[#1a1a2e]">{contractor.reviewCount}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          <FileText className="w-4 h-4" /> Data Source
                        </span>
                        <span className="font-medium text-[#1a1a2e] text-xs">
                          {getDataSourceLabel(contractor.state as StateCode)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Claim Business CTA */}
                {!contractor.claimed ? (
                  <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d4e] rounded-xl p-6 text-center">
                    <h3 className="text-white font-bold mb-2">Is this your business?</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Claim your profile to manage your PayScore, respond to reviews, and get discovered.
                    </p>
                    <button
                      onClick={() => setShowClaimModal(true)}
                      className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-full font-bold hover:shadow-lg transition-all"
                    >
                      Claim This Business
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#22C55E]/10 rounded-xl p-6 text-center border border-[#22C55E]/20">
                    <BadgeCheck className="w-8 h-8 text-[#22C55E] mx-auto mb-2" />
                    <h3 className="font-bold text-[#22C55E] mb-1">Verified Business</h3>
                    <p className="text-sm text-gray-600">This business has been claimed and verified by its owner.</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    {contractor.sourceUrl && (
                      <a
                        href={contractor.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF] py-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Official State Record
                      </a>
                    )}
                    <Link
                      href="/dashboard/payscore"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF] py-1"
                    >
                      <Star className="w-4 h-4" />
                      Rate This Contractor
                    </Link>
                    <Link
                      href="/directory"
                      className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#54A0FF] py-1"
                    >
                      <MapPin className="w-4 h-4" />
                      Back to Directory
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Contractors */}
            {contractor.similar && contractor.similar.length > 0 && (
              <div className="mt-10">
                <h2 className="text-xl font-bold text-[#1a1a2e] mb-6">
                  Similar Contractors in {contractor.city}
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {contractor.similar.map((c) => (
                    <ContractorCard key={c.id} contractor={c} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Claim Modal */}
      {showClaimModal && (
        <ClaimBusinessModal
          businessName={contractor.businessName}
          contractorId={contractor.id}
          onClose={() => setShowClaimModal(false)}
          onClaimed={() => {
            setContractor({ ...contractor, claimed: true });
          }}
        />
      )}
    </>
  );
}
