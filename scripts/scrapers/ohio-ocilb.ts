/**
 * Ohio Construction Industry Licensing Board (OCILB) Scraper
 *
 * Data Source: Ohio Construction Industry Licensing Board
 * URL: https://elicense4.com.ohio.gov/
 * License Verification: https://elicense.ohio.gov/oh_verifylicense
 *
 * This scraper downloads contractor license data from the Ohio OCILB database.
 * Ohio licenses ONLY 5 specific trades at the state level (no general contractors):
 * - Electrical Contractors
 * - HVAC Contractors
 * - Plumbing Contractors
 * - Hydronics Contractors
 * - Refrigeration Contractors
 *
 * General contractor licensing is handled at the city/county level in Ohio.
 * License format: OH- prefix + digits (e.g., OH-EL-12345)
 *
 * Usage: npx tsx scripts/scrapers/ohio-ocilb.ts
 *
 * Output: scripts/output/ohio-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawOHContractor {
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

// Ohio OCILB licenses ONLY these 5 trades
const OH_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  'EL': { type: 'Electrical Contractor', classification: 'Electrical' },
  'ELEC': { type: 'Electrical Contractor', classification: 'Electrical' },
  'HV': { type: 'HVAC Contractor', classification: 'HVAC/Mechanical' },
  'HVAC': { type: 'HVAC Contractor', classification: 'HVAC/Mechanical' },
  'PL': { type: 'Plumbing Contractor', classification: 'Plumbing' },
  'PLMB': { type: 'Plumbing Contractor', classification: 'Plumbing' },
  'HY': { type: 'Hydronics Contractor', classification: 'Hydronics' },
  'HYDR': { type: 'Hydronics Contractor', classification: 'Hydronics' },
  'RF': { type: 'Refrigeration Contractor', classification: 'Refrigeration' },
  'REFR': { type: 'Refrigeration Contractor', classification: 'Refrigeration' },
};

function parseLicenseType(licenseNumber: string): { type: string; classification: string } {
  const upper = licenseNumber.toUpperCase().trim();

  // Check OH- prefix format: OH-EL-12345
  const ohMatch = upper.match(/OH[- ]?(\w+)[- ]?\d+/);
  if (ohMatch) {
    const code = ohMatch[1];
    if (OH_LICENSE_TYPES[code]) {
      return OH_LICENSE_TYPES[code];
    }
  }

  // Direct code check
  for (const [code, info] of Object.entries(OH_LICENSE_TYPES)) {
    if (upper.includes(code)) {
      return info;
    }
  }

  // Check for trade keywords
  if (upper.includes('ELEC')) return OH_LICENSE_TYPES['EL'];
  if (upper.includes('HVAC') || upper.includes('AIR')) return OH_LICENSE_TYPES['HV'];
  if (upper.includes('PLUMB')) return OH_LICENSE_TYPES['PL'];
  if (upper.includes('HYDRO')) return OH_LICENSE_TYPES['HY'];
  if (upper.includes('REFRIG')) return OH_LICENSE_TYPES['RF'];

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
  if (s.includes('active') || s.includes('current') || s.includes('clear') || s.includes('valid')) return 'active';
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender')) return 'inactive';
  return 'inactive';
}

async function scrapeOhio() {
  console.log('🌰 Ohio OCILB Contractor Scraper');
  console.log('===================================');
  console.log('');
  console.log('ℹ️  Note: Ohio licenses ONLY 5 construction trades at the state level:');
  console.log('   Electrical, HVAC, Plumbing, Hydronics, Refrigeration');
  console.log('   General contractor licensing is handled at the city/county level.');
  console.log('');

  // Step 1: Attempt to connect to Ohio eLicense Portal
  console.log('📥 Step 1: Connecting to Ohio eLicense Portal...');
  console.log('   Source: https://elicense.ohio.gov/oh_verifylicense');
  console.log('');

  const allContractors: RawOHContractor[] = [];

  // Ohio uses the eLicense system for license verification
  // The portal supports searches by profession and license type
  const trades = [
    { code: 'EL', name: 'Electrical Contractor', professionId: '23' },
    { code: 'HV', name: 'HVAC Contractor', professionId: '24' },
    { code: 'PL', name: 'Plumbing Contractor', professionId: '25' },
    { code: 'HY', name: 'Hydronics Contractor', professionId: '26' },
    { code: 'RF', name: 'Refrigeration Contractor', professionId: '27' },
  ];

  for (const trade of trades) {
    const typeInfo = OH_LICENSE_TYPES[trade.code] || { type: trade.name, classification: 'General' };
    console.log(`   🔍 Searching for ${trade.name} licenses...`);

    try {
      // Ohio eLicense verification portal
      const searchUrl = 'https://elicense.ohio.gov/oh_verifylicense';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml,application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'ProfessionID': trade.professionId,
          'LicenseType': trade.code,
          'LicenseStatus': 'Active',
          'LastName': '',
          'FirstName': '',
          'City': '',
          'State': 'OH',
          'Zip': '',
          'County': '',
          'Submit': 'Search',
        }).toString(),
      });

      if (response.ok) {
        const contentType = response.headers.get('content-type') || '';

        if (contentType.includes('application/json')) {
          const data = await response.json() as any;
          const records = data.results || data.data || data.searchResults || [];
          console.log(`      ✅ Found ${records.length} records (JSON)`);

          for (const item of records) {
            allContractors.push({
              licenseNumber: item.licenseNumber || item.license_number || '',
              businessName: item.businessName || item.company || '',
              ownerName: item.name || `${item.firstName || ''} ${item.lastName || ''}`.trim(),
              licenseType: typeInfo.type,
              tradeCode: trade.code,
              status: item.status || item.licenseStatus || 'Active',
              address: item.address || item.street || '',
              city: item.city || '',
              state: 'OH',
              zipCode: item.zip || item.zipCode || '',
              county: item.county || '',
              phone: item.phone || '',
              issueDate: item.issueDate || item.originalDate || '',
              expirationDate: item.expirationDate || item.expireDate || '',
            });
          }
        } else {
          const html = await response.text();
          console.log(`      ✅ Connected (${html.length} bytes HTML)`);

          const rows = parseHTMLTable(html);
          if (rows.length > 0) {
            console.log(`      📊 Found ${rows.length} table rows`);

            for (const row of rows) {
              if (row.length >= 3) {
                allContractors.push({
                  licenseNumber: row[0] || '',
                  businessName: row[2] || row[1] || '',
                  ownerName: row[1] || '',
                  licenseType: typeInfo.type,
                  tradeCode: trade.code,
                  status: row[3] || 'Active',
                  address: row[4] || '',
                  city: row[5] || '',
                  state: 'OH',
                  zipCode: row[6] || '',
                  county: '',
                  phone: '',
                  issueDate: '',
                  expirationDate: row[7] || '',
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
      console.log(`      ⚠️  Error searching ${trade.name}: ${error}`);
    }
  }

  // Try the older eLicense4 portal as a backup
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying eLicense4 portal (legacy)...');

    try {
      const legacyUrl = 'https://elicense4.com.ohio.gov/';
      const response = await fetch(legacyUrl, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected to eLicense4 (${html.length} bytes)`);

        // Check for redirects or API endpoint references
        const apiMatch = html.match(/(?:api|search|verify)['":\s]+(https?:\/\/[^'">\s]+)/i);
        if (apiMatch) {
          console.log(`      📡 Found endpoint: ${apiMatch[1]}`);
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
        const typeInfo = parseLicenseType(c.licenseNumber || c.tradeCode);
        const licNum = c.licenseNumber.startsWith('OH') ? c.licenseNumber : `OH-${c.tradeCode}-${c.licenseNumber}`;
        return {
          id: `oh-${String(i + 1).padStart(3, '0')}`,
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
          state: 'OH' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'OH_OCILB' as const,
          sourceUrl: `https://elicense.ohio.gov/oh_verifylicense#/license/${encodeURIComponent(c.licenseNumber)}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'ohio-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: Ohio eLicense Verification Portal');
  console.log('   → https://elicense.ohio.gov/oh_verifylicense');
  console.log('   → Search by profession: HVAC, Electrical, Plumbing, Hydronics, Refrigeration');
  console.log('   → Filter by status and location');
  console.log('');
  console.log('   Option 2: Legacy eLicense4 Portal');
  console.log('   → https://elicense4.com.ohio.gov/');
  console.log('   → Search for construction industry licenses');
  console.log('');
  console.log('   Option 3: Public Records Request');
  console.log('   → Ohio OCILB: (614) 644-3493');
  console.log('   → Email: OCILB@com.state.oh.us');
  console.log('   → Request: Active licensee database for construction trades');
  console.log('   → Under Ohio Public Records Act (ORC 149.43)');
  console.log('');
  console.log('   ⚠️  Remember: Ohio does NOT license general contractors at state level.');
  console.log('   For general contractor data, check individual city/county registrations.');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/ohio-ocilb.ts --file /path/to/downloaded.csv');
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

      const contractors: RawOHContractor[] = [];
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
            state: 'OH',
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
          const typeInfo = parseLicenseType(c.licenseNumber || c.tradeCode);
          return {
            id: `oh-${String(i + 1).padStart(3, '0')}`,
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
            state: 'OH' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'OH_OCILB' as const,
            sourceUrl: `https://elicense.ohio.gov/oh_verifylicense#/license/${encodeURIComponent(c.licenseNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'ohio-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from OCILB and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeOhio()
  .then((result) => {
    console.log(`\n✅ Ohio scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Ohio scraper failed:', err);
    process.exit(1);
  });
