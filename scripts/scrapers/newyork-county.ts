/**
 * New York County-based Contractor License Scraper
 *
 * Data Source: New York - County-based Licensing (NO statewide board)
 * Primary URL: https://a810-bisweb.nyc.gov/ (NYC DOB)
 * NYC DOB BIS: https://a810-bisweb.nyc.gov/bisweb/bispi00.jsp
 *
 * This is the HARDEST scraper - New York has NO statewide contractor licensing.
 * Licensing is handled at the city and county level. This scraper aggregates from:
 *
 * 1. NYC Department of Buildings (DOB) - BIS Web
 *    - Home Improvement Contractor (HIC) License
 *    - Licensed Master Plumber
 *    - Licensed Master Electrician
 *    - General Contractor Registration
 *
 * 2. Top County Licensing (Westchester, Nassau, Suffolk, etc.)
 *    - Each county has its own licensing requirements
 *    - Some counties don't license contractors at all
 *
 * License format: varies by county/city
 *
 * Usage: npx tsx scripts/scrapers/newyork-county.ts
 *
 * Output: scripts/output/newyork-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawNYContractor {
  licenseNumber: string;
  businessName: string;
  ownerName: string;
  licenseType: string;
  sourceRegion: string;
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

const NY_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  // NYC DOB license types
  'HIC': { type: 'Home Improvement Contractor', classification: 'Home Improvement' },
  'GC': { type: 'General Contractor', classification: 'General Building' },
  'LMP': { type: 'Licensed Master Plumber', classification: 'Plumbing' },
  'LME': { type: 'Licensed Master Electrician', classification: 'Electrical' },
  'SE': { type: 'Special Electrician', classification: 'Electrical' },
  'SMP': { type: 'Special Master Plumber', classification: 'Plumbing' },
  'FP': { type: 'Fire Protection Contractor', classification: 'Fire Protection' },
  'FS': { type: 'Fire Suppression Contractor', classification: 'Fire Protection' },
  'RC': { type: 'Rigger Contractor', classification: 'Rigging' },
  'SC': { type: 'Sign Contractor', classification: 'Signs' },
  'DM': { type: 'Demolition Contractor', classification: 'Demolition' },
  'CNS': { type: 'Construction Superintendent', classification: 'General Building' },

  // County license types
  'WC-HIC': { type: 'Home Improvement Contractor (Westchester)', classification: 'Home Improvement' },
  'NC-HIC': { type: 'Home Improvement Contractor (Nassau)', classification: 'Home Improvement' },
  'SC-HIC': { type: 'Home Improvement Contractor (Suffolk)', classification: 'Home Improvement' },
  'RC-HIC': { type: 'Home Improvement Contractor (Rockland)', classification: 'Home Improvement' },
  'CNTY-GC': { type: 'General Contractor (County)', classification: 'General Building' },
};

function parseLicenseType(licenseType: string): { type: string; classification: string } {
  const upper = licenseType.toUpperCase().trim();

  // Direct match
  if (NY_LICENSE_TYPES[upper]) {
    return NY_LICENSE_TYPES[upper];
  }

  // Keyword matching
  for (const [code, info] of Object.entries(NY_LICENSE_TYPES)) {
    if (upper.includes(code)) {
      return info;
    }
  }

  // Text-based matching
  if (upper.includes('HOME IMPROVEMENT') || upper.includes('HIC')) {
    return NY_LICENSE_TYPES['HIC'];
  }
  if (upper.includes('GENERAL CONTRACTOR') || upper.includes('GC')) {
    return NY_LICENSE_TYPES['GC'];
  }
  if (upper.includes('PLUMB')) {
    return NY_LICENSE_TYPES['LMP'];
  }
  if (upper.includes('ELECTR')) {
    return NY_LICENSE_TYPES['LME'];
  }
  if (upper.includes('FIRE')) {
    return NY_LICENSE_TYPES['FP'];
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
  if (s.includes('active') || s.includes('current') || s.includes('clear') || s.includes('valid') || s.includes('issued') || s.includes('good standing')) return 'active';
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin') || s.includes('stop work')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed') || s.includes('not renewed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender') || s.includes('closed')) return 'inactive';
  return 'inactive';
}

async function scrapeNewYork() {
  console.log('🗽 New York County-based Contractor Scraper');
  console.log('=============================================');
  console.log('');
  console.log('⚠️  IMPORTANT: New York has NO statewide contractor licensing board.');
  console.log('   Licensing is handled at the city/county level.');
  console.log('   This scraper aggregates data from multiple sources:');
  console.log('   1. NYC Department of Buildings (DOB) - largest source');
  console.log('   2. Westchester County Consumer Protection');
  console.log('   3. Nassau County Consumer Affairs');
  console.log('   4. Suffolk County Consumer Affairs');
  console.log('');

  const allContractors: RawNYContractor[] = [];

  // ======== SOURCE 1: NYC DOB (Building Information System) ========
  console.log('📥 Source 1: NYC Department of Buildings (DOB)...');
  console.log('   BIS Web: https://a810-bisweb.nyc.gov/bisweb/bispi00.jsp');
  console.log('');

  // NYC DOB has multiple license types; search each one
  const nycLicenseTypes = [
    { code: 'HIC', name: 'Home Improvement Contractor', searchType: '11' },
    { code: 'GC', name: 'General Contractor', searchType: '01' },
    { code: 'LMP', name: 'Licensed Master Plumber', searchType: '03' },
    { code: 'LME', name: 'Licensed Master Electrician', searchType: '04' },
    { code: 'FP', name: 'Fire Protection Contractor', searchType: '06' },
  ];

  for (const licType of nycLicenseTypes) {
    console.log(`   🔍 Searching for NYC ${licType.name} (${licType.code})...`);

    try {
      // NYC DOB BIS license query
      const searchUrl = 'https://a810-bisweb.nyc.gov/bisweb/LicenseQueryServlet';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'lictype': licType.searchType,
          'licstatus': 'A',
          'licboro': '',
          'allisession': '0',
          'requestid': '',
          'allcount': '100',
          'Submit': 'Search',
        }).toString(),
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected (${html.length} bytes)`);

        const rows = parseHTMLTable(html);
        if (rows.length > 0) {
          console.log(`      📊 Found ${rows.length} result rows`);

          for (const row of rows) {
            if (row.length >= 3) {
              allContractors.push({
                licenseNumber: row[0] || '',
                businessName: row[1] || row[2] || '',
                ownerName: row[2] || '',
                licenseType: licType.code,
                sourceRegion: 'NYC',
                status: row[3] || 'Active',
                address: row[4] || '',
                city: 'New York',
                state: 'NY',
                zipCode: row[5] || '',
                county: 'New York City',
                phone: row[6] || '',
                issueDate: '',
                expirationDate: row[7] || '',
              });
            }
          }
        } else {
          console.log(`      ⚠️  No table data found - DOB BIS may require JavaScript`);
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error: ${error}`);
    }
  }

  // Try NYC Open Data for DOB license data
  console.log('');
  console.log('   🔍 Trying NYC Open Data for DOB license datasets...');

  try {
    // NYC Open Data - DOB Licensed Contractors
    // Dataset: DOB NOW Active Licensed Professionals
    const nycOpenDataUrl = 'https://data.cityofnewyork.us/resource/w9ak-ipjd.json?$limit=100&$where=license_type%20like%20%27%25contractor%25%27';

    const response = await fetch(nycOpenDataUrl, {
      headers: {
        'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
        'Accept': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json() as any[];
      console.log(`      ✅ Found ${data.length} records on NYC Open Data`);

      for (const item of data) {
        allContractors.push({
          licenseNumber: item.license_number || item.license_nbr || '',
          businessName: item.business_name || item.company_name || '',
          ownerName: `${item.first_name || ''} ${item.last_name || ''}`.trim(),
          licenseType: item.license_type || 'HIC',
          sourceRegion: 'NYC',
          status: item.status || item.license_status || 'Active',
          address: item.business_address || item.address || '',
          city: item.city || 'New York',
          state: 'NY',
          zipCode: item.zip || item.zipcode || '',
          county: 'New York City',
          phone: item.business_phone || item.phone || '',
          issueDate: item.issue_date || item.grant_date || '',
          expirationDate: item.expiration_date || item.expire_date || '',
        });
      }
    } else {
      console.log(`      ⚠️  NYC Open Data returned ${response.status}`);
    }
  } catch (error) {
    console.log(`      ⚠️  Error with NYC Open Data: ${error}`);
  }

  // ======== SOURCE 2: Westchester County ========
  console.log('');
  console.log('📥 Source 2: Westchester County Consumer Protection...');

  try {
    const wcUrl = 'https://consumer.westchestergov.com/home-improvement-contractor-search';

    const response = await fetch(wcUrl, {
      headers: {
        'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      const html = await response.text();
      console.log(`   ✅ Connected to Westchester (${html.length} bytes)`);

      const rows = parseHTMLTable(html);
      if (rows.length > 0) {
        console.log(`   📊 Found ${rows.length} result rows`);
        for (const row of rows) {
          if (row.length >= 2) {
            allContractors.push({
              licenseNumber: row[0] || `WC-${row[1]?.substring(0, 6)}`,
              businessName: row[1] || '',
              ownerName: row[2] || '',
              licenseType: 'WC-HIC',
              sourceRegion: 'Westchester',
              status: row[3] || 'Active',
              address: row[4] || '',
              city: row[5] || '',
              state: 'NY',
              zipCode: row[6] || '',
              county: 'Westchester',
              phone: row[7] || '',
              issueDate: '',
              expirationDate: '',
            });
          }
        }
      } else {
        console.log(`   ⚠️  No data found - may require JavaScript or form submission`);
      }
    } else {
      console.log(`   ⚠️  HTTP ${response.status}`);
    }
  } catch (error) {
    console.log(`   ⚠️  Error: ${error}`);
  }

  // ======== SOURCE 3: Nassau County ========
  console.log('');
  console.log('📥 Source 3: Nassau County Consumer Affairs...');

  try {
    const nassauUrl = 'https://www.nassaucountyny.gov/1409/Consumer-Affairs';

    const response = await fetch(nassauUrl, {
      headers: {
        'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      const html = await response.text();
      console.log(`   ✅ Connected to Nassau County (${html.length} bytes)`);

      // Nassau County may have a contractor search or directory link
      const searchMatch = html.match(/href="([^"]*(?:contractor|license|search)[^"]*)"/i);
      if (searchMatch) {
        console.log(`   📡 Found contractor search link: ${searchMatch[1]}`);
      } else {
        console.log(`   ⚠️  No contractor search found on page`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Error: ${error}`);
  }

  // ======== SOURCE 4: Suffolk County ========
  console.log('');
  console.log('📥 Source 4: Suffolk County Consumer Affairs...');

  try {
    const suffolkUrl = 'https://www.suffolkcountyny.gov/Departments/Consumer-Affairs';

    const response = await fetch(suffolkUrl, {
      headers: {
        'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
        'Accept': 'text/html',
      },
    });

    if (response.ok) {
      const html = await response.text();
      console.log(`   ✅ Connected to Suffolk County (${html.length} bytes)`);

      const searchMatch = html.match(/href="([^"]*(?:contractor|license|search|home.improvement)[^"]*)"/i);
      if (searchMatch) {
        console.log(`   📡 Found contractor link: ${searchMatch[1]}`);
      } else {
        console.log(`   ⚠️  No contractor search found on page`);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Error: ${error}`);
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);
    console.log('   Sources: NYC DOB, Westchester, Nassau, Suffolk');

    // Deduplicate by license number
    const seen = new Set<string>();
    const deduped = allContractors.filter(c => {
      const key = `${c.licenseNumber}-${c.sourceRegion}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    console.log(`   📊 After dedup: ${deduped.length} unique contractors`);

    // Normalize to standard contractor shape
    const normalized = deduped
      .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
      .map((c, i) => {
        const typeInfo = parseLicenseType(c.licenseType);
        return {
          id: `ny-${String(i + 1).padStart(3, '0')}`,
          licenseNumber: c.licenseNumber,
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
          state: 'NY' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || c.sourceRegion || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'NY_COUNTY' as const,
          sourceUrl: c.sourceRegion === 'NYC'
            ? `https://a810-bisweb.nyc.gov/bisweb/LicenseQueryServlet?licno=${encodeURIComponent(c.licenseNumber)}`
            : `https://a810-bisweb.nyc.gov/`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'newyork-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   ⚠️  New York is the HARDEST state for contractor data.');
  console.log('   There is NO single statewide database. Data is fragmented across');
  console.log('   62 counties and hundreds of municipalities.');
  console.log('');
  console.log('   NYC (Primary Source - largest dataset):');
  console.log('   → DOB BIS: https://a810-bisweb.nyc.gov/bisweb/bispi00.jsp');
  console.log('   → NYC Open Data: https://opendata.cityofnewyork.us/');
  console.log('     Search: "DOB Licensed" or "Home Improvement Contractor"');
  console.log('   → NYC HIC License: https://www1.nyc.gov/site/dca/businesses/home-improvement.page');
  console.log('   → NYC DCA License Search: https://www.nyc.gov/site/dca/businesses/license-verification.page');
  console.log('');
  console.log('   Westchester County:');
  console.log('   → https://consumer.westchestergov.com/home-improvement-contractor-search');
  console.log('   → Phone: (914) 995-2155');
  console.log('');
  console.log('   Nassau County:');
  console.log('   → https://www.nassaucountyny.gov/1409/Consumer-Affairs');
  console.log('   → Phone: (516) 571-2600');
  console.log('');
  console.log('   Suffolk County:');
  console.log('   → https://www.suffolkcountyny.gov/Departments/Consumer-Affairs');
  console.log('   → Phone: (631) 853-4600');
  console.log('');
  console.log('   FOIL Request (for bulk data):');
  console.log('   → NYC DOB FOIL: https://a860-openrecords.nyc.gov/');
  console.log('   → Request: Active contractor license database');
  console.log('   → Under NY Freedom of Information Law (FOIL)');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/newyork-county.ts --file /path/to/downloaded.csv');
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

      const contractors: RawNYContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 4) {
          contractors.push({
            licenseNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            licenseType: fields[3] || 'HIC',
            sourceRegion: fields[4] || 'NYC',
            status: fields[5] || '',
            address: fields[6] || '',
            city: fields[7] || '',
            state: 'NY',
            zipCode: fields[8] || '',
            county: fields[9] || '',
            phone: fields[10] || '',
            issueDate: fields[11] || '',
            expirationDate: fields[12] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} contractors from local file`);

      // Normalize and save
      const normalized = contractors
        .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
        .map((c, i) => {
          const typeInfo = parseLicenseType(c.licenseType);
          return {
            id: `ny-${String(i + 1).padStart(3, '0')}`,
            licenseNumber: c.licenseNumber,
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
            state: 'NY' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || c.sourceRegion || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'NY_COUNTY' as const,
            sourceUrl: `https://a810-bisweb.nyc.gov/bisweb/LicenseQueryServlet?licno=${encodeURIComponent(c.licenseNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'newyork-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from NYC DOB/county sources and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeNewYork()
  .then((result) => {
    console.log(`\n✅ New York scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ New York scraper failed:', err);
    process.exit(1);
  });
