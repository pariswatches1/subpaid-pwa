'use client';

import { useState, useEffect } from 'react';
import {
  BadgeCheck,
  FileText,
  Shield,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock,
  Building2,
  Share2,
  Download,
  Plus,
  Calendar,
  Award,
  Briefcase,
  ChevronRight,
  RefreshCw,
  Eye,
  Lock
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: string;
  status: 'verified' | 'expiring' | 'expired' | 'pending';
  expirationDate?: string;
  uploadDate: string;
  autoRefresh: boolean;
}

interface SharedGC {
  id: string;
  name: string;
  sharedDate: string;
  autoUpdate: boolean;
  lastViewed?: string;
}

const documents: Document[] = [
  { id: '1', name: 'General Liability Insurance', type: 'insurance', status: 'verified', expirationDate: '2026-12-15', uploadDate: '2025-12-15', autoRefresh: true },
  { id: '2', name: 'Workers Comp Certificate', type: 'insurance', status: 'verified', expirationDate: '2026-06-30', uploadDate: '2025-06-30', autoRefresh: true },
  { id: '3', name: 'Contractor License #847293', type: 'license', status: 'verified', expirationDate: '2027-03-01', uploadDate: '2024-03-01', autoRefresh: false },
  { id: '4', name: 'W-9 (2026)', type: 'tax', status: 'verified', uploadDate: '2026-01-15', autoRefresh: false },
  { id: '5', name: 'EMR Rating Certificate', type: 'safety', status: 'expiring', expirationDate: '2026-02-28', uploadDate: '2025-02-28', autoRefresh: false },
  { id: '6', name: 'Bonding Capacity Letter', type: 'financial', status: 'verified', expirationDate: '2026-08-01', uploadDate: '2025-08-01', autoRefresh: false },
  { id: '7', name: 'OSHA 10-Hour Card', type: 'safety', status: 'pending', uploadDate: '2026-01-20', autoRefresh: false },
];

const sharedGCs: SharedGC[] = [
  { id: '1', name: 'Metro Builders Inc', sharedDate: '2025-10-15', autoUpdate: true, lastViewed: '2026-02-01' },
  { id: '2', name: 'Thompson Construction', sharedDate: '2025-11-20', autoUpdate: true, lastViewed: '2026-01-28' },
  { id: '3', name: 'ABC General Contractors', sharedDate: '2026-01-05', autoUpdate: false },
];

const performanceMetrics = {
  activeProjects: 4,
  completedProjects: 23,
  onTimeRate: 96,
  safetyIncidents: 0,
  avgProjectValue: 67500,
};

