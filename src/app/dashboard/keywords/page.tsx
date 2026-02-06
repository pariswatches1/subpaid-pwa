'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MapPin,
  Briefcase,
  Users,
  Building2,
  Sparkles,
  RefreshCw,
  X,
  Lightbulb,
  FileText,
  Megaphone,
  Share2,
  TrendingUp,
  Save,
  Target,
} from 'lucide-react';
import {
  KeywordResult,
  KeywordResponse,
  IntentCluster,
  Audience,
  ProjectType,
  INTENT_CLUSTER_CONFIG,
  AUDIENCE_CONFIG,
  PROJECT_TYPE_CONFIG,
  LeadSource,
} from '@/lib/keyword-types';
import { TRADES } from '@/lib/trades';
import { formatCacheAge } from '@/lib/keyword-cache';

// US States for dropdown
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
];

type SortField = 'keyword' | 'cluster' | 'score' | 'potentialJobs';
type SortDirection = 'asc' | 'desc';

// Content generator function
const generateJobWinningContent = (keywords: string[], trade: string, city: string) => {
  const topKeywords = keywords.slice(0, 5);
  return `## Service Page Outline: ${trade} in ${city}

### H1: Professional ${trade} Services in ${city}

### Introduction (use these phrases naturally):
${topKeywords.map(k => `- "${k}"`).join('\n')}

### Services Section:
- List your ${trade.toLowerCase()} specialties
- Mention specific services: installation, repair, maintenance
- Include "${topKeywords[0]}" in your first paragraph

### Why Choose Us:
- Licensed & insured ${trade.toLowerCase()} contractor
- Local to ${city} and surrounding areas
- Fast response times & free estimates
- [X] years of experience

### Call to Action:
"Looking for a reliable ${trade.toLowerCase()}? Contact us today for a free estimate."

---

## Google Ads Headlines (30 chars max):
1. ${trade} in ${city} | Free Quote
2. Licensed ${trade} Near You
3. ${city}'s Trusted ${trade}
4. Same-Day ${trade} Service
5. Top-Rated ${trade} Pros

## Google Ads Descriptions:
- Professional ${trade.toLowerCase()} services in ${city}. Licensed, insured, free estimates. Call today!
- Need a ${trade.toLowerCase()}? We serve ${city} & nearby areas. Fast response, quality work guaranteed.

---

## Social Media Posts:

**Facebook/LinkedIn:**
"Need a reliable ${trade.toLowerCase()} in ${city}? We're here to help!

- Licensed & Insured
- Free Estimates
- Fast Response Times

DM us or call for your next project!"

**Instagram:**
"Just wrapped up another job in ${city}!

If you're searching for "${topKeywords[0]}" - look no further.

Link in bio for free estimates

#${trade.replace(/\s+/g, '')} #${city.replace(/\s+/g, '')} #Contractor #SubPaid"
`;
};

