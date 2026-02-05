import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';
import type { ContractorClaim } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contractorId, verificationMethod, contact } = body;

    if (!contractorId || !verificationMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const contractor = mockDb.contractors.find((c) => c.id === contractorId);
    if (!contractor) {
      return NextResponse.json(
        { error: 'Contractor not found' },
        { status: 404 }
      );
    }

    if (contractor.claimed) {
      return NextResponse.json(
        { error: 'This business has already been claimed' },
        { status: 409 }
      );
    }

    const userId = getMockUserId();

    const claim: ContractorClaim = {
      id: generateId(),
      contractorId,
      userId,
      status: 'pending',
      verificationMethod,
      submittedAt: new Date().toISOString(),
    };

    mockDb.contractorClaims.push(claim);

    // Demo: auto-approve after creation
    setTimeout(() => {
      claim.status = 'approved';
      claim.reviewedAt = new Date().toISOString();
      contractor.claimed = true;
      contractor.claimedByUserId = userId;
    }, 2000);

    return NextResponse.json({
      success: true,
      claimId: claim.id,
      message: 'Claim submitted successfully. Verification in progress.',
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
