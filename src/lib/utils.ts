import { type ClassValue, clsx } from 'clsx';

// Simple cn utility without tailwind-merge for now
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Currency formatting
export function formatCurrency(amount: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount);
}

// Date formatting
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...options,
  });
}

// Relative time formatting
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;

  return formatDate(d);
}

// Generate invoice ID
export function generateInvoiceId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `INV-${num}`;
}

// Generate estimate ID
export function generateEstimateId(): string {
  const num = Math.floor(Math.random() * 900) + 100;
  return `EST-${num}`;
}

// Calculate days overdue
export function calculateDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = now.getTime() - due.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Calculate days until due
export function calculateDaysUntilDue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diffMs = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

// Get initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}

// Format phone number
export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length !== 10) return phone;
  return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Color utilities for status badges
export function getStatusColor(status: string): { bg: string; text: string } {
  switch (status) {
    case 'paid':
    case 'completed':
    case 'active':
    case 'accepted':
      return { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' };
    case 'pending':
    case 'sent':
    case 'due_soon':
      return { bg: 'bg-[#F8BF24]/10', text: 'text-[#b8860b]' };
    case 'overdue':
    case 'failed':
    case 'declined':
    case 'cancelled':
      return { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' };
    case 'draft':
    case 'expired':
    case 'inactive':
      return { bg: 'bg-[#1a1a2e]/5', text: 'text-[#1a1a2e]/60' };
    default:
      return { bg: 'bg-[#1a1a2e]/5', text: 'text-[#1a1a2e]/60' };
  }
}

// Risk level colors
export function getRiskColor(risk: string): { bg: string; text: string } {
  switch (risk) {
    case 'low':
      return { bg: 'bg-[#22C55E]/10', text: 'text-[#22C55E]' };
    case 'medium':
      return { bg: 'bg-[#F8BF24]/10', text: 'text-[#b8860b]' };
    case 'high':
      return { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]' };
    default:
      return { bg: 'bg-[#1a1a2e]/5', text: 'text-[#1a1a2e]/60' };
  }
}

// PayScore color
export function getPayScoreColor(score: number): string {
  if (score >= 85) return 'text-[#22C55E]';
  if (score >= 70) return 'text-[#FECA57]';
  if (score >= 50) return 'text-[#FF9F43]';
  return 'text-[#EF4444]';
}

export function getPayScoreBg(score: number): string {
  if (score >= 85) return 'bg-[#22C55E]';
  if (score >= 70) return 'bg-[#FECA57]';
  if (score >= 50) return 'bg-[#FF9F43]';
  return 'bg-[#EF4444]';
}

// Confidence color
export function getConfidenceColor(confidence: number): string {
  if (confidence >= 85) return 'text-[#22C55E]';
  if (confidence >= 70) return 'text-[#F8BF24]';
  return 'text-[#EF4444]';
}
