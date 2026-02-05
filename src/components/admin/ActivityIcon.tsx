'use client';

import { UserPlus, ArrowUpCircle, FileText, Phone, DollarSign, UserMinus, Activity } from 'lucide-react';

const iconMap: Record<string, { icon: React.ElementType; bgColor: string; iconColor: string }> = {
  signup:   { icon: UserPlus,      bgColor: 'bg-green-100',   iconColor: 'text-green-600' },
  upgrade:  { icon: ArrowUpCircle, bgColor: 'bg-blue-100',    iconColor: 'text-blue-600' },
  invoice:  { icon: FileText,      bgColor: 'bg-purple-100',  iconColor: 'text-purple-600' },
  call:     { icon: Phone,         bgColor: 'bg-yellow-100',  iconColor: 'text-yellow-600' },
  payment:  { icon: DollarSign,    bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  churn:    { icon: UserMinus,     bgColor: 'bg-red-100',     iconColor: 'text-red-600' },
  default:  { icon: Activity,      bgColor: 'bg-[#54A0FF]/10', iconColor: 'text-[#54A0FF]' },
};

interface ActivityIconProps {
  type: string;
  size?: 'sm' | 'md';
}

export default function ActivityIcon({ type, size = 'md' }: ActivityIconProps) {
  const config = iconMap[type] || iconMap.default;
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className={`${sizeClasses} ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}>
      <Icon className={`${iconSize} ${config.iconColor}`} />
    </div>
  );
}
