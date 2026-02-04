import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/lien-guard/projects - List LienGuard projects
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let projects = mockDb.lienGuardProjects.filter(p => p.userId === userId);

    if (status) {
      projects = projects.filter(p => p.status === status);
    }

    // Sort by start date descending
    projects.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    return NextResponse.json(projects);
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

    const name = body.name;
    const address = body.address;
    const gcName = body.gc_name || body.gcName;
    const contractAmount = body.contract_amount || body.contractAmount;
    const startDate = body.start_date || body.startDate || new Date().toISOString().split('T')[0];

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Project name is required' },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { error: 'Project address is required' },
        { status: 400 }
      );
    }

    if (!gcName) {
      return NextResponse.json(
        { error: 'General contractor name is required' },
        { status: 400 }
      );
    }

    // Calculate lien deadline (varies by state, default 90 days from start)
    const lienDeadline = new Date(startDate);
    lienDeadline.setDate(lienDeadline.getDate() + 90);

    const newProject = {
      id: generateId(),
      name,
      address,
      gcName,
      contractAmount: contractAmount ? parseFloat(contractAmount) : 0,
      startDate,
      preliminaryNoticeSent: body.preliminary_notice_sent || false,
      preliminaryNoticeDate: undefined,
      lienDeadline: lienDeadline.toISOString().split('T')[0],
      status: 'active',
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.lienGuardProjects.push(newProject);

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to add project. Please try again.' },
      { status: 500 }
    );
  }
}
