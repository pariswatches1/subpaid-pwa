'use client';

const monthlyData = [
  { month: 'Aug', revenue: 32000 },
  { month: 'Sep', revenue: 35500 },
  { month: 'Oct', revenue: 38200 },
  { month: 'Nov', revenue: 41800 },
  { month: 'Dec', revenue: 44100 },
  { month: 'Jan', revenue: 48250 },
];

export default function RevenueChart() {
  const maxRevenue = Math.max(...monthlyData.map(d => d.revenue));
  const minRevenue = Math.min(...monthlyData.map(d => d.revenue));
  const padding = (maxRevenue - minRevenue) * 0.15;
  const yMax = maxRevenue + padding;
  const yMin = Math.max(0, minRevenue - padding);

  const points = monthlyData.map((d, i) => {
    const x = 5 + (i / (monthlyData.length - 1)) * 90;
    const y = 45 - ((d.revenue - yMin) / (yMax - yMin)) * 40;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaPath = `${linePath} L ${points[points.length - 1].x} 45 L ${points[0].x} 45 Z`;

  const yTicks = [yMin, yMin + (yMax - yMin) / 2, yMax].map(v => Math.round(v / 1000) * 1000);

  return (
    <div className="relative h-full flex">
      {/* Y-axis labels */}
      <div className="flex flex-col justify-between py-2 pr-3 text-xs text-gray-400 w-12">
        <span>${(yTicks[2] / 1000).toFixed(0)}K</span>
        <span>${(yTicks[1] / 1000).toFixed(0)}K</span>
        <span>${(yTicks[0] / 1000).toFixed(0)}K</span>
      </div>
      <div className="flex-1 flex flex-col">
        <svg viewBox="0 0 100 50" className="w-full flex-1" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenue-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#9FE870" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#9FE870" stopOpacity={0} />
            </linearGradient>
          </defs>
          {/* Grid lines */}
          {[15, 25, 35].map(y => (
            <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="#f0f0f0" strokeWidth="0.2" />
          ))}
          <path d={areaPath} fill="url(#revenue-gradient)" />
          <path d={linePath} fill="none" stroke="#9FE870" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="1" fill="#9FE870" />
          ))}
        </svg>
        {/* X-axis labels */}
        <div className="flex justify-between px-2 pt-2 text-xs text-gray-400">
          {monthlyData.map(d => (
            <span key={d.month}>{d.month}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
