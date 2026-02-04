'use client';

import { useState } from 'react';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  FileText,
  Download,
  Bell,
  ChevronRight,
  MapPin,
  Building2,
  Plus,
  Filter,
  Send
} from 'lucide-react';

interface LienProject {
  id: string;
  projectName: string;
  gcName: string;
  address: string;
  state: string;
  startDate: string;
  lastWorkDate: string;
  contractAmount: number;
  amountOwed: number;
  preliminaryNotice: {
    required: boolean;
    deadline: string;
    sent: boolean;
    sentDate?: string;
  };
  mechanicsLien: {
    deadline: string;
    daysRemaining: number;
    filed: boolean;
  };
  status: 'protected' | 'at-risk' | 'expired';
}

const projects: LienProject[] = [
  {
    id: '1',
    projectName: 'Highland Shopping Center - Electrical',
    gcName: 'Metro Builders Inc',
    address: '1234 Highland Ave, Denver, CO 80202',
    state: 'CO',
    startDate: '2025-08-01',
    lastWorkDate: '2025-10-15',
    contractAmount: 125000,
    amountOwed: 38500,
    preliminaryNotice: {
      required: true,
      deadline: '2025-08-21',
      sent: true,
      sentDate: '2025-08-15',
    },
    mechanicsLien: {
      deadline: '2026-02-15',
      daysRemaining: 13,
      filed: false,
    },
    status: 'protected',
  },
  {
    id: '2',
    projectName: 'Riverside Apartments - Phase 2',
    gcName: 'Downtown Development LLC',
    address: '567 River Rd, Phoenix, AZ 85001',
    state: 'AZ',
    startDate: '2025-09-15',
    lastWorkDate: '2025-12-20',
    contractAmount: 89000,
    amountOwed: 24300,
    preliminaryNotice: {
      required: true,
      deadline: '2025-10-05',
      sent: true,
      sentDate: '2025-09-28',
    },
    mechanicsLien: {
      deadline: '2026-04-18',
      daysRemaining: 75,
      filed: false,
    },
    status: 'protected',
  },
  {
    id: '3',
    projectName: 'Medical Office Build-out',
    gcName: 'Thompson Construction',
    address: '890 Health Pkwy, Las Vegas, NV 89101',
    state: 'NV',
    startDate: '2025-11-01',
    lastWorkDate: '2026-01-28',
    contractAmount: 67500,
    amountOwed: 67500,
    preliminaryNotice: {
      required: true,
      deadline: '2025-11-21',
      sent: false,
    },
    mechanicsLien: {
      deadline: '2026-05-27',
      daysRemaining: 114,
      filed: false,
    },
    status: 'at-risk',
  },
  {
    id: '4',
    projectName: 'Warehouse Expansion',
    gcName: 'ABC General Contractors',
    address: '456 Industrial Blvd, Denver, CO 80239',
    state: 'CO',
    startDate: '2025-06-01',
    lastWorkDate: '2025-09-15',
    contractAmount: 45000,
    amountOwed: 12000,
    preliminaryNotice: {
      required: true,
      deadline: '2025-06-21',
      sent: true,
      sentDate: '2025-06-18',
    },
    mechanicsLien: {
      deadline: '2025-12-15',
      daysRemaining: -49,
      filed: false,
    },
    status: 'expired',
  },
];

const stateRules: Record<string, { preLienDays: number; lienDays: number; notes: string }> = {
  CO: { preLienDays: 20, lienDays: 120, notes: 'Preliminary notice required for subs. 4-month lien deadline.' },
  AZ: { preLienDays: 20, lienDays: 120, notes: '20-day preliminary notice. 120 days from completion to file.' },
  NV: { preLienDays: 31, lienDays: 90, notes: 'Notice must be sent within 31 days. 90-day lien window.' },
  CA: { preLienDays: 20, lienDays: 90, notes: '20-day preliminary notice mandatory. 90 days to file lien.' },
  TX: { preLienDays: 15, lienDays: 0, notes: 'Complex tiered system. Notice to owner required 15th of 2nd month.' },
};

