'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  MapPin,
  Briefcase,
  Sparkles,
  Search,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { TRADES } from '@/lib/trades';
import { LoadingSpinner } from '@/components/ui';

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

// Popular trades shown first
const POPULAR_TRADES = ['Electrical', 'Plumbing', 'HVAC', 'Roofing', 'Painting', 'Concrete', 'Carpentry', 'Drywall'];

interface OnboardingData {
  trades: string[];
  city: string;
  state: string;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();

  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    trades: [],
    city: '',
    state: '',
  });
  const [showAllTrades, setShowAllTrades] = useState(false);
  const [previewKeywords, setPreviewKeywords] = useState<string[]>([]);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, authLoading, router]);

  // Generate preview keywords when we have enough data
  useEffect(() => {
    if (step === 3 && data.trades.length > 0 && data.city && data.state) {
      generatePreviewKeywords();
    }
  }, [step, data.trades, data.city, data.state]);

  const generatePreviewKeywords = async () => {
    setIsLoadingPreview(true);
    // Generate quick preview keywords
    const trade = data.trades[0].toLowerCase();
    const city = data.city.toLowerCase();
    const previews = [
      `${trade} near me`,
      `${trade} contractor ${city}`,
      `best ${trade} contractors ${city}`,
      `${trade} services ${city}`,
      `licensed ${trade} ${data.state.toLowerCase()}`,
      `${trade} subcontractor jobs ${city}`,
    ];
    // Simulate brief loading
    await new Promise(resolve => setTimeout(resolve, 500));
    setPreviewKeywords(previews);
    setIsLoadingPreview(false);
  };

  const toggleTrade = (trade: string) => {
    setData(prev => ({
      ...prev,
      trades: prev.trades.includes(trade)
        ? prev.trades.filter(t => t !== trade)
        : [...prev.trades, trade],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return data.trades.length > 0;
      case 2:
        return data.city.trim() !== '' && data.state !== '';
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save onboarding data to localStorage and redirect to keywords page
      localStorage.setItem('onboardingData', JSON.stringify(data));
      router.push('/dashboard/keywords');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7FBF4]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#2d2d44] flex flex-col">
      {/* Header */}
      <header className="p-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <span className="text-[#1a1a2e] font-bold text-xl">S</span>
            </div>
            <span className="text-white font-bold text-xl">SubPaid</span>
          </Link>
          <button
            onClick={handleSkip}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Skip for now
          </button>
        </div>
      </header>

      {/* Progress bar */}
      <div className="max-w-2xl mx-auto w-full px-6 mb-8">
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  s <= step ? 'bg-[#9FE870]' : 'bg-white/20'
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-white/50 text-sm mt-2 text-center">Step {step} of 3</p>
      </div>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="w-full max-w-2xl">
          {/* Step 1: Select Trades */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#A855F7]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-8 h-8 text-[#A855F7]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                What trade are you in?
              </h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                We&apos;ll show you what potential customers are searching for when they need your services.
              </p>

              {/* Trade selection */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {POPULAR_TRADES.map((trade) => (
                  <button
                    key={trade}
                    onClick={() => toggleTrade(trade)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      data.trades.includes(trade)
                        ? 'bg-[#9FE870] text-[#1a1a2e]'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {data.trades.includes(trade) && <Check className="w-4 h-4 inline mr-1" />}
                    {trade}
                  </button>
                ))}
              </div>

              {/* Show more trades */}
              {!showAllTrades ? (
                <button
                  onClick={() => setShowAllTrades(true)}
                  className="text-[#9FE870] text-sm hover:underline"
                >
                  Show all trades +
                </button>
              ) : (
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {TRADES.filter(t => !POPULAR_TRADES.includes(t)).map((trade) => (
                    <button
                      key={trade}
                      onClick={() => toggleTrade(trade)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        data.trades.includes(trade)
                          ? 'bg-[#9FE870] text-[#1a1a2e]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {trade}
                    </button>
                  ))}
                </div>
              )}

              {data.trades.length > 0 && (
                <p className="text-white/50 text-sm mt-6">
                  Selected: {data.trades.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#54A0FF]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-8 h-8 text-[#54A0FF]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Where do you work?
              </h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                We&apos;ll find local keyword opportunities in your service area.
              </p>

              <div className="max-w-sm mx-auto space-y-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2 text-left">
                    City
                  </label>
                  <input
                    type="text"
                    value={data.city}
                    onChange={(e) => setData(prev => ({ ...prev, city: e.target.value }))}
                    placeholder="e.g., Miami"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2 text-left">
                    State
                  </label>
                  <select
                    value={data.state}
                    onChange={(e) => setData(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20"
                  >
                    <option value="" className="text-gray-900">Select a state</option>
                    {US_STATES.map((state) => (
                      <option key={state} value={state} className="text-gray-900">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Go */}
          {step === 3 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-[#9FE870]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#9FE870]" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                Here&apos;s what people search for
              </h1>
              <p className="text-white/60 mb-8 max-w-md mx-auto">
                These are real keywords that potential customers in {data.city} use to find {data.trades[0]} contractors.
              </p>

              {/* Preview keywords */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                {isLoadingPreview ? (
                  <div className="flex items-center justify-center py-8">
                    <LoadingSpinner />
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {previewKeywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-[#A855F7]/20 text-[#A855F7] rounded-lg text-sm font-medium"
                        >
                          <Search className="w-3 h-3 inline mr-1" />
                          {kw}
                        </span>
                      ))}
                    </div>
                    <p className="text-white/40 text-sm">
                      ...and 100+ more keywords waiting for you
                    </p>
                  </>
                )}
              </div>

              {/* Value props */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Search className="w-5 h-5 text-[#54A0FF] mb-2 mx-auto" />
                  <p className="text-white text-sm font-medium">Find Keywords</p>
                  <p className="text-white/50 text-xs">That bring customers</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <Sparkles className="w-5 h-5 text-[#9FE870] mb-2 mx-auto" />
                  <p className="text-white text-sm font-medium">Generate Content</p>
                  <p className="text-white/50 text-xs">Service pages & ads</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <TrendingUp className="w-5 h-5 text-[#FF9F43] mb-2 mx-auto" />
                  <p className="text-white text-sm font-medium">Get More Work</p>
                  <p className="text-white/50 text-xs">Track your ROI</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex items-center justify-between mt-8 max-w-sm mx-auto">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                canProceed()
                  ? 'bg-[#9FE870] text-[#1a1a2e] hover:shadow-lg'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Find More Work' : 'Continue'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
