'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, FileText, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

// Sample data for charts
const userGrowthData = [
  { month: 'Aug', value: 1200 },
  { month: 'Sep', value: 1450 },
  { month: 'Oct', value: 1680 },
  { month: 'Nov', value: 1890 },
  { month: 'Dec', value: 2150 },
  { month: 'Jan', value: 2547 },
];

const revenueData = [
  { month: 'Aug', value: 89000 },
  { month: 'Sep', value: 102000 },
  { month: 'Oct', value: 118000 },
  { month: 'Nov', value: 132000 },
  { month: 'Dec', value: 145000 },
  { month: 'Jan', value: 153000 },
];

const dailyInvoicesData = [
  { day: 'Mon', value: 380 },
  { day: 'Tue', value: 420 },
  { day: 'Wed', value: 456 },
  { day: 'Thu', value: 428 },
  { day: 'Fri', value: 512 },
  { day: 'Sat', value: 234 },
  { day: 'Sun', value: 178 },
];

// Simple Bar Chart Component
function BarChart({
  data,
  color = '#9FE870',
  formatValue = (v: number) => v.toString(),
}: {
  data: { label: string; value: number }[];
  color?: string;
  formatValue?: (value: number) => string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end gap-2 h-48">
      {data.map((item, index) => {
        const heightPercent = (item.value / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="relative w-full flex justify-center group">
              <div
                className="w-full max-w-[40px] rounded-t-lg transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${heightPercent * 1.8}px`,
                  backgroundColor: color,
                }}
              />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatValue(item.value)}
              </div>
            </div>
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// Line Chart Component using SVG with Y-axis labels
function LineChart({
  data,
  color = '#54A0FF',
  formatValue = (v: number) => v.toString(),
}: {
  data: { label: string; value: number }[];
  color?: string;
  formatValue?: (value: number) => string;
}) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 100;
  const height = 50;
  const padding = 5;

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((item.value - minValue) / range) * (height - 2 * padding);
    return { x, y, value: item.value, label: item.label };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Generate Y-axis ticks
  const tickCount = 4;
  const yTicks = Array.from({ length: tickCount }, (_, i) => {
    const value = minValue + (range * (tickCount - 1 - i)) / (tickCount - 1);
    return formatValue(Math.round(value));
  });

  return (
    <div className="relative h-48">
      <div className="flex h-36">
        <div className="flex flex-col justify-between pr-2 text-right" style={{ minWidth: '52px' }}>
          {yTicks.map((tick, i) => (
            <span key={i} className="text-[10px] text-gray-400 leading-none">{tick}</span>
          ))}
        </div>
        <div className="flex-1">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaD} fill={`url(#gradient-${color.replace('#', '')})`} />
            <path d={pathD} fill="none" stroke={color} strokeWidth="0.5" />
            {points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="1" fill={color} />
            ))}
          </svg>
        </div>
      </div>
      <div className="flex justify-between mt-2" style={{ paddingLeft: '52px' }}>
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-500">{item.label}</span>
        ))}
      </div>
    </div>
  );
}

// Donut Chart Component
function DonutChart({
  data,
}: {
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercent = 0;

  const getCoordinates = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return { x, y };
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percent = item.value / total;
            const startPercent = cumulativePercent;
            cumulativePercent += percent;

            const start = getCoordinates(startPercent);
            const end = getCoordinates(cumulativePercent);
            const largeArcFlag = percent > 0.5 ? 1 : 0;

            const pathD = [
              `M ${start.x} ${start.y}`,
              `A 1 1 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
              'L 0 0',
            ].join(' ');

            return (
              <path
                key={index}
                d={pathD}
                fill={item.color}
                stroke="white"
                strokeWidth="0.02"
              />
            );
          })}
          <circle cx="0" cy="0" r="0.6" fill="white" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-gray-900">{total}</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const planDistribution = [
    { label: 'Starter', value: 1245, color: '#9CA3AF' },
    { label: 'Pro', value: 892, color: '#54A0FF' },
    { label: 'Autopilot', value: 324, color: '#9FE870' },
    { label: 'Enterprise', value: 86, color: '#FF9F43' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500">Platform performance metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#54A0FF] focus:outline-none"
            aria-label="Select time range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="6m">Last 6 months</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-[#54A0FF]" />
            <span className="text-sm text-gray-500">Total Users</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">2,547</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            +12.5% from last month
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-[#9FE870]" />
            <span className="text-sm text-gray-500">MRR</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">$153K</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            +8.2% from last month
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#FF9F43]" />
            <span className="text-sm text-gray-500">Invoices/Day</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">428</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
            <ArrowUpRight className="w-4 h-4" />
            +18.7% from last week
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#FECA57]" />
            <span className="text-sm text-gray-500">Collection Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">94%</p>
          <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
            <ArrowDownRight className="w-4 h-4" />
            -0.5% from last month
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">User Growth</h2>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <LineChart
            data={userGrowthData.map(d => ({ label: d.month, value: d.value }))}
            color="#54A0FF"
            formatValue={(v) => v.toLocaleString()}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Revenue</h2>
            <span className="text-sm text-gray-500">Last 6 months</span>
          </div>
          <LineChart
            data={revenueData.map(d => ({ label: d.month, value: d.value }))}
            color="#9FE870"
            formatValue={formatCurrency}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-6">Daily Invoices</h2>
          <BarChart
            data={dailyInvoicesData.map(d => ({ label: d.day, value: d.value }))}
            color="#FF9F43"
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Plan Distribution</h2>
          <p className="text-sm text-gray-500 mb-6">Active subscribers by plan tier</p>
          <DonutChart data={planDistribution} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Top Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Invoice Value</span>
              <span className="font-semibold text-gray-900">$2,847</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Avg. Collection Time</span>
              <span className="font-semibold text-gray-900">18 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Churn Rate</span>
              <span className="font-semibold text-red-600">2.3%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">NPS Score</span>
              <span className="font-semibold text-green-600">72</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Sessions</span>
              <span className="font-semibold text-gray-900">1,247</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Usage */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Feature Usage</h2>
        <div className="space-y-4">
          {[
            { name: 'Snap to Invoice', usage: 89, color: 'bg-[#9FE870]', users: 2268 },
            { name: 'Ask SubPaid AI', usage: 67, color: 'bg-[#54A0FF]', users: 1706 },
            { name: 'Payment Prophet', usage: 54, color: 'bg-[#FF9F43]', users: 1375 },
            { name: 'SAM Voice Agent', usage: 32, color: 'bg-[#FECA57]', users: 815 },
            { name: 'Autopilot Mode', usage: 28, color: 'bg-[#FF6B6B]', users: 713 },
          ].map((feature) => (
            <div key={feature.name}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{feature.name}</span>
                <span className="text-gray-500">{feature.usage}% ({feature.users.toLocaleString()} users)</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${feature.color} rounded-full transition-all duration-500`} style={{ width: `${feature.usage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
