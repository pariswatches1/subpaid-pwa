'use client';

import { useState } from 'react';
import { Save, Upload, User } from 'lucide-react';

export default function ProfileSettingsPage() {
  const [formData, setFormData] = useState({
    firstName: 'Sam',
    lastName: 'Johnson',
    email: 'sam@electricalpros.com',
    phone: '(555) 123-4567',
    title: 'Owner',
    bio: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Profile Photo</h2>
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] text-white rounded-lg hover:bg-[#1a1a2e]/90 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
            <p className="text-sm text-gray-500 mt-2">JPG, PNG or GIF. Max 5MB.</p>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-[#1a1a2e] mb-4">Personal Information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a bit about yourself..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none resize-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}
