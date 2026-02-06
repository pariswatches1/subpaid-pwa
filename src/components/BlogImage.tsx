'use client';

// Rich, detailed SVG illustrations for blog posts
// Construction-themed with characters, tools, and site elements

interface BlogImageProps {
  slug: string;
  className?: string;
  size?: 'card' | 'featured' | 'hero';
}

export function BlogImage({ slug, className = '', size = 'card' }: BlogImageProps) {
  const h = size === 'hero' ? 320 : size === 'featured' ? 300 : 192;
  const w = size === 'featured' ? 600 : 400;
  const config = getConfig(slug);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: h }}>
      <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`sky-${slug}`} x1="0" y1="0" x2="0" y2={h} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={config.skyTop} />
            <stop offset="60%" stopColor={config.skyMid} />
            <stop offset="100%" stopColor={config.skyBot} />
          </linearGradient>
          <linearGradient id={`ground-${slug}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={config.groundTop} />
            <stop offset="100%" stopColor={config.groundBot} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect width={w} height={h} fill={`url(#sky-${slug})`} />

        {/* Clouds */}
        <Cloud x={w * 0.1} y={h * 0.08} s={0.8} />
        <Cloud x={w * 0.6} y={h * 0.12} s={0.6} />
        <Cloud x={w * 0.85} y={h * 0.06} s={0.5} />

        {/* Background city/construction skyline */}
        <Skyline w={w} h={h} color={config.buildingColor} />

        {/* Crane */}
        <Crane x={w * 0.78} y={h * 0.12} h={h} color={config.craneColor} />

        {/* Ground */}
        <rect x={0} y={h * 0.72} width={w} height={h * 0.28} fill={`url(#ground-${slug})`} />
        <rect x={0} y={h * 0.72} width={w} height={4} fill={config.groundLine} opacity="0.4" />

        {/* Construction barriers/cones on ground */}
        <Cone x={w * 0.08} y={h * 0.72} />
        <Barrier x={w * 0.88} y={h * 0.72} />

        {/* Main illustration content */}
        {config.render(w, h)}

        {/* Bottom label banner */}
        <rect x={w * 0.15} y={h * 0.86} width={w * 0.7} height={h * 0.11} rx={h * 0.055} fill="white" opacity="0.92" />
        <rect x={w * 0.15} y={h * 0.86} width={w * 0.7} height={h * 0.11} rx={h * 0.055} stroke="#e2e8f0" strokeWidth="1" fill="none" />
        <text x={w * 0.5} y={h * 0.93} textAnchor="middle" fill="#1a1a2e" fontSize={size === 'featured' ? 14 : 11} fontWeight="600" fontFamily="system-ui, sans-serif">
          {config.label}
        </text>
      </svg>
    </div>
  );
}

/* ─── Shared sub-components ─── */

function Cloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={30} ry={12} fill="white" opacity="0.7" />
      <ellipse cx={-15} cy={3} rx={18} ry={10} fill="white" opacity="0.6" />
      <ellipse cx={18} cy={4} rx={20} ry={9} fill="white" opacity="0.65" />
    </g>
  );
}

function Skyline({ w, h, color }: { w: number; h: number; color: string }) {
  return (
    <g opacity="0.18">
      <rect x={w * 0.02} y={h * 0.35} width={w * 0.06} height={h * 0.37} fill={color} />
      <rect x={w * 0.1} y={h * 0.28} width={w * 0.08} height={h * 0.44} fill={color} />
      <rect x={w * 0.12} y={h * 0.25} width={w * 0.04} height={h * 0.47} fill={color} />
      <rect x={w * 0.2} y={h * 0.4} width={w * 0.05} height={h * 0.32} fill={color} />
      <rect x={w * 0.7} y={h * 0.32} width={w * 0.07} height={h * 0.4} fill={color} />
      <rect x={w * 0.82} y={h * 0.38} width={w * 0.05} height={h * 0.34} fill={color} />
      <rect x={w * 0.9} y={h * 0.3} width={w * 0.08} height={h * 0.42} fill={color} />
      {/* Windows */}
      {[0.31, 0.37, 0.43, 0.49].map((yp, i) => (
        <g key={i}>
          <rect x={w * 0.115} y={h * yp} width={3} height={3} fill="white" opacity="0.4" />
          <rect x={w * 0.135} y={h * yp} width={3} height={3} fill="white" opacity="0.4" />
        </g>
      ))}
    </g>
  );
}

function Crane({ x, y, h, color }: { x: number; y: number; h: number; color: string }) {
  return (
    <g opacity="0.25">
      {/* Vertical mast */}
      <rect x={x} y={y} width={4} height={h * 0.6} fill={color} />
      {/* Horizontal boom */}
      <rect x={x - 50} y={y} width={80} height={3} fill={color} />
      {/* Counter-boom */}
      <rect x={x} y={y} width={25} height={3} fill={color} />
      {/* Cable */}
      <line x1={x - 40} y1={y + 3} x2={x - 40} y2={y + 40} stroke={color} strokeWidth="1" />
      {/* Hook */}
      <path d={`M${x - 42},${y + 38} Q${x - 40},${y + 45} ${x - 38},${y + 38}`} stroke={color} strokeWidth="1.5" fill="none" />
      {/* Diagonal supports */}
      <line x1={x + 2} y1={y + 3} x2={x - 20} y2={y} stroke={color} strokeWidth="1" />
      <line x1={x + 2} y1={y + 3} x2={x + 20} y2={y} stroke={color} strokeWidth="1" />
    </g>
  );
}

function Cone({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <polygon points={`${x},${y} ${x - 6},${y} ${x - 3},${y - 16}`} fill="#FF9F43" opacity="0.7" />
      <rect x={x - 4.5} y={y - 10} width={6} height={3} rx={1} fill="white" opacity="0.6" />
      <rect x={x - 8} y={y} width={13} height={3} rx={1.5} fill="#FF9F43" opacity="0.5" />
    </g>
  );
}

function Barrier({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y - 12} width={25} height={8} rx={2} fill="#FF9F43" opacity="0.6" />
      <rect x={x + 2} y={y - 10} width={6} height={4} rx={1} fill="white" opacity="0.5" />
      <rect x={x + 11} y={y - 10} width={6} height={4} rx={1} fill="white" opacity="0.5" />
      <rect x={x + 3} y={y - 4} width={2} height={4} fill="#8B7355" opacity="0.5" />
      <rect x={x + 20} y={y - 4} width={2} height={4} fill="#8B7355" opacity="0.5" />
    </g>
  );
}

function HardHat({ x, y, s = 1, color = '#F59E0B' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-12,0 Q-12,-14 0,-16 Q12,-14 12,0" fill={color} />
      <rect x={-15} y={-1} width={30} height={5} rx={2.5} fill={color} />
      <path d="M-12,0 Q-12,-14 0,-16 Q12,-14 12,0" fill="white" opacity="0.15" />
      <rect x={-3} y={-14} width={6} height={3} rx={1.5} fill={color} />
    </g>
  );
}

function Person({ x, y, s = 1, vest = '#F59E0B', shirt = '#3B82F6', hardhat = '#F59E0B', facingRight = true }: {
  x: number; y: number; s?: number; vest?: string; shirt?: string; hardhat?: string; facingRight?: boolean;
}) {
  const dir = facingRight ? 1 : -1;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      {/* Hard hat */}
      <HardHat x={0} y={-52} color={hardhat} />
      {/* Head */}
      <circle cx={0} cy={-38} r={10} fill="#FBBF78" />
      <circle cx={3} cy={-40} r={1.5} fill="#1a1a2e" /> {/* Eye */}
      <path d="M2,-36 Q5,-34 2,-35" stroke="#1a1a2e" strokeWidth="0.8" fill="none" /> {/* Smile */}
      {/* Body/shirt */}
      <rect x={-12} y={-28} width={24} height={30} rx={4} fill={shirt} />
      {/* Safety vest */}
      <rect x={-12} y={-28} width={10} height={28} rx={2} fill={vest} opacity="0.85" />
      <rect x={2} y={-28} width={10} height={28} rx={2} fill={vest} opacity="0.85" />
      {/* Vest stripes */}
      <rect x={-10} y={-18} width={6} height={2} rx={1} fill="white" opacity="0.7" />
      <rect x={-10} y={-12} width={6} height={2} rx={1} fill="white" opacity="0.7" />
      <rect x={4} y={-18} width={6} height={2} rx={1} fill="white" opacity="0.7" />
      <rect x={4} y={-12} width={6} height={2} rx={1} fill="white" opacity="0.7" />
      {/* Belt */}
      <rect x={-12} y={-2} width={24} height={4} rx={1} fill="#8B6F47" />
      {/* Tool belt pouches */}
      <rect x={-14} y={-1} width={8} height={8} rx={2} fill="#A0845C" />
      <rect x={6} y={-1} width={8} height={8} rx={2} fill="#A0845C" />
      {/* Legs */}
      <rect x={-10} y={2} width={9} height={22} rx={3} fill="#4B6A8F" />
      <rect x={1} y={2} width={9} height={22} rx={3} fill="#4B6A8F" />
      {/* Boots */}
      <rect x={-11} y={22} width={11} height={6} rx={2} fill="#5C3D1A" />
      <rect x={0} y={22} width={11} height={6} rx={2} fill="#5C3D1A" />
    </g>
  );
}

