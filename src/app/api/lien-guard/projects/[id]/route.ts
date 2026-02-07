import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/lien-guard/projects/[id] - Get single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();

    const project = await prisma.lienProject.findFirst({
      where: { id, userId },
      include: { documents: true },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const formattedProject = {
      id: project.id,
      projectName: project.projectName,
      gcName: project.gcName,
      address: project.address,
      state: project.state,
      startDate: project.startDate.toISOString().split('T')[0],
      lastWorkDate: project.lastWorkDate?.toISOString().split('T')[0] || project.startDate.toISOString().split('T')[0],
      contractAmount: Number(project.contractAmount),
      amountOwed: Number(project.amountOwed),
      preliminaryNotice: {
        required: project.preNoticeRequired,
        deadline: project.preNoticeDeadline?.toISOString().split('T')[0] || '',
        sent: project.preNoticeSent,
        sentDate: project.preNoticeSentDate?.toISOString().split('T')[0],
      },
      mechanicsLien: {
        deadline: project.lienDeadline.toISOString().split('T')[0],
        daysRemaining: Math.ceil((project.lienDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        filed: project.lienFiled,
      },
      status: project.status as 'protected' | 'at-risk' | 'expired',
      documents: project.documents,
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PATCH /api/lien-guard/projects/[id] - Update project
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();
    const body = await request.json();

    // Verify ownership
    const existing = await prisma.lienProject.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Build update data
    const updateData: Record<string, unknown> = {};

    if (body.projectName !== undefined) updateData.projectName = body.projectName;
    if (body.gcName !== undefined) updateData.gcName = body.gcName;
    if (body.address !== undefined) updateData.address = body.address;
    if (body.state !== undefined) updateData.state = body.state;
    if (body.contractAmount !== undefined) updateData.contractAmount = parseFloat(body.contractAmount);
    if (body.amountOwed !== undefined) updateData.amountOwed = parseFloat(body.amountOwed);
    if (body.startDate !== undefined) updateData.startDate = new Date(body.startDate);
    if (body.lastWorkDate !== undefined) updateData.lastWorkDate = body.lastWorkDate ? new Date(body.lastWorkDate) : null;
    if (body.status !== undefined) updateData.status = body.status;

    // Handle preliminary notice update
    if (body.preNoticeSent !== undefined) {
      updateData.preNoticeSent = body.preNoticeSent;
      if (body.preNoticeSent) {
        updateData.preNoticeSentDate = new Date();
      }
    }

    // Handle lien filed update
    if (body.lienFiled !== undefined) {
      updateData.lienFiled = body.lienFiled;
    }

    const updated = await prisma.lienProject.update({
      where: { id },
      data: updateData,
    });

    const formattedProject = {
      id: updated.id,
      projectName: updated.projectName,
      gcName: updated.gcName,
      address: updated.address,
      state: updated.state,
      startDate: updated.startDate.toISOString().split('T')[0],
      lastWorkDate: updated.lastWorkDate?.toISOString().split('T')[0] || updated.startDate.toISOString().split('T')[0],
      contractAmount: Number(updated.contractAmount),
      amountOwed: Number(updated.amountOwed),
      preliminaryNotice: {
        required: updated.preNoticeRequired,
        deadline: updated.preNoticeDeadline?.toISOString().split('T')[0] || '',
        sent: updated.preNoticeSent,
        sentDate: updated.preNoticeSentDate?.toISOString().split('T')[0],
      },
      mechanicsLien: {
        deadline: updated.lienDeadline.toISOString().split('T')[0],
        daysRemaining: Math.ceil((updated.lienDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        filed: updated.lienFiled,
      },
      status: updated.status as 'protected' | 'at-risk' | 'expired',
    };

    return NextResponse.json({ project: formattedProject });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE /api/lien-guard/projects/[id] - Delete project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getMockUserId();

    // Verify ownership
    const existing = await prisma.lienProject.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    await prisma.lienProject.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
