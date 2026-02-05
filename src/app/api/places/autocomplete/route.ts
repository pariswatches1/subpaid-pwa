import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyDGgYcWvy6MSEZ5dtg1d6_ur1bgEGgYDZM';

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get('input');

  if (!input || input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        input
      )}&types=(cities)&components=country:us&key=${GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('Places API error:', data.status, data.error_message);
      return NextResponse.json({ predictions: [] });
    }

    return NextResponse.json({
      predictions: data.predictions?.map((p: { description: string; place_id: string }) => ({
        description: p.description,
        place_id: p.place_id,
      })) || [],
    });
  } catch (error) {
    console.error('Places autocomplete error:', error);
    return NextResponse.json({ predictions: [] });
  }
}
