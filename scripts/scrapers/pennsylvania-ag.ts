/**
 * Pennsylvania Attorney General - Home Improvement Contractor Registration Scraper
 *
 * Data Source: Pennsylvania Attorney General - Bureau of Consumer Protection
 * URL: https://hicsearch.attorneygeneral.gov/
 * HIC Act: https://www.attorneygeneral.gov/protect-yourself/home-improvement/
 *
 * This scraper downloads contractor registration data from the PA AG database.
 * Pennsylvania does NOT have a contractor "license" - instead, it has a mandatory
 * Home Improvement Contractor (HIC) registration program.
 *
 * Key Details:
 * - Registration, NOT a license (consumer protection focus)
 * - Required for home improvement work over $500
 * - Contractors must carry $5,000/year minimum insurance
 * - PA Home Improvement Consumer Protection Act (73 P.S. 517.1-517.17)
 *
 * License format: PA- prefix + digits (e.g., PA-HIC-123456)
 *
 * Usage: npx tsx scripts/scrapers/pennsylvania-ag.ts
 *
 * Output: scripts/output/pennsylvania-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawPAContractor {
  registrationNumber: string;
  businessName: string;
  ownerName: string;
  registrationType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  phone: string;
  registrationDate: string;
  expirationDate: string;
  insuranceStatus: string;
}

// Pennsylvania uses a single registration type for home improvement
const PA_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  'HIC': { type: 'Home Improvement Contractor', classification: 'Home Improvement' },
  'HOME': { type: 'Home Improvement Contractor', classification: 'Home Improvement' },
  'GEN': { type: 'Home Improvement Contractor (General)', classification: 'General/Home Improvement' },
  'ELEC': { type: 'Home Improvement Contractor (Electrical)', classification: 'Electrical' },
  'PLMB': { type: 'Home Improvement Contractor (Plumbing)', classification: 'Plumbing' },
  'HVAC': { type: 'Home Improvement Contractor (HVAC)', classification: 'HVAC/Mechanical' },
  'ROOF': { type: 'Home Improvement Contractor (Roofing)', classification: 'Roofing' },
  'PAINT': { type: 'Home Improvement Contractor (Painting)', classification: 'Painting' },
  'SIDING': { type: 'Home Improvement Contractor (Siding)', classification: 'Siding/Exterior' },
  'WINDOW': { type: 'Home Improvement Contractor (Windows/Doors)', classification: 'Windows/Doors' },
};

function parseLicenseType(registrationType: string): { type: string; classification: string } {
  const upper = registrationType.toUpperCase().trim();

  for (const [code, info] of Object.entries(PA_LICENSE_TYPES)) {
    if (upper.includes(code)) {
      return info;
    }
  }

  // Default for PA is Home Improvement Contractor (it's all one registration)
  return { type: 'Home Improvement Contractor', classification: 'Home Improvement' };
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
  if (s.includes('active') || s.includes('current') || s.includes('registered') || s.includes('valid') || s.includes('good standing')) return 'active';
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin') || s.includes('barred')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed') || s.includes('not renewed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender') || s.includes('withdrawn')) return 'inactive';
  return 'inactive';
}

async function scrapePennsylvania() {
  console.log('🔔 Pennsylvania AG Home Improvement Contractor Scraper');
  console.log('========================================================');
  console.log('');
  console.log('ℹ️  Note: Pennsylvania requires Home Improvement Contractor REGISTRATION');
  console.log('   (not a license). This is a consumer protection program under the PA AG.');
  console.log('   Work over $500 requires registration. $5K/year insurance minimum.');
  console.log('');

  // Step 1: Attempt to connect to PA HIC Search
  console.log('📥 Step 1: Connecting to PA Attorney General HIC Search...');
  console.log('   Source: https://hicsearch.attorneygeneral.gov/');
  console.log('');

  const allContractors: RawPAContractor[] = [];

  // PA AG has a HIC search tool at hicsearch.attorneygeneral.gov
  // It supports search by name, registration number, city, county, and ZIP
  const majorCounties = [
    'Philadelphia', 'Allegheny', 'Montgomery', 'Bucks', 'Delaware',
    'Chester', 'Lancaster', 'Berks', 'Lehigh', 'Luzerne',
  ];

  for (const county of majorCounties) {
    console.log(`   🔍 Searching for HIC registrations in ${county} County...`);

    try {
      // PA AG HIC search endpoint
      const searchUrl = 'https://hicsearch.attorneygeneral.gov/';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'txtContractorName': '',
          'txtRegistrationNumber': '',
          'txtCity': '',
          'ddlCounty': county,
          'txtZip': '',
          'btnSearch': 'Search',
        }).toString(),
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected (${html.length} bytes)`);

        // Parse the search results table
        const rows = parseHTMLTable(html);
        if (rows.length > 0) {
          console.log(`      📊 Found ${rows.length} result rows`);

          for (const row of rows) {
            if (row.length >= 3) {
              allContractors.push({
                registrationNumber: row[0] || '',
                businessName: row[1] || '',
                ownerName: row[2] || '',
                registrationType: 'HIC',
                status: row[3] || 'Active',
                address: row[4] || '',
                city: row[5] || '',
                state: 'PA',
                zipCode: row[6] || '',
                county: county,
                phone: row[7] || '',
                registrationDate: '',
                expirationDate: row[8] || '',
                insuranceStatus: row[9] || '',
              });
            }
          }
        } else {
          // Try to extract from a different HTML structure
          // PA AG site may use divs instead of tables
          const resultRegex = /registration[^:]*:\s*([A-Z0-9-]+)[\s\S]*?name[^:]*:\s*([^<\n]+)/gi;
          let match;
          let count = 0;
          while ((match = resultRegex.exec(html)) !== null) {
            count++;
            allContractors.push({
              registrationNumber: match[1].trim(),
              businessName: match[2].trim(),
              ownerName: '',
              registrationType: 'HIC',
              status: 'Active',
              address: '',
              city: '',
              state: 'PA',
              zipCode: '',
              county: county,
              phone: '',
              registrationDate: '',
              expirationDate: '',
              insuranceStatus: '',
            });
          }
          if (count > 0) {
            console.log(`      📊 Extracted ${count} records from HTML`);
          } else {
            console.log(`      ⚠️  No structured data found in response`);
          }
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${county}: ${error}`);
    }
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);

    // Normalize to standard contractor shape
    const normalized = allContractors
      .filter(c => c.registrationNumber && (c.businessName || c.ownerName))
      .map((c, i) => {
        const typeInfo = parseLicenseType(c.registrationType);
        const regNum = c.registrationNumber.startsWith('PA') ? c.registrationNumber : `PA-HIC-${c.registrationNumber}`;
        return {
          id: `pa-${String(i + 1).padStart(3, '0')}`,
          licenseNumber: regNum,
          licenseType: typeInfo.type,
          licenseStatus: normalizeStatus(c.status),
          classifications: [typeInfo.classification],
          businessName: c.businessName || c.ownerName,
          ownerName: c.ownerName || undefined,
          phone: c.phone || undefined,
          email: undefined,
          website: undefined,
          address: c.address,
          city: c.city,
          state: 'PA' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.registrationDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'PA_AG' as const,
          sourceUrl: `https://hicsearch.attorneygeneral.gov/?reg=${encodeURIComponent(c.registrationNumber)}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'pennsylvania-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: PA AG HIC Search Portal');
  console.log('   → https://hicsearch.attorneygeneral.gov/');
  console.log('   → Search by contractor name, registration number, county, or ZIP');
  console.log('   → Results include registration status and insurance verification');
  console.log('');
  console.log('   Option 2: Right-to-Know Request');
  console.log('   → Pennsylvania Attorney General\'s Office');
  console.log('   → Phone: (717) 787-3391');
  console.log('   → Submit Right-to-Know request for HIC registration database');
  console.log('   → Under PA Right-to-Know Law (Act 3 of 2008)');
  console.log('');
  console.log('   Option 3: Consumer Protection Bureau');
  console.log('   → Bureau of Consumer Protection: 1-800-441-2555');
  console.log('   → https://www.attorneygeneral.gov/protect-yourself/home-improvement/');
  console.log('   → Request: Registered HIC list by county');
  console.log('');
  console.log('   ⚠️  Important: PA HIC is a REGISTRATION, not a license.');
  console.log('   It focuses on consumer protection, not contractor competency.');
  console.log('   The $500 threshold means even small jobs require registration.');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/pennsylvania-ag.ts --file /path/to/downloaded.csv');
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

      const contractors: RawPAContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 3) {
          contractors.push({
            registrationNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            registrationType: 'HIC',
            status: fields[3] || '',
            address: fields[4] || '',
            city: fields[5] || '',
            state: 'PA',
            zipCode: fields[6] || '',
            county: fields[7] || '',
            phone: fields[8] || '',
            registrationDate: fields[9] || '',
            expirationDate: fields[10] || '',
            insuranceStatus: fields[11] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} contractors from local file`);

      // Normalize and save
      const normalized = contractors
        .filter(c => c.registrationNumber && (c.businessName || c.ownerName))
        .map((c, i) => {
          return {
            id: `pa-${String(i + 1).padStart(3, '0')}`,
            licenseNumber: c.registrationNumber.startsWith('PA') ? c.registrationNumber : `PA-HIC-${c.registrationNumber}`,
            licenseType: 'Home Improvement Contractor',
            licenseStatus: normalizeStatus(c.status),
            classifications: ['Home Improvement'],
            businessName: c.businessName || c.ownerName,
            ownerName: c.ownerName || undefined,
            phone: c.phone || undefined,
            email: undefined,
            website: undefined,
            address: c.address,
            city: c.city,
            state: 'PA' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.registrationDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'PA_AG' as const,
            sourceUrl: `https://hicsearch.attorneygeneral.gov/?reg=${encodeURIComponent(c.registrationNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'pennsylvania-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from PA AG and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapePennsylvania()
  .then((result) => {
    console.log(`\n✅ Pennsylvania scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Pennsylvania scraper failed:', err);
    process.exit(1);
  });
