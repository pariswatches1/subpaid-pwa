import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/payscore/ratings - Get all ratings
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();

    const ratings = mockDb.gcRatings.filter(r => r.userId === userId);

    return NextResponse.json(ratings);
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json({ error: 'Failed to fetch ratings' }, { status: 500 });
  }
}

// POST /api/payscore/ratings - Create new GC rating
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const {
      gcName,
      gc_name,
      gcEmail,
      gc_email,
      paymentTimeliness,
      payment_timeliness,
      communication,
      overallRating,
      overall_rating,
      review,
      avgPaymentDays,
      avg_payment_days,
    } = body;

    const name = gcName || gc_name;
    const timeliness = paymentTimeliness || payment_timeliness;
    const overall = overallRating || overall_rating;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'GC name is required' },
        { status: 400 }
      );
    }

    if (!timeliness || !overall) {
      return NextResponse.json(
        { error: 'Payment timeliness and overall rating are required' },
        { status: 400 }
      );
    }

    // Validate rating ranges (1-5)
    const timelinessNum = parseInt(timeliness);
    const communicationNum = communication ? parseInt(communication) : 3;
    const overallNum = parseInt(overall);

    if (timelinessNum < 1 || timelinessNum > 5 || overallNum < 1 || overallNum > 5) {
      return NextResponse.json(
        { error: 'Ratings must be between 1 and 5' },
        { status: 400 }
      );
    }

    const newRating = {
      id: generateId(),
      gcName: name,
      gcEmail: gcEmail || gc_email || undefined,
      paymentTimeliness: timelinessNum,
      communication: communicationNum,
      overallRating: overallNum,
      review: review || undefined,
      avgPaymentDays: avgPaymentDays || avg_payment_days || undefined,
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.gcRatings.push(newRating);

    return NextResponse.json(newRating, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
