import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchJobsFromAllSources } from '@/lib/job-sources';

// Simplified keywords for daily cron (to stay within time limits)
const DAILY_KEYWORDS = [
  ['construction', 'contractor'],
  ['electrician', 'electrical'],
  ['plumber', 'plumbing'],
  ['HVAC', 'heating cooling'],
  ['carpenter', 'carpentry'],
  ['roofing', 'roofer'],
  ['concrete', 'masonry'],
  ['welder', 'welding'],
  ['heavy equipment', 'operator'],
  ['foreman', 'superintendent'],
];

// Top states by construction activity
const TOP_STATES = [
  'TX', 'CA', 'FL', 'NY', 'PA', 'IL', 'OH', 'GA', 'NC', 'MI',
  'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'CO',
];

// Top cities for construction jobs
const TOP_CITIES = [
  'Houston, TX', 'Dallas, TX', 'Los Angeles, CA', 'Phoenix, AZ', 'Chicago, IL',
  'San Antonio, TX', 'Austin, TX', 'Denver, CO', 'Miami, FL', 'Atlanta, GA',
  'Seattle, WA', 'Tampa, FL', 'Charlotte, NC', 'San Diego, CA', 'Las Vegas, NV',
];

// Vercel Cron job - runs daily at 6 AM UTC
// For Vercel Pro, we can have up to 5 minutes execution time
export const maxDuration = 300;

export async function GET(request: NextRequest) {
  // Verify cron secret (set CRON_SECRET in env vars)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  // Skip auth check in development or if no secret is set
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  console.log('Starting daily job sync cron...');

  try {
    const seenIds = new Set<string>();
    const jobs: Awaited<ReturnType<typeof fetchJobsFromAllSources>> = [];

    // Fetch by keywords (2 pages each)
    for (const kwSet of DAILY_KEYWORDS) {
      for (let page = 1; page <= 2; page++) {
        try {
          const keywordJobs = await fetchJobsFromAllSources({
            keywords: kwSet,
            limit: 50,
            page
          });
          for (const job of keywordJobs) {
            const uniqueKey = `${job.source}-${job.externalId}`;
            if (!seenIds.has(uniqueKey)) {
              seenIds.add(uniqueKey);
              jobs.push(job);
            }
          }
          // Small delay
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (e) {
          console.error(`Error fetching keywords ${kwSet}:`, e);
        }
      }
    }

    // Fetch by top states
    for (const state of TOP_STATES) {
      try {
        const stateJobs = await fetchJobsFromAllSources({
          state,
          limit: 50,
          page: 1
        });
        for (const job of stateJobs) {
          const uniqueKey = `${job.source}-${job.externalId}`;
          if (!seenIds.has(uniqueKey)) {
            seenIds.add(uniqueKey);
            jobs.push(job);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.error(`Error fetching state ${state}:`, e);
      }
    }

    // Fetch by top cities
    for (const city of TOP_CITIES) {
      try {
        const cityJobs = await fetchJobsFromAllSources({
          location: city,
          limit: 50,
          page: 1
        });
        for (const job of cityJobs) {
          const uniqueKey = `${job.source}-${job.externalId}`;
          if (!seenIds.has(uniqueKey)) {
            seenIds.add(uniqueKey);
            jobs.push(job);
          }
        }
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (e) {
        console.error(`Error fetching city ${city}:`, e);
      }
    }

    console.log(`Fetched ${jobs.length} unique jobs from APIs`);

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
    const errors: string[] = [];

    for (const job of jobs) {
      try {
        if (!job.externalId || !job.source || !job.title) {
          continue;
        }

        const existing = await prisma.jobListing.findUnique({
          where: {
            source_externalId: {
              source: job.source,
              externalId: job.externalId,
            },
          },
        });

        if (existing) {
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
              rawData: job.rawData as object,
              isActive: true,
            },
          });
          updated++;
        } else {
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
              rawData: job.rawData as object,
              isActive: true,
            },
          });
          imported++;
        }
      } catch (jobError) {
        const errorMsg = jobError instanceof Error ? jobError.message : String(jobError);
        errors.push(errorMsg);
      }
    }

    console.log(`Daily sync complete: ${imported} imported, ${updated} updated`);

    return NextResponse.json({
      success: true,
      message: `Daily sync: ${imported} new jobs, ${updated} updated`,
      imported,
      updated,
      total: jobs.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in daily job sync:', error);
    return NextResponse.json({ error: 'Failed to sync jobs' }, { status: 500 });
  }
}
