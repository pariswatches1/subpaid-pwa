import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// PATCH /api/job-board/saved/[id] - Update saved job status/notes
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getMockUserId();
    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // Find the save
    const save = await prisma.jobSave.findFirst({
      where: { id, userId },
    });

    if (!save) {
      return NextResponse.json({ error: 'Saved job not found' }, { status: 404 });
    }

    // Update
    const updated = await prisma.jobSave.update({
      where: { id },
      data: {
        ...(status !== undefined && { status }),
        ...(notes !== undefined && { notes }),
      },
    });

    return NextResponse.json({
      success: true,
      save: {
        id: updated.id,
        jobId: updated.jobListingId,
        status: updated.status,
        notes: updated.notes,
      },
    });
  } catch (error) {
    console.error('Error updating saved job:', error);
    return NextResponse.json({ error: 'Failed to update saved job' }, { status: 500 });
  }
}

// DELETE /api/job-board/saved/[id] - Unsave a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getMockUserId();
    const { id } = await params;

    // Find the save
    const save = await prisma.jobSave.findFirst({
      where: { id, userId },
    });

    if (!save) {
      return NextResponse.json({ error: 'Saved job not found' }, { status: 404 });
    }

    // Delete
    await prisma.jobSave.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Job unsaved',
    });
  } catch (error) {
    console.error('Error unsaving job:', error);
    return NextResponse.json({ error: 'Failed to unsave job' }, { status: 500 });
  }
}
