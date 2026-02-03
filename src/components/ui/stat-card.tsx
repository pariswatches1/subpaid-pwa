'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  iconColor?: string;
  valueColor?: string;
  isCurrency?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

export function StatCard({
  label,
  value,
  change,
  changeLabel = 'vs last month',
  icon: Icon,
  iconColor = 'bg-[#54A0FF]',
  valueColor = 'text-[#1a1a2e]',
  isCurrency = false,
  onClick,
  isActive = false,
}: StatCardProps) {
  const displayValue = isCurrency && typeof value === 'number'
    ? formatCurrency(value)
    : value;

  const CardContent = (
    <>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-[#1a1a2e]/60">{label}</p>
          <p className={`text-2xl md:text-3xl font-bold mt-1 ${valueColor}`}>
            {displayValue}
          </p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              <span>{change >= 0 ? '+' : ''}{change}%</span>
              {changeLabel && (
                <span className="text-[#1a1a2e]/40">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 ${iconColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
      </div>
    </>
  );

  const baseClasses = `bg-white rounded-xl p-4 md:p-5 border transition-all ${
    isActive
      ? 'bg-[#9FE870]/10 border-[#9FE870]'
      : 'border-[#1a1a2e]/10 hover:shadow-md'
  }`;

  if (onClick) {
    return (
      <button onClick={onClick} className={`${baseClasses} text-left w-full`}>
        {CardContent}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {CardContent}
    </div>
  );
}
