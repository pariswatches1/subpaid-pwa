import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchJobsFromAllSources, fetchJobsFromSource, getSourceStatus } from '@/lib/job-sources';

// POST /api/job-board/sync - Import jobs from external sources
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { source, state, keywords, limit = 50 } = body;

    let jobs;

    if (source) {
      // Fetch from specific source
      jobs = await fetchJobsFromSource(source, { state, keywords, limit });
    } else {
      // Fetch from all configured sources
      jobs = await fetchJobsFromAllSources({ state, keywords, limit });
    }

    if (jobs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new jobs found',
        imported: 0,
        updated: 0,
      });
    }

    // Upsert jobs into database
    let imported = 0;
    let updated = 0;

    for (const job of jobs) {
      try {
        const existing = await prisma.jobListing.findUnique({
          where: {
            source_externalId: {
              source: job.source,
              externalId: job.externalId,
            },
          },
        });

        if (existing) {
          // Update existing job
          await prisma.jobListing.update({
            where: { id: existing.id },
            data: {
              title: job.title,
              description: job.description,
              company: job.company,
              location: job.location,
              city: job.city,
              state: job.state,
              zipCode: job.zipCode,
              contractValue: job.contractValue,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              salaryType: job.salaryType,
              category: job.category,
              jobType: job.jobType,
              isRemote: job.isRemote,
              deadline: job.deadline,
              expiresAt: job.expiresAt,
              rawData: job.rawData,
              isActive: true,
            },
          });
          updated++;
        } else {
          // Create new job
          await prisma.jobListing.create({
            data: {
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
              contractValue: job.contractValue,
              salaryMin: job.salaryMin,
              salaryMax: job.salaryMax,
              salaryType: job.salaryType,
              category: job.category,
              jobType: job.jobType,
              isRemote: job.isRemote,
              postedAt: job.postedAt,
              deadline: job.deadline,
              expiresAt: job.expiresAt,
              rawData: job.rawData,
              isActive: true,
            },
          });
          imported++;
        }
      } catch (jobError) {
        console.error(`Error upserting job ${job.externalId}:`, jobError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${imported + updated} jobs`,
      imported,
      updated,
      total: jobs.length,
    });
  } catch (error) {
    console.error('Error syncing jobs:', error);
    return NextResponse.json({ error: 'Failed to sync jobs' }, { status: 500 });
  }
}

// GET /api/job-board/sync - Get sync status and configured sources
export async function GET() {
  try {
    const sources = getSourceStatus();

    // Get job counts by source
    const counts = await prisma.jobListing.groupBy({
      by: ['source'],
      _count: { id: true },
      where: { isActive: true },
    });

    const countsMap: Record<string, number> = {};
    counts.forEach(c => {
      countsMap[c.source] = c._count.id;
    });

    // Get last sync info
    const latestJob = await prisma.jobListing.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true, source: true },
    });

    return NextResponse.json({
      sources: sources.map(s => ({
        ...s,
        jobCount: countsMap[s.name] || 0,
      })),
      totalJobs: Object.values(countsMap).reduce((a, b) => a + b, 0),
      lastSyncAt: latestJob?.createdAt?.toISOString() || null,
      lastSyncSource: latestJob?.source || null,
    });
  } catch (error) {
    console.error('Error getting sync status:', error);
    return NextResponse.json({ error: 'Failed to get sync status' }, { status: 500 });
  }
}
