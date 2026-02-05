'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, ChevronDown, MapPin, Building2, ArrowRight, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ContractorCard } from '@/components/directory/ContractorCard';
import type { Contractor } from '@/lib/db';

const ITEMS_PER_PAGE = 21;

interface APIResponse {
  contractors: Contractor[];
  total: number;
  offset: number;
  limit: number;
  filters: {
    licenseTypes: string[];
    cities: string[];
    states: string[];
  };
}

export default function DirectoryPage() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [licenseTypeFilter, setLicenseTypeFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableLicenseTypes, setAvailableLicenseTypes] = useState<string[]>([]);
  const [searchDebounce, setSearchDebounce] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounce(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchDebounce, stateFilter, licenseTypeFilter]);

  const fetchContractors = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchDebounce) params.set('query', searchDebounce);
      if (stateFilter !== 'all') params.set('state', stateFilter);
      if (licenseTypeFilter) params.set('licenseType', licenseTypeFilter);
      params.set('limit', String(ITEMS_PER_PAGE));
      params.set('offset', String((page - 1) * ITEMS_PER_PAGE));

      const res = await fetch(`/api/contractors?${params}`);
      const data: APIResponse = await res.json();

      setContractors(data.contractors);
      setTotal(data.total);
      if (data.filters?.licenseTypes) {
        setAvailableLicenseTypes(data.filters.licenseTypes);
      }
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchDebounce, stateFilter, licenseTypeFilter, page]);

  useEffect(() => {
    fetchContractors();
  }, [fetchContractors]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const stateCounts = {
    all: total,
    FL: 0,
    CA: 0,
  };

  return (
    <>
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-[#1a1a2e] to-[#2d2d4e]">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-[#9FE870]/20 text-[#9FE870] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Building2 className="w-4 h-4" />
              National Contractor Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Licensed Contractors
            </h1>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Search verified contractors across Florida and California. View PayScores, license details, and reviews.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, license number, city..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-[#1a1a2e] text-lg placeholder:text-gray-400 focus:ring-4 focus:ring-[#9FE870]/30 focus:outline-none shadow-xl"
              />
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="bg-white border-b border-gray-200 sticky top-16 z-30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              {/* State Tabs */}
              <div className="flex items-center gap-1">
                {[
                  { value: 'all', label: 'All States' },
                  { value: 'FL', label: '🟠 Florida' },
                  { value: 'CA', label: '🔵 California' },
                ].map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setStateFilter(tab.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      stateFilter === tab.value
                        ? 'bg-[#1a1a2e] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all"
              >
                <Filter className="w-4 h-4" />
                Filters
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="pb-4 flex items-center gap-4 flex-wrap">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">License Type</label>
                  <select
                    value={licenseTypeFilter}
                    onChange={(e) => setLicenseTypeFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-[#9FE870] focus:outline-none"
                  >
                    <option value="">All Types</option>
                    {availableLicenseTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                {(licenseTypeFilter || searchDebounce) && (
                  <button
                    onClick={() => {
                      setLicenseTypeFilter('');
                      setSearch('');
                    }}
                    className="text-sm text-[#54A0FF] hover:underline mt-4"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8 bg-[#F8FAFC] min-h-[60vh]">
          <div className="max-w-6xl mx-auto px-4">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <>
                    <span className="font-bold text-[#1a1a2e]">{total.toLocaleString()}</span> contractor{total !== 1 ? 's' : ''} found
                  </>
                )}
              </p>
              {total > 0 && (
                <p className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </p>
              )}
            </div>

            {/* Contractor Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                    <div className="flex justify-between mb-3">
                      <div className="flex-1">
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-100 rounded w-1/2" />
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-4 bg-gray-100 rounded w-2/3" />
                      <div className="h-4 bg-gray-100 rounded w-1/2" />
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <div className="h-4 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : contractors.length === 0 ? (
              <div className="text-center py-16">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No contractors found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contractors.map((contractor) => (
                  <ContractorCard key={contractor.id} contractor={contractor} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  let pageNum: number;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (page <= 3) {
                    pageNum = i + 1;
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = page - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                        page === pageNum
                          ? 'bg-[#1a1a2e] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[#1a1a2e]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Is Your Business Listed?
            </h2>
            <p className="text-white/70 mb-6">
              Claim your contractor profile to manage your PayScore, respond to reviews, and get discovered by subcontractors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Claim Your Business
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
