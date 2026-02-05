'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Search, Filter, Download, Eye, Send, MoreHorizontal, X, CheckCircle, AlertTriangle, FileDown, Copy, Ban } from 'lucide-react';
import Pagination from '@/components/admin/Pagination';

interface Invoice {
  id: string;
  user: string;
  client: string;
  amount: number;
  created: string;
  status: string;
}

const allInvoices: Invoice[] = [
  { id: 'INV-12847', user: 'John Martinez', client: 'ABC Contractors', amount: 12400, created: 'Feb 2, 2026', status: 'paid' },
  { id: 'INV-12846', user: 'Sarah Chen', client: 'Metro Builders', amount: 8500, created: 'Feb 2, 2026', status: 'pending' },
  { id: 'INV-12845', user: 'Mike Johnson', client: 'Smith LLC', amount: 45000, created: 'Feb 1, 2026', status: 'paid' },
  { id: 'INV-12844', user: 'Lisa Williams', client: 'Downtown Dev', amount: 20000, created: 'Feb 1, 2026', status: 'overdue' },
  { id: 'INV-12843', user: 'David Brown', client: 'Thompson Co', amount: 15600, created: 'Jan 31, 2026', status: 'paid' },
  { id: 'INV-12842', user: 'Emma Davis', client: 'Fire Safety Inc', amount: 34200, created: 'Jan 30, 2026', status: 'paid' },
  { id: 'INV-12841', user: 'James Wilson', client: 'Steel Corp', amount: 9800, created: 'Jan 29, 2026', status: 'pending' },
  { id: 'INV-12840', user: 'Amy Thompson', client: 'Paint Masters', amount: 6700, created: 'Jan 28, 2026', status: 'paid' },
];

const ITEMS_PER_PAGE = 5;

// Toast Component
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-white ${
      type === 'success' ? 'bg-green-600' : type === 'error' ? 'bg-red-600' : 'bg-[#54A0FF]'
    }`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : type === 'error' ? <AlertTriangle className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 p-1 hover:bg-white/20 rounded" aria-label="Close notification">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Invoice Detail Modal
function InvoiceDetailModal({ invoice, onClose }: { invoice: Invoice; onClose: () => void }) {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{invoice.id}</h3>
            <p className="text-sm text-gray-500">Invoice Details</p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close modal">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">User</p>
              <p className="font-medium text-gray-900">{invoice.user}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="font-medium text-gray-900">{invoice.client}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-gray-900 text-xl">{formatCurrency(invoice.amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium text-gray-900">{invoice.created}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
              invoice.status === 'paid' ? 'bg-green-100 text-green-700' :
              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {invoice.status}
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminInvoicesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset pagination on search/filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSendInvoice = (inv: Invoice) => {
    showToast(`Reminder sent for ${inv.id} to ${inv.user}`, 'success');
  };

  const handleExport = () => {
    showToast('Export started — CSV will download shortly', 'info');
  };

  const handleDownloadPdf = (inv: Invoice) => {
    showToast(`Downloading PDF for ${inv.id}`, 'info');
    setOpenMenuId(null);
  };

  const handleDuplicate = (inv: Invoice) => {
    showToast(`${inv.id} duplicated as draft`, 'success');
    setOpenMenuId(null);
  };

  const handleVoid = (inv: Invoice) => {
    showToast(`${inv.id} has been voided`, 'success');
    setOpenMenuId(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);
  };

  // Filter invoices
  const filteredInvoices = allInvoices.filter((inv) => {
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (
        !inv.id.toLowerCase().includes(q) &&
        !inv.user.toLowerCase().includes(q) &&
        !inv.client.toLowerCase().includes(q)
      ) return false;
    }
    return true;
  });

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedInvoices = filteredInvoices.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Invoices</h1>
          <p className="text-gray-500">Platform-wide invoice tracking</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-[#1a1a2e] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-[#2d2d44] transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Invoices</p>
          <p className="text-2xl font-bold text-gray-900">12,847</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-[#9FE870]">$4.22M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Paid</p>
          <p className="text-2xl font-bold text-green-600">$3.8M</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-500">Outstanding</p>
          <p className="text-2xl font-bold text-red-600">$420K</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search invoices by ID, user, or client..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:border-[#54A0FF] focus:outline-none"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 bg-white border rounded-xl flex items-center gap-2 transition-colors ${
              showFilters || statusFilter !== 'all' ? 'border-[#54A0FF] text-[#54A0FF]' : 'border-gray-200 text-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" /> Filter
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            {['all', 'paid', 'pending', 'overdue'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-[#1a1a2e] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            {statusFilter !== 'all' && (
              <button
                onClick={() => setStatusFilter('all')}
                className="ml-auto text-sm text-gray-500 hover:text-gray-700"
              >
                Clear filter
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase">
              <th className="text-left px-6 py-4">Invoice</th>
              <th className="text-left px-6 py-4">User</th>
              <th className="text-left px-6 py-4">Client</th>
              <th className="text-left px-6 py-4">Created</th>
              <th className="text-right px-6 py-4">Amount</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedInvoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <button
                    onClick={() => setViewingInvoice(inv)}
                    className="font-medium text-[#54A0FF] hover:text-[#4090EF] hover:underline transition-colors"
                  >
                    {inv.id}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-900">{inv.user}</td>
                <td className="px-6 py-4 text-gray-600">{inv.client}</td>
                <td className="px-6 py-4 text-gray-500">{inv.created}</td>
                <td className="px-6 py-4 text-right font-semibold text-gray-900">{formatCurrency(inv.amount)}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    inv.status === 'paid' ? 'bg-green-100 text-green-700' :
                    inv.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1 relative">
                    <button
                      onClick={() => setViewingInvoice(inv)}
                      className="p-2 text-gray-400 hover:text-[#54A0FF] transition-colors"
                      title="View"
                      aria-label={`View ${inv.id}`}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleSendInvoice(inv)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                      title="Send Reminder"
                      aria-label={`Send ${inv.id}`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                    <div className="relative" ref={openMenuId === inv.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        title="More"
                        aria-label={`More options for ${inv.id}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                      {openMenuId === inv.id && (
                        <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg z-20 border border-gray-200 py-1">
                          <button
                            onClick={() => handleDownloadPdf(inv)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <FileDown className="w-4 h-4" />
                            Download PDF
                          </button>
                          <button
                            onClick={() => handleDuplicate(inv)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>
                          <div className="border-t border-gray-100 my-1" />
                          <button
                            onClick={() => handleVoid(inv)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Ban className="w-4 h-4" />
                            Void Invoice
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))}
            {paginatedInvoices.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                  No invoices found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="border-t border-gray-100 px-6 py-3">
          <Pagination
            currentPage={currentPage}
            totalItems={filteredInvoices.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {viewingInvoice && (
        <InvoiceDetailModal
          invoice={viewingInvoice}
          onClose={() => setViewingInvoice(null)}
        />
      )}

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
