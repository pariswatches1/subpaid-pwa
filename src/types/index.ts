// User types
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  plan: 'starter' | 'pro' | 'autopilot';
  createdAt: Date;
}

// Invoice types
export type InvoiceStatus = 'draft' | 'sent' | 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  total: number;
}

export interface Invoice {
  id: string;
  client: string;
  clientEmail?: string;
  project: string;
  description?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  createdAt: string;
  paidDate?: string;
  paymentTerms: string;
  daysOverdue?: number;
}

export interface AIGeneratedInvoice {
  client: string;
  project: string;
  description: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  dueDate: string;
  paymentTerms: string;
  confidence: number;
}

// Job types
export type JobStatus = 'active' | 'completed' | 'on_hold' | 'cancelled';

export interface Job {
  id: string | number;
  name: string;
  client: string;
  progress: number;
  total: number;
  status: JobStatus;
  crew: number;
  icon?: string;
  color?: string;
  startDate?: string;
  endDate?: string;
}

// Payment types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'ACH' | 'Check' | 'Wire' | 'Credit Card' | 'Cash' | '-';

export interface Payment {
  id: string;
  client: string;
  invoice: string;
  amount: number;
  date: string;
  method: PaymentMethod;
  status: PaymentStatus;
}

// Crew types
export type CrewStatus = 'active' | 'inactive';

export interface CrewMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  email: string;
  phone: string;
  hourlyRate: number;
  hoursThisWeek: number;
  status: CrewStatus;
}

// Time tracking types
export type TimeEntryStatus = 'active' | 'completed';

export interface TimeEntry {
  id: number;
  employee: string;
  initials: string;
  job: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  status: TimeEntryStatus;
}

// PayScore types
export type PayScoreRating = 'Excellent' | 'Good' | 'Fair' | 'Poor';
export type PayScoreTrend = 'up' | 'down' | 'stable';

export interface GCPayScore {
  id: number;
  name: string;
  payScore: number;
  trend: PayScoreTrend;
  avgPaymentDays: number;
  totalPaid: number;
  invoiceCount: number;
  onTimeRate: number;
  rating: PayScoreRating;
  reviews: number;
  lastPayment: string;
}

// Payment Prophet types
export type RiskLevel = 'low' | 'medium' | 'high';

export interface PaymentPrediction {
  expectedDate: string;
  daysFromNow: number;
  confidence: number;
  factors: string[];
  recommendation: string;
  risk: RiskLevel;
}

export interface PredictedInvoice {
  id: string;
  client: string;
  project: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
  daysOverdue?: number;
  prediction: PaymentPrediction;
}

// Estimate types (new feature)
export type EstimateStatus = 'draft' | 'sent' | 'accepted' | 'declined' | 'expired';

export interface Estimate {
  id: string;
  client: string;
  clientEmail?: string;
  project: string;
  description?: string;
  items: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: EstimateStatus;
  validUntil: string;
  createdAt: string;
  acceptedAt?: string;
  convertedToInvoice?: string;
}

// Chat message types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Auth context types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalOwed: number;
  owedChange: number;
  overdue: number;
  overdueCount: number;
  pending: number;
  pendingCount: number;
  paidThisMonth: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}