function Clipboard({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-18} y={-30} width={36} height={48} rx={3} fill="#D4A76A" />
      <rect x={-15} y={-25} width={30} height={40} rx={2} fill="white" />
      <rect x={-7} y={-33} width={14} height={6} rx={3} fill="#8B6F47" />
      {/* Lines */}
      {[0, 8, 16, 24].map((dy, i) => (
        <g key={i}>
          <rect x={-10} y={-18 + dy} width={20} height={2.5} rx={1} fill="#e2e8f0" />
          {i < 3 && <polyline points={`${-12},${-16 + dy} ${-10},${-14 + dy} ${-7},${-18 + dy}`}
            stroke="#22C55E" strokeWidth="2" fill="none" strokeLinecap="round" />}
        </g>
      ))}
    </g>
  );
}

function Toolbox({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-20} y={-10} width={40} height={22} rx={3} fill="#DC2626" />
      <rect x={-20} y={-10} width={40} height={8} rx={3} fill="#EF4444" />
      <rect x={-8} y={-13} width={16} height={5} rx={2} fill="#991B1B" />
      <rect x={-5} y={-14} width={10} height={3} rx={1.5} fill="#7F1D1D" />
      {/* Latch */}
      <rect x={-3} y={-4} width={6} height={4} rx={1} fill="#FCD34D" />
    </g>
  );
}

function Document({ x, y, s = 1, accent = '#3B82F6' }: { x: number; y: number; s?: number; accent?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-20} y={-28} width={40} height={56} rx={3} fill="white" />
      <rect x={-20} y={-28} width={40} height={56} rx={3} stroke="#e2e8f0" strokeWidth="1" fill="none" />
      <rect x={-15} y={-22} width={30} height={5} rx={1} fill={accent} opacity="0.2" />
      <rect x={-15} y={-22} width={20} height={3} rx={1} fill={accent} opacity="0.6" />
      {[0, 8, 16, 24, 32].map((dy, i) => (
        <rect key={i} x={-15} y={-12 + dy} width={30 - i * 3} height={2} rx={1} fill="#CBD5E1" />
      ))}
    </g>
  );
}

function DollarSign({ x, y, s = 1, color = '#22C55E' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={16} fill={color} opacity="0.15" />
      <text x={0} y={6} textAnchor="middle" fill={color} fontSize="20" fontWeight="bold" fontFamily="system-ui">$</text>
    </g>
  );
}

function MoneyStack({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, -5, -10].map((dy, i) => (
        <g key={i}>
          <rect x={-18} y={dy - 4} width={36} height={10} rx={3} fill={i === 0 ? '#16A34A' : i === 1 ? '#22C55E' : '#4ADE80'} />
          <text x={0} y={dy + 3} textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="system-ui">$100</text>
        </g>
      ))}
    </g>
  );
}

function Calculator({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-16} y={-24} width={32} height={48} rx={4} fill="#334155" />
      <rect x={-12} y={-20} width={24} height={12} rx={2} fill="#86EFAC" />
      <text x={0} y={-11} textAnchor="middle" fill="#166534" fontSize="9" fontWeight="bold" fontFamily="monospace">15,000</text>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <rect key={i} x={-11 + (i % 3) * 9} y={-4 + Math.floor(i / 3) * 9}
          width={7} height={6} rx={1.5} fill={i === 8 ? '#F59E0B' : '#64748B'} />
      ))}
    </g>
  );
}

function Phone({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-14} y={-26} width={28} height={52} rx={5} fill="#1E293B" />
      <rect x={-11} y={-20} width={22} height={38} rx={2} fill="#3B82F6" opacity="0.2" />
      <rect x={-11} y={-20} width={22} height={10} rx={2} fill="#3B82F6" opacity="0.4" />
      <circle cx={0} cy={22} r={3} stroke="#64748B" strokeWidth="1" fill="none" />
      {/* Chart line on screen */}
      <polyline points="-8,-5 -3,-10 2,-7 7,-14" stroke="#22C55E" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </g>
  );
}

function Wrench({ x, y, s = 1, rot = -30 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-2} y={-20} width={4} height={30} rx={2} fill="#94A3B8" />
      <circle cx={0} cy={-20} r={7} fill="#94A3B8" />
      <circle cx={0} cy={-20} r={3} fill="#64748B" />
    </g>
  );
}

function Shield({ x, y, s = 1, color = '#3B82F6' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M0,-22 L18,-14 L18,6 L0,18 L-18,6 L-18,-14 Z" fill={color} opacity="0.2" stroke={color} strokeWidth="2" />
      <polyline points="-6,0 -2,5 8,-6" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

function Gavel({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-4} y={-25} width={8} height={20} rx={3} fill="#8B6F47" />
      <rect x={-12} y={-28} width={24} height={8} rx={4} fill="#A0845C" />
      <ellipse cx={0} cy={2} rx={20} ry={6} fill="#D4A76A" opacity="0.5" />
    </g>
  );
}

function BarChart({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[
        { h: 25, c: '#3B82F6' },
        { h: 40, c: '#22C55E' },
        { h: 30, c: '#F59E0B' },
        { h: 50, c: '#22C55E' },
        { h: 35, c: '#3B82F6' },
      ].map((bar, i) => (
        <rect key={i} x={-25 + i * 12} y={-bar.h} width={10} height={bar.h} rx={2} fill={bar.c} opacity="0.7" />
      ))}
      <line x1={-28} y1={0} x2={38} y2={0} stroke="#64748B" strokeWidth="1.5" />
    </g>
  );
}

function ThumbsUp({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={14} fill="#22C55E" opacity="0.2" />
      <path d="M-3,6 L-3,-2 Q-3,-8 3,-10 L4,-10 L4,-2 L6,2 L6,6 Z" fill="#FBBF78" />
      <rect x={-6} y={2} width={8} height={6} rx={2} fill="#FBBF78" />
    </g>
  );
}

function Clock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={16} fill="white" stroke="#3B82F6" strokeWidth="2" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a, i) => {
        const r = (a - 90) * Math.PI / 180;
        return <circle key={i} cx={Math.cos(r) * 12} cy={Math.sin(r) * 12} r={1.2} fill="#64748B" />;
      })}
      <line x1={0} y1={0} x2={0} y2={-9} stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      <line x1={0} y1={0} x2={7} y2={-3} stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={0} cy={0} r={2} fill="#1a1a2e" />
    </g>
  );
}

function Target({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle cx={0} cy={0} r={22} fill="none" stroke="#EF4444" strokeWidth="3" opacity="0.4" />
      <circle cx={0} cy={0} r={15} fill="none" stroke="#EF4444" strokeWidth="2.5" opacity="0.5" />
      <circle cx={0} cy={0} r={8} fill="none" stroke="#EF4444" strokeWidth="2" opacity="0.6" />
      <circle cx={0} cy={0} r={3} fill="#EF4444" />
    </g>
  );
}

function Scales({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-2} y={-20} width={4} height={35} rx={2} fill="#8B6F47" />
      <line x1={-25} y1={-16} x2={25} y2={-16} stroke="#8B6F47" strokeWidth="3" strokeLinecap="round" />
      <path d="M-30,-10 Q-25,-4 -20,-10" stroke="#D4A76A" strokeWidth="2" fill="#D4A76A" opacity="0.4" />
      <line x1={-25} y1={-16} x2={-30} y2={-10} stroke="#8B6F47" strokeWidth="1.5" />
      <line x1={-25} y1={-16} x2={-20} y2={-10} stroke="#8B6F47" strokeWidth="1.5" />
      <path d="M20,-13 Q25,-7 30,-13" stroke="#D4A76A" strokeWidth="2" fill="#D4A76A" opacity="0.4" />
      <line x1={25} y1={-16} x2={20} y2={-13} stroke="#8B6F47" strokeWidth="1.5" />
      <line x1={25} y1={-16} x2={30} y2={-13} stroke="#8B6F47" strokeWidth="1.5" />
      <rect x={-6} y={15} width={12} height={4} rx={2} fill="#8B6F47" />
    </g>
  );
}

function Blueprints({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-20} y={-6} width={40} height={12} rx={6} fill="#3B82F6" opacity="0.5" />
      <rect x={-18} y={-4} width={8} height={8} rx={1} fill="white" opacity="0.3" />
      <line x1={-7} y1={-2} x2={16} y2={-2} stroke="white" strokeWidth="1" opacity="0.3" />
      <line x1={-7} y1={2} x2={12} y2={2} stroke="white" strokeWidth="1" opacity="0.2" />
    </g>
  );
}

function StarBurst({ x, y, s = 1, color = '#F59E0B' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {[0, 45, 90, 135].map((angle, i) => {
        const r = (angle * Math.PI) / 180;
        return (
          <line key={i} x1={Math.cos(r) * -8} y1={Math.sin(r) * -8}
            x2={Math.cos(r) * 8} y2={Math.sin(r) * 8}
            stroke={color} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        );
      })}
    </g>
  );
}

/* ─── Config per slug ─── */

interface IllConfig {
  skyTop: string; skyMid: string; skyBot: string;
  groundTop: string; groundBot: string; groundLine: string;
  buildingColor: string; craneColor: string;
  label: string;
  render: (w: number, h: number) => React.ReactNode;
}

