import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

// City coordinates lookup (major cities for distance calculation)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Orlando': { lat: 28.5383, lng: -81.3792 },
  'Tampa': { lat: 27.9506, lng: -82.4572 },
  'Jacksonville': { lat: 30.3322, lng: -81.6557 },
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'Austin': { lat: 30.2672, lng: -97.7431 },
  'New York City': { lat: 40.7128, lng: -74.0060 },
  'Atlanta': { lat: 33.7490, lng: -84.3880 },
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  'Denver': { lat: 39.7392, lng: -104.9903 },
  'Seattle': { lat: 47.6062, lng: -122.3321 },
  'Las Vegas': { lat: 36.1699, lng: -115.1398 },
  'Fort Lauderdale': { lat: 26.1224, lng: -80.1373 },
  'West Palm Beach': { lat: 26.7153, lng: -80.0534 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'Sacramento': { lat: 38.5816, lng: -121.4944 },
  'San Jose': { lat: 37.3382, lng: -121.8863 },
  'Fresno': { lat: 36.7378, lng: -119.7871 },
  'Long Beach': { lat: 33.7701, lng: -118.1937 },
  'Oakland': { lat: 37.8044, lng: -122.2712 },
};

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function formatDistance(miles: number): string {
  if (miles < 1) return `${Math.round(miles * 5280)} ft`;
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query = searchParams.get('query')?.toLowerCase() || '';
    const state = searchParams.get('state') || 'all';
    const licenseType = searchParams.get('licenseType') || '';
    const city = searchParams.get('city') || '';
    const status = searchParams.get('status') || '';
    const minPayScore = parseInt(searchParams.get('minPayScore') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const sortBy = searchParams.get('sortBy') || '';
    const hasLocation = !isNaN(lat) && !isNaN(lng) && sortBy === 'distance';

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
        c.licenseType?.toLowerCase().includes(licenseType.toLowerCase()) ||
        c.classifications?.some((cl) => cl.toLowerCase().includes(licenseType.toLowerCase()))
      );
    }

    // Filter by city
    if (city) {
      results = results.filter((c) => c.city?.toLowerCase().includes(city.toLowerCase()));
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
        c.city?.toLowerCase().includes(query) ||
        c.ownerName?.toLowerCase().includes(query) ||
        c.zipCode?.includes(query)
      );
    }

    // Add distance if location provided
    const resultsWithDistance = results.map(c => {
      const cityCoords = c.city ? CITY_COORDS[c.city] : null;
      let distance: string | undefined;
      let distanceValue: number | undefined;

      if (hasLocation && cityCoords) {
        distanceValue = calculateDistance(lat, lng, cityCoords.lat, cityCoords.lng);
        distance = formatDistance(distanceValue);
      }

      return { ...c, distance, distanceValue };
    });

    // Sort by distance if requested
    if (hasLocation) {
      resultsWithDistance.sort((a, b) => {
        if (a.distanceValue === undefined) return 1;
        if (b.distanceValue === undefined) return -1;
        return a.distanceValue - b.distanceValue;
      });
    }

    const total = resultsWithDistance.length;
    const paginatedResults = resultsWithDistance.slice(offset, offset + limit);

    // Get unique filter values
    const states = Array.from(new Set(mockDb.contractors.map(c => c.state))).filter(Boolean).sort();
    const licenseTypes = Array.from(new Set(mockDb.contractors.map(c => c.licenseType))).filter(Boolean).sort();
    const cities = Array.from(new Set(mockDb.contractors.filter(c =>
      state === 'all' || c.state === state
    ).map(c => c.city))).filter(Boolean).sort().slice(0, 50);

    return NextResponse.json({
      contractors: paginatedResults,
      total,
      offset,
      limit,
      filters: {
        states,
        licenseTypes,
        cities,
      },
    });
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json({ error: 'Failed to fetch contractors' }, { status: 500 });
  }
}

// POST - Add new contractor (still uses mock db for now)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newContractor = {
      id: `contractor-${Date.now()}`,
      businessName: body.businessName,
      ownerName: body.ownerName || undefined,
      email: body.email || undefined,
      phone: body.phone || undefined,
      address: body.address || '',
      city: body.city || '',
      state: body.state || '',
      zipCode: body.zipCode || '',
      licenseNumber: body.licenseNumber || '',
      licenseType: body.licenseType || 'General',
      licenseStatus: 'active' as const,
      classifications: body.trades || [],
      issueDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      lastUpdated: new Date().toISOString(),
      verified: false,
      claimed: false,
      dataSource: 'USER' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockDb.contractors.push(newContractor);

    return NextResponse.json({ contractor: newContractor }, { status: 201 });
  } catch (error) {
    console.error('Error creating contractor:', error);
    return NextResponse.json({ error: 'Failed to create contractor' }, { status: 500 });
  }
}
