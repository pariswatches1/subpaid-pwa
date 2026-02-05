'use client';

// Custom SVG illustration component for blog posts
// Each blog gets a unique, on-brand illustration — no stock photos needed

interface BlogImageProps {
  slug: string;
  className?: string;
  size?: 'card' | 'featured' | 'hero';
}

// Color palette
const colors = {
  navy: '#1a1a2e',
  green: '#9FE870',
  blue: '#54A0FF',
  orange: '#FF9F43',
  skyLight: '#E8F4F8',
  skyMid: '#D4EBF2',
  sky: '#A8D8EA',
};

export function BlogImage({ slug, className = '', size = 'card' }: BlogImageProps) {
  const h = size === 'hero' ? 320 : size === 'featured' ? 300 : 192;
  const w = size === 'featured' ? 600 : 400;

  const illustration = getIllustration(slug);

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ minHeight: h }}>
      <svg
        viewBox={`0 0 ${w} ${h}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Background gradient */}
        <defs>
          <linearGradient id={`bg-${slug}`} x1="0" y1="0" x2={w} y2={h} gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={illustration.bgFrom} />
            <stop offset="100%" stopColor={illustration.bgTo} />
          </linearGradient>
          <linearGradient id={`accent-${slug}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={illustration.accentFrom} />
            <stop offset="100%" stopColor={illustration.accentTo} />
          </linearGradient>
        </defs>
        <rect width={w} height={h} fill={`url(#bg-${slug})`} />

        {/* Decorative circles */}
        <circle cx={w * 0.85} cy={h * 0.15} r={h * 0.3} fill="white" opacity="0.06" />
        <circle cx={w * 0.1} cy={h * 0.9} r={h * 0.2} fill="white" opacity="0.04" />

        {/* Illustration content */}
        {illustration.render(w, h)}
      </svg>
    </div>
  );
}

interface IllustrationConfig {
  bgFrom: string;
  bgTo: string;
  accentFrom: string;
  accentTo: string;
  render: (w: number, h: number) => React.ReactNode;
}

