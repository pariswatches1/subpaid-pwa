'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Briefcase, Loader2 } from 'lucide-react';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    address: '',
    startDate: '',
    endDate: '',
    budget: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Job Name is required');
      return;
    }
    if (!formData.client) {
      setError('Client is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // API call to create job
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          clientId: formData.client,
          address: formData.address,
          startDate: formData.startDate,
          endDate: formData.endDate,
          budget: formData.budget ? parseFloat(formData.budget) : null,
          description: formData.description,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to the new job's detail page or jobs list
        router.push(data.id ? `/dashboard/jobs/${data.id}` : '/dashboard/jobs');
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.message || 'Failed to create job. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Error creating job:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/jobs" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#9FE870] rounded-xl flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#1a1a2e]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">New Job</h1>
              <p className="text-[#1a1a2e]/60">Create a new job or project</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateJob}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-4">Job Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Office Renovation - Main Building"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client *
                  </label>
                  <select
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    required
                  >
                    <option value="">Select a client...</option>
                    <option value="1">ABC General Contractors</option>
                    <option value="2">Metro Builders Inc</option>
                    <option value="3">Smith Builders</option>
                    <option value="4">Downtown Development</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Site Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Main St, City, State ZIP"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Schedule & Budget */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-4">Schedule & Budget</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Estimated)
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="font-semibold text-[#1a1a2e] mb-4">Description</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the scope of work..."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none resize-none"
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" /> Create Job
                  </>
                )}
              </button>
              <Link
                href="/dashboard/jobs"
                className="w-full bg-gray-100 text-[#1a1a2e] py-3 rounded-lg font-medium hover:bg-gray-200 transition-all flex items-center justify-center"
              >
                Cancel
              </Link>
            </div>

            {/* Tips */}
            <div className="bg-[#54A0FF]/10 rounded-xl p-6">
              <h3 className="font-semibold text-[#1a1a2e] mb-2">Tips</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Set a budget to track profitability</li>
                <li>• Add crew members after creating the job</li>
                <li>• Link invoices to track billing progress</li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
