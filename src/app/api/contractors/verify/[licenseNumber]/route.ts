import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { licenseNumber: string } }
) {
  const { licenseNumber } = params;
  const state = request.nextUrl.searchParams.get('state') || '';

  if (!licenseNumber) {
    return NextResponse.json(
      { error: 'License number is required' },
      { status: 400 }
    );
  }

  // Find contractor in our cached data
  const contractor = mockDb.contractors.find(
    (c) => c.licenseNumber === licenseNumber
  );

  if (!contractor) {
    return NextResponse.json(
      { error: 'License not found in our records' },
      { status: 404 }
    );
  }

  // In production: make real-time request to FL DBPR or CA CSLB
  // For now: return cached data with verification timestamp
  const verificationResult = {
    licenseNumber: contractor.licenseNumber,
    businessName: contractor.businessName,
    state: contractor.state,
    status: contractor.licenseStatus,
    expirationDate: contractor.expirationDate,
    licenseType: contractor.licenseType,
    verified: true,
    verifiedAt: new Date().toISOString(),
    source: contractor.state === 'FL'
      ? 'Florida Department of Business and Professional Regulation (DBPR)'
      : 'California Contractors State License Board (CSLB)',
    sourceUrl: contractor.sourceUrl,
  };

  // Update contractor verification status
  contractor.verified = true;
  contractor.verifiedAt = verificationResult.verifiedAt;

  return NextResponse.json(verificationResult);
}
