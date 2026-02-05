# SubPaid Contractor Data Pipeline

Scripts for scraping, normalizing, and building the contractor database from public license records.

## Data Sources

| State | Source | URL | Records | Cost |
|-------|--------|-----|---------|------|
| Florida | DBPR (Dept. of Business & Professional Regulation) | [myfloridalicense.com](https://www2.myfloridalicense.com/construction-industry/public-records/) | ~300,000 | Free |
| California | CSLB (Contractors State License Board) | [cslb.ca.gov/dataportal](https://www.cslb.ca.gov/onlineservices/dataportal/) | ~400,000+ | Free (limited) / $235 (full) |

## Quick Start

```bash
# Scrape Florida contractors
npm run scrape:florida

# Scrape California contractors
npm run scrape:california

# Scrape both states
npm run scrape:all

# Build the contractor database from scraped data
npm run build:contractors
```

## Using Downloaded Files

If you've manually downloaded CSV files from the state databases:

```bash
# Florida - use a downloaded CSV file
npx tsx scripts/scrapers/florida-dbpr.ts --file=/path/to/florida-data.csv

# California - use a downloaded CSV file
npx tsx scripts/scrapers/california-cslb.ts --file=/path/to/california-data.csv
```

## Pipeline Architecture

```
State License Databases (50 states)
          │
          ▼
  Scraper Scripts (per state)
    ├── florida-dbpr.ts      → scripts/output/florida-contractors.json
    └── california-cslb.ts   → scripts/output/california-contractors.json
          │
          ▼
  Build Database Script
    └── build-database.ts    → src/lib/contractors-data.ts
          │
          ▼
  SubPaid App (serves data via API routes)
    ├── /api/contractors         (search/filter)
    ├── /api/contractors/[id]    (single contractor)
    ├── /api/contractors/claim   (claim business)
    └── /api/contractors/verify  (live license check)
```

## Output Files

| File | Description |
|------|-------------|
| `scripts/output/florida-contractors.json` | Raw FL data (gitignored) |
| `scripts/output/california-contractors.json` | Raw CA data (gitignored) |
| `src/lib/contractors-data.ts` | Final TypeScript export used by the app |

## Legal

All contractor license data is **public record** per state law:
- Florida: Public records under FL Statute 119
- California: Public records under CA Public Records Act

The "Claim Your Business" model follows the same legal framework as Yelp, Google Business, and similar platforms.

## Adding New States

1. Create a new scraper: `scripts/scrapers/[state]-[agency].ts`
2. Map fields to the `Contractor` interface in `src/lib/db.ts`
3. Add the state to the build script
4. Update the `state` type in the Contractor interface if needed

### Priority States (next to add)

| State | Agency | Difficulty |
|-------|--------|-----------|
| Texas | TDLR | Medium |
| Arizona | ROC | Easy |
| Nevada | NSCB | Easy |
| Georgia | SOS | Medium |
| North Carolina | NCLBGC | Easy |
