import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query = searchParams.get('query')?.toLowerCase() || '';
  const state = searchParams.get('state') || 'all';
  const licenseType = searchParams.get('licenseType') || '';
  const city = searchParams.get('city') || '';
  const status = searchParams.get('status') || '';
  const minPayScore = parseInt(searchParams.get('minPayScore') || '0');
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
  const offset = parseInt(searchParams.get('offset') || '0');

  let results = [...mockDb.contractors];

  // Filter by state
  if (state && state !== 'all') {
    results = results.filter((c) => c.state === state);
  }

  // Filter by license status
  if (status) {
    results = results.filter((c) => c.licenseStatus === status);
  }

  // Filter by license type
  if (licenseType) {
    results = results.filter((c) =>
      c.licenseType.toLowerCase().includes(licenseType.toLowerCase()) ||
      c.classifications.some((cl) => cl.toLowerCase().includes(licenseType.toLowerCase()))
    );
  }

  // Filter by city
  if (city) {
    results = results.filter((c) => c.city.toLowerCase().includes(city.toLowerCase()));
  }

  // Filter by min PayScore
  if (minPayScore > 0) {
    results = results.filter((c) => (c.payScore || 0) >= minPayScore);
  }

  // Text search
  if (query) {
    results = results.filter((c) =>
      c.businessName.toLowerCase().includes(query) ||
      c.licenseNumber.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      (c.ownerName && c.ownerName.toLowerCase().includes(query)) ||
      c.licenseType.toLowerCase().includes(query)
    );
  }

  // Sort: active first, then by PayScore desc, then by name
  results.sort((a, b) => {
    if (a.licenseStatus === 'active' && b.licenseStatus !== 'active') return -1;
    if (a.licenseStatus !== 'active' && b.licenseStatus === 'active') return 1;
    const scoreA = a.payScore || 0;
    const scoreB = b.payScore || 0;
    if (scoreB !== scoreA) return scoreB - scoreA;
    return a.businessName.localeCompare(b.businessName);
  });

  const total = results.length;
  const paginated = results.slice(offset, offset + limit);

  // Get unique values for filter dropdowns
  const allLicenseTypes = Array.from(new Set(mockDb.contractors.map((c) => c.licenseType))).sort();
  const allCities = Array.from(new Set(mockDb.contractors.map((c) => c.city))).sort();

  return NextResponse.json({
    contractors: paginated,
    total,
    offset,
    limit,
    filters: {
      licenseTypes: allLicenseTypes,
      cities: allCities,
      states: Array.from(new Set(mockDb.contractors.map((c) => c.state))).sort(),
    },
  });
}
