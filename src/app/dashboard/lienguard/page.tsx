'use client';

import { useState, useEffect } from 'react';
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
  Send,
  X,
  Settings,
  Folder
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

const initialProjects: LienProject[] = [
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
  FL: { preLienDays: 45, lienDays: 90, notes: '45-day notice to owner. 90 days from last work to file.' },
  NY: { preLienDays: 0, lienDays: 240, notes: 'No preliminary notice required. 8 months from last work.' },
  WA: { preLienDays: 60, lienDays: 90, notes: '60-day pre-lien notice. 90 days from completion.' },
};

const stateOptions = Object.keys(stateRules);

export default function LienGuardPage() {
  const [projects, setProjects] = useState<LienProject[]>(initialProjects);
  const [selectedProject, setSelectedProject] = useState<LienProject | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'protected' | 'at-risk' | 'expired'>('all');
  const [activeTab, setActiveTab] = useState<'projects' | 'documents' | 'settings'>('projects');
  const [showAddModal, setShowAddModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state for adding new project
  const [newProject, setNewProject] = useState({
    projectName: '',
    gcName: '',
    address: '',
    state: 'CO',
    startDate: '',
    lastWorkDate: '',
    contractAmount: '',
    amountOwed: '',
  });

  // Set mounted state and select first project
  useEffect(() => {
    setMounted(true);
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  const filteredProjects = projects.filter(p => filterStatus === 'all' || p.status === filterStatus);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) => {
    if (!mounted) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

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

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Calculate deadlines based on state rules
    const rules = stateRules[newProject.state];
    const startDate = new Date(newProject.startDate);
    const prelienDeadline = new Date(startDate);
    prelienDeadline.setDate(prelienDeadline.getDate() + rules.preLienDays);

    const lastWorkDate = new Date(newProject.lastWorkDate || newProject.startDate);
    const lienDeadline = new Date(lastWorkDate);
    lienDeadline.setDate(lienDeadline.getDate() + rules.lienDays);

    const today = new Date();
    const daysRemaining = Math.ceil((lienDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    const project: LienProject = {
      id: `${Date.now()}`,
      projectName: newProject.projectName,
      gcName: newProject.gcName,
      address: newProject.address,
      state: newProject.state,
      startDate: newProject.startDate,
      lastWorkDate: newProject.lastWorkDate || newProject.startDate,
      contractAmount: parseFloat(newProject.contractAmount) || 0,
      amountOwed: parseFloat(newProject.amountOwed) || 0,
      preliminaryNotice: {
        required: rules.preLienDays > 0,
        deadline: prelienDeadline.toISOString().split('T')[0],
        sent: false,
      },
      mechanicsLien: {
        deadline: lienDeadline.toISOString().split('T')[0],
        daysRemaining,
        filed: false,
      },
      status: daysRemaining < 0 ? 'expired' : daysRemaining <= 30 ? 'at-risk' : 'protected',
    };

    // Add to local state
    setProjects(prev => [...prev, project]);
    setSelectedProject(project);
    setShowAddModal(false);
    setNewProject({
      projectName: '',
      gcName: '',
      address: '',
      state: 'CO',
      startDate: '',
      lastWorkDate: '',
      contractAmount: '',
      amountOwed: '',
    });
    setIsLoading(false);
  };

  const handleSendPreliminaryNotice = (project: LienProject) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedProjects = projects.map(p => {
      if (p.id === project.id) {
        return {
          ...p,
          preliminaryNotice: {
            ...p.preliminaryNotice,
            sent: true,
            sentDate: today,
          },
          status: 'protected' as const,
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    const updated = updatedProjects.find(p => p.id === project.id);
    if (updated) setSelectedProject(updated);
  };

  const handleDownloadDocument = (project: LienProject) => {
    const stateRule = stateRules[project.state];
    const content = `
================================================================================
                            PRELIMINARY NOTICE
================================================================================

Date Generated: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

--------------------------------------------------------------------------------
                            PROJECT INFORMATION
--------------------------------------------------------------------------------

Project Name:       ${project.projectName}
GC/Property Owner:  ${project.gcName}
Project Address:    ${project.address}
State:              ${project.state}

--------------------------------------------------------------------------------
                            FINANCIAL DETAILS
--------------------------------------------------------------------------------

Contract Amount:    ${formatCurrency(project.contractAmount)}
Amount Owed:        ${formatCurrency(project.amountOwed)}
Outstanding:        ${Math.round((project.amountOwed / project.contractAmount) * 100)}%

--------------------------------------------------------------------------------
                            IMPORTANT DATES
--------------------------------------------------------------------------------

Project Start Date:      ${formatDate(project.startDate)}
Last Work Date:          ${formatDate(project.lastWorkDate)}
Pre-Notice Deadline:     ${formatDate(project.preliminaryNotice.deadline)}
Notice Sent Date:        ${project.preliminaryNotice.sentDate ? formatDate(project.preliminaryNotice.sentDate) : 'N/A'}
Mechanics Lien Deadline: ${formatDate(project.mechanicsLien.deadline)}
Days Remaining:          ${project.mechanicsLien.daysRemaining > 0 ? project.mechanicsLien.daysRemaining + ' days' : 'EXPIRED'}

--------------------------------------------------------------------------------
                            STATE LIEN RULES (${project.state})
--------------------------------------------------------------------------------

Pre-Lien Notice Period:  ${stateRule?.preLienDays || 'N/A'} days
Lien Filing Window:      ${stateRule?.lienDays || 'N/A'} days
Notes:                   ${stateRule?.notes || 'State rules not available'}

--------------------------------------------------------------------------------
                                 NOTICE
--------------------------------------------------------------------------------

This document serves as formal preliminary notice of the undersigned's
intent to file a mechanics lien against the above-referenced property
if payment for services rendered is not received.

This notice is provided in accordance with ${project.state} state law requirements.

================================================================================
                    Generated by SubPaid LienGuard
                    https://subpaid.com
================================================================================
    `.trim();

    // Create blob and trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Preliminary_Notice_${project.projectName.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Render documents tab content
  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Recent Documents</h3>
        <div className="space-y-3">
          {projects.filter(p => p.preliminaryNotice.sent).map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#22C55E]/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#22C55E]" />
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">Preliminary Notice - {p.projectName}</p>
                  <p className="text-sm text-[#1a1a2e]/60">Sent {mounted && p.preliminaryNotice.sentDate ? formatDate(p.preliminaryNotice.sentDate) : ''}</p>
                </div>
              </div>
              <button
                onClick={() => handleDownloadDocument(p)}
                className="flex items-center gap-2 px-3 py-1.5 text-[#1a1a2e]/70 hover:text-[#1a1a2e] transition-colors"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          ))}
          {projects.filter(p => p.preliminaryNotice.sent).length === 0 && (
            <p className="text-center text-[#1a1a2e]/60 py-8">No documents generated yet</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Pending Documents</h3>
        <div className="space-y-3">
          {projects.filter(p => !p.preliminaryNotice.sent && p.preliminaryNotice.required).map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 bg-[#FF9F43]/5 rounded-lg border border-[#FF9F43]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF9F43]/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-[#FF9F43]" />
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">Preliminary Notice Required - {p.projectName}</p>
                  <p className="text-sm text-[#FF9F43]">Due by {mounted ? formatDate(p.preliminaryNotice.deadline) : ''}</p>
                </div>
              </div>
              <button
                onClick={() => handleSendPreliminaryNotice(p)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF9F43] text-white rounded-lg font-medium hover:bg-[#FF8F33] transition-all"
              >
                <Send className="w-4 h-4" />
                Generate & Send
              </button>
            </div>
          ))}
          {projects.filter(p => !p.preliminaryNotice.sent && p.preliminaryNotice.required).length === 0 && (
            <p className="text-center text-[#1a1a2e]/60 py-8">All preliminary notices have been sent</p>
          )}
        </div>
      </div>
    </div>
  );

  // Render settings tab content
  const renderSettingsTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Alert Preferences</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
            <div>
              <p className="font-medium text-[#1a1a2e]">Email Notifications</p>
              <p className="text-sm text-[#1a1a2e]/60">Receive deadline reminders via email</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg">
            <div>
              <p className="font-medium text-[#1a1a2e]">SMS Notifications</p>
              <p className="text-sm text-[#1a1a2e]/60">Receive urgent alerts via text message</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#22C55E]"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">Reminder Schedule</h3>
        <p className="text-sm text-[#1a1a2e]/60 mb-4">Choose when to receive deadline reminders</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[30, 14, 7, 3].map(days => (
            <label key={days} className="flex items-center gap-2 p-3 bg-[#F8FAFC] rounded-lg cursor-pointer hover:bg-[#9FE870]/10 transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 text-[#22C55E] rounded focus:ring-[#22C55E]" />
              <span className="text-sm font-medium text-[#1a1a2e]">{days} days before</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-6">
        <h3 className="font-semibold text-[#1a1a2e] mb-4">State Lien Rules Reference</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(stateRules).map(([state, rules]) => (
            <div key={state} className="p-4 bg-[#F8FAFC] rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-[#54A0FF] text-white text-xs font-bold rounded">{state}</span>
                <span className="text-sm text-[#1a1a2e]/60">Pre-lien: {rules.preLienDays}d | Lien: {rules.lienDays}d</span>
              </div>
              <p className="text-sm text-[#1a1a2e]/70">{rules.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
          onClick={() => setShowAddModal(true)}
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

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-[#1a1a2e]/10">
        {[
          { id: 'projects', label: 'Projects', icon: Folder },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings },
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

      {/* Tab Content */}
      {activeTab === 'projects' && (
        <>
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
                {status === 'all' ? `All Projects (${stats.total})` :
                 status === 'at-risk' ? `At Risk (${stats.atRisk})` :
                 status === 'protected' ? `Protected (${stats.protected})` :
                 `Expired (${stats.expired})`}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Project List */}
            <div className="lg:col-span-1 space-y-3">
              <h2 className="font-semibold text-[#1a1a2e]">Projects ({filteredProjects.length})</h2>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredProjects.length === 0 ? (
                  <div className="p-8 text-center bg-white rounded-xl border border-[#1a1a2e]/10">
                    <p className="text-[#1a1a2e]/60">No projects match this filter</p>
                  </div>
                ) : (
                  filteredProjects.map((project) => (
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
                  ))
                )}
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
                              onClick={() => handleSendPreliminaryNotice(selectedProject)}
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
                              onClick={() => setActiveTab('documents')}
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
        </>
      )}

      {activeTab === 'documents' && renderDocumentsTab()}
      {activeTab === 'settings' && renderSettingsTab()}

      {/* Alert Setup Banner */}
      {activeTab === 'projects' && (
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
              onClick={() => setActiveTab('settings')}
              className="px-4 py-2 bg-white text-[#1a1a2e] rounded-lg font-medium hover:bg-[#F8FAFC] transition-all border border-[#1a1a2e]/10"
            >
              Manage Alerts
            </button>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#1a1a2e]/10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#1a1a2e]">Add New Project</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-[#1a1a2e]/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#1a1a2e]/60" />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-6">
              {/* Project Details */}
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Project Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Project Name *</label>
                    <input
                      type="text"
                      required
                      value={newProject.projectName}
                      onChange={(e) => setNewProject(prev => ({ ...prev, projectName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                      placeholder="e.g., Office Renovation - Electrical"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">GC/Property Owner *</label>
                    <input
                      type="text"
                      required
                      value={newProject.gcName}
                      onChange={(e) => setNewProject(prev => ({ ...prev, gcName: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                      placeholder="e.g., Metro Builders Inc"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Location</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Project Address *</label>
                    <input
                      type="text"
                      required
                      value={newProject.address}
                      onChange={(e) => setNewProject(prev => ({ ...prev, address: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                      placeholder="e.g., 1234 Main St, Denver, CO 80202"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">State *</label>
                    <select
                      required
                      value={newProject.state}
                      onChange={(e) => setNewProject(prev => ({ ...prev, state: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                    >
                      {stateOptions.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </div>
                {newProject.state && stateRules[newProject.state] && (
                  <p className="mt-2 text-sm text-[#54A0FF]">
                    <strong>{newProject.state}:</strong> {stateRules[newProject.state].notes}
                  </p>
                )}
              </div>

              {/* Dates */}
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Project Dates</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={newProject.startDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Last Work Date</label>
                    <input
                      type="date"
                      value={newProject.lastWorkDate}
                      onChange={(e) => setNewProject(prev => ({ ...prev, lastWorkDate: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-[#1a1a2e]/60">Leave blank if work is ongoing</p>
                  </div>
                </div>
              </div>

              {/* Financial */}
              <div>
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Financial Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Contract Amount *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/60">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProject.contractAmount}
                        onChange={(e) => setNewProject(prev => ({ ...prev, contractAmount: e.target.value }))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a2e] mb-1">Amount Owed *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1a1a2e]/60">$</span>
                      <input
                        type="number"
                        required
                        min="0"
                        step="0.01"
                        value={newProject.amountOwed}
                        onChange={(e) => setNewProject(prev => ({ ...prev, amountOwed: e.target.value }))}
                        className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-[#1a1a2e]/20 focus:border-[#9FE870] focus:outline-none"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-[#1a1a2e]/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 border border-[#1a1a2e]/20 text-[#1a1a2e] rounded-lg font-medium hover:bg-[#1a1a2e]/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Adding...' : 'Add Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
