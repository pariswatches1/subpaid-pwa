import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/payscore/ratings - Get all ratings
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const gcName = searchParams.get('gcName');

    const ratings = await prisma.gCRating.findMany({
      where: {
        userId,
        ...(gcName ? { gcName: { contains: gcName, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match frontend expected format
    const formattedRatings = ratings.map(r => ({
      id: r.id,
      gcName: r.gcName,
      projectName: r.projectName,
      paymentTimeliness: r.paymentScore,
      communication: r.communicationScore,
      fairness: r.fairnessScore,
      overallRating: r.overallScore,
      review: r.review,
      wouldWorkAgain: r.wouldWorkAgain,
      createdAt: r.createdAt.toISOString(),
      userId: r.userId,
    }));

    return NextResponse.json({ ratings: formattedRatings });
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

    const gcName = body.gcName || body.gc_name;
    const projectName = body.projectName || body.project_name || null;
    const paymentScore = parseInt(body.paymentTimeliness || body.payment_timeliness || body.paymentScore || '50');
    const communicationScore = parseInt(body.communication || body.communicationScore || '50');
    const fairnessScore = parseInt(body.fairness || body.fairnessScore || '50');
    const overallScore = parseInt(body.overallRating || body.overall_rating || body.overallScore || '50');
    const review = body.review || null;
    const wouldWorkAgain = body.wouldWorkAgain !== undefined ? body.wouldWorkAgain : true;

    // Validation
    if (!gcName) {
      return NextResponse.json({ error: 'GC name is required' }, { status: 400 });
    }

    // Validate score ranges (1-100)
    const scores = [paymentScore, communicationScore, fairnessScore, overallScore];
    if (scores.some(s => s < 1 || s > 100)) {
      return NextResponse.json({ error: 'Scores must be between 1 and 100' }, { status: 400 });
    }

    const newRating = await prisma.gCRating.create({
      data: {
        userId,
        gcName,
        projectName,
        paymentScore,
        communicationScore,
        fairnessScore,
        overallScore,
        review,
        wouldWorkAgain,
      },
    });

    const formattedRating = {
      id: newRating.id,
      gcName: newRating.gcName,
      projectName: newRating.projectName,
      paymentTimeliness: newRating.paymentScore,
      communication: newRating.communicationScore,
      fairness: newRating.fairnessScore,
      overallRating: newRating.overallScore,
      review: newRating.review,
      wouldWorkAgain: newRating.wouldWorkAgain,
      createdAt: newRating.createdAt.toISOString(),
      userId: newRating.userId,
    };

    return NextResponse.json({ rating: formattedRating }, { status: 201 });
  } catch (error) {
    console.error('Error creating rating:', error);
    return NextResponse.json({ error: 'Failed to submit rating' }, { status: 500 });
  }
}
