/**
 * Arizona Registrar of Contractors (ROC) License Scraper
 *
 * Data Source: Arizona Registrar of Contractors
 * URL: https://roc.az.gov/contractor-search
 * License Search: https://roc.az.gov/contractor-search
 *
 * This scraper downloads contractor license data from the Arizona ROC database.
 * Arizona requires contractor licensing for work over $1,000.
 * License format: ROC + 6 digits (e.g., ROC062145)
 *
 * Usage: npx tsx scripts/scrapers/arizona-roc.ts
 *
 * Output: scripts/output/arizona-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawAZContractor {
  licenseNumber: string;
  businessName: string;
  ownerName: string;
  licenseType: string;
  classification: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  phone: string;
  issueDate: string;
  expirationDate: string;
}

const AZ_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  'B-1': { type: 'General Residential Contractor', classification: 'General Residential' },
  'B-2': { type: 'General Small Commercial Contractor', classification: 'General Commercial' },
  'A': { type: 'General Engineering Contractor', classification: 'General Commercial' },
  'A-General': { type: 'General Commercial Contractor', classification: 'General Commercial' },
  'B': { type: 'General Contractor', classification: 'General Building' },
  'C-11': { type: 'Electrical Contractor', classification: 'Electrical' },
  'C-11R': { type: 'Electrical Contractor (Residential)', classification: 'Electrical' },
  'C-37': { type: 'Plumbing Contractor', classification: 'Plumbing' },
  'C-37R': { type: 'Plumbing Contractor (Residential)', classification: 'Plumbing' },
  'C-39': { type: 'HVAC/Refrigeration Contractor', classification: 'HVAC/Mechanical' },
  'C-39R': { type: 'HVAC Contractor (Residential)', classification: 'HVAC/Mechanical' },
  'C-42': { type: 'Roofing Contractor', classification: 'Roofing' },
  'C-42R': { type: 'Roofing Contractor (Residential)', classification: 'Roofing' },
  'C-9': { type: 'Swimming Pool Contractor', classification: 'Swimming Pool' },
  'C-77': { type: 'Solar Contractor', classification: 'Solar' },
  'C-53': { type: 'Painting/Wall Covering Contractor', classification: 'Painting' },
  'C-36': { type: 'Landscaping Contractor', classification: 'Landscaping' },
  'CR-1': { type: 'Residential Carpentry', classification: 'Carpentry' },
  'KA': { type: 'Dual Licensed (Residential + Commercial)', classification: 'General Building' },
  'KB-1': { type: 'Dual Licensed General Residential', classification: 'General Residential' },
  'KB-2': { type: 'Dual Licensed General Commercial', classification: 'General Commercial' },
};

function parseLicenseType(classification: string): { type: string; classification: string } {
  const code = classification.trim().toUpperCase();
  for (const [key, info] of Object.entries(AZ_LICENSE_TYPES)) {
    if (code === key.toUpperCase() || code.includes(key.toUpperCase())) {
      return info;
    }
  }
  return { type: 'Contractor', classification: 'General' };
}

function parseCSVLine(line: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  fields.push(current.trim());
  return fields;
}

function parseHTMLTable(html: string): string[][] {
  const rows: string[][] = [];
  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi;

  let rowMatch;
  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const cells: string[] = [];
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
      const text = cellMatch[1]
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&nbsp;/g, ' ')
        .replace(/&#39;/g, "'")
        .trim();
      cells.push(text);
    }
    if (cells.length > 0) {
      rows.push(cells);
    }
  }
  return rows;
}

function normalizeStatus(status: string): 'active' | 'inactive' | 'suspended' | 'expired' {
  const s = status.toLowerCase().trim();
  if (s.includes('active') || s.includes('current') || s.includes('clear') || s.includes('open')) return 'active';
  if (s.includes('suspend') || s.includes('revok')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('canceled')) return 'expired';
  return 'inactive';
}

async function scrapeArizona() {
  console.log('🌵 Arizona ROC Contractor Scraper');
  console.log('===================================');
  console.log('');

  // Step 1: Attempt to connect to Arizona ROC
  console.log('📥 Step 1: Connecting to Arizona Registrar of Contractors...');
  console.log('   Source: https://roc.az.gov/contractor-search');
  console.log('');

  const allContractors: RawAZContractor[] = [];

  // Arizona ROC has a search API behind the contractor-search page
  // The search form posts to an API that returns HTML results
  const classifications = ['B-1', 'A', 'C-11', 'C-37', 'C-39', 'C-42'];
  const cities = ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler', 'Tempe', 'Gilbert', 'Glendale'];

  for (const classification of classifications) {
    const typeInfo = AZ_LICENSE_TYPES[classification] || { type: classification, classification: 'General' };
    console.log(`   🔍 Searching for ${typeInfo.type} (${classification}) contractors...`);

    try {
      // ROC search endpoint
      const searchUrl = 'https://roc.az.gov/contractor-search';
      const searchParams = new URLSearchParams({
        classification: classification,
        status: 'Active',
        page: '1',
      });

      const response = await fetch(`${searchUrl}?${searchParams.toString()}`, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected (${html.length} bytes)`);

        // Parse search results table
        const rows = parseHTMLTable(html);
        if (rows.length > 0) {
          console.log(`      📊 Found ${rows.length} rows`);

          for (const row of rows) {
            if (row.length >= 5) {
              allContractors.push({
                licenseNumber: row[0] || '',
                businessName: row[1] || '',
                ownerName: row[2] || '',
                licenseType: typeInfo.type,
                classification: classification,
                status: row[3] || 'Active',
                address: row[4] || '',
                city: row[5] || '',
                state: 'AZ',
                zipCode: row[6] || '',
                county: row[7] || '',
                phone: row[8] || '',
                issueDate: '',
                expirationDate: '',
              });
            }
          }
        } else {
          console.log(`      ⚠️  No table data found in response`);

          // Try extracting from JSON embedded in page
          const jsonMatch = html.match(/var\s+results\s*=\s*(\[[\s\S]*?\]);/);
          if (jsonMatch) {
            try {
              const jsonData = JSON.parse(jsonMatch[1]);
              console.log(`      📊 Found ${jsonData.length} records in embedded JSON`);
              for (const item of jsonData) {
                allContractors.push({
                  licenseNumber: item.license_number || item.roc_number || '',
                  businessName: item.business_name || item.company_name || '',
                  ownerName: item.owner_name || item.qualifier || '',
                  licenseType: typeInfo.type,
                  classification: classification,
                  status: item.status || 'Active',
                  address: item.address || '',
                  city: item.city || '',
                  state: 'AZ',
                  zipCode: item.zip || item.zipcode || '',
                  county: item.county || '',
                  phone: item.phone || '',
                  issueDate: item.issue_date || '',
                  expirationDate: item.expiration_date || '',
                });
              }
            } catch {
              console.log(`      ⚠️  Could not parse embedded JSON`);
            }
          }
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${classification}: ${error}`);
    }
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);

    // Normalize to standard contractor shape
    const normalized = allContractors
      .filter(c => c.licenseNumber && c.businessName)
      .map((c, i) => {
        const typeInfo = parseLicenseType(c.classification);
        return {
          id: `az-${String(i + 1).padStart(3, '0')}`,
          licenseNumber: c.licenseNumber.startsWith('ROC') ? c.licenseNumber : `ROC${c.licenseNumber}`,
          licenseType: typeInfo.type,
          licenseStatus: normalizeStatus(c.status),
          classifications: [typeInfo.classification],
          businessName: c.businessName,
          ownerName: c.ownerName || undefined,
          phone: c.phone || undefined,
          email: undefined,
          website: undefined,
          address: c.address,
          city: c.city,
          state: 'AZ' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'AZ_ROC' as const,
          sourceUrl: `https://roc.az.gov/contractor-search?q=${c.licenseNumber}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'arizona-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: Search directly on the ROC website');
  console.log('   → https://roc.az.gov/contractor-search');
  console.log('   → Search by classification, city, or license number');
  console.log('   → Export results to CSV');
  console.log('');
  console.log('   Option 2: Public records request');
  console.log('   → Contact Arizona ROC: (602) 542-1525');
  console.log('   → Request: Active contractor license database export');
  console.log('   → Available under Arizona Public Records Law (A.R.S. 39-121)');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/arizona-roc.ts --file /path/to/downloaded.csv');
  console.log('');

  // Check for local file
  const fileArg = process.argv.find(a => a.startsWith('--file='));
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    if (fs.existsSync(filePath)) {
      console.log(`   📄 Loading local file: ${filePath}`);
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const lines = csvData.split('\n').filter(l => l.trim());
      console.log(`   Found ${lines.length} lines`);

      const contractors: RawAZContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 6) {
          const typeInfo = parseLicenseType(fields[3] || '');
          contractors.push({
            licenseNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            licenseType: typeInfo.type,
            classification: fields[3] || '',
            status: fields[4] || '',
            address: fields[5] || '',
            city: fields[6] || '',
            state: 'AZ',
            zipCode: fields[7] || '',
            county: fields[8] || '',
            phone: fields[9] || '',
            issueDate: fields[10] || '',
            expirationDate: fields[11] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} contractors from local file`);

      // Normalize and save
      const normalized = contractors
        .filter(c => c.licenseNumber && c.businessName)
        .map((c, i) => {
          const typeInfo = parseLicenseType(c.classification);
          return {
            id: `az-${String(i + 1).padStart(3, '0')}`,
            licenseNumber: c.licenseNumber.startsWith('ROC') ? c.licenseNumber : `ROC${c.licenseNumber}`,
            licenseType: typeInfo.type,
            licenseStatus: normalizeStatus(c.status),
            classifications: [typeInfo.classification],
            businessName: c.businessName,
            ownerName: c.ownerName || undefined,
            phone: c.phone || undefined,
            email: undefined,
            website: undefined,
            address: c.address,
            city: c.city,
            state: 'AZ' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'AZ_ROC' as const,
            sourceUrl: `https://roc.az.gov/contractor-search?q=${c.licenseNumber}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'arizona-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from ROC and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeArizona()
  .then((result) => {
    console.log(`\n✅ Arizona scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Arizona scraper failed:', err);
    process.exit(1);
  });
