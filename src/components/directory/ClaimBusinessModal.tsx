'use client';

import { useState } from 'react';
import { X, Mail, Phone, FileText, CheckCircle, Loader2 } from 'lucide-react';

interface ClaimBusinessModalProps {
  businessName: string;
  contractorId: string;
  onClose: () => void;
  onClaimed: () => void;
}

export function ClaimBusinessModal({ businessName, contractorId, onClose, onClaimed }: ClaimBusinessModalProps) {
  const [method, setMethod] = useState<'email' | 'phone' | 'document'>('email');
  const [contact, setContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contractors/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractorId, verificationMethod: method, contact }),
      });

      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClaimed();
          onClose();
        }, 2500);
      }
    } catch {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center" onClick={(e) => e.stopPropagation()}>
          <div className="w-16 h-16 bg-[#22C55E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-[#22C55E]" />
          </div>
          <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">Claim Submitted!</h3>
          <p className="text-gray-600">
            We&apos;ll verify your ownership of <strong>{businessName}</strong> and notify you within 24 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#1a1a2e]">Claim Your Business</h3>
            <p className="text-gray-500 mt-1">Verify you own <strong>{businessName}</strong></p>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to verify?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'email' as const, icon: Mail, label: 'Email' },
                { value: 'phone' as const, icon: Phone, label: 'Phone' },
                { value: 'document' as const, icon: FileText, label: 'License Doc' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMethod(opt.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    method === opt.value
                      ? 'border-[#9FE870] bg-[#9FE870]/10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <opt.icon className={`w-5 h-5 ${method === opt.value ? 'text-[#1a1a2e]' : 'text-gray-400'}`} />
                  <span className={`text-sm font-medium ${method === opt.value ? 'text-[#1a1a2e]' : 'text-gray-500'}`}>
                    {opt.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {method === 'email' ? 'Business Email Address' :
               method === 'phone' ? 'Business Phone Number' :
               'Upload License Document'}
            </label>
            {method === 'document' ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#9FE870] transition-colors cursor-pointer">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG up to 5MB</p>
              </div>
            ) : (
              <input
                type={method === 'email' ? 'email' : 'tel'}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                placeholder={method === 'email' ? 'owner@company.com' : '(555) 123-4567'}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#9FE870] focus:border-transparent transition-all"
              />
            )}
          </div>

          {/* Info */}
          <div className="bg-[#F8FAFC] rounded-lg p-4">
            <p className="text-xs text-gray-500">
              By claiming this business, you confirm that you are the owner or authorized representative.
              We&apos;ll verify your identity before granting access to this profile.
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting || (!contact && method !== 'document')}
            className="w-full flex items-center justify-center gap-2 bg-[#9FE870] text-[#1a1a2e] py-3 rounded-full font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Claim'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
