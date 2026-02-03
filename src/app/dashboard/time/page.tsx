'use client';

import { useState } from 'react';
import { Clock, Play, Pause, Plus, Calendar, Users } from 'lucide-react';

const timeEntries = [
  { id: 1, employee: 'Jose Martinez', initials: 'JM', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:30 AM', clockOut: '3:00 PM', hours: 8, status: 'completed' },
  { id: 2, employee: 'Carlos Rivera', initials: 'CR', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:30 AM', clockOut: '3:00 PM', hours: 8, status: 'completed' },
  { id: 3, employee: 'David Chen', initials: 'DC', job: 'Riverside Apartments - Electrical', date: 'Feb 2, 2026', clockIn: '6:00 AM', clockOut: '3:30 PM', hours: 9, status: 'completed' },
  { id: 4, employee: 'Mike Thompson', initials: 'MT', job: 'Downtown Office Tower - HVAC', date: 'Feb 2, 2026', clockIn: '7:00 AM', clockOut: '-', hours: 5, status: 'active' },
  { id: 5, employee: 'Sarah Kim', initials: 'SK', job: 'Downtown Office Tower - HVAC', date: 'Feb 2, 2026', clockIn: '7:00 AM', clockOut: '-', hours: 5, status: 'active' },
];

export default function TimeTrackingPage() {
  const totalHoursToday = timeEntries.reduce((a, b) => a + b.hours, 0);
  const activeWorkers = timeEntries.filter(e => e.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Time Tracking</h1>
          <p className="text-[#1a1a2e]/60">Track crew hours and job time</p>
        </div>
        <button className="bg-[#9FE870] text-[#1a1a2e] px-4 py-2 rounded-lg font-medium flex items-center gap-2">
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
          <h2 className="font-semibold text-[#1a1a2e]">Today's Time - Feb 2, 2026</h2>
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
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                      Completed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
