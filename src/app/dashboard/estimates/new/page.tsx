'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Send, FileText } from 'lucide-react';

export default function NewEstimatePage() {
  const [items, setItems] = useState([{ description: '', quantity: 1, rate: 0 }]);

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  const removeItem = (index: number) => items.length > 1 && setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const calculateTotal = () => items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/estimates" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF9F43] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">New Estimate</h1>
              <p className="text-[#1a1a2e]/60">Create a new estimate</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Client */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Client Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Client *</label>
                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] outline-none">
                  <option value="">Choose a client...</option>
                  <option>ABC General Contractors</option>
                  <option>Metro Builders Inc</option>
                  <option>Smith Builders</option>
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Estimate Details</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                <input type="text" placeholder="e.g., Office Renovation" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estimate Number</label>
                <input type="text" defaultValue="EST-003" readOnly className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
                <input type="date" className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] outline-none" />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Line Items</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500">
                <div className="col-span-5">Description</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-2 text-right">Rate</div>
                <div className="col-span-2 text-right">Amount</div>
                <div className="col-span-1"></div>
              </div>

              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <input type="text" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} placeholder="Description" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-center" />
                  </div>
                  <div className="col-span-2">
                    <input type="number" value={item.rate} onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-right" />
                  </div>
                  <div className="col-span-2 text-right font-medium">{formatCurrency(item.quantity * item.rate)}</div>
                  <div className="col-span-1 text-right">
                    <button onClick={() => removeItem(index)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}

              <button onClick={addItem} className="flex items-center gap-2 text-[#54A0FF] font-medium">
                <Plus className="w-4 h-4" /> Add Line Item
              </button>
            </div>

            <div className="mt-6 pt-6 border-t flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2 border-t font-semibold">
                  <span>Total</span>
                  <span className="text-xl">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Notes & Terms</h2>
            <textarea rows={3} placeholder="Add terms, conditions, or notes..." className="w-full px-4 py-3 rounded-lg border border-gray-200 resize-none" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Summary</h2>
            <div className="flex justify-between">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-xl">{formatCurrency(calculateTotal())}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <button className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
              <Send className="w-5 h-5" /> Save & Send
            </button>
            <button className="w-full bg-gray-100 text-[#1a1a2e] py-3 rounded-lg font-medium flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Save as Draft
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
