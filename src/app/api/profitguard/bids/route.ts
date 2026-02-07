import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/profitguard/bids - List all bid analyses
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const bids = await prisma.profitGuardBid.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to frontend format
    const formattedBids = bids.map(bid => ({
      id: bid.id,
      projectName: bid.projectName,
      clientName: bid.clientName,
      totalBidAmount: Number(bid.bidAmount),
      materialCost: Number(bid.materialCost),
      laborCost: Number(bid.laborCost),
      overheadPercentage: Number(bid.overheadPercent),
      profitMargin: Number(bid.profitMargin),
      status: bid.status,
      notes: bid.notes,
      createdAt: bid.createdAt.toISOString(),
    }));

    return NextResponse.json({ bids: formattedBids });
  } catch (error) {
    console.error('Error fetching bids:', error);
    return NextResponse.json({ error: 'Failed to fetch bids' }, { status: 500 });
  }
}

// POST /api/profitguard/bids - Analyze a new bid
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const projectName = body.project_name || body.projectName;
    const clientName = body.client_name || body.clientName || null;
    const totalBidAmount = parseFloat(body.total_bid_amount || body.totalBidAmount || body.bidAmount || '0');
    const laborCost = parseFloat(body.labor_cost || body.laborCost || '0');
    const materialCost = parseFloat(body.material_cost || body.materialCost || '0');
    const overheadPercentage = parseFloat(body.overhead_percentage || body.overheadPercentage || body.overheadPercent || '15');
    const desiredProfitMargin = parseFloat(body.desired_profit_margin || body.desiredProfitMargin || '20');
    const notes = body.notes || null;

    // Validation
    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    if (totalBidAmount <= 0) {
      return NextResponse.json({ error: 'Total bid amount must be greater than 0' }, { status: 400 });
    }

    // Calculate costs
    const directCosts = laborCost + materialCost;
    const overheadAmount = directCosts * (overheadPercentage / 100);
    const totalCosts = directCosts + overheadAmount;

    // Calculate profit metrics
    const grossProfit = totalBidAmount - totalCosts;
    const actualProfitMargin = (grossProfit / totalBidAmount) * 100;

    // Determine recommendation
    let recommendation = 'proceed';
    let riskLevel = 'low';
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (actualProfitMargin < 5) {
      recommendation = 'decline';
      riskLevel = 'high';
      warnings.push('Profit margin is critically low (under 5%)');
    } else if (actualProfitMargin < 10) {
      recommendation = 'review';
      riskLevel = 'high';
      warnings.push('Profit margin is below typical minimum (10%)');
    } else if (actualProfitMargin < desiredProfitMargin) {
      recommendation = 'review';
      riskLevel = 'medium';
      warnings.push(`Profit margin (${actualProfitMargin.toFixed(1)}%) is below your target (${desiredProfitMargin}%)`);
    }

    const newBid = await prisma.profitGuardBid.create({
      data: {
        userId,
        projectName,
        clientName,
        bidAmount: totalBidAmount,
        materialCost,
        laborCost,
        overheadPercent: overheadPercentage,
        profitMargin: Math.round(actualProfitMargin * 100) / 100,
        status: 'analyzed',
        notes,
      },
    });

    const formattedBid = {
      id: newBid.id,
      projectName: newBid.projectName,
      clientName: newBid.clientName,
      totalBidAmount: Number(newBid.bidAmount),
      materialCost: Number(newBid.materialCost),
      laborCost: Number(newBid.laborCost),
      overheadPercentage: Number(newBid.overheadPercent),
      profitMargin: Number(newBid.profitMargin),
      directCosts,
      overheadAmount,
      totalCosts,
      grossProfit,
      actualProfitMargin: Math.round(actualProfitMargin * 100) / 100,
      recommendation,
      riskLevel,
      warnings,
      suggestions,
      status: newBid.status,
      createdAt: newBid.createdAt.toISOString(),
    };

    return NextResponse.json({ bid: formattedBid }, { status: 201 });
  } catch (error) {
    console.error('Error analyzing bid:', error);
    return NextResponse.json({ error: 'Failed to analyze bid. Please try again.' }, { status: 500 });
  }
}
