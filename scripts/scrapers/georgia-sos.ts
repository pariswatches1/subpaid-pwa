/**
 * Georgia Secretary of State - Contractor Licensing Board Scraper
 *
 * Data Source: Georgia Secretary of State - Division of Licensing
 * URL: https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors
 * License Verification: https://verify.sos.ga.gov/verification/
 *
 * This scraper downloads contractor license data from the Georgia SOS database.
 * Georgia licenses residential and commercial general contractors through the
 * State Licensing Board for Residential and General Contractors.
 * License format: GA- prefix + digits (e.g., GA-RES-12345, GA-COM-67890)
 *
 * Usage: npx tsx scripts/scrapers/georgia-sos.ts
 *
 * Output: scripts/output/georgia-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawGAContractor {
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

const GA_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  'RES': { type: 'Residential General Contractor', classification: 'Residential' },
  'RBC': { type: 'Residential Basic Contractor', classification: 'Residential' },
  'COM': { type: 'Commercial General Contractor', classification: 'General Commercial' },
  'RLC': { type: 'Residential-Light Commercial Contractor', classification: 'Residential/Light Commercial' },
  'GC': { type: 'General Contractor', classification: 'General Building' },
  'CON': { type: 'Conditioned Air Contractor', classification: 'HVAC/Mechanical' },
  'ELC': { type: 'Electrical Contractor', classification: 'Electrical' },
  'PLB': { type: 'Plumbing Contractor', classification: 'Plumbing' },
  'LPG': { type: 'LP Gas Contractor', classification: 'Gas/Fuel' },
  'UTIL': { type: 'Utility Contractor', classification: 'Utilities' },
};

function parseLicenseType(licenseNumber: string): { type: string; classification: string } {
  const upper = licenseNumber.toUpperCase().trim();

  // Check GA- prefix format: GA-RES-12345, GA-COM-67890
  const gaMatch = upper.match(/GA[- ]?(\w+)[- ]?\d+/);
  if (gaMatch) {
    const code = gaMatch[1];
    if (GA_LICENSE_TYPES[code]) {
      return GA_LICENSE_TYPES[code];
    }
  }

  // Direct code check
  for (const [code, info] of Object.entries(GA_LICENSE_TYPES)) {
    if (upper.includes(code)) {
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
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin') || s.includes('probation')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender') || s.includes('voluntary')) return 'inactive';
  return 'inactive';
}

async function scrapeGeorgia() {
  console.log('🍑 Georgia SOS Contractor Scraper');
  console.log('===================================');
  console.log('');

  // Step 1: Attempt to connect to Georgia SOS License Verification
  console.log('📥 Step 1: Connecting to Georgia Secretary of State License Verification...');
  console.log('   Source: https://verify.sos.ga.gov/verification/');
  console.log('   Board: State Licensing Board for Residential and General Contractors');
  console.log('');

  const allContractors: RawGAContractor[] = [];

  // Georgia SOS uses a verification portal at verify.sos.ga.gov
  // The portal supports search by license type, name, and license number
  const licenseTypes = ['RES', 'COM', 'RLC', 'RBC'];
  const professionId = '2501'; // Construction Industry board ID on GA SOS portal

  for (const licType of licenseTypes) {
    const typeInfo = GA_LICENSE_TYPES[licType] || { type: licType, classification: 'General' };
    console.log(`   🔍 Searching for ${typeInfo.type} licenses...`);

    try {
      // GA SOS verification search endpoint
      const searchUrl = 'https://verify.sos.ga.gov/verification/Search.aspx';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          't_web_lookup__profession_name': 'Contractor',
          't_web_lookup__license_type_name': typeInfo.type,
          't_web_lookup__first_name': '',
          't_web_lookup__last_name': '',
          't_web_lookup__license_no': '',
          't_web_lookup__addr_city': '',
          't_web_lookup__addr_state': 'GA',
          't_web_lookup__addr_zipcode': '',
          'sch_button': 'Search',
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
            if (row.length >= 4) {
              allContractors.push({
                licenseNumber: row[0] || '',
                businessName: row[2] || row[1] || '',
                ownerName: row[1] || '',
                licenseType: typeInfo.type,
                classification: licType,
                status: row[3] || 'Active',
                address: row[4] || '',
                city: row[5] || '',
                state: 'GA',
                zipCode: row[6] || '',
                county: row[7] || '',
                phone: '',
                issueDate: row[8] || '',
                expirationDate: row[9] || '',
              });
            }
          }
        } else {
          console.log(`      ⚠️  No table data found - portal may require JavaScript`);
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${licType}: ${error}`);
    }
  }

  // Also try the board-specific page
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying board information page...');

    try {
      const boardUrl = 'https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors';
      const response = await fetch(boardUrl, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected to board page (${html.length} bytes)`);

        // Look for verification portal links
        const verifyMatch = html.match(/href="([^"]*verify[^"]*)"/i);
        if (verifyMatch) {
          console.log(`      📡 Found verification link: ${verifyMatch[1]}`);
        }

        // Look for downloadable data links
        const downloadMatch = html.match(/href="([^"]*(?:download|export|data|csv|excel)[^"]*)"/i);
        if (downloadMatch) {
          console.log(`      📄 Found data download link: ${downloadMatch[1]}`);
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
        const typeInfo = parseLicenseType(c.licenseNumber || c.classification);
        const licNum = c.licenseNumber.startsWith('GA') ? c.licenseNumber : `GA-${c.classification}-${c.licenseNumber}`;
        return {
          id: `ga-${String(i + 1).padStart(3, '0')}`,
          licenseNumber: licNum,
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
          state: 'GA' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'GA_SOS' as const,
          sourceUrl: `https://verify.sos.ga.gov/verification/Details.aspx?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'georgia-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: Georgia SOS License Verification Portal');
  console.log('   → https://verify.sos.ga.gov/verification/');
  console.log('   → Select Profession: "Contractor"');
  console.log('   → Select License Type (Residential, Commercial, etc.)');
  console.log('   → Search by city/state to get manageable result sets');
  console.log('');
  console.log('   Option 2: Open Records Request');
  console.log('   → Georgia Secretary of State');
  console.log('   → Phone: (478) 207-2440');
  console.log('   → Email: soscontact@sos.ga.gov');
  console.log('   → Request: Active contractor license database');
  console.log('   → Under Georgia Open Records Act (O.C.G.A. 50-18-70)');
  console.log('');
  console.log('   Option 3: Board Contact');
  console.log('   → Residential & General Contractors Board: (478) 207-2440');
  console.log('   → https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/georgia-sos.ts --file /path/to/downloaded.csv');
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

      const contractors: RawGAContractor[] = [];
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
            state: 'GA',
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
          const typeInfo = parseLicenseType(c.licenseNumber || c.classification);
          return {
            id: `ga-${String(i + 1).padStart(3, '0')}`,
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
            state: 'GA' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'GA_SOS' as const,
            sourceUrl: `https://verify.sos.ga.gov/verification/Details.aspx?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'georgia-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from GA SOS and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeGeorgia()
  .then((result) => {
    console.log(`\n✅ Georgia scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Georgia scraper failed:', err);
    process.exit(1);
  });
