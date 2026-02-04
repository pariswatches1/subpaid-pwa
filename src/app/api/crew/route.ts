import { NextRequest, NextResponse } from 'next/server';

// Mock database for crew members
let crewMembers = [
  {
    id: '1',
    name: 'Jose Martinez',
    email: 'jose@company.com',
    phone: '(555) 123-4567',
    role: 'Lead Electrician',
    hourlyRate: 45,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export async function GET() {
  return NextResponse.json(crewMembers);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }

    // Create new crew member
    const newMember = {
      id: String(Date.now()),
      name: body.name,
      email: body.email || '',
      phone: body.phone || '',
      role: body.role || 'Crew Member',
      hourlyRate: body.hourly_rate || body.hourlyRate || 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    crewMembers.push(newMember);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error creating crew member:', error);
    return NextResponse.json(
      { message: 'Failed to add crew member' },
      { status: 500 }
    );
  }
}
