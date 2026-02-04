import { NextRequest, NextResponse } from 'next/server';
import { mockDb } from '@/lib/db';

// GET /api/payscore/contractors - Get contractors with PayScore
export async function GET(request: NextRequest) {
  try {
    // Aggregate ratings by GC name
    const gcMap = new Map<string, {
      ratings: typeof mockDb.gcRatings;
      totalPaymentDays: number;
      paymentDaysCount: number;
    }>();

    mockDb.gcRatings.forEach(rating => {
      const existing = gcMap.get(rating.gcName) || {
        ratings: [],
        totalPaymentDays: 0,
        paymentDaysCount: 0,
      };

      existing.ratings.push(rating);
      if (rating.avgPaymentDays) {
        existing.totalPaymentDays += rating.avgPaymentDays;
        existing.paymentDaysCount++;
      }

      gcMap.set(rating.gcName, existing);
    });

    // Also include clients from the database
    const contractors = mockDb.clients.map(client => {
      const gcData = gcMap.get(client.name);

      if (gcData && gcData.ratings.length > 0) {
        // Calculate averages from ratings
        const avgTimeliness = gcData.ratings.reduce((sum, r) => sum + r.paymentTimeliness, 0) / gcData.ratings.length;
        const avgCommunication = gcData.ratings.reduce((sum, r) => sum + r.communication, 0) / gcData.ratings.length;
        const avgOverall = gcData.ratings.reduce((sum, r) => sum + r.overallRating, 0) / gcData.ratings.length;
        const avgPaymentDays = gcData.paymentDaysCount > 0
          ? Math.round(gcData.totalPaymentDays / gcData.paymentDaysCount)
          : 30;

        // Calculate PayScore (weighted average scaled to 0-100)
        const payScore = Math.round(
          (avgTimeliness * 0.5 + avgCommunication * 0.2 + avgOverall * 0.3) * 20
        );

        return {
          id: client.id,
          name: client.name,
          email: client.email,
          payScore,
          avgPaymentDays,
          reviewCount: gcData.ratings.length,
          rating: payScore >= 85 ? 'Excellent' : payScore >= 70 ? 'Good' : payScore >= 50 ? 'Fair' : 'Poor',
          trend: 'stable',
          onTimeRate: Math.round((avgTimeliness / 5) * 100),
        };
      }

      // Use existing client data if no ratings
      return {
        id: client.id,
        name: client.name,
        email: client.email,
        payScore: client.payScore || 75,
        avgPaymentDays: 30,
        reviewCount: 0,
        rating: client.payScore && client.payScore >= 85 ? 'Excellent' :
                client.payScore && client.payScore >= 70 ? 'Good' :
                client.payScore && client.payScore >= 50 ? 'Fair' : 'Poor',
        trend: 'stable',
        onTimeRate: 85,
      };
    });

    return NextResponse.json(contractors);
  } catch (error) {
    console.error('Error fetching contractors:', error);
    return NextResponse.json({ error: 'Failed to fetch contractors' }, { status: 500 });
  }
}
