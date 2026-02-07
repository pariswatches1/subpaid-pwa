import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserId } from '@/lib/auth';

// GET /api/jobs - List all jobs
export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const clientId = searchParams.get('clientId');

    const where: any = { userId };
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;

    const jobs = await prisma.job.findMany({
      where,
      include: {
        client: true,
        leadSource: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create new job
export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const body = await request.json();

    const { title, name, clientId, description, startDate, endDate, status, leadSourceId, address, budget } = body;
    const jobTitle = title || name;

    // Validation
    if (!jobTitle) {
      return NextResponse.json(
        { error: 'Job title/name is required' },
        { status: 400 }
      );
    }
    if (!clientId) {
      return NextResponse.json(
        { error: 'Client is required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const client = await prisma.client.findFirst({
      where: { id: clientId, userId }
    });
    if (!client) {
      return NextResponse.json(
        { error: 'Client not found' },
        { status: 404 }
      );
    }

    // If leadSourceId provided, verify it exists
    if (leadSourceId) {
      const leadSource = await prisma.leadSource.findFirst({
        where: { id: leadSourceId, userId }
      });
      if (!leadSource) {
        return NextResponse.json(
          { error: 'Lead source not found' },
          { status: 404 }
        );
      }
    }

    const newJob = await prisma.job.create({
      data: {
        userId,
        clientId,
        leadSourceId: leadSourceId || null,
        title: jobTitle,
        description: description || null,
        address: address || null,
        budget: budget ? parseFloat(budget) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'active',
      },
      include: {
        client: true,
      },
    });

    // If leadSourceId is provided, create a timeline event and update stats
    if (leadSourceId) {
      await prisma.leadTimelineEvent.create({
        data: {
          leadSourceId,
          userId,
          eventType: 'job_created',
          entityId: newJob.id,
          description: `Job created: "${jobTitle}"`,
        },
      });

      // Update lead source stats
      await prisma.leadSource.update({
        where: { id: leadSourceId },
        data: {
          jobsLinked: { increment: 1 },
        },
      });
    }

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Failed to create job. Please try again.' },
      { status: 500 }
    );
  }
}
