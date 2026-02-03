'use client';

import { CheckCircle, Clock, AlertTriangle, FileText, Send, XCircle } from 'lucide-react';
import { getStatusColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  daysOverdue?: number;
  dueIn?: number;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({
  status,
  daysOverdue,
  dueIn,
  showIcon = false,
  size = 'sm'
}: StatusBadgeProps) {
  const { bg, text } = getStatusColor(status);

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const iconSize = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const getIcon = () => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'accepted':
        return <CheckCircle className={iconSize[size]} />;
      case 'pending':
      case 'sent':
        return <Send className={iconSize[size]} />;
      case 'due_soon':
        return <Clock className={iconSize[size]} />;
      case 'overdue':
      case 'failed':
        return <AlertTriangle className={iconSize[size]} />;
      case 'draft':
        return <FileText className={iconSize[size]} />;
      case 'cancelled':
      case 'declined':
      case 'expired':
        return <XCircle className={iconSize[size]} />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'pending':
        return 'Pending';
      case 'sent':
        return 'Sent';
      case 'due_soon':
        return dueIn !== undefined ? `Due in ${dueIn} days` : 'Due Soon';
      case 'overdue':
        return daysOverdue !== undefined ? `${daysOverdue} days overdue` : 'Overdue';
      case 'draft':
        return 'Draft';
      case 'completed':
        return 'Completed';
      case 'active':
        return 'Active';
      case 'accepted':
        return 'Accepted';
      case 'declined':
        return 'Declined';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      case 'failed':
        return 'Failed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <span className={`inline-flex items-center gap-1 ${bg} ${text} ${sizeClasses[size]} font-medium rounded-full`}>
      {showIcon && getIcon()}
      {getLabel()}
    </span>
  );
}
