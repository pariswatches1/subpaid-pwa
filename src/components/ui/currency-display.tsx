'use client';

import { formatCurrency } from '@/lib/utils';

interface CurrencyDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'default' | 'success' | 'danger' | 'warning' | 'muted';
  showSign?: boolean;
}

export function CurrencyDisplay({
  amount,
  size = 'md',
  color = 'default',
  showSign = false
}: CurrencyDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  };

  const colorClasses = {
    default: 'text-[#1a1a2e]',
    success: 'text-[#22C55E]',
    danger: 'text-[#EF4444]',
    warning: 'text-[#FF9F43]',
    muted: 'text-[#1a1a2e]/60',
  };

  const formatted = formatCurrency(Math.abs(amount));
  const prefix = showSign && amount > 0 ? '+' : showSign && amount < 0 ? '-' : '';

  return (
    <span className={`${sizeClasses[size]} ${colorClasses[color]}`}>
      {prefix}{formatted}
    </span>
  );
}
