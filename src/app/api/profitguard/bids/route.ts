import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/profitguard/bids - List all bid analyses
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let bids = mockDb.profitGuardBids.filter(bid => bid.userId === userId);

    if (status) {
      bids = bids.filter(bid => bid.status === status);
    }

    // Sort by creation date descending
    bids.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(bids);
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
    const totalBidAmount = parseFloat(body.total_bid_amount || body.totalBidAmount || '0');
    const laborCost = parseFloat(body.labor_cost || body.laborCost || '0');
    const materialCost = parseFloat(body.material_cost || body.materialCost || '0');
    const equipmentCost = parseFloat(body.equipment_cost || body.equipmentCost || '0');
    const subcontractorCost = parseFloat(body.subcontractor_cost || body.subcontractorCost || '0');
    const overheadPercentage = parseFloat(body.overhead_percentage || body.overheadPercentage || '15');
    const desiredProfitMargin = parseFloat(body.desired_profit_margin || body.desiredProfitMargin || '20');

    // Validation
    if (!projectName) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (totalBidAmount <= 0) {
      return NextResponse.json(
        { error: 'Total bid amount must be greater than 0' },
        { status: 400 }
      );
    }

    // Calculate costs
    const directCosts = laborCost + materialCost + equipmentCost + subcontractorCost;
    const overheadAmount = directCosts * (overheadPercentage / 100);
    const totalCosts = directCosts + overheadAmount;

    // Calculate profit metrics
    const grossProfit = totalBidAmount - totalCosts;
    const actualProfitMargin = (grossProfit / totalBidAmount) * 100;
    const breakEvenAmount = totalCosts;

    // Determine recommendation
    let recommendation = 'proceed';
    let riskLevel = 'low';
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (actualProfitMargin < 5) {
      recommendation = 'decline';
      riskLevel = 'high';
      warnings.push('Profit margin is critically low (under 5%)');
      suggestions.push('Consider increasing bid by at least ' + ((desiredProfitMargin - actualProfitMargin) / 100 * totalBidAmount).toFixed(2));
    } else if (actualProfitMargin < 10) {
      recommendation = 'review';
      riskLevel = 'high';
      warnings.push('Profit margin is below typical minimum (10%)');
    } else if (actualProfitMargin < desiredProfitMargin) {
      recommendation = 'review';
      riskLevel = 'medium';
      warnings.push(`Profit margin (${actualProfitMargin.toFixed(1)}%) is below your target (${desiredProfitMargin}%)`);
    }

    if (laborCost > totalBidAmount * 0.5) {
      warnings.push('Labor costs exceed 50% of bid amount');
      suggestions.push('Review labor estimates for efficiency opportunities');
    }

    if (materialCost > totalBidAmount * 0.4) {
      warnings.push('Material costs are unusually high');
      suggestions.push('Consider alternative suppliers or materials');
    }

    // Calculate suggested bid to meet desired margin
    const suggestedBid = totalCosts / (1 - desiredProfitMargin / 100);

    const newBid = {
      id: generateId(),
      projectName,
      totalBidAmount,
      laborCost,
      materialCost,
      equipmentCost,
      subcontractorCost,
      directCosts,
      overheadPercentage,
      overheadAmount,
      totalCosts,
      grossProfit,
      actualProfitMargin: Math.round(actualProfitMargin * 100) / 100,
      desiredProfitMargin,
      breakEvenAmount,
      suggestedBid: Math.round(suggestedBid * 100) / 100,
      recommendation,
      riskLevel,
      warnings,
      suggestions,
      status: 'analyzed',
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.profitGuardBids.push(newBid);

    return NextResponse.json(newBid, { status: 201 });
  } catch (error) {
    console.error('Error analyzing bid:', error);
    return NextResponse.json(
      { error: 'Failed to analyze bid. Please try again.' },
      { status: 500 }
    );
  }
}
