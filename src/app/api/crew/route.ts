import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/crew - List all crew members
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = { userId };
    if (status) where.status = status;

    const crew = await prisma.crewMember.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(crew);
  } catch (error) {
    console.error('Error fetching crew:', error);
    return NextResponse.json({ error: 'Failed to fetch crew members' }, { status: 500 });
  }
}

// POST /api/crew - Add new crew member
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
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
      const existingMember = await prisma.crewMember.findFirst({
        where: { email, userId },
      });
      if (existingMember) {
        return NextResponse.json(
          { error: 'A crew member with this email already exists' },
          { status: 409 }
        );
      }
    }

    const newMember = await prisma.crewMember.create({
      data: {
        userId,
        name,
        email: email || null,
        phone: phone || null,
        role,
        hourlyRate: hourlyRate || hourly_rate ? parseFloat(hourlyRate || hourly_rate) : null,
        status: 'active',
      },
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error('Error adding crew member:', error);
    return NextResponse.json(
      { error: 'Failed to add crew member. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH /api/crew - Update crew member
export async function PATCH(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();
    const { id, name, email, phone, role, hourlyRate, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Crew member ID is required' },
        { status: 400 }
      );
    }

    // Verify crew member exists and belongs to user
    const existingMember = await prisma.crewMember.findFirst({
      where: { id, userId },
    });

    if (!existingMember) {
      return NextResponse.json(
        { error: 'Crew member not found' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (email !== undefined) updateData.email = email || null;
    if (phone !== undefined) updateData.phone = phone || null;
    if (role) updateData.role = role;
    if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate ? parseFloat(hourlyRate) : null;
    if (status) updateData.status = status;

    const updatedMember = await prisma.crewMember.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      crewMember: updatedMember,
    });
  } catch (error) {
    console.error('Error updating crew member:', error);
    return NextResponse.json(
      { error: 'Failed to update crew member' },
      { status: 500 }
    );
  }
}