function getConfig(slug: string): IllConfig {
  const base = {
    skyTop: '#87CEEB', skyMid: '#B8E0F0', skyBot: '#E0F0F8',
    groundTop: '#D2B48C', groundBot: '#C4A67D', groundLine: '#A0845C',
    buildingColor: '#64748B', craneColor: '#F59E0B',
  };

  const warm = { ...base, skyTop: '#FDE68A', skyMid: '#FEF3C7', skyBot: '#FFFBEB' };
  const blue = { ...base, skyTop: '#60A5FA', skyMid: '#93C5FD', skyBot: '#DBEAFE' };
  const green = { ...base, skyTop: '#6EE7B7', skyMid: '#A7F3D0', skyBot: '#D1FAE5', groundTop: '#86EFAC', groundBot: '#6EE7B7' };
  const red = { ...base, skyTop: '#FCA5A5', skyMid: '#FECACA', skyBot: '#FEE2E2' };

  const configs: Record<string, IllConfig> = {

    'subcontractor-cash-flow-management-guide': {
      ...base, label: 'Cash Flow Management Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.3} y={h * 0.72} s={0.9} />
          <Clipboard x={w * 0.42} y={h * 0.45} s={0.9} />
          <BarChart x={w * 0.65} y={h * 0.65} s={1} />
          <DollarSign x={w * 0.55} y={h * 0.2} s={0.8} />
          <DollarSign x={w * 0.72} y={h * 0.28} s={0.6} />
          <MoneyStack x={w * 0.18} y={h * 0.62} s={0.7} />
          <StarBurst x={w * 0.58} y={h * 0.17} s={0.6} />
        </g>
      ),
    },

    'how-ai-is-transforming-invoicing': {
      ...blue, label: 'AI-Powered Invoicing',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} shirt="#6366F1" />
          <Phone x={w * 0.42} y={h * 0.48} s={1.2} />
          <Document x={w * 0.65} y={h * 0.45} s={0.9} accent="#6366F1" />
          <StarBurst x={w * 0.5} y={h * 0.2} s={0.8} color="#6366F1" />
          <StarBurst x={w * 0.72} y={h * 0.18} s={0.5} color="#3B82F6" />
          {/* AI sparkles */}
          {[{x: 0.55, y: 0.25}, {x: 0.75, y: 0.3}, {x: 0.35, y: 0.22}].map((p, i) => (
            <circle key={i} cx={w * p.x} cy={h * p.y} r={3} fill="#6366F1" opacity="0.4" />
          ))}
          <Toolbox x={w * 0.15} y={h * 0.7} s={0.7} />
        </g>
      ),
    },

    'how-to-write-construction-invoice': {
      ...green, label: 'Write Invoices That Get Paid',
      render: (w, h) => (
        <g>
          <Person x={w * 0.65} y={h * 0.72} s={0.9} facingRight={false} />
          <Document x={w * 0.35} y={h * 0.42} s={1.2} accent="#22C55E" />
          <ThumbsUp x={w * 0.52} y={h * 0.22} s={1.1} />
          <DollarSign x={w * 0.2} y={h * 0.25} s={0.7} />
          <Blueprints x={w * 0.78} y={h * 0.65} s={0.8} />
          <StarBurst x={w * 0.35} y={h * 0.15} s={0.5} color="#22C55E" />
        </g>
      ),
    },

    'general-contractor-payment-problems': {
      ...warm, label: '7 Red Flags — GC Payment Problems',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} vest="#EF4444" />
          {/* Warning signs */}
          {[0.45, 0.58, 0.71].map((xp, i) => (
            <g key={i}>
              <polygon points={`${w * xp},${h * 0.25} ${w * xp - 10},${h * 0.42} ${w * xp + 10},${h * 0.42}`}
                fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
              <text x={w * xp} y={h * 0.38} textAnchor="middle" fill="#DC2626" fontSize="14" fontWeight="bold">!</text>
            </g>
          ))}
          <Document x={w * 0.7} y={h * 0.58} s={0.7} accent="#EF4444" />
          <Toolbox x={w * 0.15} y={h * 0.68} s={0.7} />
        </g>
      ),
    },

    'construction-payment-terms-explained': {
      ...blue, label: 'Payment Terms Explained',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Document x={w * 0.45} y={h * 0.42} s={1.1} accent="#3B82F6" />
          <Document x={w * 0.62} y={h * 0.46} s={0.9} accent="#F59E0B" />
          <Scales x={w * 0.78} y={h * 0.52} s={0.7} />
          <DollarSign x={w * 0.35} y={h * 0.18} s={0.7} />
          <Clock x={w * 0.7} y={h * 0.22} s={0.7} />
        </g>
      ),
    },

    'best-invoicing-apps-subcontractors': {
      ...base, label: '2026 Invoicing App Comparison',
      render: (w, h) => (
        <g>
          <Phone x={w * 0.25} y={h * 0.45} s={1.1} />
          <Phone x={w * 0.5} y={h * 0.42} s={1.3} />
          <Phone x={w * 0.75} y={h * 0.45} s={1.1} />
          {/* Star ratings */}
          {[0.25, 0.5, 0.75].map((xp, i) => (
            <g key={i}>
              {'★★★★★'.split('').map((_, si) => (
                <text key={si} x={w * xp - 12 + si * 6} y={h * 0.7}
                  fill="#F59E0B" fontSize="8" opacity={si < [4, 5, 3][i] ? 0.8 : 0.2}>★</text>
              ))}
            </g>
          ))}
          <Person x={w * 0.12} y={h * 0.72} s={0.6} />
          <StarBurst x={w * 0.5} y={h * 0.2} s={0.7} />
        </g>
      ),
    },

    'mechanics-lien-filing-guide': {
      ...warm, label: 'Mechanics Lien Filing Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.85} />
          <Gavel x={w * 0.5} y={h * 0.4} s={1.2} />
          <Document x={w * 0.7} y={h * 0.45} s={1} accent="#F59E0B" />
          <Shield x={w * 0.42} y={h * 0.58} s={0.7} color="#F59E0B" />
          <Clipboard x={w * 0.82} y={h * 0.6} s={0.6} />
          <Blueprints x={w * 0.15} y={h * 0.63} s={0.7} />
        </g>
      ),
    },

    '5-tips-to-get-paid-faster': {
      ...green, label: '5 Tips to Get Paid Faster',
      render: (w, h) => (
        <g>
          <Person x={w * 0.5} y={h * 0.72} s={0.95} />
          <MoneyStack x={w * 0.72} y={h * 0.55} s={0.9} />
          <DollarSign x={w * 0.25} y={h * 0.25} s={0.9} />
          <ThumbsUp x={w * 0.72} y={h * 0.25} s={1} />
          {/* Number badges */}
          {[1, 2, 3, 4, 5].map((n, i) => (
            <g key={i}>
              <circle cx={w * (0.12 + i * 0.06)} cy={h * 0.45} r={10} fill="#22C55E" opacity="0.7" />
              <text x={w * (0.12 + i * 0.06)} y={h * 0.47} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">{n}</text>
            </g>
          ))}
          <Clock x={w * 0.2} y={h * 0.58} s={0.6} />
        </g>
      ),
    },

    'subcontractor-profit-margin-guide': {
      ...base, label: 'Profit Margin Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.85} vest="#22C55E" />
          <Calculator x={w * 0.45} y={h * 0.48} s={1.1} />
          <BarChart x={w * 0.72} y={h * 0.62} s={0.9} />
          <DollarSign x={w * 0.6} y={h * 0.2} s={0.8} />
          <text x={w * 0.7} y={h * 0.22} textAnchor="middle" fill="#22C55E" fontSize="12" fontWeight="bold" fontFamily="system-ui" opacity="0.6">15-20%</text>
          <Toolbox x={w * 0.12} y={h * 0.68} s={0.6} />
        </g>
      ),
    },

    'aia-billing-guide-subcontractors': {
      ...blue, label: 'AIA Billing — G702 & G703 Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} shirt="#1E40AF" />
          <Document x={w * 0.42} y={h * 0.42} s={1.1} accent="#1E40AF" />
          <Document x={w * 0.6} y={h * 0.46} s={0.95} accent="#3B82F6" />
          <Clipboard x={w * 0.78} y={h * 0.5} s={0.8} />
          <text x={w * 0.42} y={h * 0.2} textAnchor="middle" fill="#1E40AF" fontSize="11" fontWeight="bold" fontFamily="system-ui" opacity="0.6">G702</text>
          <text x={w * 0.6} y={h * 0.23} textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="bold" fontFamily="system-ui" opacity="0.6">G703</text>
          <Blueprints x={w * 0.15} y={h * 0.62} />
        </g>
      ),
    },

    'construction-business-tax-deductions': {
      ...green, label: '15 Tax Deductions to Know',
      render: (w, h) => (
        <g>
          <Person x={w * 0.7} y={h * 0.72} s={0.85} facingRight={false} vest="#22C55E" />
          <Calculator x={w * 0.3} y={h * 0.48} s={1.2} />
          <DollarSign x={w * 0.5} y={h * 0.22} s={1} />
          <DollarSign x={w * 0.2} y={h * 0.28} s={0.6} />
          <MoneyStack x={w * 0.5} y={h * 0.62} s={0.8} />
          <circle cx={w * 0.82} cy={h * 0.25} r={14} fill="#F59E0B" opacity="0.5" />
          <text x={w * 0.82} y={h * 0.27} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">15</text>
        </g>
      ),
    },

    'how-to-bid-construction-jobs': {
      ...base, label: 'Win Construction Bids',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.9} />
          <Target x={w * 0.6} y={h * 0.4} s={1.2} />
          <Document x={w * 0.8} y={h * 0.5} s={0.8} accent="#EF4444" />
          <ThumbsUp x={w * 0.5} y={h * 0.18} s={0.9} />
          <Blueprints x={w * 0.4} y={h * 0.65} />
          <Wrench x={w * 0.15} y={h * 0.55} s={0.7} />
        </g>
      ),
    },

    'construction-payment-disputes-resolution': {
      ...warm, label: 'Resolve Payment Disputes',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.8} />
          <Person x={w * 0.78} y={h * 0.72} s={0.8} facingRight={false} shirt="#DC2626" />
          <Scales x={w * 0.5} y={h * 0.42} s={1} />
          <Document x={w * 0.38} y={h * 0.58} s={0.6} accent="#F59E0B" />
          <Document x={w * 0.62} y={h * 0.58} s={0.6} accent="#3B82F6" />
          <ThumbsUp x={w * 0.5} y={h * 0.18} s={0.8} />
        </g>
      ),
    },

    'understanding-lien-rights': {
      ...blue, label: 'Lien Rights for Subcontractors',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} />
          <Shield x={w * 0.55} y={h * 0.38} s={1.3} color="#3B82F6" />
          <Document x={w * 0.78} y={h * 0.48} s={0.8} accent="#3B82F6" />
          <Gavel x={w * 0.4} y={h * 0.58} s={0.7} />
          <StarBurst x={w * 0.55} y={h * 0.18} s={0.6} color="#3B82F6" />
        </g>
      ),
    },

    'grow-subcontracting-business': {
      ...green, label: 'Grow from $500K to $2M',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.75} />
          <Person x={w * 0.35} y={h * 0.72} s={0.85} shirt="#059669" />
          <Person x={w * 0.5} y={h * 0.72} s={0.95} vest="#22C55E" />
          <BarChart x={w * 0.75} y={h * 0.6} s={0.9} />
          <DollarSign x={w * 0.65} y={h * 0.2} s={0.8} />
          <text x={w * 0.2} y={h * 0.25} textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.5">$500K</text>
          <text x={w * 0.75} y={h * 0.2} textAnchor="middle" fill="#22C55E" fontSize="13" fontWeight="bold" fontFamily="system-ui" opacity="0.6">$2M</text>
        </g>
      ),
    },

    'workers-comp-insurance-contractors': {
      ...base, label: 'Workers Comp Insurance Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.3} y={h * 0.72} s={0.9} />
          <Shield x={w * 0.6} y={h * 0.38} s={1.2} color="#3B82F6" />
          <HardHat x={w * 0.6} y={h * 0.2} s={1.3} />
          <Document x={w * 0.78} y={h * 0.52} s={0.8} accent="#3B82F6" />
          <Toolbox x={w * 0.15} y={h * 0.68} s={0.7} />
          {/* Medical cross */}
          <rect x={w * 0.57} y={h * 0.35} width={6} height={14} rx={1} fill="white" opacity="0.7" />
          <rect x={w * 0.53} y={h * 0.39} width={14} height={6} rx={1} fill="white" opacity="0.7" />
        </g>
      ),
    },

    'invoice-factoring-construction': {
      ...warm, label: 'Invoice Factoring — Is It Worth It?',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Document x={w * 0.42} y={h * 0.45} s={1} accent="#F59E0B" />
          {/* Arrow */}
          <line x1={w * 0.52} y1={h * 0.45} x2={w * 0.62} y2={h * 0.45} stroke="#22C55E" strokeWidth="3" />
          <polygon points={`${w * 0.62},${h * 0.42} ${w * 0.66},${h * 0.45} ${w * 0.62},${h * 0.48}`} fill="#22C55E" />
          <MoneyStack x={w * 0.75} y={h * 0.48} s={1} />
          <DollarSign x={w * 0.6} y={h * 0.2} s={0.7} />
          <text x={w * 0.5} y={h * 0.22} textAnchor="middle" fill="#64748B" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.4">Worth it?</text>
        </g>
      ),
    },

    'prequalification-tips-subcontractors': {
      ...blue, label: 'Get Prequalified Faster',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.9} />
          <Clipboard x={w * 0.5} y={h * 0.42} s={1.2} />
          {/* Approved stamp */}
          <g transform={`rotate(-12, ${w * 0.72}, ${h * 0.38})`}>
            <rect x={w * 0.58} y={h * 0.32} width={w * 0.28} height={h * 0.12} rx={4} stroke="#22C55E" strokeWidth="2.5" fill="none" opacity="0.6" />
            <text x={w * 0.72} y={h * 0.4} textAnchor="middle" fill="#22C55E" fontSize="11" fontWeight="bold" fontFamily="system-ui" opacity="0.7">APPROVED</text>
          </g>
          <Document x={w * 0.78} y={h * 0.58} s={0.7} accent="#22C55E" />
          <ThumbsUp x={w * 0.4} y={h * 0.2} s={0.8} />
        </g>
      ),
    },

    'reduce-construction-payment-delays': {
      ...base, label: '10 Ways to Reduce Payment Delays',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} />
          <Clock x={w * 0.55} y={h * 0.35} s={1.3} />
          <DollarSign x={w * 0.75} y={h * 0.3} s={0.8} />
          <MoneyStack x={w * 0.72} y={h * 0.58} s={0.8} />
          <circle cx={w * 0.82} cy={h * 0.18} r={12} fill="#22C55E" opacity="0.6" />
          <text x={w * 0.82} y={h * 0.2} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">10</text>
          <Toolbox x={w * 0.12} y={h * 0.68} s={0.6} />
        </g>
      ),
    },

    'construction-scheduling-tips': {
      ...warm, label: 'Time Tracking Saves Thousands',
      render: (w, h) => (
        <g>
          <Person x={w * 0.7} y={h * 0.72} s={0.9} facingRight={false} />
          <Clock x={w * 0.35} y={h * 0.38} s={1.5} />
          <DollarSign x={w * 0.55} y={h * 0.25} s={0.7} />
          <DollarSign x={w * 0.2} y={h * 0.3} s={0.5} />
          <Phone x={w * 0.82} y={h * 0.48} s={0.8} />
          <Wrench x={w * 0.15} y={h * 0.55} s={0.6} />
        </g>
      ),
    },

    'the-true-cost-of-late-payments': {
      ...warm, skyTop: '#FCA5A5', skyMid: '#FECACA', skyBot: '#FEE2E2', label: 'The True Cost of Late Payments',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} vest="#EF4444" />
          {/* Declining chart */}
          {[0.35, 0.48, 0.61, 0.74].map((xp, i) => {
            const bh = [45, 35, 22, 12][i];
            return <rect key={i} x={w * xp} y={h * 0.68 - bh} width={w * 0.1} height={bh}
              rx={3} fill={['#22C55E', '#F59E0B', '#F97316', '#EF4444'][i]} opacity="0.6" />;
          })}
          {/* LATE stamp */}
          <g transform={`rotate(-8, ${w * 0.6}, ${h * 0.3})`}>
            <rect x={w * 0.45} y={h * 0.24} width={w * 0.3} height={h * 0.12} rx={3} stroke="#EF4444" strokeWidth="2.5" fill="none" opacity="0.5" />
            <text x={w * 0.6} y={h * 0.32} textAnchor="middle" fill="#EF4444" fontSize="14" fontWeight="bold" fontFamily="system-ui" opacity="0.6">LATE</text>
          </g>
          <DollarSign x={w * 0.18} y={h * 0.3} s={0.7} color="#EF4444" />
        </g>
      ),
    },

    'subcontractor-vs-employee': {
      ...base, label: 'Subcontractor vs. Employee',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.85} />
          <Person x={w * 0.75} y={h * 0.72} s={0.85} facingRight={false} vest="#3B82F6" shirt="#64748B" />
          {/* VS circle */}
          <circle cx={w * 0.5} cy={h * 0.5} r={16} fill="#1a1a2e" opacity="0.8" />
          <text x={w * 0.5} y={h * 0.52} textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="system-ui">VS</text>
          <text x={w * 0.25} y={h * 0.2} textAnchor="middle" fill="#F59E0B" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.6">1099</text>
          <text x={w * 0.75} y={h * 0.2} textAnchor="middle" fill="#3B82F6" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.6">W-2</text>
          {/* Warning */}
          <rect x={w * 0.32} y={h * 0.24} width={w * 0.36} height={h * 0.08} rx={3} fill="#EF4444" opacity="0.15" />
          <text x={w * 0.5} y={h * 0.3} textAnchor="middle" fill="#EF4444" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">$100K+ Risk</text>
        </g>
      ),
    },

    'construction-safety-program-guide': {
      ...green, label: 'Safety Program That Wins Bids',
      render: (w, h) => (
        <g>
          <Person x={w * 0.3} y={h * 0.72} s={0.9} vest="#F59E0B" />
          <Shield x={w * 0.6} y={h * 0.38} s={1.3} color="#22C55E" />
          <HardHat x={w * 0.6} y={h * 0.15} s={1.5} />
          <Toolbox x={w * 0.78} y={h * 0.65} s={0.8} />
          {/* Safety stars */}
          {[0.15, 0.85].map((xp, i) => (
            <text key={i} x={w * xp} y={h * 0.3} textAnchor="middle" fill="#F59E0B" fontSize="16" opacity="0.5">★</text>
          ))}
          <Wrench x={w * 0.15} y={h * 0.55} s={0.6} />
        </g>
      ),
    },

    'ai-voice-agents-construction-collections': {
      ...blue, label: 'AI Voice Agents for Collections',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.85} shirt="#6366F1" />
          <Phone x={w * 0.5} y={h * 0.4} s={1.5} />
          {/* Sound waves */}
          {[16, 24, 32].map((r, i) => (
            <path key={i} d={`M${w * 0.57 + i * 8},${h * 0.3} Q${w * 0.6 + i * 10},${h * 0.4} ${w * 0.57 + i * 8},${h * 0.5}`}
              stroke="#6366F1" strokeWidth="2" fill="none" opacity={0.5 - i * 0.12} />
          ))}
          <DollarSign x={w * 0.78} y={h * 0.3} s={0.8} />
          <MoneyStack x={w * 0.78} y={h * 0.55} s={0.7} />
          <StarBurst x={w * 0.5} y={h * 0.18} s={0.5} color="#6366F1" />
        </g>
      ),
    },

    'payment-prediction-construction': {
      ...blue, label: 'Payment Prediction Technology',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} shirt="#6366F1" />
          {/* Crystal ball / prediction circle */}
          <circle cx={w * 0.55} cy={h * 0.4} r={h * 0.2} fill="#3B82F6" opacity="0.15" stroke="#3B82F6" strokeWidth="2" />
          <polyline points={`${w * 0.42},${h * 0.45} ${w * 0.48},${h * 0.38} ${w * 0.54},${h * 0.42} ${w * 0.6},${h * 0.32} ${w * 0.66},${h * 0.36}`}
            stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <polyline points={`${w * 0.66},${h * 0.36} ${w * 0.72},${h * 0.3}`}
            stroke="#22C55E" strokeWidth="2" fill="none" strokeDasharray="3 3" opacity="0.5" />
          <text x={w * 0.55} y={h * 0.3} textAnchor="middle" fill="#3B82F6" fontSize="14" fontWeight="bold" fontFamily="system-ui" opacity="0.4">94%</text>
          <DollarSign x={w * 0.78} y={h * 0.25} s={0.7} />
          <StarBurst x={w * 0.4} y={h * 0.2} s={0.5} color="#6366F1" />
        </g>
      ),
    },

    /* ═══════════════════════════════════════════════════════════════
       PRIORITY 1 — NEW SEO BLOG ILLUSTRATIONS
       ═══════════════════════════════════════════════════════════════ */

    'how-to-get-paid-faster-as-a-subcontractor': {
      ...green, skyTop: '#34D399', skyMid: '#6EE7B7', skyBot: '#D1FAE5', label: '7 Strategies to Get Paid Faster',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.9} vest="#22C55E" />
          {/* Speed lines behind money */}
          {[0, 5, 10].map((dy, i) => (
            <line key={i} x1={w * 0.4} y1={h * 0.35 + dy} x2={w * 0.5} y2={h * 0.35 + dy}
              stroke="#22C55E" strokeWidth="2" opacity={0.3 + i * 0.15} />
          ))}
          <MoneyStack x={w * 0.6} y={h * 0.4} s={1.2} />
          <Clock x={w * 0.75} y={h * 0.55} s={0.8} />
          {/* Numbered badges for 7 strategies */}
          {[1, 2, 3, 4, 5, 6, 7].map((n, i) => (
            <g key={i}>
              <circle cx={w * (0.1 + i * 0.04)} cy={h * 0.2} r={7} fill="#22C55E" opacity="0.6" />
              <text x={w * (0.1 + i * 0.04)} y={h * 0.22} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">{n}</text>
            </g>
          ))}
          <Phone x={w * 0.4} y={h * 0.55} s={0.9} />
          <StarBurst x={w * 0.6} y={h * 0.18} s={0.6} color="#22C55E" />
        </g>
      ),
    },

    'general-contractor-wont-pay-subcontractor': {
      ...warm, skyTop: '#FCA5A5', skyMid: '#FECACA', skyBot: '#FEE2E2', label: 'When a GC Won\'t Pay',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#EF4444" />
          {/* Crossed out dollar sign */}
          <DollarSign x={w * 0.5} y={h * 0.35} s={1.2} color="#EF4444" />
          <line x1={w * 0.42} y1={h * 0.25} x2={w * 0.58} y2={h * 0.45} stroke="#EF4444" strokeWidth="3" />
          {/* Steps to recovery */}
          <Document x={w * 0.72} y={h * 0.4} s={0.9} accent="#3B82F6" />
          <Gavel x={w * 0.8} y={h * 0.58} s={0.7} />
          <Shield x={w * 0.35} y={h * 0.55} s={0.8} color="#3B82F6" />
          <text x={w * 0.5} y={h * 0.2} textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.6">OVERDUE</text>
        </g>
      ),
    },

    'how-to-write-a-construction-invoice': {
      ...green, label: 'Write Invoices That Get Paid Fast',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Large invoice document */}
          <Document x={w * 0.55} y={h * 0.4} s={1.4} accent="#22C55E" />
          {/* Checkmarks */}
          {[0.28, 0.36, 0.44].map((yp, i) => (
            <g key={i} transform={`translate(${w * 0.7}, ${h * yp})`}>
              <circle r={6} fill="#22C55E" opacity="0.7" />
              <polyline points="-3,0 -1,2 3,-2" stroke="white" strokeWidth="1.5" fill="none" />
            </g>
          ))}
          <ThumbsUp x={w * 0.78} y={h * 0.55} s={0.8} />
          <MoneyStack x={w * 0.15} y={h * 0.55} s={0.6} />
          <StarBurst x={w * 0.4} y={h * 0.15} s={0.5} color="#22C55E" />
        </g>
      ),
    },

    'free-contractor-invoice-templates': {
      ...blue, label: 'Free Invoice Templates',
      render: (w, h) => (
        <g>
          {/* Multiple stacked documents */}
          <Document x={w * 0.3} y={h * 0.48} s={0.9} accent="#3B82F6" />
          <Document x={w * 0.45} y={h * 0.44} s={0.95} accent="#22C55E" />
          <Document x={w * 0.6} y={h * 0.4} s={1} accent="#F59E0B" />
          {/* Download arrow */}
          <g transform={`translate(${w * 0.75}, ${h * 0.45})`}>
            <circle r={16} fill="#3B82F6" opacity="0.2" />
            <line x1={0} y1={-8} x2={0} y2={6} stroke="#3B82F6" strokeWidth="2.5" />
            <polyline points="-6,0 0,8 6,0" stroke="#3B82F6" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          {/* Trade icons */}
          <Wrench x={w * 0.15} y={h * 0.35} s={0.6} rot={-20} />
          <HardHat x={w * 0.82} y={h * 0.25} s={0.9} />
          <text x={w * 0.5} y={h * 0.2} textAnchor="middle" fill="#3B82F6" fontSize="11" fontWeight="bold" fontFamily="system-ui" opacity="0.5">FREE</text>
          <Person x={w * 0.15} y={h * 0.72} s={0.7} />
        </g>
      ),
    },

    'how-to-check-contractor-license': {
      ...base, label: 'Verify Contractor Licenses',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* License card */}
          <g transform={`translate(${w * 0.55}, ${h * 0.38})`}>
            <rect x={-35} y={-22} width={70} height={44} rx={4} fill="white" stroke="#64748B" strokeWidth="1.5" />
            <rect x={-30} y={-17} width={20} height={20} rx={2} fill="#E2E8F0" />
            <rect x={-5} y={-15} width={28} height={3} rx={1} fill="#64748B" opacity="0.4" />
            <rect x={-5} y={-8} width={22} height={2} rx={1} fill="#CBD5E1" />
            <rect x={-5} y={-2} width={25} height={2} rx={1} fill="#CBD5E1" />
            <text x={12} y={16} textAnchor="middle" fill="#22C55E" fontSize="8" fontWeight="bold">ACTIVE</text>
          </g>
          {/* Magnifying glass */}
          <g transform={`translate(${w * 0.72}, ${h * 0.52})`}>
            <circle r={14} fill="none" stroke="#3B82F6" strokeWidth="2.5" />
            <line x1={10} y1={10} x2={20} y2={20} stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
          </g>
          <Shield x={w * 0.35} y={h * 0.55} s={0.7} color="#22C55E" />
          {/* State abbreviations */}
          {['CA', 'TX', 'FL'].map((st, i) => (
            <text key={i} x={w * (0.75 + i * 0.08)} y={h * 0.22} textAnchor="middle" fill="#64748B" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.4">{st}</text>
          ))}
        </g>
      ),
    },

    /* ═══════════════════════════════════════════════════════════════
       15 NEW SEO BLOG ILLUSTRATIONS — UNIQUE KEYWORDS
       ═══════════════════════════════════════════════════════════════ */

    'construction-retainage-explained': {
      ...warm, label: 'Construction Retainage Explained',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Pie chart showing 10% held back */}
          <circle cx={w * 0.55} cy={h * 0.4} r={h * 0.18} fill="#22C55E" opacity="0.3" />
          <path d={`M${w * 0.55},${h * 0.4} L${w * 0.55},${h * 0.22} A${h * 0.18},${h * 0.18} 0 0,1 ${w * 0.55 + h * 0.18 * 0.59},${h * 0.4 - h * 0.18 * 0.81} Z`}
            fill="#F59E0B" opacity="0.8" />
          <text x={w * 0.68} y={h * 0.28} textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.7">10%</text>
          <text x={w * 0.48} y={h * 0.48} textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">90%</text>
          <DollarSign x={w * 0.78} y={h * 0.5} s={0.7} />
          <Clock x={w * 0.35} y={h * 0.55} s={0.6} />
        </g>
      ),
    },

    'how-to-start-subcontracting-business': {
      ...blue, label: 'Start Your Subcontracting Business',
      render: (w, h) => (
        <g>
          <Person x={w * 0.5} y={h * 0.72} s={0.95} vest="#3B82F6" />
          {/* Rocket/growth icon */}
          <g transform={`translate(${w * 0.72}, ${h * 0.35})`}>
            <polygon points="0,-20 8,5 0,0 -8,5" fill="#3B82F6" opacity="0.7" />
            <polygon points="-5,5 0,15 5,5" fill="#F59E0B" opacity="0.6" />
          </g>
          <Document x={w * 0.25} y={h * 0.45} s={0.8} accent="#3B82F6" />
          <HardHat x={w * 0.32} y={h * 0.2} s={1.1} />
          {/* Checklist items */}
          {[0, 8, 16].map((dy, i) => (
            <g key={i}>
              <rect x={w * 0.1} y={h * 0.38 + dy} width={5} height={5} rx={1} stroke="#22C55E" strokeWidth="1" fill="none" opacity="0.6" />
              <polyline points={`${w * 0.11},${h * 0.405 + dy} ${w * 0.12},${h * 0.415 + dy} ${w * 0.14},${h * 0.39 + dy}`}
                stroke="#22C55E" strokeWidth="1" fill="none" opacity="0.7" />
            </g>
          ))}
        </g>
      ),
    },

    'construction-contract-red-flags': {
      ...warm, skyTop: '#FCA5A5', skyMid: '#FECACA', skyBot: '#FEE2E2', label: '12 Contract Red Flags',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#EF4444" />
          <Document x={w * 0.55} y={h * 0.4} s={1.2} accent="#EF4444" />
          {/* Warning triangles */}
          {[0.38, 0.52, 0.66].map((xp, i) => (
            <g key={i}>
              <polygon points={`${w * xp},${h * 0.2} ${w * xp - 8},${h * 0.32} ${w * xp + 8},${h * 0.32}`}
                fill="#FDE68A" stroke="#F59E0B" strokeWidth="1" />
              <text x={w * xp} y={h * 0.29} textAnchor="middle" fill="#DC2626" fontSize="10" fontWeight="bold">!</text>
            </g>
          ))}
          <text x={w * 0.52} y={h * 0.18} textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.5">RED FLAGS</text>
        </g>
      ),
    },

    'subcontractor-bonding-guide': {
      ...blue, label: 'Bonding Guide for Subcontractors',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Bond certificate */}
          <g transform={`translate(${w * 0.55}, ${h * 0.4})`}>
            <rect x={-30} y={-25} width={60} height={50} rx={3} fill="white" stroke="#3B82F6" strokeWidth="2" />
            <rect x={-25} y={-20} width={50} height={8} rx={2} fill="#3B82F6" opacity="0.2" />
            <text x={0} y={-13} textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="bold">BOND</text>
            <circle cx={0} cy={8} r={12} fill="#F59E0B" opacity="0.3" stroke="#F59E0B" strokeWidth="1" />
            <text x={0} y={11} textAnchor="middle" fill="#F59E0B" fontSize="7" fontWeight="bold">✓</text>
          </g>
          <Shield x={w * 0.78} y={h * 0.55} s={0.7} color="#3B82F6" />
          <DollarSign x={w * 0.35} y={h * 0.25} s={0.6} />
        </g>
      ),
    },

    'prevailing-wage-requirements-contractors': {
      ...base, label: 'Prevailing Wage Requirements',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Person x={w * 0.4} y={h * 0.72} s={0.85} shirt="#3B82F6" facingRight={false} />
          {/* Government building silhouette */}
          <g opacity="0.3">
            <rect x={w * 0.55} y={h * 0.35} width={w * 0.25} height={h * 0.25} fill="#64748B" />
            <polygon points={`${w * 0.55},${h * 0.35} ${w * 0.675},${h * 0.22} ${w * 0.8},${h * 0.35}`} fill="#64748B" />
            {[0.58, 0.64, 0.7, 0.76].map((xp, i) => (
              <rect key={i} x={w * xp} y={h * 0.4} width={4} height={h * 0.15} fill="white" opacity="0.5" />
            ))}
          </g>
          <DollarSign x={w * 0.65} y={h * 0.55} s={0.8} />
          <Calculator x={w * 0.82} y={h * 0.5} s={0.7} />
        </g>
      ),
    },

    'commercial-vs-residential-subcontracting': {
      ...base, label: 'Commercial vs. Residential',
      render: (w, h) => (
        <g>
          {/* Commercial building */}
          <g opacity="0.5">
            <rect x={w * 0.15} y={h * 0.3} width={w * 0.2} height={h * 0.35} fill="#3B82F6" />
            {[0, 6, 12, 18, 24].map((dy, i) => (
              [0, 8, 16].map((dx, j) => (
                <rect key={`${i}-${j}`} x={w * 0.17 + dx} y={h * 0.33 + dy} width={4} height={4} fill="white" opacity="0.4" />
              ))
            ))}
          </g>
          {/* House */}
          <g opacity="0.5">
            <rect x={w * 0.6} y={h * 0.45} width={w * 0.2} height={h * 0.2} fill="#22C55E" />
            <polygon points={`${w * 0.6},${h * 0.45} ${w * 0.7},${h * 0.32} ${w * 0.8},${h * 0.45}`} fill="#22C55E" />
            <rect x={w * 0.67} y={h * 0.52} width={6} height={10} fill="white" opacity="0.4" />
          </g>
          {/* VS */}
          <circle cx={w * 0.5} cy={h * 0.45} r={12} fill="#1a1a2e" opacity="0.7" />
          <text x={w * 0.5} y={h * 0.47} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">VS</text>
          <Person x={w * 0.5} y={h * 0.72} s={0.85} />
        </g>
      ),
    },

    'subcontractor-insurance-requirements': {
      ...green, label: 'Insurance Requirements Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Shield x={w * 0.55} y={h * 0.38} s={1.4} color="#22C55E" />
          {/* Insurance policy documents */}
          <Document x={w * 0.75} y={h * 0.35} s={0.6} accent="#3B82F6" />
          <Document x={w * 0.8} y={h * 0.42} s={0.6} accent="#F59E0B" />
          <HardHat x={w * 0.55} y={h * 0.15} s={1} />
          <text x={w * 0.55} y={h * 0.42} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.9">✓</text>
        </g>
      ),
    },

    'construction-material-price-increases': {
      ...warm, label: 'Handle Material Price Increases',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Rising price chart */}
          <polyline points={`${w * 0.35},${h * 0.55} ${w * 0.45},${h * 0.48} ${w * 0.55},${h * 0.52} ${w * 0.65},${h * 0.38} ${w * 0.75},${h * 0.25}`}
            stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Arrow up */}
          <polygon points={`${w * 0.75},${h * 0.25} ${w * 0.72},${h * 0.32} ${w * 0.78},${h * 0.32}`} fill="#EF4444" />
          <DollarSign x={w * 0.78} y={h * 0.45} s={0.7} color="#EF4444" />
          {/* Materials */}
          <Toolbox x={w * 0.35} y={h * 0.68} s={0.7} />
          <text x={w * 0.6} y={h * 0.2} textAnchor="middle" fill="#EF4444" fontSize="10" fontWeight="bold" fontFamily="system-ui" opacity="0.6">PRICE ↑</text>
        </g>
      ),
    },

    'construction-project-delays-subcontractor': {
      ...base, label: 'Surviving Project Delays',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#F59E0B" />
          <Clock x={w * 0.55} y={h * 0.38} s={1.4} />
          {/* Delay indicators */}
          {[0, 8, 16].map((dy, i) => (
            <rect key={i} x={w * 0.72} y={h * 0.32 + dy} width={w * 0.12 - i * 4} height={5} rx={2} fill="#EF4444" opacity={0.4 + i * 0.15} />
          ))}
          <text x={w * 0.78} y={h * 0.28} textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.6">DELAYED</text>
          <Blueprints x={w * 0.35} y={h * 0.6} s={0.8} />
        </g>
      ),
    },

    'subcontractor-estimating-tips': {
      ...blue, label: 'Estimating Tips for Profit',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Calculator x={w * 0.5} y={h * 0.42} s={1.3} />
          <Clipboard x={w * 0.75} y={h * 0.45} s={0.9} />
          <DollarSign x={w * 0.65} y={h * 0.2} s={0.7} />
          <Target x={w * 0.35} y={h * 0.3} s={0.6} />
          <Blueprints x={w * 0.15} y={h * 0.55} s={0.7} />
        </g>
      ),
    },

    'construction-warranty-claims': {
      ...warm, label: 'Handle Warranty Claims',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Warranty badge */}
          <g transform={`translate(${w * 0.55}, ${h * 0.38})`}>
            <circle r={h * 0.15} fill="#F59E0B" opacity="0.2" stroke="#F59E0B" strokeWidth="2" />
            <text x={0} y={-5} textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold">WARRANTY</text>
            <text x={0} y={8} textAnchor="middle" fill="#F59E0B" fontSize="7">1 YEAR</text>
          </g>
          <Wrench x={w * 0.75} y={h * 0.5} s={0.8} rot={30} />
          <Document x={w * 0.78} y={h * 0.35} s={0.6} accent="#F59E0B" />
          <ThumbsUp x={w * 0.35} y={h * 0.3} s={0.7} />
        </g>
      ),
    },

    'subcontractor-change-order-management': {
      ...green, label: 'Master Change Orders',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Document x={w * 0.5} y={h * 0.4} s={1.1} accent="#22C55E" />
          {/* Change/edit icon */}
          <g transform={`translate(${w * 0.65}, ${h * 0.32})`}>
            <circle r={12} fill="#F59E0B" opacity="0.3" />
            <text x={0} y={4} textAnchor="middle" fill="#F59E0B" fontSize="14">✎</text>
          </g>
          <DollarSign x={w * 0.75} y={h * 0.5} s={0.8} />
          <Clipboard x={w * 0.32} y={h * 0.55} s={0.7} />
          <text x={w * 0.5} y={h * 0.2} textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">CHANGE ORDER</text>
        </g>
      ),
    },

    'construction-lien-waiver-guide': {
      ...blue, label: 'Lien Waivers Explained',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Document x={w * 0.5} y={h * 0.4} s={1.2} accent="#3B82F6" />
          {/* Signature line */}
          <line x1={w * 0.42} y1={h * 0.52} x2={w * 0.58} y2={h * 0.52} stroke="#64748B" strokeWidth="1" />
          <text x={w * 0.5} y={h * 0.58} textAnchor="middle" fill="#64748B" fontSize="6" fontFamily="system-ui" opacity="0.5">SIGNATURE</text>
          <Shield x={w * 0.75} y={h * 0.4} s={0.8} color="#3B82F6" />
          <Gavel x={w * 0.32} y={h * 0.55} s={0.6} />
          <text x={w * 0.5} y={h * 0.2} textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.5">LIEN WAIVER</text>
        </g>
      ),
    },

    'subcontractor-networking-tips': {
      ...green, label: 'Networking for Work',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.8} />
          <Person x={w * 0.5} y={h * 0.72} s={0.8} shirt="#3B82F6" />
          <Person x={w * 0.75} y={h * 0.72} s={0.8} facingRight={false} shirt="#22C55E" />
          {/* Connection lines */}
          <line x1={w * 0.3} y1={h * 0.45} x2={w * 0.45} y2={h * 0.45} stroke="#22C55E" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
          <line x1={w * 0.55} y1={h * 0.45} x2={w * 0.7} y2={h * 0.45} stroke="#22C55E" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
          <line x1={w * 0.38} y1={h * 0.35} x2={w * 0.62} y2={h * 0.35} stroke="#22C55E" strokeWidth="2" strokeDasharray="4 2" opacity="0.5" />
          {/* Nodes */}
          {[0.25, 0.5, 0.75].map((xp, i) => (
            <circle key={i} cx={w * xp} cy={h * 0.45} r={6} fill="#22C55E" opacity="0.6" />
          ))}
          <circle cx={w * 0.5} cy={h * 0.28} r={8} fill="#22C55E" opacity="0.8" />
          <ThumbsUp x={w * 0.5} y={h * 0.28} s={0.4} />
        </g>
      ),
    },

    'construction-project-closeout-checklist': {
      ...base, label: 'Project Closeout Checklist',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#22C55E" />
          <Clipboard x={w * 0.55} y={h * 0.4} s={1.3} />
          {/* Checkmarks on clipboard */}
          {[0, 10, 20, 30].map((dy, i) => (
            <g key={i}>
              <circle cx={w * 0.48} cy={h * 0.3 + dy * 0.5} r={4} fill="#22C55E" opacity="0.7" />
              <polyline points={`${w * 0.46},${h * 0.3 + dy * 0.5} ${w * 0.48},${h * 0.32 + dy * 0.5} ${w * 0.51},${h * 0.28 + dy * 0.5}`}
                stroke="white" strokeWidth="1.5" fill="none" />
            </g>
          ))}
          <MoneyStack x={w * 0.78} y={h * 0.45} s={0.8} />
          <DollarSign x={w * 0.35} y={h * 0.25} s={0.6} />
          <text x={w * 0.55} y={h * 0.18} textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">CLOSEOUT</text>
        </g>
      ),
    },

    /* ═══════════════════════════════════════════════════════════════
       20 NEW SEO BLOG ILLUSTRATIONS
       ═══════════════════════════════════════════════════════════════ */

    'how-long-to-pay-subcontractors': {
      ...warm, label: 'Payment Deadline Laws',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Clock x={w * 0.5} y={h * 0.35} s={1.4} />
          <Document x={w * 0.72} y={h * 0.35} s={1.1} />
          <Scales x={w * 0.35} y={h * 0.25} s={0.7} />
          <DollarSign x={w * 0.78} y={h * 0.55} s={0.6} />
          <text x={w * 0.5} y={h * 0.18} textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">STATE LAWS</text>
        </g>
      ),
    },

    'subcontractor-payment-application': {
      ...green, label: 'Payment Application Process',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.85} vest="#22C55E" />
          <Clipboard x={w * 0.5} y={h * 0.38} s={1.3} />
          <DollarSign x={w * 0.72} y={h * 0.3} s={0.9} />
          {/* Progress bar */}
          <rect x={w * 0.35} y={h * 0.6} width={w * 0.4} height={8} rx={4} fill="#E5E7EB" />
          <rect x={w * 0.35} y={h * 0.6} width={w * 0.3} height={8} rx={4} fill="#22C55E" />
          <text x={w * 0.5} y={h * 0.18} textAnchor="middle" fill="#22C55E" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">PAY APP</text>
        </g>
      ),
    },

    'construction-back-charges-guide': {
      ...red, label: 'Back Charges Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#EF4444" />
          <Document x={w * 0.5} y={h * 0.35} s={1.2} accent="#EF4444" />
          {/* X mark on document */}
          <line x1={w * 0.45} y1={h * 0.35} x2={w * 0.55} y2={h * 0.45} stroke="#EF4444" strokeWidth="3" opacity="0.7" />
          <line x1={w * 0.55} y1={h * 0.35} x2={w * 0.45} y2={h * 0.45} stroke="#EF4444" strokeWidth="3" opacity="0.7" />
          <Shield x={w * 0.72} y={h * 0.35} s={1} color="#22C55E" />
          <DollarSign x={w * 0.35} y={h * 0.2} s={0.6} color="#EF4444" />
        </g>
      ),
    },

    'best-accounting-software-subcontractors': {
      ...blue, label: 'Accounting Software Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.18} y={h * 0.72} s={0.8} shirt="#3B82F6" />
          <Calculator x={w * 0.42} y={h * 0.38} s={1.2} />
          <Phone x={w * 0.65} y={h * 0.35} s={1.1} />
          <BarChart x={w * 0.78} y={h * 0.5} s={0.8} />
          {/* Stars for ratings */}
          {[0.35, 0.45, 0.55].map((xp, i) => (
            <text key={i} x={w * xp} y={h * 0.2} textAnchor="middle" fill="#F59E0B" fontSize="12" opacity="0.7">★</text>
          ))}
        </g>
      ),
    },

    'construction-draw-schedule-explained': {
      ...warm, label: 'Draw Schedule Explained',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          {/* Calendar/timeline */}
          <rect x={w * 0.35} y={h * 0.25} width={w * 0.4} height={h * 0.35} rx={4} fill="white" stroke="#E5E7EB" strokeWidth="1" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={w * 0.38} y={h * (0.3 + i * 0.07)} width={w * 0.32} height={h * 0.05} rx={2} fill={i < 2 ? '#22C55E' : '#E5E7EB'} opacity="0.5" />
            </g>
          ))}
          <DollarSign x={w * 0.78} y={h * 0.35} s={0.8} />
          <MoneyStack x={w * 0.78} y={h * 0.55} s={0.7} />
        </g>
      ),
    },

    'subcontractor-scope-creep-management': {
      ...warm, label: 'Managing Scope Creep',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#F59E0B" />
          {/* Expanding document */}
          <Document x={w * 0.45} y={h * 0.35} s={0.9} />
          <Document x={w * 0.52} y={h * 0.32} s={1} />
          <Document x={w * 0.59} y={h * 0.29} s={1.1} />
          {/* Warning triangles */}
          <polygon points={`${w * 0.75},${h * 0.25} ${w * 0.72},${h * 0.32} ${w * 0.78},${h * 0.32}`} fill="#F59E0B" opacity="0.7" />
          <text x={w * 0.75} y={h * 0.3} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">!</text>
          <DollarSign x={w * 0.35} y={h * 0.22} s={0.5} color="#EF4444" />
        </g>
      ),
    },

    'joint-check-agreements-construction': {
      ...blue, label: 'Joint Check Agreements',
      render: (w, h) => (
        <g>
          <Person x={w * 0.22} y={h * 0.72} s={0.8} />
          <Person x={w * 0.78} y={h * 0.72} s={0.8} facingRight={false} shirt="#3B82F6" />
          {/* Check document in middle */}
          <rect x={w * 0.38} y={h * 0.3} width={w * 0.24} height={h * 0.15} rx={3} fill="white" stroke="#3B82F6" strokeWidth="1.5" />
          <rect x={w * 0.4} y={h * 0.35} width={w * 0.12} height={3} fill="#E5E7EB" />
          <rect x={w * 0.4} y={h * 0.4} width={w * 0.08} height={3} fill="#E5E7EB" />
          <DollarSign x={w * 0.5} y={h * 0.5} s={0.8} />
          {/* Connection arrows */}
          <line x1={w * 0.32} y1={h * 0.4} x2={w * 0.38} y2={h * 0.38} stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
          <line x1={w * 0.68} y1={h * 0.4} x2={w * 0.62} y2={h * 0.38} stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
        </g>
      ),
    },

    'subcontractor-default-insurance-guide': {
      ...blue, label: 'Default Insurance Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Shield x={w * 0.5} y={h * 0.35} s={1.5} color="#3B82F6" />
          <Document x={w * 0.72} y={h * 0.4} s={0.9} />
          <HardHat x={w * 0.35} y={h * 0.22} s={0.9} />
          <text x={w * 0.5} y={h * 0.18} textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.6">SDI</text>
        </g>
      ),
    },

    'construction-demand-letter-template': {
      ...warm, label: 'Demand Letter Template',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#F59E0B" />
          <Document x={w * 0.48} y={h * 0.35} s={1.3} accent="#EF4444" />
          <Gavel x={w * 0.72} y={h * 0.35} s={1} />
          <Clock x={w * 0.35} y={h * 0.25} s={0.7} />
          <text x={w * 0.48} y={h * 0.35} textAnchor="middle" fill="#EF4444" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.7">DEMAND</text>
        </g>
      ),
    },

    'notice-to-owner-requirements-states': {
      ...blue, label: 'Notice to Owner Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.18} y={h * 0.72} s={0.8} />
          <Document x={w * 0.45} y={h * 0.35} s={1.2} />
          {/* Map/states representation */}
          <rect x={w * 0.62} y={h * 0.25} width={w * 0.22} height={h * 0.28} rx={3} fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
          {[0.3, 0.35, 0.4].map((yp, i) => (
            <rect key={i} x={w * 0.65} y={h * yp} width={w * 0.07} height={h * 0.03} rx={1} fill="#3B82F6" opacity={0.3 + i * 0.2} />
          ))}
          <Shield x={w * 0.35} y={h * 0.22} s={0.6} color="#22C55E" />
          <text x={w * 0.73} y={h * 0.2} textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.6">50 STATES</text>
        </g>
      ),
    },

    'construction-mediation-vs-arbitration': {
      ...warm, label: 'Mediation vs Arbitration',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.75} />
          <Person x={w * 0.8} y={h * 0.72} s={0.75} facingRight={false} vest="#EF4444" />
          <Scales x={w * 0.5} y={h * 0.32} s={1.3} />
          <Gavel x={w * 0.35} y={h * 0.25} s={0.7} />
          {/* VS */}
          <circle cx={w * 0.5} cy={h * 0.58} r={12} fill="#1a1a2e" opacity="0.8" />
          <text x={w * 0.5} y={h * 0.6} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" fontFamily="system-ui">VS</text>
        </g>
      ),
    },

    'how-to-fire-general-contractor': {
      ...red, label: 'Terminating GC Relationships',
      render: (w, h) => (
        <g>
          <Person x={w * 0.25} y={h * 0.72} s={0.8} />
          <Person x={w * 0.75} y={h * 0.72} s={0.8} facingRight={false} vest="#EF4444" />
          {/* X between them */}
          <line x1={w * 0.45} y1={h * 0.4} x2={w * 0.55} y2={h * 0.5} stroke="#EF4444" strokeWidth="4" opacity="0.7" />
          <line x1={w * 0.55} y1={h * 0.4} x2={w * 0.45} y2={h * 0.5} stroke="#EF4444" strokeWidth="4" opacity="0.7" />
          <Document x={w * 0.5} y={h * 0.22} s={0.8} accent="#EF4444" />
          <Shield x={w * 0.35} y={h * 0.5} s={0.6} color="#22C55E" />
        </g>
      ),
    },

    'construction-payment-bond-claims': {
      ...blue, label: 'Payment Bond Claims',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Shield x={w * 0.48} y={h * 0.32} s={1.4} color="#3B82F6" />
          <Document x={w * 0.7} y={h * 0.38} s={1} />
          <DollarSign x={w * 0.48} y={h * 0.35} s={0.7} />
          <MoneyStack x={w * 0.78} y={h * 0.55} s={0.7} />
          <text x={w * 0.48} y={h * 0.18} textAnchor="middle" fill="#3B82F6" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">BOND CLAIM</text>
        </g>
      ),
    },

    'time-and-materials-contracts-guide': {
      ...warm, label: 'T&M Contracts Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Clock x={w * 0.42} y={h * 0.35} s={1.1} />
          <Calculator x={w * 0.62} y={h * 0.38} s={1} />
          <Document x={w * 0.78} y={h * 0.35} s={0.9} />
          {/* Plus symbol */}
          <circle cx={w * 0.52} cy={h * 0.4} r={8} fill="#F59E0B" opacity="0.8" />
          <text x={w * 0.52} y={h * 0.42} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">+</text>
          <DollarSign x={w * 0.35} y={h * 0.22} s={0.6} />
        </g>
      ),
    },

    'subcontractor-business-credit-building': {
      ...green, label: 'Building Business Credit',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#22C55E" />
          {/* Rising chart */}
          <rect x={w * 0.35} y={h * 0.25} width={w * 0.35} height={h * 0.35} rx={3} fill="white" stroke="#E5E7EB" strokeWidth="1" />
          <polyline points={`${w * 0.38},${h * 0.52} ${w * 0.45},${h * 0.45} ${w * 0.52},${h * 0.48} ${w * 0.58},${h * 0.38} ${w * 0.65},${h * 0.32}`}
            stroke="#22C55E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <DollarSign x={w * 0.75} y={h * 0.3} s={0.9} />
          <Shield x={w * 0.75} y={h * 0.5} s={0.7} color="#22C55E" />
          <text x={w * 0.52} y={h * 0.2} textAnchor="middle" fill="#22C55E" fontSize="8" fontWeight="bold" fontFamily="system-ui" opacity="0.6">CREDIT ↑</text>
        </g>
      ),
    },

    'construction-stop-work-notice': {
      ...red, label: 'Stop Work Notice',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#EF4444" />
          {/* Stop sign shape */}
          <polygon points={`${w * 0.5},${h * 0.2} ${w * 0.6},${h * 0.25} ${w * 0.6},${h * 0.4} ${w * 0.5},${h * 0.45} ${w * 0.4},${h * 0.4} ${w * 0.4},${h * 0.25}`}
            fill="#EF4444" opacity="0.85" />
          <text x={w * 0.5} y={h * 0.35} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="system-ui">STOP</text>
          <Document x={w * 0.72} y={h * 0.35} s={1} accent="#EF4444" />
          <HardHat x={w * 0.35} y={h * 0.22} s={0.8} />
        </g>
      ),
    },

    'subcontractor-progress-billing-guide': {
      ...green, label: 'Progress Billing Guide',
      render: (w, h) => (
        <g>
          <Person x={w * 0.18} y={h * 0.72} s={0.8} vest="#22C55E" />
          <BarChart x={w * 0.45} y={h * 0.4} s={1.3} />
          {/* Calendar */}
          <rect x={w * 0.65} y={h * 0.25} width={w * 0.2} height={h * 0.22} rx={3} fill="white" stroke="#E5E7EB" strokeWidth="1" />
          <rect x={w * 0.65} y={h * 0.25} width={w * 0.2} height={h * 0.06} rx={3} fill="#22C55E" opacity="0.6" />
          <Document x={w * 0.75} y={h * 0.55} s={0.8} />
          <DollarSign x={w * 0.35} y={h * 0.25} s={0.6} />
        </g>
      ),
    },

    'construction-punch-list-tips': {
      ...green, label: 'Punch List Tips',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} vest="#22C55E" />
          <Clipboard x={w * 0.52} y={h * 0.38} s={1.3} />
          {/* Checkmarks */}
          {[0, 12, 24].map((dy, i) => (
            <g key={i}>
              <circle cx={w * 0.48} cy={h * 0.32 + dy * 0.4} r={5} fill="#22C55E" opacity="0.8" />
              <polyline points={`${w * 0.46},${h * 0.32 + dy * 0.4} ${w * 0.48},${h * 0.34 + dy * 0.4} ${w * 0.51},${h * 0.3 + dy * 0.4}`}
                stroke="white" strokeWidth="1.5" fill="none" />
            </g>
          ))}
          <ThumbsUp x={w * 0.75} y={h * 0.35} s={1} />
          <DollarSign x={w * 0.75} y={h * 0.55} s={0.6} />
        </g>
      ),
    },

    'subcontractor-vs-prime-contractor': {
      ...blue, label: 'Sub vs Prime Contractor',
      render: (w, h) => (
        <g>
          {/* Org chart structure */}
          <rect x={w * 0.4} y={h * 0.18} width={w * 0.2} height={h * 0.1} rx={3} fill="#3B82F6" opacity="0.8" />
          <text x={w * 0.5} y={h * 0.25} textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">PRIME</text>
          <line x1={w * 0.5} y1={h * 0.28} x2={w * 0.5} y2={h * 0.35} stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
          <line x1={w * 0.35} y1={h * 0.35} x2={w * 0.65} y2={h * 0.35} stroke="#3B82F6" strokeWidth="2" opacity="0.5" />
          <rect x={w * 0.25} y={h * 0.38} width={w * 0.18} height={h * 0.08} rx={3} fill="#22C55E" opacity="0.8" />
          <rect x={w * 0.57} y={h * 0.38} width={w * 0.18} height={h * 0.08} rx={3} fill="#22C55E" opacity="0.8" />
          <text x={w * 0.34} y={h * 0.43} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SUB</text>
          <text x={w * 0.66} y={h * 0.43} textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">SUB</text>
          <Person x={w * 0.25} y={h * 0.72} s={0.75} />
          <Person x={w * 0.75} y={h * 0.72} s={0.75} facingRight={false} shirt="#3B82F6" />
        </g>
      ),
    },

    'construction-cost-plus-contracts': {
      ...warm, label: 'Cost Plus Contracts',
      render: (w, h) => (
        <g>
          <Person x={w * 0.2} y={h * 0.72} s={0.85} />
          <Calculator x={w * 0.45} y={h * 0.38} s={1.2} />
          <Document x={w * 0.68} y={h * 0.35} s={1} />
          {/* Plus symbol */}
          <circle cx={w * 0.56} cy={h * 0.4} r={10} fill="#F59E0B" opacity="0.9" />
          <text x={w * 0.56} y={h * 0.43} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">+</text>
          <DollarSign x={w * 0.78} y={h * 0.5} s={0.8} />
          <text x={w * 0.56} y={h * 0.2} textAnchor="middle" fill="#F59E0B" fontSize="9" fontWeight="bold" fontFamily="system-ui" opacity="0.6">COST + FEE</text>
        </g>
      ),
    },
  };

  return configs[slug] || {
    ...base, label: 'SubPaid Blog',
    render: (w: number, h: number) => (
      <g>
        <Person x={w * 0.35} y={h * 0.72} s={0.9} />
        <Clipboard x={w * 0.55} y={h * 0.45} s={1} />
        <DollarSign x={w * 0.7} y={h * 0.25} s={0.8} />
        <Toolbox x={w * 0.75} y={h * 0.65} s={0.7} />
        <StarBurst x={w * 0.5} y={h * 0.2} s={0.6} />
      </g>
    ),
  };
}
