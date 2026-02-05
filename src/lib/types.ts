// Shared types to avoid circular dependencies
// This file should NOT import from ./db.ts

import { StateCode, DataSourceCode } from './states-config';

export interface Contractor {
  id: string;
  licenseNumber: string;
  licenseType: string;
  licenseStatus: 'active' | 'inactive' | 'suspended' | 'expired';
  classifications: string[];
  businessName: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  website?: string;
  address: string;
  city: string;
  state: StateCode;
  zipCode: string;
  county?: string;
  issueDate: string;
  expirationDate: string;
  lastUpdated: string;
  payScore?: number;
  reviewCount?: number;
  avgPaymentDays?: number;
  claimed: boolean;
  claimedByUserId?: string;
  dataSource: DataSourceCode;
  sourceUrl?: string;
  verified: boolean;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}
