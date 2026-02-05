import { NextRequest, NextResponse } from 'next/server';
import { mockDb, Contractor } from '@/lib/db';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

// City coordinates lookup (major cities for distance calculation)
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  // Florida
  'Miami': { lat: 25.7617, lng: -80.1918 },
  'Orlando': { lat: 28.5383, lng: -81.3792 },
  'Tampa': { lat: 27.9506, lng: -82.4572 },
  'Jacksonville': { lat: 30.3322, lng: -81.6557 },
  'Fort Lauderdale': { lat: 26.1224, lng: -80.1373 },
  'West Palm Beach': { lat: 26.7153, lng: -80.0534 },
  // California
  'Los Angeles': { lat: 34.0522, lng: -118.2437 },
  'San Francisco': { lat: 37.7749, lng: -122.4194 },
  'San Diego': { lat: 32.7157, lng: -117.1611 },
  'San Jose': { lat: 37.3382, lng: -121.8863 },
  'Sacramento': { lat: 38.5816, lng: -121.4944 },
  'Fresno': { lat: 36.7378, lng: -119.7871 },
  // Texas
  'Houston': { lat: 29.7604, lng: -95.3698 },
  'Dallas': { lat: 32.7767, lng: -96.7970 },
  'Austin': { lat: 30.2672, lng: -97.7431 },
  'San Antonio': { lat: 29.4241, lng: -98.4936 },
  'Fort Worth': { lat: 32.7555, lng: -97.3308 },
  'El Paso': { lat: 31.7619, lng: -106.4850 },
  // New York
  'New York City': { lat: 40.7128, lng: -74.0060 },
  'Buffalo': { lat: 42.8864, lng: -78.8784 },
  'Rochester': { lat: 43.1566, lng: -77.6088 },
  'Albany': { lat: 42.6526, lng: -73.7562 },
  'Syracuse': { lat: 43.0481, lng: -76.1474 },
  // Georgia
  'Atlanta': { lat: 33.7490, lng: -84.3880 },
  'Savannah': { lat: 32.0809, lng: -81.0912 },
  'Augusta': { lat: 33.4735, lng: -82.0105 },
  'Columbus, GA': { lat: 32.4610, lng: -84.9877 },
  // Illinois
  'Chicago': { lat: 41.8781, lng: -87.6298 },
  'Aurora, IL': { lat: 41.7606, lng: -88.3201 },
  'Naperville': { lat: 41.7508, lng: -88.1535 },
  'Rockford': { lat: 42.2711, lng: -89.0940 },
  // Pennsylvania
  'Philadelphia': { lat: 39.9526, lng: -75.1652 },
  'Pittsburgh': { lat: 40.4406, lng: -79.9959 },
  'Allentown': { lat: 40.6084, lng: -75.4902 },
  'Erie': { lat: 42.1292, lng: -80.0851 },
  // Arizona
  'Phoenix': { lat: 33.4484, lng: -112.0740 },
  'Tucson': { lat: 32.2226, lng: -110.9747 },
  'Mesa': { lat: 33.4152, lng: -111.8315 },
  'Scottsdale': { lat: 33.4942, lng: -111.9261 },
  // North Carolina
  'Charlotte': { lat: 35.2271, lng: -80.8431 },
  'Raleigh': { lat: 35.7796, lng: -78.6382 },
  'Greensboro': { lat: 36.0726, lng: -79.7920 },
  'Durham': { lat: 35.9940, lng: -78.8986 },
  // Ohio
  'Columbus, OH': { lat: 39.9612, lng: -82.9988 },
  'Cleveland': { lat: 41.4993, lng: -81.6944 },
  'Cincinnati': { lat: 39.1031, lng: -84.5120 },
  'Toledo': { lat: 41.6528, lng: -83.5379 },
  // Michigan
  'Detroit': { lat: 42.3314, lng: -83.0458 },
  'Grand Rapids': { lat: 42.9634, lng: -85.6681 },
  'Ann Arbor': { lat: 42.2808, lng: -83.7430 },
  // Washington
  'Seattle': { lat: 47.6062, lng: -122.3321 },
  'Spokane': { lat: 47.6588, lng: -117.4260 },
  'Tacoma': { lat: 47.2529, lng: -122.4443 },
  // Colorado
  'Denver': { lat: 39.7392, lng: -104.9903 },
  'Colorado Springs': { lat: 38.8339, lng: -104.8214 },
  'Aurora, CO': { lat: 39.7294, lng: -104.8319 },
  // Massachusetts
  'Boston': { lat: 42.3601, lng: -71.0589 },
  'Worcester': { lat: 42.2626, lng: -71.8023 },
  'Springfield': { lat: 42.1015, lng: -72.5898 },
  // Tennessee
  'Nashville': { lat: 36.1627, lng: -86.7816 },
  'Memphis': { lat: 35.1495, lng: -90.0490 },
  'Knoxville': { lat: 35.9606, lng: -83.9207 },
  // Nevada
  'Las Vegas': { lat: 36.1699, lng: -115.1398 },
  'Reno': { lat: 39.5296, lng: -119.8138 },
  'Henderson': { lat: 36.0395, lng: -114.9817 },
  // Add more cities as needed...
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

// Format distance for display
function formatDistance(miles: number): string {
  if (miles < 1) {
    return `${Math.round(miles * 5280)} ft`;
  } else if (miles < 10) {
    return `${miles.toFixed(1)} mi`;
  } else {
    return `${Math.round(miles)} mi`;
  }
}

interface ContractorWithDistance extends Contractor {
  distance?: string;
  distanceValue?: number;
}

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

  // Location-based sorting
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

  // Add distance information if location provided
  let resultsWithDistance: ContractorWithDistance[] = results.map(c => ({ ...c }));

  if (hasLocation) {
    resultsWithDistance = results.map((contractor) => {
      // Try city name first, then "City, STATE" format
      const cityCoords = CITY_COORDS[contractor.city] || CITY_COORDS[`${contractor.city}, ${contractor.state}`];
      let distance: string | undefined;
      let distanceValue: number | undefined;

      if (cityCoords) {
        distanceValue = calculateDistance(lat, lng, cityCoords.lat, cityCoords.lng);
        distance = formatDistance(distanceValue);
      }

      return {
        ...contractor,
        distance,
        distanceValue,
      };
    });

    // Sort by distance (closest first), then by PayScore
    resultsWithDistance.sort((a, b) => {
      // Items without distance go to the end
      if (a.distanceValue === undefined && b.distanceValue === undefined) {
        return (b.payScore || 0) - (a.payScore || 0);
      }
      if (a.distanceValue === undefined) return 1;
      if (b.distanceValue === undefined) return -1;
      return a.distanceValue - b.distanceValue;
    });
  } else {
    // Default sort: active first, then by PayScore desc, then by name
    resultsWithDistance.sort((a, b) => {
      if (a.licenseStatus === 'active' && b.licenseStatus !== 'active') return -1;
      if (a.licenseStatus !== 'active' && b.licenseStatus === 'active') return 1;
      const scoreA = a.payScore || 0;
      const scoreB = b.payScore || 0;
      if (scoreB !== scoreA) return scoreB - scoreA;
      return a.businessName.localeCompare(b.businessName);
    });
  }

  const total = resultsWithDistance.length;
  const paginated = resultsWithDistance.slice(offset, offset + limit);

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
