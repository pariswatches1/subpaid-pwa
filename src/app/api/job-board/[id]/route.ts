import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';

// GET /api/job-board/[id] - Get single job details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getMockUserId();
    const { id } = await params;

    const job = await prisma.jobListing.findUnique({
      where: { id },
      include: {
        savedBy: {
          where: { userId },
          select: { id: true, status: true, notes: true, createdAt: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({
      job: {
        id: job.id,
        source: job.source,
        externalId: job.externalId,
        externalUrl: job.externalUrl,
        title: job.title,
        description: job.description,
        company: job.company,
        location: job.location,
        city: job.city,
        state: job.state,
        zipCode: job.zipCode,
        contractValue: job.contractValue ? Number(job.contractValue) : null,
        salaryMin: job.salaryMin ? Number(job.salaryMin) : null,
        salaryMax: job.salaryMax ? Number(job.salaryMax) : null,
        salaryType: job.salaryType,
        category: job.category,
        jobType: job.jobType,
        isRemote: job.isRemote,
        postedAt: job.postedAt?.toISOString(),
        deadline: job.deadline?.toISOString(),
        expiresAt: job.expiresAt?.toISOString(),
        rawData: job.rawData,
        isSaved: job.savedBy.length > 0,
        saveStatus: job.savedBy[0]?.status || null,
        saveNotes: job.savedBy[0]?.notes || null,
        savedAt: job.savedBy[0]?.createdAt?.toISOString() || null,
        createdAt: job.createdAt.toISOString(),
        updatedAt: job.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    return NextResponse.json({ error: 'Failed to fetch job' }, { status: 500 });
  }
}
