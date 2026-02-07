import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/job-board/saved - Get user's saved jobs
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // saved, applied, won, lost

    const where: { userId: string; status?: string } = { userId };
    if (status) {
      where.status = status;
    }

    const savedJobs = await prisma.jobSave.findMany({
      where,
      include: {
        jobListing: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedJobs = savedJobs.map(save => ({
      id: save.id,
      jobId: save.jobListingId,
      status: save.status,
      notes: save.notes,
      savedAt: save.createdAt.toISOString(),
      job: {
        id: save.jobListing.id,
        source: save.jobListing.source,
        externalUrl: save.jobListing.externalUrl,
        title: save.jobListing.title,
        description: save.jobListing.description?.substring(0, 300),
        company: save.jobListing.company,
        location: save.jobListing.location,
        state: save.jobListing.state,
        contractValue: save.jobListing.contractValue ? Number(save.jobListing.contractValue) : null,
        salaryMin: save.jobListing.salaryMin ? Number(save.jobListing.salaryMin) : null,
        salaryMax: save.jobListing.salaryMax ? Number(save.jobListing.salaryMax) : null,
        category: save.jobListing.category,
        jobType: save.jobListing.jobType,
        postedAt: save.jobListing.postedAt?.toISOString(),
        deadline: save.jobListing.deadline?.toISOString(),
      },
    }));

    // Get counts by status
    const statusCounts = await prisma.jobSave.groupBy({
      by: ['status'],
      where: { userId },
      _count: { id: true },
    });

    const counts: Record<string, number> = {
      saved: 0,
      applied: 0,
      won: 0,
      lost: 0,
    };
    statusCounts.forEach(s => {
      counts[s.status] = s._count.id;
    });

    return NextResponse.json({
      savedJobs: formattedJobs,
      counts,
      total: formattedJobs.length,
    });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch saved jobs' }, { status: 500 });
  }
}

// POST /api/job-board/saved - Save a job
export async function POST(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const body = await request.json();
    const { jobId, job_id, notes, status = 'saved' } = body;
    const jobListingId = jobId || job_id;

    if (!jobListingId) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    // Check if job exists
    const job = await prisma.jobListing.findUnique({
      where: { id: jobListingId },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Check if already saved
    const existing = await prisma.jobSave.findUnique({
      where: {
        userId_jobListingId: {
          userId,
          jobListingId,
        },
      },
    });

    if (existing) {
      // Update existing save
      const updated = await prisma.jobSave.update({
        where: { id: existing.id },
        data: { notes, status },
      });

      return NextResponse.json({
        success: true,
        message: 'Job save updated',
        save: {
          id: updated.id,
          jobId: updated.jobListingId,
          status: updated.status,
          notes: updated.notes,
        },
      });
    }

    // Create new save
    const newSave = await prisma.jobSave.create({
      data: {
        userId,
        jobListingId,
        notes,
        status,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Job saved',
      save: {
        id: newSave.id,
        jobId: newSave.jobListingId,
        status: newSave.status,
        notes: newSave.notes,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving job:', error);
    return NextResponse.json({ error: 'Failed to save job' }, { status: 500 });
  }
}
