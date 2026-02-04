'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Clock, Edit, Briefcase } from 'lucide-react';

const crewData: Record<string, {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  startDate: string;
  hourlyRate: number;
  hoursThisWeek: number;
  hoursThisMonth: number;
  activeJobs: { name: string; client: string }[];
}> = {
  '1': {
    id: '1',
    name: 'Jose Martinez',
    role: 'Lead Electrician',
    email: 'jose@company.com',
    phone: '(555) 123-4567',
    address: 'San Francisco, CA',
    startDate: 'Mar 15, 2022',
    hourlyRate: 45,
    hoursThisWeek: 42,
    hoursThisMonth: 168,
    activeJobs: [
      { name: 'Riverside Apartments - Electrical', client: 'ABC General Contractors' },
      { name: 'Downtown Office Tower - HVAC', client: 'Metro Builders Inc' },
    ],
  },
  '2': {
    id: '2',
    name: 'Carlos Rivera',
    role: 'Electrician',
    email: 'carlos@company.com',
    phone: '(555) 234-5678',
    address: 'Oakland, CA',
    startDate: 'Jun 1, 2023',
    hourlyRate: 38,
    hoursThisWeek: 40,
    hoursThisMonth: 160,
    activeJobs: [
      { name: 'Riverside Apartments - Electrical', client: 'ABC General Contractors' },
    ],
  },
  '3': {
    id: '3',
    name: 'David Chen',
    role: 'Electrician',
    email: 'david@company.com',
    phone: '(555) 345-6789',
    address: 'San Jose, CA',
    startDate: 'Sep 10, 2023',
    hourlyRate: 38,
    hoursThisWeek: 45,
    hoursThisMonth: 180,
    activeJobs: [
      { name: 'Riverside Apartments - Electrical', client: 'ABC General Contractors' },
    ],
  },
  '4': {
    id: '4',
    name: 'Mike Thompson',
    role: 'HVAC Technician',
    email: 'mike@company.com',
    phone: '(555) 456-7890',
    address: 'Fremont, CA',
    startDate: 'Jan 5, 2024',
    hourlyRate: 42,
    hoursThisWeek: 38,
    hoursThisMonth: 152,
    activeJobs: [
      { name: 'Downtown Office Tower - HVAC', client: 'Metro Builders Inc' },
    ],
  },
  '5': {
    id: '5',
    name: 'Sarah Kim',
    role: 'HVAC Technician',
    email: 'sarah@company.com',
    phone: '(555) 567-8901',
    address: 'Palo Alto, CA',
    startDate: 'Apr 15, 2024',
    hourlyRate: 40,
    hoursThisWeek: 36,
    hoursThisMonth: 144,
    activeJobs: [
      { name: 'Downtown Office Tower - HVAC', client: 'Metro Builders Inc' },
    ],
  },
  '6': {
    id: '6',
    name: 'Tom Wilson',
    role: 'Apprentice',
    email: 'tom@company.com',
    phone: '(555) 678-9012',
    address: 'Berkeley, CA',
    startDate: 'Nov 1, 2025',
    hourlyRate: 22,
    hoursThisWeek: 0,
    hoursThisMonth: 0,
    activeJobs: [],
  },
};

export default function CrewMemberPage() {
  const params = useParams();
  const memberId = params.id as string;
  const member = crewData[memberId];

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(amount);

  if (!member) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-[#1a1a2e] mb-4">Crew Member Not Found</h1>
        <Link href="/dashboard/crew" className="text-[#54A0FF] hover:underline">Back to Crew</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/crew" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#54A0FF]/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-[#54A0FF]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a2e]">{member.name}</h1>
              <p className="text-[#1a1a2e]/60">{member.role}</p>
            </div>
          </div>
        </div>
        <button
          onClick={() => alert(`Edit ${member.name}\n\nRole: ${member.role}\nEmail: ${member.email}\nPhone: ${member.phone}\nHourly Rate: ${formatCurrency(member.hourlyRate)}/hr\n\nFull edit form coming soon.`)}
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Edit className="w-5 h-5" />
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Hours Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Hours Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">This Week</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">{member.hoursThisWeek} hrs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-[#1a1a2e]">{member.hoursThisMonth} hrs</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500">Earnings (Month)</p>
                <p className="text-2xl font-bold text-[#9FE870]">{formatCurrency(member.hoursThisMonth * member.hourlyRate)}</p>
              </div>
            </div>
          </div>

          {/* Active Jobs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Active Jobs</h2>
            {member.activeJobs.length > 0 ? (
              <div className="space-y-3">
                {member.activeJobs.map((job, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-[#1a1a2e]">{job.name}</p>
                      <p className="text-sm text-gray-500">{job.client}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No active jobs</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Contact Info</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <a href={`mailto:${member.email}`} className="text-[#54A0FF] hover:underline">{member.email}</a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>{member.address}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-[#1a1a2e] mb-4">Employment</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Start Date</span>
                <span className="font-medium">{member.startDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hourly Rate</span>
                <span className="font-medium">{formatCurrency(member.hourlyRate)}/hr</span>
              </div>
            </div>
          </div>

          <Link href="/dashboard/time" className="block w-full bg-[#9FE870] text-[#1a1a2e] py-3 rounded-lg font-semibold text-center hover:shadow-lg transition-all">
            <Clock className="w-5 h-5 inline mr-2" /> Log Time
          </Link>
        </div>
      </div>
    </div>
  );
}
