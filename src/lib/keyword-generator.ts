import {
  IntentCluster,
  KeywordRequest,
  KeywordResponse,
  KeywordResult,
  Audience,
  ProjectType,
} from './keyword-types';
import { getTradeKeywords, TRADE_ALIASES } from './trades';

// Template definitions for each intent cluster
const HIRE_LOCAL_TEMPLATES = [
  '{trade} near me',
  '{trade} contractor near me',
  '{trade} contractors {city}',
  '{trade} contractors {city} {state}',
  '{trade} company {city}',
  '{trade} services {city}',
  'best {trade} contractors {city}',
  'top {trade} contractors near me',
  '{trade} installation {city}',
  '{trade} repair {city}',
  '{trade} replacement {city}',
  '{trade} estimate',
  '{trade} quote',
  '{trade} cost',
  '{trade} prices {city}',
  'licensed {trade} contractor {city}',
  'insured {trade} contractor near me',
  'local {trade} contractor',
  'affordable {trade} {city}',
  '{trade} specialists {city}',
];

const HIRE_LOCAL_COMMERCIAL = [
  'commercial {trade} contractors {city}',
  'commercial {trade} company',
  'commercial {trade} services near me',
  'commercial {trade} installation',
];

const HIRE_LOCAL_INDUSTRIAL = [
  'industrial {trade} contractors {city}',
  'industrial {trade} company',
  'industrial {trade} services',
  'industrial {trade} installation',
];

const WORK_ACQUISITION_TEMPLATES = [
  '{trade} subcontractor jobs',
  '{trade} subcontractor jobs {city}',
  '{trade} subcontractor jobs {state}',
  '1099 {trade} subcontractor',
  '1099 {trade} jobs {city}',
  '{trade} subcontractor needed',
  '{trade} subcontractor needed {city}',
  '{trade} installer subcontractor',
  'subcontractor needed {city}',
  '{trade} subcontractor opportunities',
  'independent contractor {trade} jobs',
  '{trade} contractor jobs near me',
  'hiring {trade} subcontractors',
  '{trade} crews needed',
  '{trade} sub work available',
  'looking for {trade} subcontractor',
  '{trade} work for subs',
  '{trade} helper jobs {city}',
  'journeyman {trade} jobs {city}',
];

const BIDS_PLANROOM_TEMPLATES = [
  'construction bid opportunities {state}',
  '{city} construction bids',
  'subcontractor bidding',
  'plan room',
  'plan room {state}',
  'public works bids {state}',
  'commercial construction bids {state}',
  'government construction bids {state}',
  '{trade} bid opportunities',
  '{trade} bid opportunities {city}',
  'construction bidding software',
  'free construction bids',
  'construction bid websites',
  '{city} public works projects',
  'ITB construction {state}',
  'RFP construction {state}',
  'subcontractor bid invitations',
  '{trade} ITB {city}',
];

const ADMIN_COMPLIANCE_TEMPLATES = [
  'subcontractor agreement',
  'subcontractor agreement template',
  'construction subcontractor agreement template',
  'subcontractor contract template',
  'subcontractor insurance requirements',
  'certificate of insurance subcontractor',
  'additional insured endorsement',
  'lien waiver form',
  'conditional lien waiver',
  'unconditional lien waiver',
  'pay application template',
  'AIA pay application',
  'notice to owner',
  'notice to owner {state}',
  'preliminary notice {state}',
  'mechanics lien {state}',
  'bond claim requirements',
  'payment bond claim',
  'subcontractor prequalification form',
  'W9 subcontractor',
  'subcontractor onboarding checklist',
];

