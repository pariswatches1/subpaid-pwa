'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, DollarSign, FileText, Calendar, CreditCard, CheckCircle } from 'lucide-react';

const paymentsData: Record<string, {
  id: string;
  invoiceId: string;
  client: string;
  amount: number;
  date: string;
  method: string;
  status: string;
  reference?: string;
}> = {
  'PAY-001': {
    id: 'PAY-001',
    invoiceId: 'INV-001',
    client: 'Metro Builders Inc',
    amount: 12400,
    date: 'Jan 28, 2026',
    method: 'ACH',
    status: 'completed',
    reference: 'REF-123456789',
  },
  'PAY-002': {
    id: 'PAY-002',
    invoiceId: 'INV-005',
    client: 'Smith Builders',
    amount: 8500,
    date: 'Jan 25, 2026',
    method: 'Check',
    status: 'completed',
    reference: 'CHK-45678',
  },
  'PAY-003': {
    id: 'PAY-003',
    invoiceId: 'INV-008',
    client: 'Downtown Development',
    amount: 45000,
    date: 'Jan 20, 2026',
    method: 'Wire',
    status: 'completed',
    reference: 'WIRE-789012',
  },
  'PAY-004': {
    id: 'PAY-004',
    invoiceId: 'INV-003',
    client: 'ABC General Contractors',
    amount: 20000,
    date: 'Pending',
    method: '-',
    status: 'pending',
  },
  'PAY-005': {
    id: 'PAY-005',
    invoiceId: 'INV-010',
    client: 'Thompson Construction',
    amount: 15600,
    date: 'Jan 15, 2026',
    method: 'ACH',
    status: 'completed',
    reference: 'REF-345678901',
  },
};

export default function PaymentDetailPage() {
  const params = useParams();
  const paymentId = params.id as string;
  const payment = paymentsData[paymentId];

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

  if (!payment) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Payment Not Found</h1>
        <Link href="/dashboard/payments" className="text-[#54A0FF] hover:underline">Back to Payments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/payments" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">{payment.id}</h1>
            <p className="text-[#1a1a2e]/60">Payment received</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full ${payment.status === 'completed' ? 'bg-[#22C55E]/10 text-[#22C55E]' : 'bg-[#F8BF24]/10 text-[#b8860b]'}`}>
                <CheckCircle className="w-4 h-4" /> {payment.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
              <p className="text-3xl font-bold text-[#22C55E]">{formatCurrency(payment.amount)}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Client</p>
                <p className="font-medium text-[#1a1a2e]">{payment.client}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Invoice</p>
                <Link href={`/dashboard/invoices/${payment.invoiceId}`} className="font-medium text-[#54A0FF] hover:underline">
                  {payment.invoiceId}
                </Link>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Date</p>
                <p className="font-medium text-[#1a1a2e]">{payment.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <p className="font-medium text-[#1a1a2e]">{payment.method}</p>
              </div>
              {payment.reference && (
                <div className="col-span-2">
                  <p className="text-sm text-gray-500 mb-1">Reference</p>
                  <p className="font-mono text-sm text-[#1a1a2e]">{payment.reference}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href={`/dashboard/invoices/${payment.invoiceId}`} className="w-full bg-gray-100 text-[#1a1a2e] py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                <FileText className="w-5 h-5" /> View Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
