import { prisma } from './prisma';

/**
 * Get the current user ID.
 * For now, returns a demo user. Later integrate with real auth.
 */
export async function getUserId(): Promise<string> {
  let user = await prisma.user.findFirst({
    where: { email: 'demo@subpaid.com' }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@subpaid.com',
        name: 'Demo User',
        company: 'Demo Company',
      }
    });
  }

  return user.id;
}

/**
 * Generate a unique ID (timestamp + random)
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate invoice number (INV-XXXX format)
 */
export function generateInvoiceNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `INV-${num}`;
}

/**
 * Generate estimate number (EST-XXXX format)
 */
export function generateEstimateNumber(): string {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `EST-${num}`;
}
