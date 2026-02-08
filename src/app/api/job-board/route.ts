import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getMockUserId } from '@/lib/db';
import { Prisma } from '@/generated/prisma/client';

// GET /api/job-board - List and search jobs
export async function GET(request: NextRequest) {
  try {
    const userId = getMockUserId();
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const q = searchParams.get('q'); // Search keyword
    const state = searchParams.get('state');
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const source = searchParams.get('source');
    const jobType = searchParams.get('jobType');
    const minSalary = searchParams.get('minSalary');
    const maxSalary = searchParams.get('maxSalary');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const savedOnly = searchParams.get('savedOnly') === 'true';

    // Category keywords mapping for better search
    const CATEGORY_KEYWORDS: Record<string, string[]> = {
      electrical: ['electrician', 'electrical', 'wiring', 'voltage'],
      plumbing: ['plumber', 'plumbing', 'pipe', 'drain'],
      hvac: ['hvac', 'heating', 'cooling', 'air conditioning', 'ventilation'],
      roofing: ['roofing', 'roofer', 'shingle', 'roof'],
      carpentry: ['carpenter', 'carpentry', 'woodwork', 'framing'],
      painting: ['painter', 'painting', 'coating'],
      concrete: ['concrete', 'masonry', 'cement', 'mason'],
      landscaping: ['landscaping', 'landscaper', 'lawn', 'garden'],
      general: ['general contractor', 'construction', 'building', 'contractor'],
    };

    // Build where clause
    const where: Prisma.JobListingWhereInput = {
      isActive: true,
    };

    // Build AND conditions array for combining filters
    const andConditions: Prisma.JobListingWhereInput[] = [];

    if (q) {
      andConditions.push({
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { description: { contains: q, mode: 'insensitive' } },
          { company: { contains: q, mode: 'insensitive' } },
        ],
      });
    }

    if (state) {
      where.state = state;
    }

    if (city) {
      // Search in city field or location field
      andConditions.push({
        OR: [
          { city: { contains: city, mode: 'insensitive' } },
          { location: { contains: city, mode: 'insensitive' } },
        ],
      });
    }

    // Category filter - search by keywords in title/description
    if (category && CATEGORY_KEYWORDS[category]) {
      const keywords = CATEGORY_KEYWORDS[category];
      andConditions.push({
        OR: keywords.map(keyword => ({
          OR: [
            { title: { contains: keyword, mode: 'insensitive' as const } },
            { description: { contains: keyword, mode: 'insensitive' as const } },
          ],
        })),
      });
    }

    if (source) {
      where.source = source;
    }

    if (jobType) {
      where.jobType = jobType;
    }

    if (minSalary) {
      andConditions.push({
        OR: [
          { salaryMin: { gte: parseFloat(minSalary) } },
          { contractValue: { gte: parseFloat(minSalary) } },
        ],
      });
    }

    if (maxSalary) {
      andConditions.push({
        OR: [
          { salaryMax: { lte: parseFloat(maxSalary) } },
          { contractValue: { lte: parseFloat(maxSalary) } },
        ],
      });
    }

    // If savedOnly, filter to only saved jobs with valid status
    if (savedOnly) {
      where.savedBy = {
        some: {
          userId,
          status: { in: ['saved', 'applied', 'won'] },
        },
      };
    }

    // Add all AND conditions to where clause
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Get total count
    const total = await prisma.jobListing.count({ where });

    // Get jobs with pagination
    const jobs = await prisma.jobListing.findMany({
      where,
      include: {
        savedBy: {
          where: { userId },
          select: { id: true, status: true, notes: true },
        },
      },
      orderBy: { postedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Format response
    const formattedJobs = jobs.map(job => ({
      id: job.id,
      source: job.source,
      externalId: job.externalId,
      externalUrl: job.externalUrl,
      title: job.title,
      description: job.description?.substring(0, 500),
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
      isSaved: job.savedBy.length > 0,
      saveStatus: job.savedBy[0]?.status || null,
      saveNotes: job.savedBy[0]?.notes || null,
    }));

    return NextResponse.json({
      jobs: formattedJobs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}
