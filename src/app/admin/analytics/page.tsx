'use client';

import { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, FileText, ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

// ============================================
// Data sets keyed by time range
// ============================================

const rangeLabels: Record<string, string> = {
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  '6m': 'Last 6 months',
  '1y': 'Last year',
};

const metricsData: Record<string, { users: string; usersChange: string; usersTrend: 'up' | 'down'; mrr: string; mrrChange: string; mrrTrend: 'up' | 'down'; invoicesDay: string; invoicesChange: string; invoicesTrend: 'up' | 'down'; collectionRate: string; collectionChange: string; collectionTrend: 'up' | 'down' }> = {
  '7d': {
    users: '2,547', usersChange: '+2.1%', usersTrend: 'up',
    mrr: '$153K', mrrChange: '+1.8%', mrrTrend: 'up',
    invoicesDay: '456', invoicesChange: '+22.3%', invoicesTrend: 'up',
    collectionRate: '94%', collectionChange: '-0.5%', collectionTrend: 'down',
  },
  '30d': {
    users: '2,547', usersChange: '+5.3%', usersTrend: 'up',
    mrr: '$153K', mrrChange: '+4.1%', mrrTrend: 'up',
    invoicesDay: '428', invoicesChange: '+18.7%', invoicesTrend: 'up',
    collectionRate: '94%', collectionChange: '-0.3%', collectionTrend: 'down',
  },
  '6m': {
    users: '2,547', usersChange: '+12.5%', usersTrend: 'up',
    mrr: '$153K', mrrChange: '+8.2%', mrrTrend: 'up',
    invoicesDay: '428', invoicesChange: '+18.7%', invoicesTrend: 'up',
    collectionRate: '94%', collectionChange: '-0.5%', collectionTrend: 'down',
  },
  '1y': {
    users: '2,547', usersChange: '+112%', usersTrend: 'up',
    mrr: '$153K', mrrChange: '+72%', mrrTrend: 'up',
    invoicesDay: '428', invoicesChange: '+156%', invoicesTrend: 'up',
    collectionRate: '94%', collectionChange: '+2.1%', collectionTrend: 'up',
  },
};

const userGrowthByRange: Record<string, { label: string; value: number }[]> = {
  '7d': [
    { label: 'Mon', value: 2510 }, { label: 'Tue', value: 2518 }, { label: 'Wed', value: 2525 },
    { label: 'Thu', value: 2530 }, { label: 'Fri', value: 2538 }, { label: 'Sat', value: 2542 }, { label: 'Sun', value: 2547 },
  ],
  '30d': [
    { label: 'W1', value: 2420 }, { label: 'W2', value: 2460 }, { label: 'W3', value: 2500 }, { label: 'W4', value: 2547 },
  ],
  '6m': [
    { label: 'Aug', value: 1200 }, { label: 'Sep', value: 1450 }, { label: 'Oct', value: 1680 },
    { label: 'Nov', value: 1890 }, { label: 'Dec', value: 2150 }, { label: 'Jan', value: 2547 },
  ],
  '1y': [
    { label: 'Feb', value: 620 }, { label: 'Apr', value: 840 }, { label: 'Jun', value: 1050 },
    { label: 'Aug', value: 1200 }, { label: 'Oct', value: 1680 }, { label: 'Dec', value: 2150 }, { label: 'Jan', value: 2547 },
  ],
};

const revenueByRange: Record<string, { label: string; value: number }[]> = {
  '7d': [
    { label: 'Mon', value: 148000 }, { label: 'Tue', value: 149200 }, { label: 'Wed', value: 150100 },
    { label: 'Thu', value: 150800 }, { label: 'Fri', value: 151500 }, { label: 'Sat', value: 152200 }, { label: 'Sun', value: 153000 },
  ],
  '30d': [
    { label: 'W1', value: 147000 }, { label: 'W2', value: 149000 }, { label: 'W3', value: 151000 }, { label: 'W4', value: 153000 },
  ],
  '6m': [
    { label: 'Aug', value: 89000 }, { label: 'Sep', value: 102000 }, { label: 'Oct', value: 118000 },
    { label: 'Nov', value: 132000 }, { label: 'Dec', value: 145000 }, { label: 'Jan', value: 153000 },
  ],
  '1y': [
    { label: 'Feb', value: 42000 }, { label: 'Apr', value: 58000 }, { label: 'Jun', value: 72000 },
    { label: 'Aug', value: 89000 }, { label: 'Oct', value: 118000 }, { label: 'Dec', value: 145000 }, { label: 'Jan', value: 153000 },
  ],
};

const dailyInvoicesByRange: Record<string, { label: string; value: number }[]> = {
  '7d': [
    { label: 'Mon', value: 380 }, { label: 'Tue', value: 420 }, { label: 'Wed', value: 456 },
    { label: 'Thu', value: 428 }, { label: 'Fri', value: 512 }, { label: 'Sat', value: 234 }, { label: 'Sun', value: 178 },
  ],
  '30d': [
    { label: 'W1', value: 345 }, { label: 'W2', value: 378 }, { label: 'W3', value: 410 }, { label: 'W4', value: 428 },
  ],
  '6m': [
    { label: 'Aug', value: 280 }, { label: 'Sep', value: 310 }, { label: 'Oct', value: 350 },
    { label: 'Nov', value: 380 }, { label: 'Dec', value: 410 }, { label: 'Jan', value: 428 },
  ],
  '1y': [
    { label: 'Feb', value: 120 }, { label: 'Apr', value: 180 }, { label: 'Jun', value: 220 },
    { label: 'Aug', value: 280 }, { label: 'Oct', value: 350 }, { label: 'Dec', value: 410 }, { label: 'Jan', value: 428 },
  ],
};

// Plan Distribution — aligned with Subscriptions page (paying users)
const planDistribution = [
  { label: 'Starter', value: 847, color: '#9CA3AF' },
  { label: 'Pro', value: 623, color: '#54A0FF' },
  { label: 'Autopilot', value: 312, color: '#9FE870' },
  { label: 'Enterprise', value: 110, color: '#FF9F43' },
];

// ============================================
// Chart Components
// ============================================

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
          <span className="text-xl font-bold text-gray-900">{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.label}</span>
            <span className="text-sm font-medium text-gray-900">{item.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Main Page Component
// ============================================

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

  const metrics = metricsData[timeRange];
  const userGrowthData = userGrowthByRange[timeRange];
  const revenueData = revenueByRange[timeRange];
  const dailyInvoicesData = dailyInvoicesByRange[timeRange];

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
          <p className="text-3xl font-bold text-gray-900">{metrics.users}</p>
          <div className={`flex items-center gap-1 mt-1 text-sm ${metrics.usersTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.usersTrend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {metrics.usersChange} from {rangeLabels[timeRange].toLowerCase().replace('last ', '')}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-[#9FE870]" />
            <span className="text-sm text-gray-500">MRR</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.mrr}</p>
          <div className={`flex items-center gap-1 mt-1 text-sm ${metrics.mrrTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.mrrTrend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {metrics.mrrChange} from {rangeLabels[timeRange].toLowerCase().replace('last ', '')}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-[#FF9F43]" />
            <span className="text-sm text-gray-500">Invoices/Day</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.invoicesDay}</p>
          <div className={`flex items-center gap-1 mt-1 text-sm ${metrics.invoicesTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.invoicesTrend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {metrics.invoicesChange} from {rangeLabels[timeRange].toLowerCase().replace('last ', '')}
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-[#FECA57]" />
            <span className="text-sm text-gray-500">Collection Rate</span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.collectionRate}</p>
          <div className={`flex items-center gap-1 mt-1 text-sm ${metrics.collectionTrend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {metrics.collectionTrend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {metrics.collectionChange} from {rangeLabels[timeRange].toLowerCase().replace('last ', '')}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">User Growth</h2>
            <span className="text-sm text-gray-500">{rangeLabels[timeRange]}</span>
          </div>
          <LineChart
            data={userGrowthData}
            color="#54A0FF"
            formatValue={(v) => v.toLocaleString()}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Revenue</h2>
            <span className="text-sm text-gray-500">{rangeLabels[timeRange]}</span>
          </div>
          <LineChart
            data={revenueData}
            color="#9FE870"
            formatValue={formatCurrency}
          />
        </div>
      </div>

      {/* Second Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-semibold text-gray-900">Daily Invoices</h2>
            <span className="text-sm text-gray-500">{rangeLabels[timeRange]}</span>
          </div>
          <BarChart
            data={dailyInvoicesData}
            color="#FF9F43"
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900">Plan Distribution</h2>
          <p className="text-sm text-gray-500 mb-6">Paying subscribers by plan tier</p>
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
