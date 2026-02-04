import { NextRequest, NextResponse } from 'next/server';
import { mockDb, generateId, getMockUserId } from '@/lib/db';

// GET /api/crew - List all crew members
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let crew = mockDb.crewMembers.filter(member => member.userId === userId);

    if (status) {
      crew = crew.filter(member => member.status === status);
    }

    // Sort by name
    crew.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json(crew);
  } catch (error) {
    console.error('Error fetching crew:', error);
    return NextResponse.json({ error: 'Failed to fetch crew members' }, { status: 500 });
  }
}

// POST /api/crew - Add new crew member
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();

    const { name, email, phone, role, hourlyRate, hourly_rate } = body;

    // Validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    // Check for duplicate email if provided
    if (email) {
      const existingMember = mockDb.crewMembers.find(
        m => m.email === email && m.userId === userId
      );
      if (existingMember) {
        return NextResponse.json(
          { error: 'A crew member with this email already exists' },
          { status: 409 }
        );
      }
    }

    const newMember = {
      id: generateId(),
      name,
      email: email || null,
      phone: phone || null,
      role,
      hourlyRate: hourlyRate || hourly_rate ? parseFloat(hourlyRate || hourly_rate) : null,
      status: 'active',
      userId,
      createdAt: new Date().toISOString(),
    };

    mockDb.crewMembers.push(newMember);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding crew member:', error);
    return NextResponse.json(
      { error: 'Failed to add crew member. Please try again.' },
      { status: 500 }
    );
  }
}