export default function PreQualPage() {
  const [activeTab, setActiveTab] = useState<'documents' | 'shared' | 'metrics'>('documents');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getDaysUntil = (dateStr: string) => {
    if (!mounted) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatusBadge = (status: string, expirationDate?: string) => {
    switch (status) {
      case 'verified':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded-full">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'expiring':
        const days = expirationDate ? getDaysUntil(expirationDate) : 0;
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-[#FF9F43]/10 text-[#FF9F43] text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Expires in {days}d
          </span>
        );
      case 'expired':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-[#FF6B6B]/10 text-[#FF6B6B] text-xs font-medium rounded-full">
            <AlertTriangle className="w-3 h-3" />
            Expired
          </span>
        );
      case 'pending':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-[#54A0FF]/10 text-[#54A0FF] text-xs font-medium rounded-full">
            <Clock className="w-3 h-3" />
            Pending Review
          </span>
        );
      default:
        return null;
    }
  };

  const completionPercentage = Math.round(
    (documents.filter(d => d.status === 'verified').length / documents.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#9FE870] to-[#22C55E] rounded-xl flex items-center justify-center">
            <BadgeCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">PreQual Passport</h1>
            <p className="text-[#1a1a2e]/60">Your universal prequalification profile</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all">
          <Share2 className="w-4 h-4" />
          Share Profile
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#2d2d44] rounded-xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-xl flex items-center justify-center text-2xl font-bold">
              EP
            </div>
            <div>
              <h2 className="text-xl font-bold">Electric Pros LLC</h2>
              <p className="text-white/60">Licensed Electrical Contractor • Denver, CO</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-[#9FE870] text-[#1a1a2e] text-xs font-bold rounded">
                  VERIFIED
                </span>
                <span className="text-white/60 text-sm">License #847293</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{completionPercentage}%</p>
              <p className="text-white/60 text-sm">Profile Complete</p>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="none" />
                <circle
                  cx="32" cy="32" r="28"
                  stroke="#9FE870"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${completionPercentage * 1.76} 176`}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1a1a2e]/10">
        {[
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'shared', label: 'Shared With', icon: Building2 },
          { id: 'metrics', label: 'Performance', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#9FE870] text-[#1a1a2e]'
                : 'border-transparent text-[#1a1a2e]/60 hover:text-[#1a1a2e]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Alert for expiring docs */}
          {documents.some(d => d.status === 'expiring') && (
            <div className="bg-[#FF9F43]/10 border border-[#FF9F43]/30 rounded-xl p-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-[#FF9F43]" />
              <div className="flex-1">
                <p className="font-medium text-[#1a1a2e]">Documents Expiring Soon</p>
                <p className="text-sm text-[#1a1a2e]/60">
                  {documents.filter(d => d.status === 'expiring').length} document(s) will expire within 30 days
                </p>
              </div>
              <button className="px-4 py-2 bg-[#FF9F43] text-white rounded-lg font-medium hover:bg-[#FF8F33] transition-all">
                Update Now
              </button>
            </div>
          )}

          {/* Documents List */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
            <div className="p-4 border-b border-[#1a1a2e]/10 flex items-center justify-between">
              <h3 className="font-semibold text-[#1a1a2e]">Verified Documents</h3>
              <button className="flex items-center gap-2 text-[#54A0FF] text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" />
                Add Document
              </button>
            </div>
            <div className="divide-y divide-[#1a1a2e]/5">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      doc.type === 'insurance' ? 'bg-[#54A0FF]/10' :
                      doc.type === 'license' ? 'bg-[#9FE870]/10' :
                      doc.type === 'safety' ? 'bg-[#FF9F43]/10' :
                      doc.type === 'financial' ? 'bg-[#FECA57]/10' :
                      'bg-[#1a1a2e]/5'
                    }`}>
                      {doc.type === 'insurance' ? <Shield className="w-5 h-5 text-[#54A0FF]" /> :
                       doc.type === 'license' ? <Award className="w-5 h-5 text-[#9FE870]" /> :
                       doc.type === 'safety' ? <BadgeCheck className="w-5 h-5 text-[#FF9F43]" /> :
                       <FileText className="w-5 h-5 text-[#FECA57]" />}
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{doc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-[#1a1a2e]/60">
                        {doc.expirationDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Exp: {formatDate(doc.expirationDate)}
                          </span>
                        )}
                        {doc.autoRefresh && (
                          <span className="flex items-center gap-1 text-[#22C55E]">
                            <RefreshCw className="w-3 h-3" />
                            Auto-refresh
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status, doc.expirationDate)}
                    <button className="p-2 text-[#1a1a2e]/40 hover:text-[#1a1a2e] transition-colors" aria-label="View document">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Shared With Tab */}
      {activeTab === 'shared' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
            <div className="p-4 border-b border-[#1a1a2e]/10 flex items-center justify-between">
              <h3 className="font-semibold text-[#1a1a2e]">Shared With GCs ({sharedGCs.length})</h3>
              <button className="flex items-center gap-2 text-[#54A0FF] text-sm font-medium hover:underline">
                <Plus className="w-4 h-4" />
                Share with New GC
              </button>
            </div>
            <div className="divide-y divide-[#1a1a2e]/5">
              {sharedGCs.map((gc) => (
                <div key={gc.id} className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#FECA57]/20 rounded-lg flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-[#FECA57]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{gc.name}</p>
                      <div className="flex items-center gap-3 text-sm text-[#1a1a2e]/60">
                        <span>Shared {formatDate(gc.sharedDate)}</span>
                        {gc.lastViewed && (
                          <span className="flex items-center gap-1 text-[#22C55E]">
                            <Eye className="w-3 h-3" />
                            Viewed {formatDate(gc.lastViewed)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {gc.autoUpdate ? (
                      <span className="flex items-center gap-1 px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded-full">
                        <RefreshCw className="w-3 h-3" />
                        Auto-updates
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-1 bg-[#1a1a2e]/5 text-[#1a1a2e]/60 text-xs font-medium rounded-full">
                        <Lock className="w-3 h-3" />
                        Static
                      </span>
                    )}
                    <button className="p-2 text-[#1a1a2e]/40 hover:text-[#FF6B6B] transition-colors" aria-label="Remove access">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#54A0FF]/10 rounded-xl p-6 border border-[#54A0FF]/30">
            <h3 className="font-semibold text-[#1a1a2e] mb-2">One Profile, Every GC</h3>
            <p className="text-sm text-[#1a1a2e]/70 mb-4">
              Stop filling out repetitive prequalification forms. Share your PreQual Passport with any GC,
              and it automatically adapts to their requirements. Updates sync in real-time.
            </p>
            <button className="flex items-center gap-2 text-[#54A0FF] font-medium hover:underline">
              Learn how it works
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Performance Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
              <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                <Briefcase className="w-4 h-4" />
                Active Projects
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{performanceMetrics.activeProjects}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
              <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                <CheckCircle className="w-4 h-4" />
                Completed (12mo)
              </div>
              <p className="text-2xl font-bold text-[#1a1a2e]">{performanceMetrics.completedProjects}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
              <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                <Clock className="w-4 h-4" />
                On-Time Rate
              </div>
              <p className="text-2xl font-bold text-[#22C55E]">{performanceMetrics.onTimeRate}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
              <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                <Shield className="w-4 h-4" />
                Safety Incidents
              </div>
              <p className="text-2xl font-bold text-[#22C55E]">{performanceMetrics.safetyIncidents}</p>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
              <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
                <Award className="w-4 h-4" />
                EMR Rating
              </div>
              <p className="text-2xl font-bold text-[#9FE870]">0.85</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
            <h3 className="font-semibold text-[#1a1a2e] mb-4">Performance Summary</h3>
            <p className="text-[#1a1a2e]/70 mb-4">
              These metrics are automatically calculated from your SubPaid project data and shared with GCs
              when you provide access. Strong performance metrics help you win more bids.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#22C55E]/5 rounded-lg border border-[#22C55E]/20">
                <p className="text-sm text-[#22C55E] font-medium mb-1">Strengths</p>
                <ul className="text-sm text-[#1a1a2e]/70 space-y-1">
                  <li>• Excellent on-time completion rate (96%)</li>
                  <li>• Zero safety incidents in 12 months</li>
                  <li>• Below-average EMR rating (0.85)</li>
                </ul>
              </div>
              <div className="p-4 bg-[#FF9F43]/5 rounded-lg border border-[#FF9F43]/20">
                <p className="text-sm text-[#FF9F43] font-medium mb-1">Opportunities</p>
                <ul className="text-sm text-[#1a1a2e]/70 space-y-1">
                  <li>• Complete OSHA 10-Hour certification</li>
                  <li>• Add more project references</li>
                  <li>• Update bonding capacity letter</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
