'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Camera, Save, Send } from 'lucide-react';

export default function NewInvoicePage() {
  const [items, setItems] = useState([
    { description: '', quantity: 1, rate: 0 },
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">New Invoice</h1>
            <p className="text-[#1a1a2e]/60">Create a new invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/snap"
            className="px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Snap to Invoice
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Client *
                </label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none">
                  <option value="">Choose a client...</option>
                  <option value="1">ABC General Contractors</option>
                  <option value="2">Metro Builders Inc</option>
                  <option value="3">Smith Builders</option>
                  <option value="4">Downtown Development</option>
                  <option value="5">Thompson Construction</option>
                </select>
              </div>
              <button className="text-[#54A0FF] text-sm font-medium hover:underline">
                + Add New Client
              </button>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Invoice Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Office Renovation"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Invoice Number
                </label>
                <input
                  type="text"
                  defaultValue="INV-006"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none bg-gray-50"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Line Items</h2>
            <div className="space-y-4">
              {/* Header */}
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {/* Items */}
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none text-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none text-sm text-center"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none text-sm text-right"
                    />
                  </div>
                  <div className="col-span-2 text-right font-medium text-[#1a1a2e]">
                    {formatCurrency(item.quantity * item.rate)}
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => removeItem(index)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      disabled={items.length === 1}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addItem}
                className="flex items-center gap-2 text-[#54A0FF] font-medium hover:text-[#3d8ae0] transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
            </div>

            {/* Total */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="w-64">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">{formatCurrency(calculateTotal())}</span>
                  </div>
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="font-semibold text-[#1a1a2e]">Total</span>
                    <span className="text-xl font-bold text-[#1a1a2e]">{formatCurrency(calculateTotal())}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Notes</h2>
            <textarea
              rows={3}
              placeholder="Add any notes or payment instructions..."
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none resize-none"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Line Items</span>
                <span className="font-medium">{items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold text-xl text-[#1a1a2e]">{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <button className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Save & Send
            </button>
            <button className="w-full bg-gray-100 text-[#1a1a2e] py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Save as Draft
            </button>
          </div>

          {/* Tips */}
          <div className="bg-[#54A0FF]/10 rounded-xl p-6">
            <h3 className="font-semibold text-[#1a1a2e] mb-2">Pro Tip</h3>
            <p className="text-sm text-gray-600">
              Use <Link href="/dashboard/snap" className="text-[#54A0FF] font-medium hover:underline">Snap to Invoice</Link> to create invoices from photos of receipts, work orders, or notes in seconds!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