// Generate unique ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Estimate monthly searches based on keyword type + cluster
// Uses realistic ranges based on industry data
function estimateMonthlySearches(keyword: string, cluster: IntentCluster): number {
  const baseVolume: Record<IntentCluster, { min: number; max: number }> = {
    'hire-local': { min: 100, max: 500 },      // High intent - lots of people looking for contractors
    'work-acquisition': { min: 50, max: 200 }, // Moderate - subs looking for work
    'bids-planroom': { min: 20, max: 100 },    // Lower volume - more specialized
    'admin-compliance': { min: 10, max: 50 },  // Lowest but high intent
  };

  const range = baseVolume[cluster];

  // Adjust based on keyword specificity (longer = more specific = lower volume)
  const wordCount = keyword.split(' ').length;
  const specificityFactor = Math.max(0.3, 1 - (wordCount - 2) * 0.15);

  // "Near me" keywords get a boost (very popular)
  const nearMeBoost = keyword.includes('near me') ? 1.5 : 1;

  // Location-specific keywords get slight reduction
  const hasLocation = /\b(city|state|[a-z]{2})\b/i.test(keyword) || keyword.match(/[A-Z][a-z]+,?\s+[A-Z]{2}/);
  const locationFactor = hasLocation ? 0.7 : 1;

  const baseEstimate = range.min + Math.random() * (range.max - range.min);
  const finalEstimate = Math.round(baseEstimate * specificityFactor * nearMeBoost * locationFactor);

  return Math.max(10, finalEstimate); // Minimum 10 searches/month
}

// Convert searches to potential jobs (2-5% conversion estimate)
function estimatePotentialJobs(monthlySearches: number): number {
  // Realistic conversion: 2-5% of searches lead to a job
  const conversionRate = 0.02 + Math.random() * 0.03;
  return Math.max(1, Math.round(monthlySearches * conversionRate));
}

// Expand a template with trade and location
function expandTemplate(
  template: string,
  trade: string,
  city: string,
  state: string
): string {
  return template
    .replace(/{trade}/g, trade.toLowerCase())
    .replace(/{city}/g, city.toLowerCase())
    .replace(/{state}/g, state.toLowerCase());
}

// Calculate keyword score based on heuristics
function calculateScore(keyword: string, city: string, state: string): number {
  let score = 1;

  // High value indicators
  if (keyword.includes('near me')) score += 3;
  if (keyword.includes('commercial')) score += 2;
  if (keyword.includes('industrial')) score += 2;
  if (keyword.includes('jobs') || keyword.includes('1099') || keyword.includes('needed')) score += 2;
  if (keyword.includes('subcontractor')) score += 1;

  // Location relevance
  if (keyword.includes(city.toLowerCase())) score += 1;
  if (keyword.includes(state.toLowerCase())) score += 1;

  // Intent indicators
  if (keyword.includes('estimate') || keyword.includes('quote') || keyword.includes('cost')) score += 1;
  if (keyword.includes('licensed') || keyword.includes('insured')) score += 1;
  if (keyword.includes('best') || keyword.includes('top')) score += 1;

  // Work acquisition specific
  if (keyword.includes('hiring') || keyword.includes('looking for')) score += 2;
  if (keyword.includes('opportunities')) score += 1;

  // Bids specific
  if (keyword.includes('bid') || keyword.includes('ITB') || keyword.includes('RFP')) score += 2;
  if (keyword.includes('public works') || keyword.includes('government')) score += 1;

  return Math.min(score, 10); // Cap at 10
}

// Deduplicate keywords
function deduplicateKeywords(keywords: KeywordResult[]): KeywordResult[] {
  const seen = new Set<string>();
  return keywords.filter((kw) => {
    const normalized = kw.keyword.toLowerCase().trim();
    if (seen.has(normalized)) return false;
    seen.add(normalized);
    return true;
  });
}

// Generate keywords for a single cluster
function generateClusterKeywords(
  templates: string[],
  cluster: IntentCluster,
  trades: string[],
  city: string,
  state: string
): KeywordResult[] {
  const results: KeywordResult[] = [];

  for (const trade of trades) {
    // Get trade keywords including aliases
    const tradeVariants = [trade, ...(TRADE_ALIASES[trade] || []).slice(0, 2)];

    for (const tradeVariant of tradeVariants) {
      for (const template of templates) {
        const keyword = expandTemplate(template, tradeVariant, city, state);
        const score = calculateScore(keyword, city, state);

        const estimatedVolume = estimateMonthlySearches(keyword, cluster);
        const potentialJobs = estimatePotentialJobs(estimatedVolume);

        results.push({
          id: generateId(),
          keyword,
          cluster,
          source: 'heuristic',
          score,
          estimatedVolume,
          potentialJobs,
        });
      }
    }
  }

  return results;
}

