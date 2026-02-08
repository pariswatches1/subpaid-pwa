import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchJobsFromAllSources, fetchJobsFromSource, getSourceStatus } from '@/lib/job-sources';

// Construction keywords for bulk sync - expanded list
const BULK_KEYWORDS = [
  ['construction', 'contractor'],
  ['electrician', 'electrical'],
  ['plumber', 'plumbing'],
  ['HVAC', 'heating cooling'],
  ['carpenter', 'carpentry'],
  ['roofing', 'roofer'],
  ['concrete', 'masonry'],
  ['painting', 'painter'],
  ['landscaping', 'landscaper'],
  ['welder', 'welding'],
  ['heavy equipment', 'operator'],
  ['foreman', 'superintendent'],
  ['project manager', 'construction'],
  ['estimator', 'construction'],
  ['inspector', 'building'],
  ['drywall', 'installer'],
  ['flooring', 'tile'],
  ['ironworker', 'steel'],
  ['crane operator', 'rigging'],
  ['pipefitter', 'steamfitter'],
  ['sheet metal', 'ductwork'],
  ['glazier', 'glass'],
  ['insulation', 'installer'],
  ['demolition', 'excavation'],
  ['framing', 'framer'],
  ['siding', 'exterior'],
  ['fence', 'installer'],
  ['pool', 'builder'],
  ['solar', 'installer'],
  ['fire sprinkler', 'protection'],
];

// All US states
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

// Major US cities for more granular searches
const MAJOR_CITIES = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
  'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
  'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
  'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
  'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
  'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
  'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Mesa, AZ',
  'Sacramento, CA', 'Atlanta, GA', 'Kansas City, MO', 'Colorado Springs, CO', 'Miami, FL',
  'Raleigh, NC', 'Omaha, NE', 'Long Beach, CA', 'Virginia Beach, VA', 'Oakland, CA',
  'Minneapolis, MN', 'Tulsa, OK', 'Tampa, FL', 'Arlington, TX', 'New Orleans, LA',
  'Wichita, KS', 'Cleveland, OH', 'Bakersfield, CA', 'Aurora, CO', 'Anaheim, CA',
  'Honolulu, HI', 'Santa Ana, CA', 'Riverside, CA', 'Corpus Christi, TX', 'Lexington, KY',
  'Henderson, NV', 'Stockton, CA', 'Saint Paul, MN', 'Cincinnati, OH', 'St. Louis, MO',
  'Pittsburgh, PA', 'Greensboro, NC', 'Lincoln, NE', 'Anchorage, AK', 'Plano, TX',
  'Orlando, FL', 'Irvine, CA', 'Newark, NJ', 'Durham, NC', 'Chula Vista, CA',
  'Toledo, OH', 'Fort Wayne, IN', 'St. Petersburg, FL', 'Laredo, TX', 'Jersey City, NJ',
  'Chandler, AZ', 'Madison, WI', 'Lubbock, TX', 'Scottsdale, AZ', 'Reno, NV',
  'Buffalo, NY', 'Gilbert, AZ', 'Glendale, AZ', 'North Las Vegas, NV', 'Winston-Salem, NC',
  'Chesapeake, VA', 'Norfolk, VA', 'Fremont, CA', 'Garland, TX', 'Irving, TX',
  'Hialeah, FL', 'Richmond, VA', 'Boise, ID', 'Spokane, WA', 'Baton Rouge, LA',
];

// POST /api/job-board/sync - Import jobs from external sources
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { source, state, keywords, limit = 50, bulk = false } = body;

    let jobs: Awaited<ReturnType<typeof fetchJobsFromAllSources>> = [];

    if (bulk) {
      // Bulk sync: fetch from multiple keyword/state/city combinations
      console.log('Starting bulk sync...');

      // Track unique job IDs to avoid duplicates during this run
      const seenIds = new Set<string>();

      // Helper function to add unique jobs
      const addUniqueJobs = (newJobs: typeof jobs) => {
        for (const job of newJobs) {
          const uniqueKey = `${job.source}-${job.externalId}`;
          if (!seenIds.has(uniqueKey)) {
            seenIds.add(uniqueKey);
            jobs.push(job);
          }
        }
      };

      // Fetch 3 pages for top 15 keywords
      for (const kwSet of BULK_KEYWORDS.slice(0, 15)) {
        for (let page = 1; page <= 3; page++) {
          try {
            const keywordJobs = await fetchJobsFromAllSources({
              keywords: kwSet,
              limit: 50,
              page
            });
            addUniqueJobs(keywordJobs);
            console.log(`Fetched ${keywordJobs.length} jobs for keywords: ${kwSet.join(', ')} (page ${page}), total unique: ${jobs.length}`);
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (e) {
            console.error(`Error fetching for keywords ${kwSet} page ${page}:`, e);
          }
        }
      }

      // Fetch 2 pages for top 20 states
      for (const st of US_STATES.slice(0, 20)) {
        for (let page = 1; page <= 2; page++) {
          try {
            const stateJobs = await fetchJobsFromAllSources({
              state: st,
              limit: 50,
              page
            });
            addUniqueJobs(stateJobs);
            console.log(`Fetched ${stateJobs.length} jobs for state: ${st} (page ${page}), total unique: ${jobs.length}`);
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (e) {
            console.error(`Error fetching for state ${st} page ${page}:`, e);
          }
        }
      }

      // Fetch 2 pages for top 30 cities
      for (const city of MAJOR_CITIES.slice(0, 30)) {
        for (let page = 1; page <= 2; page++) {
          try {
            const cityJobs = await fetchJobsFromAllSources({
              location: city,
              limit: 50,
              page
            });
            addUniqueJobs(cityJobs);
            console.log(`Fetched ${cityJobs.length} jobs for city: ${city} (page ${page}), total unique: ${jobs.length}`);
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (e) {
            console.error(`Error fetching for city ${city} page ${page}:`, e);
          }
        }
      }

      console.log(`Bulk sync fetched ${jobs.length} unique jobs`);
    } else if (source) {
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
    const errors: string[] = [];

    for (const job of jobs) {
      try {
        // Validate required fields
        if (!job.externalId || !job.source || !job.title) {
          errors.push(`Missing required fields for job`);
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
              rawData: job.rawData as object,
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
              rawData: job.rawData as object,
              isActive: true,
            },
          });
          imported++;
        }
      } catch (jobError) {
        const errorMsg = jobError instanceof Error ? jobError.message : String(jobError);
        errors.push(errorMsg);
        console.error(`Error upserting job ${job.externalId}:`, jobError);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${imported + updated} jobs`,
      imported,
      updated,
      total: jobs.length,
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
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
