'use client';

import { useState } from 'react';
import {
  FileText,
  Plus,
  ChevronRight,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Send,
  Eye,
  Edit,
  AlertTriangle,
  TrendingUp,
  Building2,
  Calendar
} from 'lucide-react';

interface AIAApplication {
  id: string;
  applicationNumber: number;
  project: string;
  gc: string;
  periodTo: string;
  originalContract: number;
  changeOrders: number;
  currentContract: number;
  completedToDate: number;
  completedPercent: number;
  previousApplications: number;
  currentPayment: number;
  retainage: number;
  retainagePercent: number;
  netPayment: number;
  status: 'draft' | 'submitted' | 'approved' | 'paid';
}

const applications: AIAApplication[] = [
  {
    id: '1',
    applicationNumber: 3,
    project: 'Highland Shopping Center - Electrical',
    gc: 'Metro Builders Inc',
    periodTo: '2026-01-31',
    originalContract: 125000,
    changeOrders: 15500,
    currentContract: 140500,
    completedToDate: 95540,
    completedPercent: 68,
    previousApplications: 65200,
    currentPayment: 30340,
    retainage: 9554,
    retainagePercent: 10,
    netPayment: 20786,
    status: 'draft',
  },
  {
    id: '2',
    applicationNumber: 5,
    project: 'Riverside Apartments - Phase 2',
    gc: 'Downtown Development LLC',
    periodTo: '2026-01-31',
    originalContract: 96000,
    changeOrders: 8500,
    currentContract: 104500,
    completedToDate: 78375,
    completedPercent: 75,
    previousApplications: 58500,
    currentPayment: 19875,
    retainage: 7838,
    retainagePercent: 10,
    netPayment: 12037,
    status: 'submitted',
  },
  {
    id: '3',
    applicationNumber: 2,
    project: 'Medical Office Build-out',
    gc: 'Thompson Construction',
    periodTo: '2026-01-15',
    originalContract: 67500,
    changeOrders: 0,
    currentContract: 67500,
    completedToDate: 33750,
    completedPercent: 50,
    previousApplications: 16875,
    currentPayment: 16875,
    retainage: 3375,
    retainagePercent: 10,
    netPayment: 13500,
    status: 'approved',
  },
  {
    id: '4',
    applicationNumber: 4,
    project: 'Downtown Office Tower',
    gc: 'ABC General Contractors',
    periodTo: '2025-12-31',
    originalContract: 89000,
    changeOrders: 12000,
    currentContract: 101000,
    completedToDate: 101000,
    completedPercent: 100,
    previousApplications: 80800,
    currentPayment: 20200,
    retainage: 10100,
    retainagePercent: 10,
    netPayment: 10100,
    status: 'paid',
  },
];

const scheduleOfValues = [
  { id: '1', description: 'Electrical Panel Installation', scheduledValue: 35000, previousWork: 35000, currentWork: 0, totalCompleted: 35000, percentComplete: 100, balanceToFinish: 0, retainage: 3500 },
  { id: '2', description: 'Rough-In Wiring - Floors 1-3', scheduledValue: 45000, previousWork: 30200, currentWork: 14800, totalCompleted: 45000, percentComplete: 100, balanceToFinish: 0, retainage: 4500 },
  { id: '3', description: 'Rough-In Wiring - Floors 4-6', scheduledValue: 45000, previousWork: 0, currentWork: 15540, totalCompleted: 15540, percentComplete: 35, balanceToFinish: 29460, retainage: 1554 },
  { id: '4', description: 'Fixture Installation', scheduledValue: 12000, previousWork: 0, currentWork: 0, totalCompleted: 0, percentComplete: 0, balanceToFinish: 12000, retainage: 0 },
  { id: '5', description: 'CO #1 - Additional Circuits', scheduledValue: 8500, previousWork: 0, currentWork: 0, totalCompleted: 0, percentComplete: 0, balanceToFinish: 8500, retainage: 0 },
  { id: '6', description: 'CO #2 - Emergency Lighting', scheduledValue: 7000, previousWork: 0, currentWork: 0, totalCompleted: 0, percentComplete: 0, balanceToFinish: 7000, retainage: 0 },
];

