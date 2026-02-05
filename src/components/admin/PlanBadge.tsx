'use client';

const planStyles: Record<string, string> = {
  starter:    'bg-gray-100 text-gray-700',
  pro:        'bg-[#54A0FF]/10 text-[#54A0FF]',
  autopilot:  'bg-[#9FE870]/10 text-[#1a1a2e]',
  enterprise: 'bg-[#FF9F43]/10 text-[#FF9F43]',
};

interface PlanBadgeProps {
  plan: string;
  size?: 'sm' | 'md';
}

export default function PlanBadge({ plan, size = 'md' }: PlanBadgeProps) {
  const style = planStyles[plan.toLowerCase()] || 'bg-gray-100 text-gray-700';
  const sizeClass = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${style}`}>
      {plan}
    </span>
  );
}
