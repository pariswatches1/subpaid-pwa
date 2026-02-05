# SubPaid Contractor Data Pipeline

Scripts for scraping, normalizing, and building the contractor database from public license records across all 10 states.

## Data Sources

| State | Agency | Source URL | Records (est.) | Cost | Difficulty |
|-------|--------|-----------|----------------|------|------------|
| Florida | FL DBPR | [myfloridalicense.com](https://www2.myfloridalicense.com/construction-industry/public-records/) | ~300,000 | Free | Easy |
| California | CA CSLB | [cslb.ca.gov/dataportal](https://www.cslb.ca.gov/onlineservices/dataportal/) | ~400,000+ | Free (limited) / $235 (full) | Easy |
| Arizona | AZ ROC | [roc.az.gov](https://roc.az.gov/contractor-search) | ~80,000 | Free | Easy |
| North Carolina | NC NCLBGC | [nclbgc.org](https://portal.nclbgc.org/public/search) | ~90,000 | Free | Easy |
| Texas | TX TDLR | [tdlr.texas.gov](https://www.tdlr.texas.gov/verify.htm) | ~200,000 | Free | Medium |
| Georgia | GA SOS | [sos.ga.gov](https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors) | ~100,000 | Free | Medium |
| Ohio | OH OCILB | [com.ohio.gov](https://elicense4.com.ohio.gov/) | ~80,000 | Free | Medium |
| Pennsylvania | PA AG | [attorneygeneral.gov](https://hicsearch.attorneygeneral.gov/) | ~120,000 | Free | Medium |
| Illinois | IL IDFPR | [idfpr.illinois.gov](https://idfpr.illinois.gov/checklicense.html) | ~100,000 | Free | Medium |
| New York | NY County | [NYC DOB](https://a810-bisweb.nyc.gov/) + counties | ~150,000 | Free | Hard |

**Total estimated: ~1,620,000 licensed contractors**

## Quick Start

```bash
# Generate mock data for all 10 states (100 per state = 1,000 total)
npm run generate:mock

# Scrape individual states
npm run scrape:florida
npm run scrape:california
npm run scrape:arizona
npm run scrape:northcarolina
npm run scrape:texas
npm run scrape:georgia
npm run scrape:ohio
npm run scrape:pennsylvania
npm run scrape:illinois
npm run scrape:newyork

# Scrape all 10 states
npm run scrape:all

# Build contractor database from scraped JSON files
npm run build:contractors
```

## Using Downloaded Files

If you've manually downloaded CSV/data files from state databases:

```bash
# Use a downloaded file with any scraper
npx tsx scripts/scrapers/florida-dbpr.ts --file=/path/to/florida-data.csv
npx tsx scripts/scrapers/california-cslb.ts --file=/path/to/california-data.csv
npx tsx scripts/scrapers/arizona-roc.ts --file=/path/to/arizona-data.csv
# ... etc
```

## Pipeline Architecture

```
State License Databases (10 states)
          |
          v
  Scraper Scripts (per state)
    ├── florida-dbpr.ts         -> scripts/output/florida-contractors.json
    ├── california-cslb.ts      -> scripts/output/california-contractors.json
    ├── arizona-roc.ts          -> scripts/output/arizona-contractors.json
    ├── northcarolina-nclbgc.ts -> scripts/output/northcarolina-contractors.json
    ├── texas-tdlr.ts           -> scripts/output/texas-contractors.json
    ├── georgia-sos.ts          -> scripts/output/georgia-contractors.json
    ├── ohio-ocilb.ts           -> scripts/output/ohio-contractors.json
    ├── pennsylvania-ag.ts      -> scripts/output/pennsylvania-contractors.json
    ├── illinois-idfpr.ts       -> scripts/output/illinois-contractors.json
    └── newyork-county.ts       -> scripts/output/newyork-contractors.json
          |
          v
  Build Database Script
    └── build-database.ts       -> src/lib/contractors-data.ts
          |
          v
  SubPaid App (serves data via API routes)
    ├── /api/contractors         (search/filter/paginate)
    ├── /api/contractors/[id]    (single contractor + similar)
    ├── /api/contractors/claim   (claim business)
    └── /api/contractors/verify  (live license verification)
```

## Output Files

| File | Description |
|------|-------------|
| `scripts/output/florida-contractors.json` | Raw FL data (gitignored) |
| `scripts/output/california-contractors.json` | Raw CA data (gitignored) |
| `scripts/output/arizona-contractors.json` | Raw AZ data (gitignored) |
| `scripts/output/northcarolina-contractors.json` | Raw NC data (gitignored) |
| `scripts/output/texas-contractors.json` | Raw TX data (gitignored) |
| `scripts/output/georgia-contractors.json` | Raw GA data (gitignored) |
| `scripts/output/ohio-contractors.json` | Raw OH data (gitignored) |
| `scripts/output/pennsylvania-contractors.json` | Raw PA data (gitignored) |
| `scripts/output/illinois-contractors.json` | Raw IL data (gitignored) |
| `scripts/output/newyork-contractors.json` | Raw NY data (gitignored) |
| `src/lib/contractors-data.ts` | Final TypeScript export used by the app |

## Legal

All contractor license data is **public record** per state law:
- Florida: Public records under FL Statute 119
- California: Public records under CA Public Records Act
- Arizona: Public records under AZ Public Records Law
- North Carolina: Public records under NC Public Records Act
- Texas: Public records under TX Public Information Act
- Georgia: Public records under GA Open Records Act
- Ohio: Public records under OH Public Records Act
- Pennsylvania: Public records under PA Right-to-Know Law
- Illinois: Public records under IL Freedom of Information Act
- New York: Public records under NY FOIL

The "Claim Your Business" model follows the same legal framework as Yelp, Google Business, and similar platforms.

## State Configuration

All state metadata (names, agencies, data sources, URLs) is centralized in:
`src/lib/states-config.ts`

When adding a new state, update that file first — every other file imports from it.
