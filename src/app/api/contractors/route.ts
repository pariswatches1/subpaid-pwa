import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const city = searchParams.get('city') || '';
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const sortBy = searchParams.get('sortBy') || '';
    const hasLocation = !isNaN(lat) && !isNaN(lng) && sortBy === 'distance';

    // Build where clause
    const where: Record<string, unknown> = {};

    if (state && state !== 'all') {
      where.state = state;
    }

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (query) {
      where.OR = [
        { businessName: { contains: query, mode: 'insensitive' } },
        { licenseNumber: { contains: query, mode: 'insensitive' } },
        { city: { contains: query, mode: 'insensitive' } },
        { ownerName: { contains: query, mode: 'insensitive' } },
      ];
    }

    const contractors = await prisma.contractor.findMany({
      where,
      orderBy: [
        { rating: 'desc' },
        { businessName: 'asc' },
      ],
      take: limit,
      skip: offset,
    });

    const total = await prisma.contractor.count({ where });

    // Add distance if location provided
    const contractorsWithDistance = contractors.map(c => {
      const cityCoords = c.city ? CITY_COORDS[c.city] : null;
      let distance: string | undefined;
      let distanceValue: number | undefined;

      if (hasLocation && cityCoords) {
        distanceValue = calculateDistance(lat, lng, cityCoords.lat, cityCoords.lng);
        distance = formatDistance(distanceValue);
      }

      return {
        id: c.id,
        businessName: c.businessName,
        ownerName: c.ownerName,
        email: c.email,
        phone: c.phone,
        address: c.address,
        city: c.city,
        state: c.state,
        zipCode: c.zipCode,
        licenseNumber: c.licenseNumber,
        licenseState: c.licenseState,
        trades: c.trades,
        insuranceExpiry: c.insuranceExpiry?.toISOString().split('T')[0],
        rating: c.rating ? Number(c.rating) : null,
        reviewCount: c.reviewCount,
        verified: c.verified,
        distance,
        distanceValue,
      };
    });

    // Sort by distance if requested
    if (hasLocation) {
      contractorsWithDistance.sort((a, b) => {
        if (a.distanceValue === undefined) return 1;
        if (b.distanceValue === undefined) return -1;
        return a.distanceValue - b.distanceValue;
      });
    }

    // Get filter options
    const states = await prisma.contractor.groupBy({
      by: ['state'],
      where: { state: { not: null } },
    });

    const cities = await prisma.contractor.groupBy({
      by: ['city'],
      where: { city: { not: null } },
      orderBy: { city: 'asc' },
      take: 50,
    });

    return NextResponse.json({
      contractors: contractorsWithDistance,
      total,
      offset,
      limit,
      filters: {
        states: states.map(s => s.state).filter(Boolean).sort(),
        cities: cities.map(c => c.city).filter(Boolean).sort(),
      },
    });
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json({ error: 'Failed to fetch contractors' }, { status: 500 });
  }
}

// POST - Add new contractor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const contractor = await prisma.contractor.create({
      data: {
        businessName: body.businessName,
        ownerName: body.ownerName || null,
        email: body.email || null,
        phone: body.phone || null,
        address: body.address || null,
        city: body.city || null,
        state: body.state || null,
        zipCode: body.zipCode || null,
        licenseNumber: body.licenseNumber || null,
        licenseState: body.licenseState || null,
        trades: body.trades || [],
        verified: false,
      },
    });

    return NextResponse.json({ contractor }, { status: 201 });
  } catch (error) {
    console.error('Error creating contractor:', error);
    return NextResponse.json({ error: 'Failed to create contractor' }, { status: 500 });
  }
}
