/**
 * Texas Department of Licensing and Regulation (TDLR) Contractor Scraper
 *
 * Data Source: Texas Department of Licensing and Regulation
 * URL: https://www.tdlr.texas.gov/verify.htm
 * License Verification: https://www.tdlr.texas.gov/LicenseSearch/
 *
 * This scraper downloads contractor license data from the Texas TDLR database.
 * Texas does NOT have a general contractor license at the state level.
 * TDLR licenses specific trades: Electricians, HVAC, Plumbing (via TSBPE).
 * License format varies: TECL12345 (electricians), TACLB12345 (HVAC), etc.
 *
 * Usage: npx tsx scripts/scrapers/texas-tdlr.ts
 *
 * Output: scripts/output/texas-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawTXContractor {
  licenseNumber: string;
  businessName: string;
  ownerName: string;
  licenseType: string;
  tradeCode: string;
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

const TX_LICENSE_TYPES: Record<string, { type: string; classification: string; prefix: string }> = {
  'TECL': { type: 'Master Electrician', classification: 'Electrical', prefix: 'TECL' },
  'TESL': { type: 'Journeyman Electrician', classification: 'Electrical', prefix: 'TESL' },
  'TECA': { type: 'Electrical Apprentice', classification: 'Electrical', prefix: 'TECA' },
  'TECE': { type: 'Electrical Contractor', classification: 'Electrical', prefix: 'TECE' },
  'TECF': { type: 'Electrical Sign Contractor', classification: 'Electrical', prefix: 'TECF' },
  'TACLB': { type: 'HVAC Contractor (Class B)', classification: 'HVAC/Mechanical', prefix: 'TACLB' },
  'TACLA': { type: 'HVAC Contractor (Class A)', classification: 'HVAC/Mechanical', prefix: 'TACLA' },
  'TACLT': { type: 'HVAC Technician', classification: 'HVAC/Mechanical', prefix: 'TACLT' },
  'TACLR': { type: 'HVAC Registered Technician', classification: 'HVAC/Mechanical', prefix: 'TACLR' },
  'TACLD': { type: 'HVAC Contractor (Class D - Environmental)', classification: 'HVAC/Mechanical', prefix: 'TACLD' },
};

function parseLicenseType(licenseNumber: string): { type: string; classification: string } {
  const upper = licenseNumber.toUpperCase().trim();
  for (const [prefix, info] of Object.entries(TX_LICENSE_TYPES)) {
    if (upper.startsWith(prefix)) {
      return { type: info.type, classification: info.classification };
    }
  }

  // Additional pattern matching for Texas license formats
  if (upper.startsWith('MP') || upper.startsWith('JP')) {
    return { type: 'Plumber', classification: 'Plumbing' };
  }
  if (upper.startsWith('RMP')) {
    return { type: 'Responsible Master Plumber', classification: 'Plumbing' };
  }

  return { type: 'Licensed Contractor', classification: 'General' };
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
  if (s.includes('active') || s.includes('current') || s.includes('clear') || s.includes('valid')) return 'active';
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed') || s.includes('delinquent')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender') || s.includes('void')) return 'inactive';
  return 'inactive';
}

async function scrapeTexas() {
  console.log('🤠 Texas TDLR Contractor Scraper');
  console.log('===================================');
  console.log('');
  console.log('ℹ️  Note: Texas does NOT have a statewide general contractor license.');
  console.log('   TDLR licenses specific trades: Electricians, HVAC/AC contractors.');
  console.log('   Plumbing is licensed separately by the Texas State Board of Plumbing Examiners (TSBPE).');
  console.log('');

  // Step 1: Attempt to connect to TDLR
  console.log('📥 Step 1: Connecting to Texas TDLR License Verification...');
  console.log('   Source: https://www.tdlr.texas.gov/LicenseSearch/');
  console.log('');

  const allContractors: RawTXContractor[] = [];

  // TDLR has a license search that can be queried by license type
  // The search page uses a form that posts to an ASP.NET backend
  const tradePrefixes = ['TECL', 'TESL', 'TECE', 'TACLB', 'TACLA', 'TACLT'];
  const majorCities = ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth', 'El Paso', 'Arlington'];

  for (const prefix of tradePrefixes) {
    const typeInfo = TX_LICENSE_TYPES[prefix] || { type: prefix, classification: 'General', prefix };
    console.log(`   🔍 Searching for ${typeInfo.type} (${prefix}) licenses...`);

    try {
      // TDLR license search endpoint
      const searchUrl = 'https://www.tdlr.texas.gov/LicenseSearch/SearchResultsJson';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'application/json, text/html',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          LicenseType: prefix,
          Status: 'Active',
          City: '',
          State: 'TX',
          PageSize: '100',
          PageNumber: '1',
        }).toString(),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await response.json() as any;
          const records = data.results || data.SearchResults || data.data || [];
          console.log(`      ✅ Found ${records.length} records (JSON)`);

          for (const item of records) {
            allContractors.push({
              licenseNumber: item.LicenseNumber || item.licenseNumber || item.License || '',
              businessName: item.BusinessName || item.CompanyName || item.Name || '',
              ownerName: item.OwnerName || item.Licensee || item.PersonName || '',
              licenseType: typeInfo.type,
              tradeCode: prefix,
              status: item.Status || item.LicenseStatus || 'Active',
              address: item.Address || item.Street || '',
              city: item.City || '',
              state: 'TX',
              zipCode: item.Zip || item.ZipCode || '',
              county: item.County || '',
              phone: item.Phone || item.Telephone || '',
              issueDate: item.IssueDate || item.DateIssued || '',
              expirationDate: item.ExpirationDate || item.DateExpires || '',
            });
          }
        } else {
          // HTML response
          const html = await response.text();
          console.log(`      ✅ Connected (${html.length} bytes HTML)`);

          const rows = parseHTMLTable(html);
          if (rows.length > 0) {
            console.log(`      📊 Found ${rows.length} table rows`);

            for (const row of rows) {
              if (row.length >= 4) {
                allContractors.push({
                  licenseNumber: row[0] || '',
                  businessName: row[1] || row[2] || '',
                  ownerName: row[2] || '',
                  licenseType: typeInfo.type,
                  tradeCode: prefix,
                  status: row[3] || 'Active',
                  address: row[4] || '',
                  city: row[5] || '',
                  state: 'TX',
                  zipCode: row[6] || '',
                  county: '',
                  phone: row[7] || '',
                  issueDate: '',
                  expirationDate: row[8] || '',
                });
              }
            }
          } else {
            console.log(`      ⚠️  No table data found in response`);
          }
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${prefix}: ${error}`);
    }
  }

  // Also try the TDLR OpenData portal (if available)
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying TDLR open data endpoints...');

    try {
      // Texas Open Data / TDLR data downloads
      const openDataUrl = 'https://www.tdlr.texas.gov/verify.htm';
      const response = await fetch(openDataUrl, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected to TDLR verify page (${html.length} bytes)`);

        // Look for links to data downloads or license search tools
        const searchLinks = html.match(/href="([^"]*(?:LicenseSearch|verify|search)[^"]*)"/gi) || [];
        if (searchLinks.length > 0) {
          console.log(`      📡 Found ${searchLinks.length} search-related links`);
        }
      }
    } catch (error) {
      console.log(`      ⚠️  Error: ${error}`);
    }
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);

    // Normalize to standard contractor shape
    const normalized = allContractors
      .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
      .map((c, i) => {
        const typeInfo = parseLicenseType(c.licenseNumber);
        return {
          id: `tx-${String(i + 1).padStart(3, '0')}`,
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
          state: 'TX' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'TX_TDLR' as const,
          sourceUrl: `https://www.tdlr.texas.gov/LicenseSearch/SearchResult?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'texas-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: TDLR License Verification');
  console.log('   → https://www.tdlr.texas.gov/LicenseSearch/');
  console.log('   → Search by license type (Electricians, ACR/HVAC)');
  console.log('   → Export search results');
  console.log('');
  console.log('   Option 2: Texas Open Data Portal');
  console.log('   → https://data.texas.gov/');
  console.log('   → Search "TDLR" or "contractor licenses"');
  console.log('   → Download CSV datasets');
  console.log('');
  console.log('   Option 3: TSBPE for Plumbing');
  console.log('   → https://www.tsbpe.texas.gov/');
  console.log('   → Texas State Board of Plumbing Examiners');
  console.log('   → Separate board from TDLR');
  console.log('');
  console.log('   Note: Texas has NO statewide general contractor license.');
  console.log('   Some cities (Houston, Austin, etc.) require local registration.');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/texas-tdlr.ts --file /path/to/downloaded.csv');
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

      const contractors: RawTXContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 4) {
          contractors.push({
            licenseNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            licenseType: fields[3] || '',
            tradeCode: fields[3] || '',
            status: fields[4] || '',
            address: fields[5] || '',
            city: fields[6] || '',
            state: 'TX',
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
        .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
        .map((c, i) => {
          const typeInfo = parseLicenseType(c.licenseNumber);
          return {
            id: `tx-${String(i + 1).padStart(3, '0')}`,
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
            state: 'TX' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'TX_TDLR' as const,
            sourceUrl: `https://www.tdlr.texas.gov/LicenseSearch/SearchResult?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'texas-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from TDLR and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeTexas()
  .then((result) => {
    console.log(`\n✅ Texas scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Texas scraper failed:', err);
    process.exit(1);
  });
