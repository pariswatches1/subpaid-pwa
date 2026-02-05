/**
 * North Carolina Licensing Board for General Contractors (NCLBGC) Scraper
 *
 * Data Source: North Carolina Licensing Board for General Contractors
 * URL: https://portal.nclbgc.org/public/search
 * Portal: https://portal.nclbgc.org/
 *
 * This scraper downloads contractor license data from the NC LBGC portal.
 * North Carolina licenses general contractors at the state level.
 * License format: 5-digit numbers (e.g., 72514)
 * Note: Electrical, plumbing, and HVAC are licensed by separate boards.
 *
 * Usage: npx tsx scripts/scrapers/northcarolina-nclbgc.ts
 *
 * Output: scripts/output/northcarolina-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawNCContractor {
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
  limitations: string;
}

const NC_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  'Unlimited': { type: 'General Contractor (Unlimited)', classification: 'General Building' },
  'Intermediate': { type: 'General Contractor (Intermediate)', classification: 'General Building' },
  'Limited': { type: 'General Contractor (Limited)', classification: 'General Building' },
  'Building': { type: 'Building Contractor', classification: 'Building' },
  'Residential': { type: 'Residential Contractor', classification: 'Residential' },
  'Unclassified': { type: 'Unclassified Contractor', classification: 'General' },
  'Highway': { type: 'Highway Contractor', classification: 'Highway/Infrastructure' },
  'Public Utilities': { type: 'Public Utilities Contractor', classification: 'Utilities' },
  'Specialty': { type: 'Specialty Contractor', classification: 'Specialty' },
};

function parseLicenseType(classification: string): { type: string; classification: string } {
  const code = classification.trim();
  for (const [key, info] of Object.entries(NC_LICENSE_TYPES)) {
    if (code.toLowerCase().includes(key.toLowerCase())) {
      return info;
    }
  }
  return { type: 'General Contractor', classification: 'General' };
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
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender')) return 'inactive';
  return 'inactive';
}

async function scrapeNorthCarolina() {
  console.log('🌲 North Carolina NCLBGC Contractor Scraper');
  console.log('=============================================');
  console.log('');

  // Step 1: Attempt to connect to NCLBGC Portal
  console.log('📥 Step 1: Connecting to NC Licensing Board for General Contractors...');
  console.log('   Source: https://portal.nclbgc.org/public/search');
  console.log('');

  const allContractors: RawNCContractor[] = [];

  // The NCLBGC portal provides a search API
  // The portal uses a modern web framework with API endpoints
  const licenseTypes = ['Unlimited', 'Limited', 'Building', 'Residential', 'Intermediate'];

  for (const licenseType of licenseTypes) {
    const typeInfo = NC_LICENSE_TYPES[licenseType] || { type: licenseType, classification: 'General' };
    console.log(`   🔍 Searching for ${typeInfo.type} contractors...`);

    try {
      // NCLBGC portal search API
      const searchUrl = 'https://portal.nclbgc.org/api/public/search';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          licenseType: licenseType,
          status: 'Active',
          page: 1,
          pageSize: 100,
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await response.json() as any;
          const records = data.results || data.data || data.records || [];
          console.log(`      ✅ Found ${records.length} records (JSON API)`);

          for (const item of records) {
            allContractors.push({
              licenseNumber: String(item.licenseNumber || item.license_number || item.number || ''),
              businessName: item.businessName || item.company_name || item.tradeName || '',
              ownerName: item.ownerName || item.licensee || item.name || '',
              licenseType: typeInfo.type,
              classification: licenseType,
              status: item.status || 'Active',
              address: item.address || item.street || '',
              city: item.city || '',
              state: 'NC',
              zipCode: item.zip || item.zipCode || '',
              county: item.county || '',
              phone: item.phone || item.telephone || '',
              issueDate: item.issueDate || item.dateIssued || '',
              expirationDate: item.expirationDate || item.dateExpires || '',
              limitations: item.limitations || item.classification || '',
            });
          }
        } else {
          // HTML response - parse the search results page
          const html = await response.text();
          console.log(`      ✅ Connected (${html.length} bytes HTML)`);

          const rows = parseHTMLTable(html);
          if (rows.length > 0) {
            console.log(`      📊 Found ${rows.length} table rows`);

            for (const row of rows) {
              if (row.length >= 4) {
                allContractors.push({
                  licenseNumber: row[0] || '',
                  businessName: row[1] || '',
                  ownerName: row[2] || '',
                  licenseType: typeInfo.type,
                  classification: licenseType,
                  status: row[3] || 'Active',
                  address: row[4] || '',
                  city: row[5] || '',
                  state: 'NC',
                  zipCode: row[6] || '',
                  county: row[7] || '',
                  phone: row[8] || '',
                  issueDate: '',
                  expirationDate: '',
                  limitations: '',
                });
              }
            }
          } else {
            console.log(`      ⚠️  No structured data found in response`);
          }
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${licenseType}: ${error}`);
    }
  }

  // Also try the main search page HTML scrape
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying direct portal page scrape...');

    try {
      const response = await fetch('https://portal.nclbgc.org/public/search', {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected to portal (${html.length} bytes)`);

        // Look for embedded data or API endpoint references
        const apiMatch = html.match(/api['":\s]+(\/[^'"]+search[^'"]*)/i);
        if (apiMatch) {
          console.log(`      📡 Found API endpoint reference: ${apiMatch[1]}`);
        }

        // Check for download links
        const downloadMatch = html.match(/href="([^"]*(?:download|export|csv|xlsx)[^"]*)"/i);
        if (downloadMatch) {
          console.log(`      📄 Found download link: ${downloadMatch[1]}`);
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
        const typeInfo = parseLicenseType(c.classification);
        return {
          id: `nc-${String(i + 1).padStart(3, '0')}`,
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
          state: 'NC' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'NC_NCLBGC' as const,
          sourceUrl: `https://portal.nclbgc.org/public/search?license=${c.licenseNumber}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'northcarolina-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: Search the NCLBGC Portal');
  console.log('   → https://portal.nclbgc.org/public/search');
  console.log('   → Search by license type, name, or location');
  console.log('   → Copy results or export to spreadsheet');
  console.log('');
  console.log('   Option 2: Public records request');
  console.log('   → Contact NCLBGC: (919) 571-4183');
  console.log('   → Email: information@nclbgc.org');
  console.log('   → Request: Active licensee database export');
  console.log('   → Available under NC Public Records Act (G.S. 132)');
  console.log('');
  console.log('   Option 3: Annual Report Data');
  console.log('   → https://www.nclbgc.org/about/annual-reports');
  console.log('   → Contains aggregate licensee statistics');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/northcarolina-nclbgc.ts --file /path/to/downloaded.csv');
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

      const contractors: RawNCContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 4) {
          contractors.push({
            licenseNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            licenseType: fields[3] || '',
            classification: fields[3] || '',
            status: fields[4] || '',
            address: fields[5] || '',
            city: fields[6] || '',
            state: 'NC',
            zipCode: fields[7] || '',
            county: fields[8] || '',
            phone: fields[9] || '',
            issueDate: fields[10] || '',
            expirationDate: fields[11] || '',
            limitations: fields[12] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} contractors from local file`);

      // Normalize and save
      const normalized = contractors
        .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
        .map((c, i) => {
          const typeInfo = parseLicenseType(c.classification);
          return {
            id: `nc-${String(i + 1).padStart(3, '0')}`,
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
            state: 'NC' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'NC_NCLBGC' as const,
            sourceUrl: `https://portal.nclbgc.org/public/search?license=${c.licenseNumber}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'northcarolina-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from NCLBGC and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeNorthCarolina()
  .then((result) => {
    console.log(`\n✅ North Carolina scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ North Carolina scraper failed:', err);
    process.exit(1);
  });
