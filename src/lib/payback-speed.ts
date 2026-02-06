/**
 * Payback Speed Score - Signature Feature
 *
 * Measures how quickly a lead source converts into paid revenue.
 * Score components:
 * - Conversion Rate (25 points): How many leads become jobs
 * - Avg Invoice Amount (25 points): Size of revenue per invoice
 * - Speed to Payment (25 points): How fast invoices get paid
 * - Reliability (25 points): Low late payment rate
 */

import { LeadSource, PaybackSpeedScore } from './keyword-types';
import { Invoice } from './db';

export interface PaybackScoreInput {
  leadSource: LeadSource;
  linkedInvoices: Invoice[];
}

/**
 * Calculate the Payback Speed Score for a lead source
 */
export function calculatePaybackSpeedScore(input: PaybackScoreInput): PaybackSpeedScore {
  const { leadSource, linkedInvoices } = input;

  // Get paid invoices
  const paidInvoices = linkedInvoices.filter(inv => inv.paidAt && inv.sentAt);

  // Calculate conversion rate (jobs linked as a proxy for now)
  const conversionRate = leadSource.stats.jobsLinked;

  // Calculate average invoice amount
  const avgInvoiceAmount = paidInvoices.length > 0
    ? paidInvoices.reduce((sum, inv) => sum + inv.total, 0) / paidInvoices.length
    : 0;

  // Calculate average days to paid
  let avgDaysToPaid = 0;
  if (paidInvoices.length > 0) {
    const totalDays = paidInvoices.reduce((sum, inv) => {
      const sentDate = new Date(inv.sentAt!).getTime();
      const paidDate = new Date(inv.paidAt!).getTime();
      return sum + (paidDate - sentDate) / (1000 * 60 * 60 * 24);
    }, 0);
    avgDaysToPaid = Math.round(totalDays / paidInvoices.length);
  }

  // Calculate late payment rate (invoices paid after due date)
  let latePaymentRate = 0;
  if (paidInvoices.length > 0) {
    const latePayments = paidInvoices.filter(inv => {
      const dueDate = new Date(inv.dueDate).getTime();
      const paidDate = new Date(inv.paidAt!).getTime();
      return paidDate > dueDate;
    }).length;
    latePaymentRate = Math.round((latePayments / paidInvoices.length) * 100);
  }

  // Calculate component scores
  let score = 0;

  // Conversion Rate scoring (25 points max)
  // More jobs = higher conversion success
  if (conversionRate >= 10) score += 25;
  else if (conversionRate >= 5) score += 20;
  else if (conversionRate >= 3) score += 15;
  else if (conversionRate >= 1) score += 10;
  else score += 0;

  // Avg Invoice Amount scoring (25 points max)
  // Capped at $10k for full points
  if (avgInvoiceAmount >= 10000) score += 25;
  else if (avgInvoiceAmount >= 5000) score += 20;
  else if (avgInvoiceAmount >= 2500) score += 15;
  else if (avgInvoiceAmount >= 1000) score += 10;
  else if (avgInvoiceAmount > 0) score += 5;
  else score += 0;

  // Speed to Payment scoring (25 points max)
  // 30 days or less = full points
  if (avgDaysToPaid > 0) {
    if (avgDaysToPaid <= 14) score += 25;
    else if (avgDaysToPaid <= 21) score += 20;
    else if (avgDaysToPaid <= 30) score += 15;
    else if (avgDaysToPaid <= 45) score += 10;
    else score += 5;
  }

  // Reliability scoring (25 points max)
  // 0% late = full points
  if (paidInvoices.length > 0) {
    if (latePaymentRate === 0) score += 25;
    else if (latePaymentRate <= 10) score += 20;
    else if (latePaymentRate <= 25) score += 15;
    else if (latePaymentRate <= 50) score += 10;
    else score += 5;
  }

  // Determine grade
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (score >= 80) grade = 'A';
  else if (score >= 60) grade = 'B';
  else if (score >= 40) grade = 'C';
  else if (score >= 20) grade = 'D';
  else grade = 'F';

  // Determine trend (would need historical data in real implementation)
  const trend: 'improving' | 'stable' | 'declining' = 'stable';

  return {
    leadSourceId: leadSource.id,
    userId: leadSource.userId,
    conversionRate,
    avgInvoiceAmount: Math.round(avgInvoiceAmount * 100) / 100,
    avgDaysToPaid,
    latePaymentRate,
    score,
    grade,
    trend,
    calculatedAt: new Date().toISOString(),
  };
}

/**
 * Get score interpretation text
 */
export function getScoreInterpretation(score: PaybackSpeedScore): string {
  const insights: string[] = [];

  // Grade-based insight
  if (score.grade === 'A') {
    insights.push('This source is a top performer - fast payments and strong ROI.');
  } else if (score.grade === 'B') {
    insights.push('Good performance with room for improvement.');
  } else if (score.grade === 'C') {
    insights.push('Average performance - consider optimizing costs or targeting.');
  } else if (score.grade === 'D') {
    insights.push('Below average - may need review or adjustment.');
  } else {
    insights.push('Poor performance - consider pausing or restructuring this source.');
  }

  // Payment speed insight
  if (score.avgDaysToPaid > 0) {
    if (score.avgDaysToPaid <= 14) {
      insights.push('Excellent payment speed - clients pay quickly.');
    } else if (score.avgDaysToPaid <= 30) {
      insights.push('Good payment speed - within standard terms.');
    } else {
      insights.push('Slow payments - consider requiring deposits or shorter terms.');
    }
  }

  // Late payment insight
  if (score.latePaymentRate > 25) {
    insights.push(`Warning: ${score.latePaymentRate}% of invoices are paid late.`);
  }

  return insights.join(' ');
}

/**
 * Compare two lead sources by Payback Speed Score
 */
export function compareLeadSources(
  score1: PaybackSpeedScore,
  score2: PaybackSpeedScore
): string {
  const diff = score1.score - score2.score;
  const paymentDiff = score2.avgDaysToPaid - score1.avgDaysToPaid; // Lower is better

  const insights: string[] = [];

  if (Math.abs(diff) < 5) {
    insights.push('These sources perform similarly overall.');
  } else if (diff > 0) {
    insights.push(`First source scores ${diff} points higher.`);
  } else {
    insights.push(`Second source scores ${Math.abs(diff)} points higher.`);
  }

  if (paymentDiff > 7) {
    insights.push(`First source gets paid ${paymentDiff} days faster.`);
  } else if (paymentDiff < -7) {
    insights.push(`Second source gets paid ${Math.abs(paymentDiff)} days faster.`);
  }

  return insights.join(' ');
}

/**
 * Get color classes for a grade
 */
export function getGradeColors(grade: string): {
  text: string;
  bg: string;
  border: string;
} {
  switch (grade) {
    case 'A':
      return { text: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' };
    case 'B':
      return { text: 'text-blue-700', bg: 'bg-blue-100', border: 'border-blue-200' };
    case 'C':
      return { text: 'text-yellow-700', bg: 'bg-yellow-100', border: 'border-yellow-200' };
    case 'D':
      return { text: 'text-orange-700', bg: 'bg-orange-100', border: 'border-orange-200' };
    default:
      return { text: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' };
  }
}
