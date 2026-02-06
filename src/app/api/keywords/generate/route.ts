import { NextRequest, NextResponse } from 'next/server';
import { KeywordRequest } from '@/lib/keyword-types';
import { generateKeywords } from '@/lib/keyword-generator';
import { getCachedKeywords, cacheKeywords } from '@/lib/keyword-cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { trades, location, radiusMiles, audience, vertical } = body;

    if (!trades || !Array.isArray(trades) || trades.length === 0) {
      return NextResponse.json(
        { error: 'At least one trade is required' },
        { status: 400 }
      );
    }

    if (!location || !location.city || !location.state) {
      return NextResponse.json(
        { error: 'Location with city and state is required' },
        { status: 400 }
      );
    }

    if (!audience || !['GET_HIRED', 'FIND_WORK'].includes(audience)) {
      return NextResponse.json(
        { error: 'Audience must be GET_HIRED or FIND_WORK' },
        { status: 400 }
      );
    }

    if (!vertical || !['RES', 'COM', 'IND', 'ALL'].includes(vertical)) {
      return NextResponse.json(
        { error: 'Vertical must be RES, COM, IND, or ALL' },
        { status: 400 }
      );
    }

    const keywordRequest: KeywordRequest = {
      trades,
      location: {
        city: location.city,
        state: location.state,
        lat: location.lat,
        lng: location.lng,
      },
      radiusMiles: radiusMiles || 25,
      audience,
      vertical,
    };

    // Check cache first
    const cached = getCachedKeywords(keywordRequest);
    if (cached) {
      return NextResponse.json({
        ...cached,
        fromCache: true,
      });
    }

    // Generate new keywords
    const response = generateKeywords(keywordRequest);

    // Cache the results
    cacheKeywords(keywordRequest, response);

    return NextResponse.json({
      ...response,
      fromCache: false,
    });
  } catch (error) {
    console.error('Error generating keywords:', error);
    return NextResponse.json(
      { error: 'Failed to generate keywords' },
      { status: 500 }
    );
  }
}
