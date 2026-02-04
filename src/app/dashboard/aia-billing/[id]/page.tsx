'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, FileText, Download, Send, Edit, Building2 } from 'lucide-react';

const aiaData: Record<string, {
  id: string;
  applicationNo: string;
  project: string;
  client: string;
  contractAmount: number;
  previousBilled: number;
  currentBilled: number;
  retainage: number;
  status: string;
  periodTo: string;
}> = {
  '1': {
    id: '1',
    applicationNo: '3',
    project: 'Highland Shopping Center - Electrical',
    client: 'Metro Builders Inc',
    contractAmount: 140500,
    previousBilled: 65200,
    currentBilled: 30340,
    retainage: 9554,
    status: 'draft',
    periodTo: 'Jan 31, 2026',
  },
  '2': {
    id: '2',
    applicationNo: '5',
    project: 'Riverside Apartments - Phase 2',
    client: 'Downtown Development LLC',
    contractAmount: 104500,
    previousBilled: 58500,
    currentBilled: 19875,
    retainage: 7838,
    status: 'submitted',
    periodTo: 'Jan 31, 2026',
  },
  '3': {
    id: '3',
    applicationNo: '2',
    project: 'Medical Office Build-out',
    client: 'Thompson Construction',
    contractAmount: 67500,
    previousBilled: 16875,
    currentBilled: 16875,
    retainage: 3375,
    status: 'approved',
    periodTo: 'Jan 15, 2026',
  },
  '4': {
    id: '4',
    applicationNo: '4',
    project: 'Downtown Office Tower',
    client: 'ABC General Contractors',
    contractAmount: 101000,
    previousBilled: 80800,
    currentBilled: 20200,
    retainage: 10100,
    status: 'paid',
    periodTo: 'Dec 31, 2025',
  },
};

export default function AIABillingDetailPage() {
  const params = useParams();
  const appId = params.id as string;
  const application = aiaData[appId];

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  if (!application) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Application Not Found</h1>
        <Link href="/dashboard/aia-billing" className="text-[#54A0FF] hover:underline">Back to AIA Billing</Link>
      </div>
    );
  }

  const totalBilled = application.previousBilled + application.currentBilled;
  const percentComplete = Math.round((totalBilled / application.contractAmount) * 100);
  const amountDue = application.currentBilled - (application.currentBilled * 0.1); // 10% retainage

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/aia-billing" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#8B5CF6] rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">Application #{application.applicationNo}</h1>
              <p className="text-[#1a1a2e]/60">{application.project}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert(`G702/G703 PDF for Application #${application.applicationNo}\n\nProject: ${application.project}\nClient: ${application.client}\nContract: ${formatCurrency(application.contractAmount)}\nThis Application: ${formatCurrency(application.currentBilled)}\nAmount Due: ${formatCurrency(amountDue)}\n\nPDF generation coming soon.`)}
            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download G702/G703
          </button>
          <button
            onClick={() => alert(`Application #${application.applicationNo} submitted to ${application.client} for ${formatCurrency(amountDue)}`)}
            className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Application Summary</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Contract Amount</p>
                <p className="text-xl font-bold text-[#1a1a2e]">{formatCurrency(application.contractAmount)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Total Completed</p>
                <p className="text-xl font-bold text-[#1a1a2e]">{formatCurrency(totalBilled)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">This Application</p>
                <p className="text-xl font-bold text-[#9FE870]">{formatCurrency(application.currentBilled)}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500">Amount Due</p>
                <p className="text-xl font-bold text-[#1a1a2e]">{formatCurrency(amountDue)}</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium">{percentComplete}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div className="bg-[#9FE870] h-3 rounded-full" style={{ width: `${percentComplete}%` }} />
              </div>
            </div>
          </div>

          {/* Billing Breakdown */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Billing Breakdown</h2>
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-3 text-gray-500">Original Contract Sum</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(application.contractAmount)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500">Total Completed to Date</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(totalBilled)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500">Less Previous Certificates</td>
                  <td className="py-3 text-right font-medium">({formatCurrency(application.previousBilled)})</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500">Current Payment Due</td>
                  <td className="py-3 text-right font-medium">{formatCurrency(application.currentBilled)}</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-500">Less Retainage (10%)</td>
                  <td className="py-3 text-right font-medium">({formatCurrency(application.currentBilled * 0.1)})</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="py-3 font-semibold">Amount Due This Application</td>
                  <td className="py-3 text-right font-bold text-lg">{formatCurrency(amountDue)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Client</span>
                <span className="font-medium">{application.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Period To</span>
                <span className="font-medium">{application.periodTo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="px-2 py-1 bg-[#54A0FF]/10 text-[#54A0FF] text-xs font-medium rounded-full capitalize">{application.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Retainage Held</span>
                <span className="font-medium">{formatCurrency(application.retainage)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
