'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, Send, X, FileText } from 'lucide-react';
import { AIGeneratedInvoice, InvoiceLineItem } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function SnapToInvoicePage() {
  const [image, setImage] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [invoice, setInvoice] = useState<AIGeneratedInvoice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        processImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = () => {
    setProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      const generatedInvoice: AIGeneratedInvoice = {
        client: 'ABC General Contractors',
        project: 'Downtown Office Tower - Electrical',
        description: 'Completed electrical rough-in for floors 3-5, including panel installation and conduit runs',
        items: [
          { id: '1', description: 'Labor - Electrical Rough-in (3 days, 3 crew)', quantity: 72, rate: 85, total: 6120 },
          { id: '2', description: '200A Main Panel', quantity: 1, rate: 1850, total: 1850 },
          { id: '3', description: '3/4" EMT Conduit (500ft)', quantity: 5, rate: 145, total: 725 },
          { id: '4', description: 'Wire - 12 AWG THHN (1000ft)', quantity: 2, rate: 285, total: 570 },
          { id: '5', description: 'Junction Boxes & Connectors', quantity: 1, rate: 435, total: 435 },
        ],
        subtotal: 9700,
        tax: 0,
        total: 9700,
        dueDate: 'March 3, 2026',
        paymentTerms: 'Net 30',
        confidence: 94
      };
      setInvoice(generatedInvoice);
      setProcessing(false);
    }, 2500);
  };

  const resetForm = () => {
    setImage(null);
    setInvoice(null);
    setProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
            <Camera className="w-5 h-5 text-[#1a1a2e]" />
          </div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Snap to Invoice</h1>
        </div>
        <p className="text-[#1a1a2e]/60">
          Take a photo or upload an image of your work. AI will extract the details and create a professional invoice in seconds.
        </p>
      </div>

      {!image && !invoice && (
        <>
          {/* Upload Area */}
          <div
            className="bg-white rounded-2xl border-2 border-dashed border-[#9FE870]/50 hover:border-[#9FE870] transition-colors p-12 text-center cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
            aria-label="Click to upload an image"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleImageUpload}
              aria-label="Upload image"
            />
            <div className="w-20 h-20 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-[#9FE870]" />
            </div>
            <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
              Snap or Upload a Photo
            </h3>
            <p className="text-[#1a1a2e]/60 mb-6">
              Take a photo of your completed work, materials, or handwritten notes
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
              >
                <Camera className="w-5 h-5" />
                Take Photo
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full font-medium hover:bg-[#2a2a3e] transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload Image
              </button>
            </div>
          </div>

          {/* How it works */}
          <div className="bg-white rounded-xl p-6 border border-[#1a1a2e]/10">
            <h3 className="font-semibold text-[#1a1a2e] mb-4">How it works</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#9FE870]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1a1a2e] font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">Capture</p>
                  <p className="text-sm text-[#1a1a2e]/60">Photo your work, receipts, or notes</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#54A0FF]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1a1a2e] font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">AI Extracts</p>
                  <p className="text-sm text-[#1a1a2e]/60">Details are pulled automatically</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#FF9F43]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1a1a2e] font-bold">3</span>
                </div>
                <div>
                  <p className="font-medium text-[#1a1a2e]">Review & Send</p>
                  <p className="text-sm text-[#1a1a2e]/60">Edit if needed, then send</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Processing State */}
      {processing && (
        <div className="bg-white rounded-2xl p-12 text-center border border-[#1a1a2e]/10">
          <div className="w-20 h-20 bg-[#9FE870]/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="w-10 h-10 text-[#9FE870] animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-[#1a1a2e] mb-2">
            AI is analyzing your image...
          </h3>
          <p className="text-[#1a1a2e]/60">
            Extracting work details, materials, and calculating totals
          </p>
          {image && (
            <div className="mt-6">
              <img
                src={image}
                alt="Uploaded work photo"
                className="max-w-xs mx-auto rounded-lg shadow-lg"
              />
            </div>
          )}
        </div>
      )}

      {/* Invoice Preview */}
      {invoice && !processing && (
        <div className="space-y-6">
          {/* Success Banner */}
          <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-[#22C55E]" />
            <div className="flex-1">
              <p className="font-medium text-[#1a1a2e]">Invoice created successfully!</p>
              <p className="text-sm text-[#1a1a2e]/60">
                AI confidence: {invoice.confidence}% — Review and make any changes before sending
              </p>
            </div>
            <button
              onClick={resetForm}
              className="p-2 text-[#1a1a2e]/60 hover:text-[#1a1a2e] transition-colors"
              aria-label="Close and start over"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Invoice Card */}
          <div className="bg-white rounded-xl border border-[#1a1a2e]/10 overflow-hidden">
            {/* Invoice Header */}
            <div className="bg-[#1a1a2e] text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 bg-[#9FE870] rounded-lg flex items-center justify-center">
                      <span className="text-[#1a1a2e] font-bold">S</span>
                    </div>
                    <span className="font-semibold">SubPaid</span>
                  </div>
                  <p className="text-white/60 text-sm">Invoice #INV-004</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold">{formatCurrency(invoice.total)}</p>
                  <p className="text-white/60 text-sm">Due: {invoice.dueDate}</p>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="p-6 border-b border-[#1a1a2e]/10">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#1a1a2e]/60 mb-1">Bill To</p>
                  <p className="font-semibold text-[#1a1a2e]">{invoice.client}</p>
                  <p className="text-[#1a1a2e]/70">{invoice.project}</p>
                </div>
                <div className="md:text-right">
                  <p className="text-sm text-[#1a1a2e]/60 mb-1">Payment Terms</p>
                  <p className="font-medium text-[#1a1a2e]">{invoice.paymentTerms}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="p-6 border-b border-[#1a1a2e]/10 bg-[#F7FBF4]">
              <p className="text-sm text-[#1a1a2e]/60 mb-1">Description</p>
              <p className="text-[#1a1a2e]">{invoice.description}</p>
            </div>

            {/* Line Items */}
            <div className="p-6">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-[#1a1a2e]/60 uppercase tracking-wider">
                    <th className="text-left pb-3">Description</th>
                    <th className="text-right pb-3">Qty</th>
                    <th className="text-right pb-3">Rate</th>
                    <th className="text-right pb-3">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a2e]/5">
                  {invoice.items.map((item: InvoiceLineItem) => (
                    <tr key={item.id}>
                      <td className="py-3 text-[#1a1a2e]">{item.description}</td>
                      <td className="py-3 text-right text-[#1a1a2e]/70">{item.quantity}</td>
                      <td className="py-3 text-right text-[#1a1a2e]/70">{formatCurrency(item.rate)}</td>
                      <td className="py-3 text-right font-medium text-[#1a1a2e]">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#1a1a2e]/10">
                    <td colSpan={3} className="pt-4 text-right font-semibold text-[#1a1a2e]">Total Due</td>
                    <td className="pt-4 text-right text-xl font-bold text-[#1a1a2e]">{formatCurrency(invoice.total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={async () => {
                try {
                  const res = await fetch('/api/invoices', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      clientId: '1',
                      lineItems: invoice.items.map((item: InvoiceLineItem) => ({
                        description: item.description,
                        quantity: item.quantity,
                        rate: item.rate,
                      })),
                      dueDate: '2026-03-03',
                      status: 'sent',
                      notes: invoice.description,
                    }),
                  });
                  if (res.ok) alert('Invoice sent to ABC General Contractors!');
                  else alert('Failed to send invoice. Please try again.');
                } catch { alert('Failed to send invoice. Please try again.'); }
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
            >
              <Send className="w-5 h-5" />
              Send Invoice
            </button>
            <button
              onClick={() => window.location.href = '/dashboard/invoices/new'}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a1a2e] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#2a2a3e] transition-all"
            >
              <FileText className="w-5 h-5" />
              Edit Details
            </button>
            <button
              onClick={resetForm}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#1a1a2e]/10 text-[#1a1a2e] px-6 py-3 rounded-full font-medium hover:bg-[#1a1a2e]/5 transition-all"
            >
              <Camera className="w-5 h-5" />
              New Photo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
