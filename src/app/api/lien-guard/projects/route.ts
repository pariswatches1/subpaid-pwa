import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/lien-guard/projects - List LienGuard projects
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const projects = await prisma.lienProject.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      orderBy: {
        startDate: 'desc',
      },
      include: {
        documents: true,
      },
    });

    // Transform to match frontend expected format
    const formattedProjects = projects.map(p => ({
      id: p.id,
      projectName: p.projectName,
      gcName: p.gcName,
      address: p.address,
      state: p.state,
      startDate: p.startDate.toISOString().split('T')[0],
      lastWorkDate: p.lastWorkDate?.toISOString().split('T')[0] || p.startDate.toISOString().split('T')[0],
      contractAmount: Number(p.contractAmount),
      amountOwed: Number(p.amountOwed),
      preliminaryNotice: {
        required: p.preNoticeRequired,
        deadline: p.preNoticeDeadline?.toISOString().split('T')[0] || '',
        sent: p.preNoticeSent,
        sentDate: p.preNoticeSentDate?.toISOString().split('T')[0],
      },
      mechanicsLien: {
        deadline: p.lienDeadline.toISOString().split('T')[0],
        daysRemaining: Math.ceil((p.lienDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        filed: p.lienFiled,
      },
      status: p.status as 'protected' | 'at-risk' | 'expired',
    }));

    return NextResponse.json({ projects: formattedProjects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/lien-guard/projects - Create new LienGuard project
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const projectName = body.projectName || body.name;
    const address = body.address;
    const gcName = body.gcName || body.gc_name;
    const state = body.state || 'CO';
    const contractAmount = parseFloat(body.contractAmount || body.contract_amount || '0');
    const amountOwed = parseFloat(body.amountOwed || body.amount_owed || contractAmount.toString());
    const startDate = new Date(body.startDate || body.start_date || new Date());
    const lastWorkDate = body.lastWorkDate || body.last_work_date
      ? new Date(body.lastWorkDate || body.last_work_date)
      : null;

    // Validation
    if (!projectName) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    if (!address) {
      return NextResponse.json({ error: 'Project address is required' }, { status: 400 });
    }
    if (!gcName) {
      return NextResponse.json({ error: 'General contractor name is required' }, { status: 400 });
    }

    // State rules for calculating deadlines
    const stateRules: Record<string, { preLienDays: number; lienDays: number }> = {
      AL: { preLienDays: 0, lienDays: 180 },
      AK: { preLienDays: 0, lienDays: 120 },
      AZ: { preLienDays: 20, lienDays: 120 },
      AR: { preLienDays: 0, lienDays: 120 },
      CA: { preLienDays: 20, lienDays: 90 },
      CO: { preLienDays: 10, lienDays: 120 },
      CT: { preLienDays: 90, lienDays: 90 },
      DE: { preLienDays: 0, lienDays: 60 },
      FL: { preLienDays: 45, lienDays: 90 },
      GA: { preLienDays: 30, lienDays: 90 },
      HI: { preLienDays: 0, lienDays: 45 },
      ID: { preLienDays: 0, lienDays: 90 },
      IL: { preLienDays: 60, lienDays: 120 },
      IN: { preLienDays: 60, lienDays: 90 },
      IA: { preLienDays: 0, lienDays: 90 },
      KS: { preLienDays: 0, lienDays: 90 },
      KY: { preLienDays: 75, lienDays: 180 },
      LA: { preLienDays: 30, lienDays: 60 },
      ME: { preLienDays: 0, lienDays: 90 },
      MD: { preLienDays: 120, lienDays: 180 },
      MA: { preLienDays: 0, lienDays: 120 },
      MI: { preLienDays: 20, lienDays: 90 },
      MN: { preLienDays: 45, lienDays: 120 },
      MS: { preLienDays: 30, lienDays: 90 },
      MO: { preLienDays: 0, lienDays: 180 },
      MT: { preLienDays: 20, lienDays: 90 },
      NE: { preLienDays: 0, lienDays: 120 },
      NV: { preLienDays: 31, lienDays: 90 },
      NH: { preLienDays: 0, lienDays: 120 },
      NJ: { preLienDays: 60, lienDays: 90 },
      NM: { preLienDays: 60, lienDays: 90 },
      NY: { preLienDays: 0, lienDays: 240 },
      NC: { preLienDays: 15, lienDays: 120 },
      ND: { preLienDays: 0, lienDays: 90 },
      OH: { preLienDays: 21, lienDays: 75 },
      OK: { preLienDays: 75, lienDays: 90 },
      OR: { preLienDays: 8, lienDays: 75 },
      PA: { preLienDays: 45, lienDays: 180 },
      RI: { preLienDays: 10, lienDays: 200 },
      SC: { preLienDays: 0, lienDays: 90 },
      SD: { preLienDays: 60, lienDays: 120 },
      TN: { preLienDays: 90, lienDays: 90 },
      TX: { preLienDays: 15, lienDays: 0 },
      UT: { preLienDays: 20, lienDays: 180 },
      VT: { preLienDays: 0, lienDays: 180 },
      VA: { preLienDays: 30, lienDays: 90 },
      WA: { preLienDays: 60, lienDays: 90 },
      WV: { preLienDays: 0, lienDays: 100 },
      WI: { preLienDays: 60, lienDays: 180 },
      WY: { preLienDays: 30, lienDays: 150 },
    };

    const rules = stateRules[state] || { preLienDays: 20, lienDays: 90 };

    // Calculate pre-notice deadline
    const preNoticeDeadline = new Date(startDate);
    preNoticeDeadline.setDate(preNoticeDeadline.getDate() + rules.preLienDays);

    // Calculate lien deadline (from last work date if available, otherwise start date)
    const baseDate = lastWorkDate || startDate;
    const lienDeadline = new Date(baseDate);
    lienDeadline.setDate(lienDeadline.getDate() + rules.lienDays);

    // Calculate status
    const today = new Date();
    const daysRemaining = Math.ceil((lienDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    let status = 'protected';
    if (daysRemaining < 0) {
      status = 'expired';
    } else if (daysRemaining <= 30) {
      status = 'at-risk';
    }

    const newProject = await prisma.lienProject.create({
      data: {
        userId,
        projectName,
        gcName,
        address,
        state,
        startDate,
        lastWorkDate,
        contractAmount,
        amountOwed,
        preNoticeRequired: rules.preLienDays > 0,
        preNoticeDeadline,
        preNoticeSent: false,
        lienDeadline,
        lienFiled: false,
        status,
      },
    });

    // Return formatted response
    const formattedProject = {
      id: newProject.id,
      projectName: newProject.projectName,
      gcName: newProject.gcName,
      address: newProject.address,
      state: newProject.state,
      startDate: newProject.startDate.toISOString().split('T')[0],
      lastWorkDate: newProject.lastWorkDate?.toISOString().split('T')[0] || newProject.startDate.toISOString().split('T')[0],
      contractAmount: Number(newProject.contractAmount),
      amountOwed: Number(newProject.amountOwed),
      preliminaryNotice: {
        required: newProject.preNoticeRequired,
        deadline: newProject.preNoticeDeadline?.toISOString().split('T')[0] || '',
        sent: newProject.preNoticeSent,
        sentDate: newProject.preNoticeSentDate?.toISOString().split('T')[0],
      },
      mechanicsLien: {
        deadline: newProject.lienDeadline.toISOString().split('T')[0],
        daysRemaining,
        filed: newProject.lienFiled,
      },
      status: newProject.status as 'protected' | 'at-risk' | 'expired',
    };

    return NextResponse.json({ project: formattedProject }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to add project. Please try again.' },
      { status: 500 }
    );
  }
}