export default function AIABillingPage() {
  const [selectedApp, setSelectedApp] = useState<AIAApplication | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return <span className="px-2 py-1 bg-[#1a1a2e]/10 text-[#1a1a2e]/70 text-xs font-medium rounded-full">Draft</span>;
      case 'submitted':
        return <span className="px-2 py-1 bg-[#54A0FF]/10 text-[#54A0FF] text-xs font-medium rounded-full flex items-center gap-1"><Clock className="w-3 h-3" />Submitted</span>;
      case 'approved':
        return <span className="px-2 py-1 bg-[#22C55E]/10 text-[#22C55E] text-xs font-medium rounded-full flex items-center gap-1"><CheckCircle className="w-3 h-3" />Approved</span>;
      case 'paid':
        return <span className="px-2 py-1 bg-[#9FE870]/10 text-[#22C55E] text-xs font-medium rounded-full flex items-center gap-1"><DollarSign className="w-3 h-3" />Paid</span>;
      default:
        return null;
    }
  };

  const stats = {
    pending: applications.filter(a => a.status === 'submitted').reduce((sum, a) => sum + a.netPayment, 0),
    approved: applications.filter(a => a.status === 'approved').reduce((sum, a) => sum + a.netPayment, 0),
    retainage: applications.reduce((sum, a) => sum + a.retainage, 0),
    totalBilled: applications.reduce((sum, a) => sum + a.completedToDate, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#FF9F43] to-[#FECA57] rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">AIA Billing</h1>
            <p className="text-[#1a1a2e]/60">G702/G703 applications for payment</p>
          </div>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <Clock className="w-4 h-4" />
            Pending Approval
          </div>
          <p className="text-2xl font-bold text-[#54A0FF]">{formatCurrency(stats.pending)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <CheckCircle className="w-4 h-4" />
            Approved
          </div>
          <p className="text-2xl font-bold text-[#22C55E]">{formatCurrency(stats.approved)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <TrendingUp className="w-4 h-4" />
            Retainage Held
          </div>
          <p className="text-2xl font-bold text-[#FF9F43]">{formatCurrency(stats.retainage)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#1a1a2e]/10">
          <div className="flex items-center gap-2 text-[#1a1a2e]/60 text-sm mb-1">
            <DollarSign className="w-4 h-4" />
            Total Billed
          </div>
          <p className="text-2xl font-bold text-[#1a1a2e]">{formatCurrency(stats.totalBilled)}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="font-semibold text-[#1a1a2e]">Applications</h2>
          <div className="space-y-2">
            {applications.map((app) => (
              <button
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  selectedApp?.id === app.id
                    ? 'bg-[#FF9F43]/10 border-[#FF9F43]'
                    : 'bg-white border-[#1a1a2e]/10 hover:border-[#FF9F43]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-[#1a1a2e]">App #{app.applicationNumber}</span>
                  {getStatusBadge(app.status)}
                </div>
                <p className="text-sm text-[#1a1a2e]/70 mb-1 line-clamp-1">{app.project}</p>
                <p className="text-xs text-[#1a1a2e]/50 mb-2">{app.gc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(app.netPayment)}</span>
                  <span className="text-xs text-[#1a1a2e]/50">{app.completedPercent}% complete</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Application Detail */}
        <div className="lg:col-span-2">
          {selectedApp ? (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
              {/* G702 Header */}
              <div className="p-6 bg-gradient-to-r from-[#FF9F43]/10 to-[#FECA57]/10 border-b border-[#1a1a2e]/10">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-[#1a1a2e]">G702 Application #{selectedApp.applicationNumber}</h2>
                      {getStatusBadge(selectedApp.status)}
                    </div>
                    <p className="text-[#1a1a2e]/60">{selectedApp.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-[#1a1a2e]/60">Period To</p>
                    <p className="font-medium text-[#1a1a2e]">{formatDate(selectedApp.periodTo)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[#1a1a2e]/60">
                  <Building2 className="w-4 h-4" />
                  {selectedApp.gc}
                </div>
              </div>

              {/* Contract Summary */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Contract Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Original Contract</p>
                    <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(selectedApp.originalContract)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Change Orders</p>
                    <p className="text-lg font-bold text-[#54A0FF]">+{formatCurrency(selectedApp.changeOrders)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Current Contract</p>
                    <p className="text-lg font-bold text-[#1a1a2e]">{formatCurrency(selectedApp.currentContract)}</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="p-6 border-b border-[#1a1a2e]/10">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">Work Completed</h3>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#1a1a2e]/60">Progress</span>
                    <span className="font-medium text-[#1a1a2e]">{selectedApp.completedPercent}%</span>
                  </div>
                  <div className="h-3 bg-[#1a1a2e]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#9FE870] to-[#54A0FF] rounded-full transition-all"
                      style={{ width: `${selectedApp.completedPercent}%` }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Completed to Date</p>
                    <p className="font-bold text-[#1a1a2e]">{formatCurrency(selectedApp.completedToDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#1a1a2e]/60">Balance to Finish</p>
                    <p className="font-bold text-[#1a1a2e]">{formatCurrency(selectedApp.currentContract - selectedApp.completedToDate)}</p>
                  </div>
                </div>
              </div>

              {/* This Application */}
              <div className="p-6 bg-[#F8FAFC]">
                <h3 className="font-semibold text-[#1a1a2e] mb-4">This Application</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#1a1a2e]/60">Previous Applications</span>
                    <span className="font-medium text-[#1a1a2e]">{formatCurrency(selectedApp.previousApplications)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#1a1a2e]/60">Current Payment Due</span>
                    <span className="font-medium text-[#1a1a2e]">{formatCurrency(selectedApp.currentPayment)}</span>
                  </div>
                  <div className="flex justify-between text-[#FF9F43]">
                    <span>Retainage ({selectedApp.retainagePercent}%)</span>
                    <span className="font-medium">-{formatCurrency(selectedApp.retainage)}</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-[#1a1a2e]/10 text-lg font-bold">
                    <span className="text-[#1a1a2e]">Net Amount Due</span>
                    <span className="text-[#22C55E]">{formatCurrency(selectedApp.netPayment)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-[#1a1a2e]/10 flex flex-wrap gap-3">
                {selectedApp.status === 'draft' && (
                  <>
                    <button
                      onClick={() => alert(`Application #${selectedApp.applicationNumber} submitted to ${selectedApp.gc} for ${formatCurrency(selectedApp.netPayment)}`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                    >
                      <Send className="w-5 h-5" />
                      Submit to GC
                    </button>
                    <button
                      onClick={() => alert(`Editing Application #${selectedApp.applicationNumber}. Full editor coming soon.`)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#F8FAFC] transition-all"
                    >
                      <Edit className="w-5 h-5" />
                      Edit
                    </button>
                  </>
                )}
                <button
                  onClick={() => alert(`Preview G702 Application #${selectedApp.applicationNumber}\n\nProject: ${selectedApp.project}\nGC: ${selectedApp.gc}\nPeriod To: ${formatDate(selectedApp.periodTo)}\nContract: ${formatCurrency(selectedApp.currentContract)}\nCompleted: ${selectedApp.completedPercent}%\nNet Payment Due: ${formatCurrency(selectedApp.netPayment)}`)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#F8FAFC] transition-all"
                >
                  <Eye className="w-5 h-5" />
                  Preview G702
                </button>
                <button
                  onClick={() => alert(`G702 PDF for Application #${selectedApp.applicationNumber} will be generated and downloaded. PDF generation coming soon.`)}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#F8FAFC] transition-all"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-[#1a1a2e]/10 p-12 text-center">
              <div className="w-16 h-16 bg-[#FF9F43]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-[#FF9F43]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">Select an Application</h3>
              <p className="text-[#1a1a2e]/60">
                Click on any application to view details and generate G702/G703 forms.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-[#FF9F43]/20 to-[#FECA57]/20 rounded-xl p-6 border border-[#FF9F43]/30">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#FF9F43] rounded-full flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1a1a2e] mb-1">Free AIA Forms Included</h3>
            <p className="text-sm text-[#1a1a2e]/70">
              Official AIA G702/G703 forms cost $49.99 per use or $2,199/year elsewhere.
              With SubPaid, generate unlimited professional applications for payment at no extra cost.
              Your forms are automatically populated from your project data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