function getIllustration(slug: string): IllustrationConfig {
  const illustrations: Record<string, IllustrationConfig> = {
    // ── Cash Flow Management Guide ──
    'subcontractor-cash-flow-management-guide': {
      bgFrom: '#1a1a2e',
      bgTo: '#2d2d5e',
      accentFrom: colors.green,
      accentTo: '#6dd44a',
      render: (w, h) => (
        <g>
          {/* Bar chart */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((x, i) => {
            const barH = [0.4, 0.6, 0.5, 0.75, 0.65][i];
            return (
              <g key={i}>
                <rect x={w * x - 15} y={h * (1 - barH) - 10} width={30} height={h * barH - 20}
                  rx={4} fill={i % 2 === 0 ? colors.green : colors.blue} opacity={0.85} />
              </g>
            );
          })}
          {/* Trend line */}
          <polyline
            points={`${w * 0.2},${h * 0.5} ${w * 0.35},${h * 0.35} ${w * 0.5},${h * 0.4} ${w * 0.65},${h * 0.22} ${w * 0.8},${h * 0.28}`}
            stroke={colors.orange} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"
          />
          {/* Dollar signs */}
          <text x={w * 0.5} y={h * 0.15} textAnchor="middle" fill="white" fontSize="24" fontWeight="bold" opacity="0.2">$ $ $</text>
          {/* Arrow up */}
          <polygon points={`${w * 0.88},${h * 0.45} ${w * 0.92},${h * 0.35} ${w * 0.96},${h * 0.45}`} fill={colors.green} opacity="0.6" />
          <rect x={w * 0.895} y={h * 0.45} width={5} height={20} fill={colors.green} opacity="0.6" rx={2} />
        </g>
      ),
    },

    // ── AI Invoicing ──
    'how-ai-is-transforming-invoicing': {
      bgFrom: '#0f172a',
      bgTo: '#1e3a5f',
      accentFrom: colors.blue,
      accentTo: '#3b82f6',
      render: (w, h) => (
        <g>
          {/* Brain/AI circle */}
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.25} stroke={colors.blue} strokeWidth="2" fill="none" opacity="0.4" />
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.18} stroke={colors.blue} strokeWidth="1.5" fill="none" opacity="0.25" />
          {/* Neural connections */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => {
            const rad = (angle * Math.PI) / 180;
            const cx = w * 0.5 + Math.cos(rad) * h * 0.25;
            const cy = h * 0.45 + Math.sin(rad) * h * 0.25;
            return <circle key={i} cx={cx} cy={cy} r={5} fill={colors.blue} opacity="0.7" />;
          })}
          {/* Document icon center */}
          <rect x={w * 0.44} y={h * 0.32} width={w * 0.12} height={h * 0.26} rx={4} fill="white" opacity="0.15" />
          <rect x={w * 0.46} y={h * 0.37} width={w * 0.08} height={3} rx={1} fill={colors.blue} opacity="0.6" />
          <rect x={w * 0.46} y={h * 0.42} width={w * 0.06} height={3} rx={1} fill={colors.blue} opacity="0.4" />
          <rect x={w * 0.46} y={h * 0.47} width={w * 0.07} height={3} rx={1} fill={colors.blue} opacity="0.5" />
          {/* Sparkle particles */}
          {[{x: 0.25, y: 0.2}, {x: 0.75, y: 0.25}, {x: 0.8, y: 0.7}, {x: 0.2, y: 0.75}].map((p, i) => (
            <g key={i}>
              <line x1={w * p.x - 6} y1={h * p.y} x2={w * p.x + 6} y2={h * p.y} stroke={colors.green} strokeWidth="2" opacity="0.5" />
              <line x1={w * p.x} y1={h * p.y - 6} x2={w * p.x} y2={h * p.y + 6} stroke={colors.green} strokeWidth="2" opacity="0.5" />
            </g>
          ))}
        </g>
      ),
    },

    // ── Construction Invoice ──
    'how-to-write-construction-invoice': {
      bgFrom: '#14532d',
      bgTo: '#166534',
      accentFrom: colors.green,
      accentTo: '#4ade80',
      render: (w, h) => (
        <g>
          {/* Invoice document */}
          <rect x={w * 0.3} y={h * 0.1} width={w * 0.4} height={h * 0.75} rx={8} fill="white" opacity="0.15" />
          <rect x={w * 0.3} y={h * 0.1} width={w * 0.4} height={h * 0.12} rx={8} fill={colors.green} opacity="0.3" />
          {/* Invoice lines */}
          {[0.28, 0.35, 0.42, 0.49, 0.56].map((y, i) => (
            <g key={i}>
              <rect x={w * 0.35} y={h * y} width={w * (0.15 + i * 0.02)} height={4} rx={2} fill="white" opacity={0.2 + i * 0.05} />
              <rect x={w * 0.58} y={h * y} width={w * 0.07} height={4} rx={2} fill={colors.green} opacity={0.3 + i * 0.05} />
            </g>
          ))}
          {/* Total line */}
          <rect x={w * 0.35} y={h * 0.67} width={w * 0.3} height={2} rx={1} fill="white" opacity="0.3" />
          <rect x={w * 0.52} y={h * 0.71} width={w * 0.13} height={6} rx={3} fill={colors.green} opacity="0.5" />
          {/* Checkmark */}
          <circle cx={w * 0.75} cy={h * 0.25} r={20} fill={colors.green} opacity="0.3" />
          <polyline points={`${w * 0.73},${h * 0.25} ${w * 0.75},${h * 0.28} ${w * 0.78},${h * 0.22}`}
            stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
          {/* Pencil */}
          <line x1={w * 0.2} y1={h * 0.8} x2={w * 0.28} y2={h * 0.6} stroke={colors.orange} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
          <circle cx={w * 0.2} cy={h * 0.8} r={3} fill={colors.orange} opacity="0.5" />
        </g>
      ),
    },

    // ── GC Red Flags ──
    'general-contractor-payment-problems': {
      bgFrom: '#7f1d1d',
      bgTo: '#991b1b',
      accentFrom: '#ef4444',
      accentTo: colors.orange,
      render: (w, h) => (
        <g>
          {/* Warning triangle */}
          <polygon points={`${w * 0.5},${h * 0.15} ${w * 0.3},${h * 0.7} ${w * 0.7},${h * 0.7}`}
            stroke="#fbbf24" strokeWidth="3" fill="none" opacity="0.5" />
          <text x={w * 0.5} y={h * 0.55} textAnchor="middle" fill="#fbbf24" fontSize="36" fontWeight="bold" opacity="0.7">!</text>
          {/* Red flags */}
          {[0.15, 0.85].map((x, i) => (
            <g key={i}>
              <line x1={w * x} y1={h * 0.3} x2={w * x} y2={h * 0.75} stroke="white" strokeWidth="2" opacity="0.2" />
              <polygon points={`${w * x},${h * 0.3} ${w * x + 20},${h * 0.37} ${w * x},${h * 0.44}`}
                fill="#ef4444" opacity="0.6" />
            </g>
          ))}
          {/* Number 7 */}
          <text x={w * 0.5} y={h * 0.92} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" opacity="0.15">7 RED FLAGS</text>
        </g>
      ),
    },

    // ── Payment Terms ──
    'construction-payment-terms-explained': {
      bgFrom: '#312e81',
      bgTo: '#3730a3',
      accentFrom: colors.blue,
      accentTo: '#818cf8',
      render: (w, h) => (
        <g>
          {/* Contract/document */}
          <rect x={w * 0.25} y={h * 0.08} width={w * 0.5} height={h * 0.8} rx={6} fill="white" opacity="0.1" />
          {/* Section headers */}
          {['Net-30', 'Retainage', 'Pay-When-Paid'].map((term, i) => (
            <g key={i}>
              <rect x={w * 0.3} y={h * (0.15 + i * 0.25)} width={w * 0.4} height={h * 0.18} rx={4} fill="white" opacity="0.08" />
              <text x={w * 0.5} y={h * (0.26 + i * 0.25)} textAnchor="middle" fill={i === 0 ? colors.green : i === 1 ? colors.blue : colors.orange}
                fontSize="14" fontWeight="bold" opacity="0.7">{term}</text>
            </g>
          ))}
          {/* Decorative brackets */}
          <text x={w * 0.18} y={h * 0.5} fill="white" fontSize="60" opacity="0.08" fontWeight="bold">{'{'}</text>
          <text x={w * 0.76} y={h * 0.5} fill="white" fontSize="60" opacity="0.08" fontWeight="bold">{'}'}</text>
        </g>
      ),
    },

    // ── Best Invoicing Apps ──
    'best-invoicing-apps-subcontractors': {
      bgFrom: '#1e1b4b',
      bgTo: '#312e81',
      accentFrom: colors.orange,
      accentTo: '#fbbf24',
      render: (w, h) => (
        <g>
          {/* Phone mockups */}
          {[0.25, 0.5, 0.75].map((x, i) => (
            <g key={i}>
              <rect x={w * x - 25} y={h * 0.15 + i * 8} width={50} height={h * 0.6} rx={10}
                stroke="white" strokeWidth="1.5" fill="none" opacity={0.2 + i * 0.1} />
              <rect x={w * x - 18} y={h * 0.25 + i * 8} width={36} height={4} rx={2}
                fill={[colors.green, colors.blue, colors.orange][i]} opacity="0.5" />
              <rect x={w * x - 18} y={h * 0.33 + i * 8} width={28} height={3} rx={1} fill="white" opacity="0.15" />
              <rect x={w * x - 18} y={h * 0.39 + i * 8} width={32} height={3} rx={1} fill="white" opacity="0.12" />
              <rect x={w * x - 18} y={h * 0.45 + i * 8} width={24} height={3} rx={1} fill="white" opacity="0.1" />
              {/* Star rating */}
              {'★★★★★'.split('').map((_, si) => (
                <text key={si} x={w * x - 18 + si * 8} y={h * 0.58 + i * 8} fill={colors.orange} fontSize="8" opacity="0.6">★</text>
              ))}
            </g>
          ))}
          {/* VS labels */}
          <text x={w * 0.375} y={h * 0.5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.2">vs</text>
          <text x={w * 0.625} y={h * 0.5} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.2">vs</text>
        </g>
      ),
    },

    // ── Mechanics Lien ──
    'mechanics-lien-filing-guide': {
      bgFrom: '#1a1a2e',
      bgTo: '#2d1a4e',
      accentFrom: colors.orange,
      accentTo: '#f59e0b',
      render: (w, h) => (
        <g>
          {/* Gavel */}
          <rect x={w * 0.42} y={h * 0.2} width={w * 0.16} height={12} rx={4} fill={colors.orange} opacity="0.6" />
          <rect x={w * 0.48} y={h * 0.28} width={8} height={h * 0.25} rx={3} fill={colors.orange} opacity="0.4" />
          {/* Sound block */}
          <ellipse cx={w * 0.5} cy={h * 0.6} rx={30} ry={10} fill={colors.orange} opacity="0.3" />
          {/* Document with lien text */}
          <rect x={w * 0.2} y={h * 0.35} width={w * 0.2} height={h * 0.45} rx={4} fill="white" opacity="0.1" />
          <rect x={w * 0.23} y={h * 0.4} width={w * 0.14} height={3} rx={1} fill="white" opacity="0.2" />
          <rect x={w * 0.23} y={h * 0.45} width={w * 0.1} height={3} rx={1} fill="white" opacity="0.15" />
          <rect x={w * 0.23} y={h * 0.5} width={w * 0.12} height={3} rx={1} fill="white" opacity="0.15" />
          {/* Shield */}
          <path d={`M${w * 0.75},${h * 0.3} L${w * 0.75 + 20},${h * 0.38} L${w * 0.75 + 20},${h * 0.55} L${w * 0.75},${h * 0.65} L${w * 0.75 - 20},${h * 0.55} L${w * 0.75 - 20},${h * 0.38} Z`}
            stroke={colors.blue} strokeWidth="2" fill="none" opacity="0.4" />
          <text x={w * 0.75} y={h * 0.5} textAnchor="middle" fill={colors.blue} fontSize="14" fontWeight="bold" opacity="0.5">§</text>
        </g>
      ),
    },

    // ── 5 Tips Get Paid Faster ──
    '5-tips-to-get-paid-faster': {
      bgFrom: '#064e3b',
      bgTo: '#065f46',
      accentFrom: colors.green,
      accentTo: '#34d399',
      render: (w, h) => (
        <g>
          {/* Speed/lightning bolt */}
          <polygon points={`${w * 0.52},${h * 0.1} ${w * 0.42},${h * 0.45} ${w * 0.5},${h * 0.45} ${w * 0.46},${h * 0.85} ${w * 0.58},${h * 0.45} ${w * 0.5},${h * 0.45}`}
            fill={colors.green} opacity="0.3" />
          {/* Numbered tips */}
          {[1, 2, 3, 4, 5].map((n, i) => (
            <g key={i}>
              <circle cx={w * (0.15 + i * 0.175)} cy={h * 0.85} r={14} fill="white" opacity="0.1" />
              <text x={w * (0.15 + i * 0.175)} y={h * 0.87} textAnchor="middle" fill={colors.green} fontSize="14" fontWeight="bold" opacity="0.6">{n}</text>
            </g>
          ))}
          {/* Dollar with wings */}
          <text x={w * 0.5} y={h * 0.35} textAnchor="middle" fill="white" fontSize="32" fontWeight="bold" opacity="0.15">$</text>
          <line x1={w * 0.38} y1={h * 0.28} x2={w * 0.32} y2={h * 0.22} stroke={colors.green} strokeWidth="2" opacity="0.4" />
          <line x1={w * 0.62} y1={h * 0.28} x2={w * 0.68} y2={h * 0.22} stroke={colors.green} strokeWidth="2" opacity="0.4" />
        </g>
      ),
    },

    // ── Profit Margin ──
    'subcontractor-profit-margin-guide': {
      bgFrom: '#1a1a2e',
      bgTo: '#1a2e4a',
      accentFrom: colors.green,
      accentTo: colors.blue,
      render: (w, h) => (
        <g>
          {/* Pie chart */}
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.28} stroke="white" strokeWidth="1" fill="none" opacity="0.1" />
          <path d={`M${w * 0.5},${h * 0.45} L${w * 0.5},${h * 0.17} A${h * 0.28},${h * 0.28} 0 0,1 ${w * 0.5 + h * 0.24},${h * 0.59} Z`}
            fill={colors.green} opacity="0.4" />
          <path d={`M${w * 0.5},${h * 0.45} L${w * 0.5 + h * 0.24},${h * 0.59} A${h * 0.28},${h * 0.28} 0 0,1 ${w * 0.5 - h * 0.1},${h * 0.72} Z`}
            fill={colors.blue} opacity="0.4" />
          <path d={`M${w * 0.5},${h * 0.45} L${w * 0.5 - h * 0.1},${h * 0.72} A${h * 0.28},${h * 0.28} 0 0,1 ${w * 0.5},${h * 0.17} Z`}
            fill={colors.orange} opacity="0.3" />
          {/* Labels */}
          <text x={w * 0.62} y={h * 0.3} fill={colors.green} fontSize="11" fontWeight="bold" opacity="0.7">Profit</text>
          <text x={w * 0.65} y={h * 0.65} fill={colors.blue} fontSize="10" opacity="0.6">Labor</text>
          <text x={w * 0.25} y={h * 0.6} fill={colors.orange} fontSize="10" opacity="0.5">Materials</text>
          {/* Percentage */}
          <text x={w * 0.5} y={h * 0.47} textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" opacity="0.25">15-20%</text>
        </g>
      ),
    },

    // ── AIA Billing ──
    'aia-billing-guide-subcontractors': {
      bgFrom: '#1e3a5f',
      bgTo: '#1e40af',
      accentFrom: colors.blue,
      accentTo: '#60a5fa',
      render: (w, h) => (
        <g>
          {/* G702 Form */}
          <rect x={w * 0.15} y={h * 0.08} width={w * 0.35} height={h * 0.8} rx={4} fill="white" opacity="0.1" />
          <text x={w * 0.325} y={h * 0.18} textAnchor="middle" fill={colors.blue} fontSize="11" fontWeight="bold" opacity="0.6">G702</text>
          {/* Grid lines */}
          {[0.25, 0.35, 0.45, 0.55, 0.65].map((y, i) => (
            <g key={i}>
              <line x1={w * 0.18} y1={h * y} x2={w * 0.47} y2={h * y} stroke="white" strokeWidth="0.5" opacity="0.15" />
              <rect x={w * 0.19} y={h * y + 3} width={w * 0.1} height={3} rx={1} fill="white" opacity="0.1" />
              <rect x={w * 0.35} y={h * y + 3} width={w * 0.08} height={3} rx={1} fill={colors.blue} opacity="0.2" />
            </g>
          ))}
          {/* G703 Form */}
          <rect x={w * 0.55} y={h * 0.12} width={w * 0.3} height={h * 0.72} rx={4} fill="white" opacity="0.08" />
          <text x={w * 0.7} y={h * 0.22} textAnchor="middle" fill={colors.blue} fontSize="11" fontWeight="bold" opacity="0.5">G703</text>
          {[0.3, 0.4, 0.5, 0.6].map((y, i) => (
            <g key={i}>
              <line x1={w * 0.58} y1={h * y} x2={w * 0.82} y2={h * y} stroke="white" strokeWidth="0.5" opacity="0.1" />
              <rect x={w * 0.59} y={h * y + 3} width={w * 0.08} height={3} rx={1} fill="white" opacity="0.08" />
            </g>
          ))}
          {/* Connecting arrow */}
          <line x1={w * 0.51} y1={h * 0.45} x2={w * 0.54} y2={h * 0.45} stroke={colors.green} strokeWidth="2" opacity="0.4" markerEnd="url(#arrow)" />
        </g>
      ),
    },

    // ── Tax Deductions ──
    'construction-business-tax-deductions': {
      bgFrom: '#14532d',
      bgTo: '#064e3b',
      accentFrom: colors.green,
      accentTo: '#22c55e',
      render: (w, h) => (
        <g>
          {/* Calculator */}
          <rect x={w * 0.35} y={h * 0.12} width={w * 0.3} height={h * 0.7} rx={8} fill="white" opacity="0.12" />
          <rect x={w * 0.38} y={h * 0.17} width={w * 0.24} height={h * 0.15} rx={4} fill={colors.green} opacity="0.2" />
          <text x={w * 0.5} y={h * 0.27} textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" opacity="0.5">$15,000</text>
          {/* Calculator buttons */}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <rect key={i} x={w * (0.39 + (i % 3) * 0.08)} y={h * (0.38 + Math.floor(i / 3) * 0.1)}
              width={w * 0.06} height={h * 0.07} rx={3} fill="white" opacity="0.08" />
          ))}
          {/* Floating dollar signs */}
          {[{x: 0.18, y: 0.3, s: 20}, {x: 0.78, y: 0.4, s: 16}, {x: 0.22, y: 0.7, s: 14}, {x: 0.82, y: 0.65, s: 18}].map((d, i) => (
            <text key={i} x={w * d.x} y={h * d.y} textAnchor="middle" fill={colors.green} fontSize={d.s} fontWeight="bold" opacity="0.25">$</text>
          ))}
          {/* 15 badge */}
          <circle cx={w * 0.78} cy={h * 0.2} r={18} fill={colors.orange} opacity="0.4" />
          <text x={w * 0.78} y={h * 0.22} textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" opacity="0.8">15</text>
        </g>
      ),
    },

    // ── Bidding ──
    'how-to-bid-construction-jobs': {
      bgFrom: '#1a1a2e',
      bgTo: '#2d2d5e',
      accentFrom: colors.blue,
      accentTo: colors.green,
      render: (w, h) => (
        <g>
          {/* Target/bullseye */}
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.32} stroke={colors.blue} strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.22} stroke={colors.blue} strokeWidth="2" fill="none" opacity="0.3" />
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.12} stroke={colors.green} strokeWidth="2" fill="none" opacity="0.4" />
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.04} fill={colors.green} opacity="0.6" />
          {/* Arrow hitting center */}
          <line x1={w * 0.22} y1={h * 0.18} x2={w * 0.48} y2={h * 0.43} stroke={colors.orange} strokeWidth="2.5" opacity="0.5" />
          <polygon points={`${w * 0.48},${h * 0.43} ${w * 0.44},${h * 0.38} ${w * 0.42},${h * 0.44}`}
            fill={colors.orange} opacity="0.6" />
          {/* WIN text */}
          <text x={w * 0.5} y={h * 0.9} textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.1">WIN THE BID</text>
        </g>
      ),
    },

    // ── Payment Disputes ──
    'construction-payment-disputes-resolution': {
      bgFrom: '#3b0764',
      bgTo: '#581c87',
      accentFrom: '#a855f7',
      accentTo: '#c084fc',
      render: (w, h) => (
        <g>
          {/* Handshake abstraction */}
          <path d={`M${w * 0.25},${h * 0.5} Q${w * 0.35},${h * 0.35} ${w * 0.45},${h * 0.45} Q${w * 0.55},${h * 0.55} ${w * 0.5},${h * 0.45}`}
            stroke={colors.blue} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d={`M${w * 0.75},${h * 0.5} Q${w * 0.65},${h * 0.35} ${w * 0.55},${h * 0.45} Q${w * 0.5},${h * 0.5} ${w * 0.5},${h * 0.45}`}
            stroke={colors.green} strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round" />
          {/* Balance scale */}
          <line x1={w * 0.5} y1={h * 0.15} x2={w * 0.5} y2={h * 0.3} stroke="white" strokeWidth="2" opacity="0.2" />
          <line x1={w * 0.35} y1={h * 0.2} x2={w * 0.65} y2={h * 0.2} stroke="white" strokeWidth="2" opacity="0.2" />
          <path d={`M${w * 0.3},${h * 0.25} Q${w * 0.35},${h * 0.3} ${w * 0.4},${h * 0.25}`} stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
          <path d={`M${w * 0.6},${h * 0.25} Q${w * 0.65},${h * 0.3} ${w * 0.7},${h * 0.25}`} stroke="white" strokeWidth="1.5" fill="none" opacity="0.15" />
          {/* Bridge metaphor - arch */}
          <path d={`M${w * 0.2},${h * 0.75} Q${w * 0.5},${h * 0.55} ${w * 0.8},${h * 0.75}`}
            stroke="white" strokeWidth="2" fill="none" opacity="0.1" strokeDasharray="4 4" />
        </g>
      ),
    },

    // ── Lien Rights ──
    'understanding-lien-rights': {
      bgFrom: '#1a1a2e',
      bgTo: '#1e3a5f',
      accentFrom: colors.blue,
      accentTo: colors.orange,
      render: (w, h) => (
        <g>
          {/* Shield with lock */}
          <path d={`M${w * 0.5},${h * 0.1} L${w * 0.7},${h * 0.22} L${w * 0.7},${h * 0.55} L${w * 0.5},${h * 0.8} L${w * 0.3},${h * 0.55} L${w * 0.3},${h * 0.22} Z`}
            stroke={colors.blue} strokeWidth="2.5" fill={colors.blue} opacity="0.12" />
          {/* Lock */}
          <rect x={w * 0.44} y={h * 0.4} width={w * 0.12} height={h * 0.18} rx={3} fill="white" opacity="0.15" />
          <path d={`M${w * 0.46},${h * 0.4} L${w * 0.46},${h * 0.35} Q${w * 0.46},${h * 0.28} ${w * 0.5},${h * 0.28} Q${w * 0.54},${h * 0.28} ${w * 0.54},${h * 0.35} L${w * 0.54},${h * 0.4}`}
            stroke="white" strokeWidth="2" fill="none" opacity="0.2" />
          <circle cx={w * 0.5} cy={h * 0.48} r={3} fill="white" opacity="0.3" />
          {/* Paragraph symbol */}
          <text x={w * 0.5} y={h * 0.9} textAnchor="middle" fill="white" fontSize="14" opacity="0.1">PROTECTED</text>
        </g>
      ),
    },

    // ── Grow Business ──
    'grow-subcontracting-business': {
      bgFrom: '#0c4a6e',
      bgTo: '#075985',
      accentFrom: colors.green,
      accentTo: colors.blue,
      render: (w, h) => (
        <g>
          {/* Growth staircase */}
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={w * (0.15 + i * 0.15)} y={h * (0.7 - i * 0.12)} width={w * 0.12} height={h * (0.2 + i * 0.12)}
              rx={3} fill={colors.green} opacity={0.15 + i * 0.08} />
          ))}
          {/* Dollar amounts */}
          <text x={w * 0.21} y={h * 0.65} textAnchor="middle" fill="white" fontSize="8" opacity="0.3">$500K</text>
          <text x={w * 0.81} y={h * 0.2} textAnchor="middle" fill={colors.green} fontSize="10" fontWeight="bold" opacity="0.6">$2M</text>
          {/* Upward arrow */}
          <polyline points={`${w * 0.2},${h * 0.7} ${w * 0.5},${h * 0.3} ${w * 0.8},${h * 0.15}`}
            stroke={colors.green} strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
          <polygon points={`${w * 0.8},${h * 0.15} ${w * 0.78},${h * 0.22} ${w * 0.83},${h * 0.2}`} fill={colors.green} opacity="0.5" />
        </g>
      ),
    },

    // ── Workers Comp ──
    'workers-comp-insurance-contractors': {
      bgFrom: '#1a1a2e',
      bgTo: '#1a2e4a',
      accentFrom: colors.blue,
      accentTo: '#38bdf8',
      render: (w, h) => (
        <g>
          {/* Hard hat */}
          <path d={`M${w * 0.35},${h * 0.45} Q${w * 0.35},${h * 0.2} ${w * 0.5},${h * 0.18} Q${w * 0.65},${h * 0.2} ${w * 0.65},${h * 0.45}`}
            fill={colors.orange} opacity="0.35" />
          <rect x={w * 0.3} y={h * 0.42} width={w * 0.4} height={8} rx={3} fill={colors.orange} opacity="0.4" />
          {/* Cross/medical */}
          <rect x={w * 0.47} y={h * 0.55} width={w * 0.06} height={h * 0.2} rx={2} fill="white" opacity="0.15" />
          <rect x={w * 0.42} y={h * 0.6} width={w * 0.16} height={h * 0.1} rx={2} fill="white" opacity="0.15" />
          {/* Insurance shield */}
          <path d={`M${w * 0.78},${h * 0.25} L${w * 0.88},${h * 0.32} L${w * 0.88},${h * 0.5} L${w * 0.78},${h * 0.6} L${w * 0.68},${h * 0.5} L${w * 0.68},${h * 0.32} Z`}
            stroke={colors.blue} strokeWidth="1.5" fill="none" opacity="0.3" />
          <text x={w * 0.78} y={h * 0.44} textAnchor="middle" fill={colors.blue} fontSize="12" opacity="0.5">✓</text>
        </g>
      ),
    },

    // ── Invoice Factoring ──
    'invoice-factoring-construction': {
      bgFrom: '#1a1a2e',
      bgTo: '#2d1a4e',
      accentFrom: colors.orange,
      accentTo: colors.green,
      render: (w, h) => (
        <g>
          {/* Invoice → Money flow */}
          <rect x={w * 0.12} y={h * 0.25} width={w * 0.22} height={h * 0.45} rx={4} fill="white" opacity="0.1" />
          <rect x={w * 0.15} y={h * 0.3} width={w * 0.16} height={3} rx={1} fill="white" opacity="0.15" />
          <rect x={w * 0.15} y={h * 0.36} width={w * 0.12} height={3} rx={1} fill="white" opacity="0.12" />
          <text x={w * 0.23} y={h * 0.55} textAnchor="middle" fill={colors.orange} fontSize="14" fontWeight="bold" opacity="0.4">$</text>
          {/* Arrow */}
          <line x1={w * 0.38} y1={h * 0.47} x2={w * 0.58} y2={h * 0.47} stroke={colors.green} strokeWidth="3" opacity="0.4" />
          <polygon points={`${w * 0.58},${h * 0.43} ${w * 0.63},${h * 0.47} ${w * 0.58},${h * 0.51}`} fill={colors.green} opacity="0.4" />
          {/* Money stack */}
          {[0, 1, 2].map((i) => (
            <rect key={i} x={w * 0.65} y={h * (0.35 - i * 0.05)} width={w * 0.2} height={h * 0.22}
              rx={4} fill={colors.green} opacity={0.1 + i * 0.08} />
          ))}
          <text x={w * 0.75} y={h * 0.42} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" opacity="0.3">$$$</text>
          {/* Question mark */}
          <text x={w * 0.5} y={h * 0.2} textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" opacity="0.1">Worth it?</text>
        </g>
      ),
    },

    // ── Prequalification ──
    'prequalification-tips-subcontractors': {
      bgFrom: '#1e3a5f',
      bgTo: '#1a1a2e',
      accentFrom: colors.green,
      accentTo: colors.blue,
      render: (w, h) => (
        <g>
          {/* Clipboard checklist */}
          <rect x={w * 0.32} y={h * 0.08} width={w * 0.36} height={h * 0.8} rx={6} fill="white" opacity="0.1" />
          <rect x={w * 0.38} y={h * 0.04} width={w * 0.24} height={h * 0.08} rx={4} fill={colors.blue} opacity="0.3" />
          {/* Checklist items */}
          {[0.2, 0.32, 0.44, 0.56, 0.68].map((y, i) => (
            <g key={i}>
              <rect x={w * 0.37} y={h * y} width={12} height={12} rx={2} stroke={i < 3 ? colors.green : 'white'} strokeWidth="1.5" fill={i < 3 ? colors.green : 'none'} opacity={i < 3 ? 0.4 : 0.15} />
              {i < 3 && <polyline points={`${w * 0.375 + 2},${h * y + 6} ${w * 0.375 + 5},${h * y + 9} ${w * 0.375 + 10},${h * y + 3}`}
                stroke="white" strokeWidth="1.5" fill="none" opacity="0.7" />}
              <rect x={w * 0.42} y={h * y + 3} width={w * (0.1 + i * 0.02)} height={4} rx={2} fill="white" opacity="0.15" />
            </g>
          ))}
          {/* Approval stamp */}
          <circle cx={w * 0.77} cy={h * 0.7} r={22} stroke={colors.green} strokeWidth="2.5" fill="none" opacity="0.3" transform={`rotate(-15, ${w * 0.77}, ${h * 0.7})`} />
          <text x={w * 0.77} y={h * 0.71} textAnchor="middle" fill={colors.green} fontSize="8" fontWeight="bold" opacity="0.4">APPROVED</text>
        </g>
      ),
    },

    // ── Reduce Payment Delays ──
    'reduce-construction-payment-delays': {
      bgFrom: '#1a1a2e',
      bgTo: '#0c4a6e',
      accentFrom: colors.blue,
      accentTo: colors.green,
      render: (w, h) => (
        <g>
          {/* Clock */}
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.3} stroke={colors.blue} strokeWidth="2" fill="none" opacity="0.25" />
          <circle cx={w * 0.5} cy={h * 0.45} r={h * 0.28} stroke={colors.blue} strokeWidth="0.5" fill="none" opacity="0.15" />
          {/* Clock hands */}
          <line x1={w * 0.5} y1={h * 0.45} x2={w * 0.5} y2={h * 0.25} stroke="white" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
          <line x1={w * 0.5} y1={h * 0.45} x2={w * 0.6} y2={h * 0.4} stroke={colors.green} strokeWidth="2" opacity="0.4" strokeLinecap="round" />
          <circle cx={w * 0.5} cy={h * 0.45} r={4} fill="white" opacity="0.3" />
          {/* Hour markers */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
            const rad = ((angle - 90) * Math.PI) / 180;
            const x = w * 0.5 + Math.cos(rad) * h * 0.25;
            const y = h * 0.45 + Math.sin(rad) * h * 0.25;
            return <circle key={i} cx={x} cy={y} r={2} fill="white" opacity="0.2" />;
          })}
          {/* "10" badge */}
          <circle cx={w * 0.82} cy={h * 0.18} r={16} fill={colors.green} opacity="0.4" />
          <text x={w * 0.82} y={h * 0.2} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.7">10</text>
          {/* Speed lines */}
          <line x1={w * 0.15} y1={h * 0.4} x2={w * 0.08} y2={h * 0.4} stroke={colors.green} strokeWidth="2" opacity="0.3" />
          <line x1={w * 0.15} y1={h * 0.5} x2={w * 0.05} y2={h * 0.5} stroke={colors.green} strokeWidth="2" opacity="0.2" />
        </g>
      ),
    },

    // ── Time Tracking ──
    'construction-scheduling-tips': {
      bgFrom: '#1a1a2e',
      bgTo: '#2d1a4e',
      accentFrom: colors.orange,
      accentTo: colors.green,
      render: (w, h) => (
        <g>
          {/* Stopwatch */}
          <circle cx={w * 0.5} cy={h * 0.48} r={h * 0.28} stroke={colors.orange} strokeWidth="2" fill="none" opacity="0.3" />
          <rect x={w * 0.48} y={h * 0.14} width={w * 0.04} height={h * 0.06} rx={2} fill={colors.orange} opacity="0.4" />
          <line x1={w * 0.5} y1={h * 0.48} x2={w * 0.5} y2={h * 0.3} stroke="white" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
          <line x1={w * 0.5} y1={h * 0.48} x2={w * 0.58} y2={h * 0.52} stroke={colors.orange} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
          {/* Dollar signs around */}
          {[{x: 0.2, y: 0.3}, {x: 0.8, y: 0.35}, {x: 0.18, y: 0.7}, {x: 0.82, y: 0.68}].map((p, i) => (
            <text key={i} x={w * p.x} y={h * p.y} textAnchor="middle" fill={colors.green} fontSize="16" fontWeight="bold" opacity="0.25">$</text>
          ))}
          {/* Time = Money */}
          <text x={w * 0.5} y={h * 0.9} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" opacity="0.1">TIME = MONEY</text>
        </g>
      ),
    },

    // ── True Cost of Late Payments ──
    'the-true-cost-of-late-payments': {
      bgFrom: '#7f1d1d',
      bgTo: '#1a1a2e',
      accentFrom: '#ef4444',
      accentTo: colors.orange,
      render: (w, h) => (
        <g>
          {/* Declining bar chart */}
          {[0.2, 0.35, 0.5, 0.65, 0.8].map((x, i) => {
            const barH = [0.65, 0.55, 0.42, 0.3, 0.2][i];
            return (
              <rect key={i} x={w * x - 15} y={h * (0.85 - barH)} width={30} height={h * barH}
                rx={3} fill={i < 2 ? colors.green : i < 4 ? colors.orange : '#ef4444'} opacity={0.3 + i * 0.05} />
            );
          })}
          {/* Downward trend arrow */}
          <polyline points={`${w * 0.2},${h * 0.2} ${w * 0.5},${h * 0.4} ${w * 0.8},${h * 0.65}`}
            stroke="#ef4444" strokeWidth="2.5" fill="none" opacity="0.4" strokeLinecap="round" />
          <polygon points={`${w * 0.8},${h * 0.65} ${w * 0.78},${h * 0.58} ${w * 0.83},${h * 0.6}`} fill="#ef4444" opacity="0.5" />
          {/* "LATE" stamp */}
          <rect x={w * 0.35} y={h * 0.08} width={w * 0.3} height={h * 0.12} rx={3} stroke="#ef4444" strokeWidth="2" fill="none" opacity="0.3" transform={`rotate(-5, ${w * 0.5}, ${h * 0.14})`} />
          <text x={w * 0.5} y={h * 0.16} textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold" opacity="0.4" transform={`rotate(-5, ${w * 0.5}, ${h * 0.14})`}>LATE</text>
        </g>
      ),
    },

    // ── Subcontractor vs Employee ──
    'subcontractor-vs-employee': {
      bgFrom: '#1a1a2e',
      bgTo: '#312e81',
      accentFrom: colors.blue,
      accentTo: colors.orange,
      render: (w, h) => (
        <g>
          {/* VS divider */}
          <line x1={w * 0.5} y1={h * 0.1} x2={w * 0.5} y2={h * 0.9} stroke="white" strokeWidth="1" opacity="0.1" strokeDasharray="4 4" />
          <circle cx={w * 0.5} cy={h * 0.5} r={18} fill="white" opacity="0.1" />
          <text x={w * 0.5} y={h * 0.52} textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" opacity="0.4">VS</text>
          {/* Left: Subcontractor (tools) */}
          <circle cx={w * 0.25} cy={h * 0.35} r={25} fill={colors.blue} opacity="0.15" />
          <text x={w * 0.25} y={h * 0.38} textAnchor="middle" fill={colors.blue} fontSize="20" opacity="0.5">🔧</text>
          <text x={w * 0.25} y={h * 0.55} textAnchor="middle" fill="white" fontSize="9" opacity="0.3">1099</text>
          {/* Right: Employee (badge) */}
          <circle cx={w * 0.75} cy={h * 0.35} r={25} fill={colors.orange} opacity="0.15" />
          <text x={w * 0.75} y={h * 0.38} textAnchor="middle" fill={colors.orange} fontSize="20" opacity="0.5">👤</text>
          <text x={w * 0.75} y={h * 0.55} textAnchor="middle" fill="white" fontSize="9" opacity="0.3">W-2</text>
          {/* $100K warning */}
          <rect x={w * 0.3} y={h * 0.72} width={w * 0.4} height={h * 0.12} rx={4} fill="#ef4444" opacity="0.15" />
          <text x={w * 0.5} y={h * 0.8} textAnchor="middle" fill="#ef4444" fontSize="12" fontWeight="bold" opacity="0.5">$100K+ Risk</text>
        </g>
      ),
    },

    // ── Safety Program ──
    'construction-safety-program-guide': {
      bgFrom: '#1a1a2e',
      bgTo: '#064e3b',
      accentFrom: colors.green,
      accentTo: colors.orange,
      render: (w, h) => (
        <g>
          {/* Hard hat */}
          <path d={`M${w * 0.35},${h * 0.42} Q${w * 0.35},${h * 0.18} ${w * 0.5},${h * 0.15} Q${w * 0.65},${h * 0.18} ${w * 0.65},${h * 0.42}`}
            fill={colors.orange} opacity="0.35" />
          <rect x={w * 0.3} y={h * 0.4} width={w * 0.4} height={8} rx={4} fill={colors.orange} opacity="0.45" />
          {/* Shield */}
          <path d={`M${w * 0.5},${h * 0.48} L${w * 0.6},${h * 0.52} L${w * 0.6},${h * 0.68} L${w * 0.5},${h * 0.78} L${w * 0.4},${h * 0.68} L${w * 0.4},${h * 0.52} Z`}
            fill={colors.green} opacity="0.25" stroke={colors.green} strokeWidth="1.5" />
          <polyline points={`${w * 0.46},${h * 0.63} ${w * 0.49},${h * 0.67} ${w * 0.55},${h * 0.58}`}
            stroke="white" strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" strokeLinejoin="round" />
          {/* Stars */}
          {[{x: 0.2, y: 0.25}, {x: 0.82, y: 0.3}, {x: 0.15, y: 0.7}].map((p, i) => (
            <text key={i} x={w * p.x} y={h * p.y} textAnchor="middle" fill={colors.green} fontSize="14" opacity="0.3">★</text>
          ))}
        </g>
      ),
    },

    // ── AI Voice Agents ──
    'ai-voice-agents-construction-collections': {
      bgFrom: '#0f172a',
      bgTo: '#1e3a5f',
      accentFrom: colors.blue,
      accentTo: colors.green,
      render: (w, h) => (
        <g>
          {/* Phone */}
          <rect x={w * 0.4} y={h * 0.15} width={w * 0.2} height={h * 0.65} rx={12} stroke="white" strokeWidth="1.5" fill="none" opacity="0.2" />
          <circle cx={w * 0.5} cy={h * 0.72} r={6} stroke="white" strokeWidth="1" fill="none" opacity="0.15" />
          {/* Sound waves */}
          {[0.16, 0.22, 0.28].map((r, i) => (
            <path key={i} d={`M${w * 0.62 + i * 12},${h * 0.35} Q${w * 0.66 + i * 16},${h * 0.45} ${w * 0.62 + i * 12},${h * 0.55}`}
              stroke={colors.blue} strokeWidth="2" fill="none" opacity={0.4 - i * 0.1} />
          ))}
          {[0.16, 0.22, 0.28].map((r, i) => (
            <path key={i} d={`M${w * 0.38 - i * 12},${h * 0.35} Q${w * 0.34 - i * 16},${h * 0.45} ${w * 0.38 - i * 12},${h * 0.55}`}
              stroke={colors.green} strokeWidth="2" fill="none" opacity={0.4 - i * 0.1} />
          ))}
          {/* AI sparkle */}
          <circle cx={w * 0.5} cy={h * 0.45} r={12} fill={colors.blue} opacity="0.2" />
          <text x={w * 0.5} y={h * 0.48} textAnchor="middle" fill="white" fontSize="10" opacity="0.5">AI</text>
          {/* Dollar collected */}
          <text x={w * 0.5} y={h * 0.92} textAnchor="middle" fill={colors.green} fontSize="10" fontWeight="bold" opacity="0.2">$$$ COLLECTED</text>
        </g>
      ),
    },

    // ── Payment Prediction ──
    'payment-prediction-construction': {
      bgFrom: '#1a1a2e',
      bgTo: '#0c4a6e',
      accentFrom: colors.green,
      accentTo: colors.blue,
      render: (w, h) => (
        <g>
          {/* Crystal ball effect */}
          <circle cx={w * 0.5} cy={h * 0.42} r={h * 0.28} stroke={colors.blue} strokeWidth="1.5" fill={colors.blue} opacity="0.08" />
          <circle cx={w * 0.5} cy={h * 0.42} r={h * 0.26} stroke={colors.blue} strokeWidth="0.5" fill="none" opacity="0.2" />
          {/* Prediction chart inside */}
          <polyline points={`${w * 0.35},${h * 0.52} ${w * 0.42},${h * 0.45} ${w * 0.48},${h * 0.48} ${w * 0.55},${h * 0.38} ${w * 0.62},${h * 0.42}`}
            stroke={colors.green} strokeWidth="2" fill="none" opacity="0.5" strokeLinecap="round" />
          {/* Dotted prediction future */}
          <polyline points={`${w * 0.62},${h * 0.42} ${w * 0.68},${h * 0.35} ${w * 0.72},${h * 0.3}`}
            stroke={colors.green} strokeWidth="2" fill="none" opacity="0.3" strokeDasharray="3 3" />
          {/* 94% accuracy */}
          <text x={w * 0.5} y={h * 0.35} textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" opacity="0.2">94%</text>
          {/* Base */}
          <ellipse cx={w * 0.5} cy={h * 0.72} rx={h * 0.18} ry={h * 0.05} fill="white" opacity="0.08" />
          {/* Sparkles */}
          {[{x: 0.3, y: 0.2}, {x: 0.72, y: 0.22}, {x: 0.25, y: 0.65}].map((p, i) => (
            <g key={i}>
              <line x1={w * p.x - 4} y1={h * p.y} x2={w * p.x + 4} y2={h * p.y} stroke={colors.green} strokeWidth="1.5" opacity="0.4" />
              <line x1={w * p.x} y1={h * p.y - 4} x2={w * p.x} y2={h * p.y + 4} stroke={colors.green} strokeWidth="1.5" opacity="0.4" />
            </g>
          ))}
        </g>
      ),
    },
  };

  // Fallback illustration for any slug not explicitly mapped
  return illustrations[slug] || {
    bgFrom: '#1a1a2e',
    bgTo: '#2d2d5e',
    accentFrom: colors.blue,
    accentTo: colors.green,
    render: (w: number, h: number) => (
      <g>
        <rect x={w * 0.3} y={h * 0.2} width={w * 0.4} height={h * 0.55} rx={6} fill="white" opacity="0.08" />
        <rect x={w * 0.35} y={h * 0.28} width={w * 0.3} height={4} rx={2} fill={colors.blue} opacity="0.3" />
        <rect x={w * 0.35} y={h * 0.36} width={w * 0.25} height={3} rx={1} fill="white" opacity="0.15" />
        <rect x={w * 0.35} y={h * 0.42} width={w * 0.28} height={3} rx={1} fill="white" opacity="0.12" />
        <rect x={w * 0.35} y={h * 0.48} width={w * 0.2} height={3} rx={1} fill="white" opacity="0.1" />
        <circle cx={w * 0.5} cy={h * 0.65} r={12} fill={colors.green} opacity="0.2" />
        <text x={w * 0.5} y={h * 0.67} textAnchor="middle" fill="white" fontSize="10" opacity="0.5">✓</text>
      </g>
    ),
  };
}