// Main keyword generation function
export function generateKeywords(request: KeywordRequest): KeywordResponse {
  const { trades, location, audience, vertical } = request;
  const { city, state } = location;

  let allKeywords: KeywordResult[] = [];

  // Generate hire-local keywords (both audiences benefit from understanding what customers search)
  let hireLocalTemplates = [...HIRE_LOCAL_TEMPLATES];
  if (vertical === 'COM' || vertical === 'ALL') {
    hireLocalTemplates = [...hireLocalTemplates, ...HIRE_LOCAL_COMMERCIAL];
  }
  if (vertical === 'IND' || vertical === 'ALL') {
    hireLocalTemplates = [...hireLocalTemplates, ...HIRE_LOCAL_INDUSTRIAL];
  }

  const hireLocalKeywords = generateClusterKeywords(
    hireLocalTemplates,
    'hire-local',
    trades,
    city,
    state
  );
  allKeywords = [...allKeywords, ...hireLocalKeywords];

  // Generate work-acquisition keywords (especially relevant for FIND_WORK audience)
  if (audience === 'FIND_WORK' || audience === 'GET_HIRED') {
    const workAcqKeywords = generateClusterKeywords(
      WORK_ACQUISITION_TEMPLATES,
      'work-acquisition',
      trades,
      city,
      state
    );
    allKeywords = [...allKeywords, ...workAcqKeywords];
  }

  // Generate bids/planroom keywords (especially relevant for FIND_WORK audience)
  if (audience === 'FIND_WORK') {
    const bidsKeywords = generateClusterKeywords(
      BIDS_PLANROOM_TEMPLATES,
      'bids-planroom',
      trades,
      city,
      state
    );
    allKeywords = [...allKeywords, ...bidsKeywords];
  }

  // Always include admin/compliance keywords
  const adminKeywords = generateClusterKeywords(
    ADMIN_COMPLIANCE_TEMPLATES,
    'admin-compliance',
    trades,
    city,
    state
  );
  allKeywords = [...allKeywords, ...adminKeywords];

  // Deduplicate
  const uniqueKeywords = deduplicateKeywords(allKeywords);

  // Sort by score descending
  uniqueKeywords.sort((a, b) => b.score - a.score);

  // Calculate stats
  const stats = {
    total: uniqueKeywords.length,
    byCluster: {
      'hire-local': uniqueKeywords.filter((k) => k.cluster === 'hire-local').length,
      'work-acquisition': uniqueKeywords.filter((k) => k.cluster === 'work-acquisition').length,
      'bids-planroom': uniqueKeywords.filter((k) => k.cluster === 'bids-planroom').length,
      'admin-compliance': uniqueKeywords.filter((k) => k.cluster === 'admin-compliance').length,
    },
  };

  // Generate cache key
  const cacheKey = generateCacheKey(request);

  return {
    generatedAt: new Date().toISOString(),
    source: 'heuristic',
    cacheKey,
    keywords: uniqueKeywords,
    stats,
  };
}

// Generate a deterministic cache key from the request
export function generateCacheKey(request: KeywordRequest): string {
  const keyParts = [
    request.trades.sort().join(','),
    request.location.city.toLowerCase(),
    request.location.state.toLowerCase(),
    request.radiusMiles.toString(),
    request.audience,
    request.vertical,
  ];
  return keyParts.join('|');
}

// Export keywords to CSV format
export function keywordsToCSV(keywords: KeywordResult[]): string {
  const headers = ['Keyword', 'Intent Cluster', 'Score', 'Source'];
  const rows = keywords.map((kw) => [
    `"${kw.keyword.replace(/"/g, '""')}"`,
    kw.cluster,
    kw.score.toString(),
    kw.source,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