export default function KeywordsPage() {
  // Filter states
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [audience, setAudience] = useState<Audience>('GET_HIRED');
  const [projectType, setProjectType] = useState<ProjectType>('ALL');
  const [radiusMiles, setRadiusMiles] = useState(25);

  // UI states
  const [isTradeDropdownOpen, setIsTradeDropdownOpen] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results states
  const [response, setResponse] = useState<KeywordResponse | null>(null);
  const [activeClusterFilter, setActiveClusterFilter] = useState<IntentCluster | 'all'>('all');
  const [sortField, setSortField] = useState<SortField>('score');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selection & generator states
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  // Lead source states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [leadSourceName, setLeadSourceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load onboarding data if available
  useEffect(() => {
    const onboardingData = localStorage.getItem('onboardingData');
    if (onboardingData) {
      try {
        const data = JSON.parse(onboardingData);
        if (data.trades && data.trades.length > 0) {
          setSelectedTrades(data.trades);
        }
        if (data.city) {
          setCity(data.city);
        }
        if (data.state) {
          setState(data.state);
        }
        // Clear after loading
        localStorage.removeItem('onboardingData');
        // Auto-generate after a brief delay
        setTimeout(() => {
          if (data.trades?.length > 0 && data.city && data.state) {
            handleGenerateWithData(data.trades, data.city, data.state);
          }
        }, 500);
      } catch (e) {
        console.error('Error loading onboarding data:', e);
      }
    }
  }, []);

  // Generate keywords with specific data
  const handleGenerateWithData = async (trades: string[], cityVal: string, stateVal: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/keywords/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trades,
          location: { city: cityVal, state: stateVal },
          radiusMiles,
          audience,
          vertical: projectType,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate keywords');
      }

      const data = await res.json();
      setResponse(data);
      setActiveClusterFilter('all');
      setSelectedKeywords(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate keywords');
    } finally {
      setIsLoading(false);
    }
  };

  // Generate keywords
  const handleGenerate = async () => {
    if (selectedTrades.length === 0) {
      setError('Please select at least one trade');
      return;
    }
    if (!city || !state) {
      setError('Please enter a city and select a state');
      return;
    }

    await handleGenerateWithData(selectedTrades, city, state);
  };

  // Export to CSV
  const handleExport = async () => {
    if (!response || filteredKeywords.length === 0) return;

    try {
      const res = await fetch('/api/keywords/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keywords: filteredKeywords,
          filename: `keywords-${selectedTrades.join('-')}-${city}-${state}`,
        }),
      });

      if (!res.ok) throw new Error('Export failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keywords-${selectedTrades.join('-')}-${city}-${state}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Copy keyword to clipboard
  const handleCopy = async (keyword: string, id: string) => {
    await navigator.clipboard.writeText(keyword);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Toggle trade selection
  const toggleTrade = (trade: string) => {
    setSelectedTrades((prev) =>
      prev.includes(trade) ? prev.filter((t) => t !== trade) : [...prev, trade]
    );
  };

  // Toggle keyword selection
  const toggleKeywordSelection = (keyword: string) => {
    setSelectedKeywords((prev) => {
      const next = new Set(prev);
      if (next.has(keyword)) {
        next.delete(keyword);
      } else {
        next.add(keyword);
      }
      return next;
    });
  };

  // Select all visible keywords
  const selectAllKeywords = () => {
    const allVisible = filteredKeywords.slice(0, 100).map((kw) => kw.keyword);
    setSelectedKeywords(new Set(allVisible));
  };

  // Clear selection
  const clearSelection = () => {
    setSelectedKeywords(new Set());
  };

  // Generate content from selected keywords
  const handleGenerateContent = () => {
    if (selectedKeywords.size === 0) return;
    const content = generateJobWinningContent(
      Array.from(selectedKeywords),
      selectedTrades[0] || 'Contractor',
      city || 'Your City'
    );
    setGeneratedContent(content);
    setShowGenerator(true);
    // Set default lead source name
    setLeadSourceName(`${selectedTrades[0] || 'Contractor'} - ${city || 'Local'}`);
  };

  // Copy generated content
  const handleCopyContent = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
    }
  };

  // Save as lead source
  const handleSaveAsLeadSource = async () => {
    if (!generatedContent || !leadSourceName) return;

    setIsSaving(true);
    try {
      const res = await fetch('/api/lead-sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadSourceName,
          keywords: Array.from(selectedKeywords),
          generatedContent,
          filters: {
            trades: selectedTrades,
            location: { city, state },
            radiusMiles,
            audience,
            vertical: projectType,
          },
        }),
      });

      if (!res.ok) throw new Error('Failed to save lead source');

      setSaveSuccess(true);
      setTimeout(() => {
        setShowSaveModal(false);
        setSaveSuccess(false);
      }, 1500);
    } catch (err) {
      console.error('Save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Filter and sort keywords
  const filteredKeywords = useMemo(() => {
    if (!response) return [];

    let filtered = response.keywords;

    // Filter by cluster
    if (activeClusterFilter !== 'all') {
      filtered = filtered.filter((kw) => kw.cluster === activeClusterFilter);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'keyword':
          comparison = a.keyword.localeCompare(b.keyword);
          break;
        case 'cluster':
          comparison = a.cluster.localeCompare(b.cluster);
          break;
        case 'score':
          comparison = a.score - b.score;
          break;
        case 'potentialJobs':
          comparison = (a.potentialJobs || 0) - (b.potentialJobs || 0);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [response, activeClusterFilter, sortField, sortDirection]);

  // Calculate total potential jobs
  const totalPotentialJobs = useMemo(() => {
    if (!response) return { min: 0, max: 0 };
    const total = response.keywords.reduce((sum, kw) => sum + (kw.potentialJobs || 0), 0);
    // Show a range to be more realistic
    return {
      min: Math.floor(total * 0.7),
      max: Math.ceil(total * 1.3),
    };
  }, [response]);

  // Estimate potential revenue (average job value $2k-$5k)
  const potentialRevenue = useMemo(() => {
    const avgJobValue = 3500;
    return {
      min: totalPotentialJobs.min * 2000,
      max: totalPotentialJobs.max * 5000,
    };
  }, [totalPotentialJobs]);

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-[#A855F7]" />
            Find More Work
          </h1>
          <p className="text-gray-600 mt-1">
            Discover what people search when looking for contractors like you — then turn those keywords into job-winning content.
          </p>
        </div>
        {response && filteredKeywords.length > 0 && (
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Trades Multi-select */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Briefcase className="w-4 h-4 inline mr-1" />
              Your Trade
            </label>
            <button
              type="button"
              onClick={() => setIsTradeDropdownOpen(!isTradeDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
            >
              <span className="truncate">
                {selectedTrades.length === 0
                  ? 'What do you do?'
                  : `${selectedTrades.length} selected`}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {isTradeDropdownOpen && (
              <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {TRADES.map((trade) => (
                  <label
                    key={trade}
                    className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTrades.includes(trade)}
                      onChange={() => toggleTrade(trade)}
                      className="rounded border-gray-300 text-[#A855F7] focus:ring-[#A855F7]"
                    />
                    <span className="ml-2 text-sm text-gray-700">{trade}</span>
                  </label>
                ))}
              </div>
            )}
            {/* Selected trades chips */}
            {selectedTrades.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {selectedTrades.slice(0, 3).map((trade) => (
                  <span
                    key={trade}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-[#A855F7]/10 text-[#A855F7]"
                  >
                    {trade}
                    <button
                      onClick={() => toggleTrade(trade)}
                      className="ml-1 hover:text-[#7C3AED]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedTrades.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{selectedTrades.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 inline mr-1" />
              Where do you work?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
              />
              <div className="relative w-32">
                <button
                  type="button"
                  onClick={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                >
                  <span className="truncate">{state || 'State'}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {isStateDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {US_STATES.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setState(s);
                          setIsStateDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Users className="w-4 h-4 inline mr-1" />
              I want to...
            </label>
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              {(['GET_HIRED', 'FIND_WORK'] as Audience[]).map((a) => (
                <button
                  key={a}
                  onClick={() => setAudience(a)}
                  className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                    audience === a
                      ? 'bg-[#A855F7] text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {AUDIENCE_CONFIG[a].label}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">{AUDIENCE_CONFIG[audience].description}</p>
          </div>

          {/* Project Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Building2 className="w-4 h-4 inline mr-1" />
              Project Type
            </label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value as ProjectType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
            >
              {Object.entries(PROJECT_TYPE_CONFIG).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>

          {/* Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MapPin className="w-4 h-4 inline mr-1" />
              Service Area
            </label>
            <select
              value={radiusMiles}
              onChange={(e) => setRadiusMiles(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
            >
              <option value={10}>10 miles</option>
              <option value={25}>25 miles</option>
              <option value={50}>50 miles</option>
              <option value={100}>100 miles</option>
            </select>
          </div>

          {/* Generate Button */}
          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#A855F7] text-white rounded-lg hover:bg-[#9333EA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Finding keywords...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Find Keywords
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Summary Stats - Show after results */}
      {response && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#A855F7]/10 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-[#A855F7]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{response.stats.total}</div>
                <div className="text-sm text-gray-500">Keywords Found</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-700">
                  {totalPotentialJobs.min}-{totalPotentialJobs.max}
                </div>
                <div className="text-sm text-green-600">Potential Jobs/Month</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-700">
                  ${(potentialRevenue.min / 1000).toFixed(0)}k-${(potentialRevenue.max / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-blue-600">Revenue Potential/Month</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips Section - Show after results */}
      {response && (
        <div className="bg-[#A855F7]/5 border border-[#A855F7]/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-[#A855F7] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900 mb-1">Use these keywords to get more jobs:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  Create service pages that rank on Google
                </li>
                <li className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-gray-400" />
                  Run ads that bring inbound work
                </li>
                <li className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-gray-400" />
                  Write posts that attract general contractors
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {response && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Results Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="font-semibold text-gray-900">
                  {filteredKeywords.length} keywords found
                </span>
                <span className="text-gray-500 ml-2">
                  - Updated {formatCacheAge(response.generatedAt)}
                </span>
                {(response as any).fromCache && (
                  <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                    Cached
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {selectedKeywords.size > 0 && (
                  <span className="text-sm text-gray-500">
                    {selectedKeywords.size} selected
                  </span>
                )}
                <button
                  onClick={handleGenerateContent}
                  disabled={selectedKeywords.size === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Turn Into Job-Winning Page
                </button>
              </div>
            </div>

            {/* Cluster Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setActiveClusterFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeClusterFilter === 'all'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({response.stats.total})
              </button>
              {(Object.keys(INTENT_CLUSTER_CONFIG) as IntentCluster[]).map((cluster) => {
                const config = INTENT_CLUSTER_CONFIG[cluster];
                const count = response.stats.byCluster[cluster];
                if (count === 0) return null;
                return (
                  <button
                    key={cluster}
                    onClick={() => setActiveClusterFilter(cluster)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      activeClusterFilter === cluster
                        ? `${config.bgColor} ${config.color}`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {config.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedKeywords.size === Math.min(filteredKeywords.length, 100)}
                      onChange={() => {
                        if (selectedKeywords.size === Math.min(filteredKeywords.length, 100)) {
                          clearSelection();
                        } else {
                          selectAllKeywords();
                        }
                      }}
                      className="rounded border-gray-300 text-[#A855F7] focus:ring-[#A855F7]"
                    />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('keyword')}
                  >
                    Keyword <SortIcon field="keyword" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('cluster')}
                  >
                    Category <SortIcon field="cluster" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('score')}
                  >
                    Value <SortIcon field="score" />
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('potentialJobs')}
                  >
                    Est. Jobs/Mo <SortIcon field="potentialJobs" />
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Copy
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredKeywords.slice(0, 100).map((kw) => {
                  const clusterConfig = INTENT_CLUSTER_CONFIG[kw.cluster];
                  const isSelected = selectedKeywords.has(kw.keyword);
                  return (
                    <tr
                      key={kw.id}
                      className={`hover:bg-gray-50 ${isSelected ? 'bg-[#A855F7]/5' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleKeywordSelection(kw.keyword)}
                          className="rounded border-gray-300 text-[#A855F7] focus:ring-[#A855F7]"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-gray-900 font-medium">{kw.keyword}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${clusterConfig.bgColor} ${clusterConfig.color}`}
                        >
                          {clusterConfig.name}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-[#A855F7] h-2 rounded-full"
                              style={{ width: `${(kw.score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{kw.score}/10</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-green-600" title={`~${kw.estimatedVolume || 0} monthly searches`}>
                          ~{kw.potentialJobs || 0}/mo
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleCopy(kw.keyword, kw.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                          title="Copy keyword"
                        >
                          {copiedId === kw.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredKeywords.length > 100 && (
            <div className="p-4 border-t border-gray-200 text-center text-sm text-gray-500">
              Showing 100 of {filteredKeywords.length} keywords. Export to CSV to see all.
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!response && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-[#A855F7]/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Find Keywords That Bring You Work
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            These are real phrases people type into Google when looking to hire contractors like you.
            Select your trade and location to see what they&apos;re searching for.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Electrical', 'Plumbing', 'HVAC', 'Roofing'].map((trade) => (
              <button
                key={trade}
                onClick={() => toggleTrade(trade)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedTrades.includes(trade)
                    ? 'bg-[#A855F7]/10 text-[#A855F7]'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {trade}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Generator Modal */}
      {showGenerator && generatedContent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#9FE870]" />
                  Your Job-Winning Content
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Copy and customize this for your website, ads, and social media
                </p>
              </div>
              <button
                onClick={() => setShowGenerator(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 rounded-xl p-4">
                {generatedContent}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-between gap-3">
              <button
                onClick={() => {
                  setShowGenerator(false);
                  setShowSaveModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/30 rounded-lg font-medium hover:bg-[#22C55E]/20 transition-colors"
              >
                <Target className="w-4 h-4" />
                Save as Lead Source
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowGenerator(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-2 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:bg-[#8FD860] transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  Copy All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save as Lead Source Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-[#22C55E]" />
                Save as Lead Source
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Track jobs and revenue from this content
              </p>
            </div>
            <div className="p-6">
              {saveSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-lg font-medium text-gray-900">Saved!</p>
                  <p className="text-sm text-gray-500">View in Lead Sources dashboard</p>
                </div>
              ) : (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Source Name
                  </label>
                  <input
                    type="text"
                    value={leadSourceName}
                    onChange={(e) => setLeadSourceName(e.target.value)}
                    placeholder="e.g., Electrical Services - Miami"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-[#22C55E]"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedKeywords.size} keywords - {city}, {state}
                  </p>
                </>
              )}
            </div>
            {!saveSuccess && (
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAsLeadSource}
                  disabled={!leadSourceName || isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#22C55E] text-white rounded-lg font-medium hover:bg-[#16A34A] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Lead Source
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(isTradeDropdownOpen || isStateDropdownOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsTradeDropdownOpen(false);
            setIsStateDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