export default function LienGuardPage() {
  const [selectedProject, setSelectedProject] = useState<LienProject | null>(projects[0]);
  const [filterStatus, setFilterStatus] = useState<'all' | 'protected' | 'at-risk' | 'expired'>('all');

  const filteredProjects = projects.filter(p => filterStatus === 'all' || p.status === filterStatus);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'protected': return 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30';
      case 'at-risk': return 'bg-[#FF9F43]/10 text-[#FF9F43] border-[#FF9F43]/30';
      case 'expired': return 'bg-[#FF6B6B]/10 text-[#FF6B6B] border-[#FF6B6B]/30';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days < 0) return 'text-[#FF6B6B]';
    if (days <= 14) return 'text-[#FF6B6B]';
    if (days <= 30) return 'text-[#FF9F43]';
    return 'text-[#22C55E]';
  };

  const stats = {
    total: projects.length,
    protected: projects.filter(p => p.status === 'protected').length,
    atRisk: projects.filter(p => p.status === 'at-risk').length,
    expired: projects.filter(p => p.status === 'expired').length,
    totalOwed: projects.reduce((sum, p) => sum + p.amountOwed, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#22C55E] to-[#9FE870] rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">LienGuard</h1>
            <p className="text-[#1a1a2e]/60">Protect your payment rights automatically</p>
          </div>
        </div>
        <button
          onClick={() => alert('Add Project form coming soon. Use the API at POST /api/lien-guard/projects to create a project.')}
          className="flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Total Projects</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#22C55E]/30">
          <p className="text-sm text-[#22C55E]">Protected</p>
          <p className="text-2xl font-bold text-[#22C55E]">{stats.protected}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#FF9F43]/30">
          <p className="text-sm text-[#FF9F43]">At Risk</p>
          <p className="text-2xl font-bold text-[#FF9F43]">{stats.atRisk}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#FF6B6B]/30">
          <p className="text-sm text-[#FF6B6B]">Expired</p>
          <p className="text-2xl font-bold text-[#FF6B6B]">{stats.expired}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <p className="text-sm text-[#1a1a2e]/60">Amount Protected</p>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(stats.totalOwed)}</p>
        </div>
      </div>

      {/* Urgent Alerts */}
      {projects.some(p => p.mechanicsLien.daysRemaining <= 14 && p.mechanicsLien.daysRemaining > 0) && (
        <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-[#FF6B6B]" />
            <div className="flex-1">
              <p className="font-semibold text-[#FF6B6B]">Urgent: Lien Deadline Approaching</p>
              <p className="text-sm text-[#1a1a2e]/70">
                {projects.filter(p => p.mechanicsLien.daysRemaining <= 14 && p.mechanicsLien.daysRemaining > 0).length} project(s)
                have lien deadlines within 2 weeks. Take action to protect your payment rights.
              </p>
            </div>
            <button
              onClick={() => setFilterStatus('at-risk')}
              className="px-4 py-2 bg-[#FF6B6B] text-white rounded-lg font-medium hover:bg-[#FF5252] transition-all"
            >
              View Urgent
            </button>
          </div>
        </div>
      )}

      {/* Filter Buttons */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(['all', 'protected', 'at-risk', 'expired'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filterStatus === status
                ? 'bg-[#1a1a2e] text-white'
                : 'bg-white border border-[#1a1a2e]/10 text-[#1a1a2e]/70 hover:border-[#9FE870]'
            }`}
          >
            {status === 'all' ? 'All Projects' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Project List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-[#1a1a2e]">Projects ({filteredProjects.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedProject?.id === project.id
                    ? 'bg-[#9FE870]/10 border-[#9FE870]'
                    : 'bg-white border-[#1a1a2e]/10 hover:border-[#9FE870]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-semibold text-[#1a1a2e] text-sm line-clamp-1">{project.projectName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                    {project.status === 'at-risk' ? 'At Risk' : project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                </div>
                <div className="text-xs text-[#1a1a2e]/60 mb-2">{project.gcName}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-[#1a1a2e]">{formatCurrency(project.amountOwed)}</span>
                  <span className={`text-xs font-medium ${getUrgencyColor(project.mechanicsLien.daysRemaining)}`}>
                    {project.mechanicsLien.daysRemaining < 0
                      ? 'Expired'
                      : `${project.mechanicsLien.daysRemaining}d remaining`
                    }
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Project Detail */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
              {/* Project Header */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#1a1a2e]">{selectedProject.projectName}</h2>
                    <p className="text-[#1a1a2e]/60">{selectedProject.gcName}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status === 'at-risk' ? 'At Risk' : selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/60">
                  <MapPin className="w-4 h-4" />
                  {selectedProject.address}
                </div>
              </div>

              {/* State Rules */}
              <div className="p-4 bg-[#54A0FF]/5 border-b border-[#1a1a2e]/10">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-[#54A0FF] text-white rounded font-medium">{selectedProject.state}</span>
                  <span className="text-[#1a1a2e]/70">{stateRules[selectedProject.state]?.notes || 'State rules not found'}</span>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Lien Rights Timeline</h3>
                <div className="relative">
                  {/* Timeline bar */}
                  <div className="h-2 bg-[#1a1a2e]/10 rounded-full mb-6">
                    <div
                      className={`h-full rounded-full ${selectedProject.status === 'expired' ? 'bg-[#FF6B6B]' : 'bg-[#9FE870]'}`}
                      style={{
                        width: selectedProject.mechanicsLien.daysRemaining < 0
                          ? '100%'
                          : `${Math.max(0, 100 - (selectedProject.mechanicsLien.daysRemaining / 120) * 100)}%`
                      }}
                    />
                  </div>

                  {/* Timeline points */}
                  <div className="flex justify-between text-xs">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-[#22C55E] rounded-full mx-auto mb-1" />
                      <div className="text-[#1a1a2e]/60">Start</div>
                      <div className="font-medium">{formatDate(selectedProject.startDate)}</div>
                    </div>
                    <div className="text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${selectedProject.preliminaryNotice.sent ? 'bg-[#22C55E]' : 'bg-[#FF9F43]'}`} />
                      <div className="text-[#1a1a2e]/60">Pre-Notice</div>
                      <div className="font-medium">{formatDate(selectedProject.preliminaryNotice.deadline)}</div>
                    </div>
                    <div className="text-center">
                      <div className="w-3 h-3 bg-[#54A0FF] rounded-full mx-auto mb-1" />
                      <div className="text-[#1a1a2e]/60">Last Work</div>
                      <div className="font-medium">{formatDate(selectedProject.lastWorkDate)}</div>
                    </div>
                    <div className="text-center">
                      <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${selectedProject.mechanicsLien.daysRemaining < 0 ? 'bg-[#FF6B6B]' : 'bg-[#FF9F43]'}`} />
                      <div className="text-[#1a1a2e]/60">Lien Deadline</div>
                      <div className={`font-medium ${getUrgencyColor(selectedProject.mechanicsLien.daysRemaining)}`}>
                        {formatDate(selectedProject.mechanicsLien.deadline)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Status */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Document Status</h3>
                <div className="space-y-4">
                  {/* Preliminary Notice */}
                  <div className={`p-4 rounded-lg border ${selectedProject.preliminaryNotice.sent ? 'bg-[#22C55E]/5 border-[#22C55E]/30' : 'bg-[#FF9F43]/5 border-[#FF9F43]/30'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedProject.preliminaryNotice.sent ? (
                          <CheckCircle className="w-5 h-5 text-[#22C55E]" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-[#FF9F43]" />
                        )}
                        <div>
                          <p className="font-medium text-[#1a1a2e]">Preliminary Notice</p>
                          <p className="text-sm text-[#1a1a2e]/60">
                            {selectedProject.preliminaryNotice.sent
                              ? `Sent ${formatDate(selectedProject.preliminaryNotice.sentDate!)}`
                              : `Due by ${formatDate(selectedProject.preliminaryNotice.deadline)}`
                            }
                          </p>
                        </div>
                      </div>
                      {!selectedProject.preliminaryNotice.sent && (
                        <button
                          onClick={() => alert(`Preliminary notice generated for ${selectedProject.projectName}. It will be sent to ${selectedProject.gcName}.`)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#FF9F43] text-white rounded-lg font-medium hover:bg-[#FF8F33] transition-all"
                        >
                          <Send className="w-4 h-4" />
                          Generate & Send
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mechanics Lien */}
                  <div className={`p-4 rounded-lg border ${
                    selectedProject.mechanicsLien.daysRemaining < 0
                      ? 'bg-[#FF6B6B]/5 border-[#FF6B6B]/30'
                      : selectedProject.mechanicsLien.daysRemaining <= 30
                        ? 'bg-[#FF9F43]/5 border-[#FF9F43]/30'
                        : 'bg-[#1a1a2e]/5 border-[#1a1a2e]/10'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedProject.mechanicsLien.daysRemaining < 0 ? (
                          <AlertTriangle className="w-5 h-5 text-[#FF6B6B]" />
                        ) : (
                          <Clock className={`w-5 h-5 ${getUrgencyColor(selectedProject.mechanicsLien.daysRemaining)}`} />
                        )}
                        <div>
                          <p className="font-medium text-[#1a1a2e]">Mechanics Lien</p>
                          <p className={`text-sm ${getUrgencyColor(selectedProject.mechanicsLien.daysRemaining)}`}>
                            {selectedProject.mechanicsLien.daysRemaining < 0
                              ? 'Deadline passed - rights may be lost'
                              : `${selectedProject.mechanicsLien.daysRemaining} days remaining`
                            }
                          </p>
                        </div>
                      </div>
                      {selectedProject.mechanicsLien.daysRemaining > 0 && (
                        <button
                          onClick={() => alert(`Mechanics lien preparation started for ${selectedProject.projectName}. Deadline: ${formatDate(selectedProject.mechanicsLien.deadline)}.`)}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#2a2a3e] transition-all"
                        >
                          <FileText className="w-4 h-4" />
                          Prepare Lien
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="p-6 bg-[#F8FAFC]">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Contract Amount</p>
                    <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(selectedProject.contractAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Amount Owed</p>
                    <p className="text-lg font-bold text-[#FF6B6B]">{formatCurrency(selectedProject.amountOwed)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">% Outstanding</p>
                    <p className="text-lg font-bold text-[#1a1a2e]">
                      {Math.round((selectedProject.amountOwed / selectedProject.contractAmount) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-12 text-center">
              <div className="w-16 h-16 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#9FE870]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">Select a Project</h3>
              <p className="text-[#1a1a2e]/60">
                Click on any project to view lien deadlines and document status.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Alert Setup Banner */}
      <div className="bg-gradient-to-r from-[#22C55E]/20 to-[#9FE870]/20 rounded-xl p-6 border border-[#22C55E]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#22C55E] rounded-full flex items-center justify-center flex-shrink-0">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Smart Alerts Enabled</h3>
            <p className="text-sm text-[#1a1a2e]/70">
              You&apos;ll receive automatic notifications at 30, 14, 7, and 3 days before each deadline.
              SMS and email alerts are active for all projects.
            </p>
          </div>
          <button
            onClick={() => alert('Alert preferences: Email and SMS notifications at 30, 14, 7, and 3 days before deadlines. Customize in Settings > Notifications.')}
            className="px-4 py-2 bg-white text-[#1a1a2e] rounded-lg font-medium hover:bg-[#F8FAFC] transition-all border border-[#1a1a2e]/10"
          >
            Manage Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
