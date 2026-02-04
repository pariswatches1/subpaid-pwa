'use client';

import { useState, useEffect } from 'react';
import { Clock, Plus, Calendar, Users, X, Loader2 } from 'lucide-react';

const initialTimeEntries = [
  { id: 1, employee: 'Jose Martinez', initials: 'JM', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:30 AM', clockOut: '3:00 PM', hours: 8, status: 'completed' },
  { id: 2, employee: 'Carlos Rivera', initials: 'CR', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:30 AM', clockOut: '3:00 PM', hours: 8, status: 'completed' },
  { id: 3, employee: 'David Chen', initials: 'DC', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:00 AM', clockOut: '3:30 PM', hours: 9, status: 'completed' },
  { id: 4, employee: 'Mike Thompson', initials: 'MT', job: 'Downtown Office Tower - HVAC', date: 'Feb 2, 2026', clockIn: '7:00 AM', clockOut: '-', hours: 5, status: 'active' },
  { id: 5, employee: 'Sarah Kim', initials: 'SK', job: 'Downtown Office Tower - HVAC', date: 'Feb 2, 2026', clockIn: '7:00 AM', clockOut: '-', hours: 5, status: 'active' },
];

const jobs = [
  { id: '1', name: 'Riverside Apartments - Electrical' },
  { id: '2', name: 'Downtown Office Tower - HVAC' },
  { id: '3', name: 'Highland Shopping Center' },
];

const employees = [
  { id: '1', name: 'Jose Martinez', initials: 'JM' },
  { id: '2', name: 'Carlos Rivera', initials: 'CR' },
  { id: '3', name: 'David Chen', initials: 'DC' },
  { id: '4', name: 'Mike Thompson', initials: 'MT' },
  { id: '5', name: 'Sarah Kim', initials: 'SK' },
];

export default function TimeTrackingPage() {
  const [timeEntries, setTimeEntries] = useState(initialTimeEntries);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [formData, setFormData] = useState({
    employeeId: '',
    jobId: '',
    date: '',
    hours: '',
    description: '',
    billable: true,
  });

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setTodayDate(today);
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  const totalHoursToday = timeEntries.reduce((a, b) => a + b.hours, 0);
  const activeWorkers = timeEntries.filter(e => e.status === 'active').length;

  const handleAddEntry = async () => {
    if (!formData.jobId) {
      setError('Please select a job');
      return;
    }
    if (!formData.hours || parseFloat(formData.hours) <= 0) {
      setError('Please enter valid hours');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: formData.jobId,
          employee_id: formData.employeeId || '1',
          date: formData.date,
          hours: parseFloat(formData.hours),
          description: formData.description,
          billable: formData.billable,
        }),
      });

      if (!response.ok) throw new Error('Failed to add time entry');

      const employee = employees.find(e => e.id === formData.employeeId) || employees[0];
      const job = jobs.find(j => j.id === formData.jobId);

      setTimeEntries([...timeEntries, {
        id: Date.now(),
        employee: employee.name,
        initials: employee.initials,
        job: job?.name || 'Unknown Job',
        date: new Date(formData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        clockIn: 'Manual',
        clockOut: 'Manual',
        hours: parseFloat(formData.hours),
        status: 'completed',
      }]);

      setShowModal(false);
      setFormData({ employeeId: '', jobId: '', date: todayDate, hours: '', description: '', billable: true });
    } catch {
      setError('Failed to add time entry. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Time Tracking</h1>
          <p className="text-[#1a1a2e]/60">Track crew hours and job time</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#54A0FF]" />
            <span className="text-sm text-[#1a1a2e]/60">Hours Today</span>
          </div>
          <p className="text-3xl font-bold text-[#1a1a2e]">{totalHoursToday}h</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#9FE870]" />
            <span className="text-sm text-[#1a1a2e]/60">Active Now</span>
          </div>
          <p className="text-3xl font-bold text-[#22C55E]">{activeWorkers}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-[#FF9F43]" />
            <span className="text-sm text-[#1a1a2e]/60">This Week</span>
          </div>
          <p className="text-3xl font-bold text-[#1a1a2e]">187h</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-[#FECA57]" />
            <span className="text-sm text-[#1a1a2e]/60">This Month</span>
          </div>
          <p className="text-3xl font-bold text-[#1a1a2e]">743h</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-[#1a1a2e]">Today&apos;s Time - Feb 2, 2026</h2>
          <span className="text-[#1a1a2e]/60 text-sm">{totalHoursToday} total hours</span>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-[#1a1a2e]/60 uppercase">
              <th className="text-left px-6 py-3">Employee</th>
              <th className="text-left px-6 py-3">Job</th>
              <th className="text-left px-6 py-3">Clock In</th>
              <th className="text-left px-6 py-3">Clock Out</th>
              <th className="text-right px-6 py-3">Hours</th>
              <th className="text-left px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {timeEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-[#9FE870] to-[#54A0FF] rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {entry.initials}
                    </div>
                    <span className="font-medium text-[#1a1a2e]">{entry.employee}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[#1a1a2e]/70">{entry.job}</td>
                <td className="px-6 py-4 text-[#1a1a2e]">{entry.clockIn}</td>
                <td className="px-6 py-4 text-[#1a1a2e]">{entry.clockOut}</td>
                <td className="px-6 py-4 text-right font-semibold text-[#1a1a2e]">{entry.hours}h</td>
                <td className="px-6 py-4">
                  {entry.status === 'active' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1a1a2e]">Add Time Entry</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
                <select value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none">
                  <option value="">Select employee...</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job *</label>
                <select value={formData.jobId} onChange={(e) => setFormData({ ...formData, jobId: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none" required>
                  <option value="">Select job...</option>
                  {jobs.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours *</label>
                  <input type="number" step="0.5" min="0" value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} placeholder="8" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Work performed..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-[#9FE870] focus:ring-2 focus:ring-[#9FE870]/20 outline-none" />
              </div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={formData.billable} onChange={(e) => setFormData({ ...formData, billable: e.target.checked })} className="rounded border-gray-300" />
                <span className="text-sm text-gray-700">Billable hours</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleAddEntry} disabled={isLoading} className="flex-1 px-4 py-2 bg-[#9FE870] text-[#1a1a2e] rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Adding...</> : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
