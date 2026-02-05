import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const contractor = mockDb.contractors.find((c) => c.id === params.id);

  if (!contractor) {
    return NextResponse.json(
      { error: 'Contractor not found' },
      { status: 404 }
    );
  }

  // Get ratings for this contractor
  const ratings = mockDb.gcRatings.filter(
    (r) => r.gcName.toLowerCase() === contractor.businessName.toLowerCase()
  );

  // Get similar contractors (same city + same state, different ID)
  const similar = mockDb.contractors
    .filter((c) => c.id !== contractor.id && c.city === contractor.city && c.state === contractor.state && c.licenseStatus === 'active')
    .slice(0, 4);

  return NextResponse.json({
    ...contractor,
    ratings,
    similar,
  });
}
