/**
 * Illinois Department of Financial and Professional Regulation (IDFPR) Scraper
 *
 * Data Source: Illinois Department of Financial and Professional Regulation
 * URL: https://idfpr.illinois.gov/checklicense.html
 * License Lookup: https://online-dfpr.micropact.com/lookup/licenselookup.aspx
 *
 * This scraper downloads contractor license data from the Illinois IDFPR database.
 * Illinois regulates 100+ professions through IDFPR. This scraper filters to
 * construction-related trades only.
 *
 * Relevant construction trades licensed by IDFPR:
 * - Roofing Contractor / Roofing Limited
 * - Plumbing Contractor / Plumbing Limited
 * - Electrical Contractor (some municipalities)
 *
 * License format: varies (e.g., 104.012345 for roofing)
 * Note: Illinois does NOT license general contractors at the state level.
 *
 * Usage: npx tsx scripts/scrapers/illinois-idfpr.ts
 *
 * Output: scripts/output/illinois-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawILContractor {
  licenseNumber: string;
  businessName: string;
  ownerName: string;
  licenseType: string;
  professionCode: string;
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

// Illinois IDFPR license types relevant to construction
// IDFPR regulates 100+ professions; we filter to construction trades only
const IL_LICENSE_TYPES: Record<string, { type: string; classification: string; profCode: string }> = {
  '104': { type: 'Roofing Contractor', classification: 'Roofing', profCode: '104' },
  '104L': { type: 'Roofing Contractor (Limited)', classification: 'Roofing', profCode: '104' },
  '105': { type: 'Roofing Qualifying Party', classification: 'Roofing', profCode: '105' },
  '055': { type: 'Plumbing Contractor', classification: 'Plumbing', profCode: '055' },
  '055L': { type: 'Plumbing Contractor (Limited)', classification: 'Plumbing', profCode: '055' },
  '056': { type: 'Plumber (Licensed)', classification: 'Plumbing', profCode: '056' },
  '057': { type: 'Plumber Apprentice', classification: 'Plumbing', profCode: '057' },
  '014': { type: 'Electrical Contractor', classification: 'Electrical', profCode: '014' },
  'EL': { type: 'Electrician', classification: 'Electrical', profCode: '014' },
  '048': { type: 'Structural Engineer', classification: 'Engineering', profCode: '048' },
  '001': { type: 'Architect', classification: 'Architecture', profCode: '001' },
  '066': { type: 'Land Surveyor', classification: 'Surveying', profCode: '066' },
  '090': { type: 'Home Inspector', classification: 'Home Inspection', profCode: '090' },
  'LEAD': { type: 'Lead Contractor', classification: 'Environmental', profCode: 'LEAD' },
  'ASBE': { type: 'Asbestos Contractor', classification: 'Environmental', profCode: 'ASBE' },
};

// Construction-related profession codes for IDFPR filtering
const CONSTRUCTION_PROF_CODES = ['104', '105', '055', '056', '057', '014', '090'];

function parseLicenseType(licenseNumber: string, profCode?: string): { type: string; classification: string } {
  // Check profession code first
  if (profCode) {
    const codeInfo = IL_LICENSE_TYPES[profCode];
    if (codeInfo) return { type: codeInfo.type, classification: codeInfo.classification };
  }

  // Parse from license number format (e.g., 104.012345)
  const dotMatch = licenseNumber.match(/^(\d{3})\./);
  if (dotMatch) {
    const prefix = dotMatch[1];
    const info = IL_LICENSE_TYPES[prefix];
    if (info) return { type: info.type, classification: info.classification };
  }

  // Check all prefixes
  for (const [code, info] of Object.entries(IL_LICENSE_TYPES)) {
    if (licenseNumber.startsWith(code)) {
      return { type: info.type, classification: info.classification };
    }
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
  if (s.includes('active') || s.includes('current') || s.includes('clear') || s.includes('valid') || s.includes('not expired')) return 'active';
  if (s.includes('suspend') || s.includes('revok') || s.includes('disciplin') || s.includes('refused')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled') || s.includes('lapsed') || s.includes('not renewed')) return 'expired';
  if (s.includes('inactive') || s.includes('retired') || s.includes('surrender') || s.includes('voluntary')) return 'inactive';
  return 'inactive';
}

async function scrapeIllinois() {
  console.log('🏙️  Illinois IDFPR Contractor Scraper');
  console.log('=======================================');
  console.log('');
  console.log('ℹ️  Note: IDFPR regulates 100+ professions. This scraper filters to');
  console.log('   construction trades only: Roofing, Plumbing, Electrical, Home Inspection.');
  console.log('   Illinois does NOT license general contractors at the state level.');
  console.log('');

  // Step 1: Attempt to connect to IDFPR License Lookup
  console.log('📥 Step 1: Connecting to IDFPR License Lookup...');
  console.log('   Source: https://online-dfpr.micropact.com/lookup/licenselookup.aspx');
  console.log('');

  const allContractors: RawILContractor[] = [];

  // IDFPR uses a MicroPact-based license lookup system
  // We search for each construction-related profession code
  const constructionTrades = [
    { code: '104', name: 'Roofing Contractor', profName: 'Roofing Contractor' },
    { code: '105', name: 'Roofing Qualifying Party', profName: 'Roofing Qualifying Party' },
    { code: '055', name: 'Plumbing Contractor', profName: 'Plumber' },
    { code: '014', name: 'Electrical Contractor', profName: 'Electrician' },
    { code: '090', name: 'Home Inspector', profName: 'Home Inspector' },
  ];

  for (const trade of constructionTrades) {
    const typeInfo = IL_LICENSE_TYPES[trade.code] || { type: trade.name, classification: 'General', profCode: trade.code };
    console.log(`   🔍 Searching for ${trade.name} licenses (Prof Code: ${trade.code})...`);

    try {
      // IDFPR MicroPact license lookup API
      const searchUrl = 'https://online-dfpr.micropact.com/lookup/licenselookup.aspx';

      const response = await fetch(searchUrl, {
        method: 'POST',
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'Ession': '',
          'Ession_Board': trade.profName,
          'Ession_LicenseType': '',
          'Ession_LastName': '',
          'Session_FirstName': '',
          'Sesion_City': '',
          'Session_County': '',
          'Session_State': 'IL',
          'Session_Zip': '',
          'Session_Status': 'Active',
          'Submit': 'Search',
        }).toString(),
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected (${html.length} bytes)`);

        // Parse the results table
        const rows = parseHTMLTable(html);
        if (rows.length > 0) {
          console.log(`      📊 Found ${rows.length} result rows`);

          for (const row of rows) {
            if (row.length >= 3) {
              allContractors.push({
                licenseNumber: row[0] || '',
                businessName: row[2] || row[1] || '',
                ownerName: row[1] || '',
                licenseType: typeInfo.type,
                professionCode: trade.code,
                status: row[3] || 'Active',
                address: row[4] || '',
                city: row[5] || '',
                state: 'IL',
                zipCode: row[6] || '',
                county: '',
                phone: '',
                issueDate: '',
                expirationDate: row[7] || '',
              });
            }
          }
        } else {
          console.log(`      ⚠️  No table data found - site may use JavaScript rendering`);
        }
      } else {
        console.log(`      ⚠️  HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.log(`      ⚠️  Error searching ${trade.name}: ${error}`);
    }
  }

  // Also try the main IDFPR check license page
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying main IDFPR license check page...');

    try {
      const mainUrl = 'https://idfpr.illinois.gov/checklicense.html';
      const response = await fetch(mainUrl, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected to IDFPR main page (${html.length} bytes)`);

        // Look for the actual search portal link
        const portalMatch = html.match(/href="([^"]*(?:lookup|search|verify)[^"]*)"/i);
        if (portalMatch) {
          console.log(`      📡 Found lookup portal: ${portalMatch[1]}`);
        }

        // Look for data download options
        const downloadMatch = html.match(/href="([^"]*(?:download|data|export|csv)[^"]*)"/i);
        if (downloadMatch) {
          console.log(`      📄 Found data link: ${downloadMatch[1]}`);
        }
      }
    } catch (error) {
      console.log(`      ⚠️  Error: ${error}`);
    }
  }

  // Try the IDFPR data portal / open data
  if (allContractors.length === 0) {
    console.log('');
    console.log('   🔍 Trying Illinois open data portal...');

    try {
      // Illinois has open data at data.illinois.gov
      const openDataUrl = 'https://data.illinois.gov/api/3/action/package_search?q=IDFPR+contractor+license';

      const response = await fetch(openDataUrl, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json() as any;
        const results = data.result?.results || [];
        console.log(`      ✅ Found ${results.length} datasets on Illinois Open Data`);

        for (const dataset of results) {
          console.log(`      📦 Dataset: ${dataset.title || dataset.name}`);
          // Look for CSV resources
          const resources = dataset.resources || [];
          for (const resource of resources) {
            if (resource.format?.toLowerCase() === 'csv') {
              console.log(`         📄 CSV available: ${resource.url}`);
            }
          }
        }
      }
    } catch (error) {
      console.log(`      ⚠️  Error: ${error}`);
    }
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);
    console.log(`   (Filtered to construction trades only from IDFPR's 100+ professions)`);

    // Normalize to standard contractor shape
    const normalized = allContractors
      .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
      .map((c, i) => {
        const typeInfo = parseLicenseType(c.licenseNumber, c.professionCode);
        return {
          id: `il-${String(i + 1).padStart(3, '0')}`,
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
          state: 'IL' as const,
          zipCode: c.zipCode.substring(0, 5),
          county: c.county || undefined,
          issueDate: c.issueDate || '2020-01-01',
          expirationDate: c.expirationDate || '2026-12-31',
          lastUpdated: new Date().toISOString().split('T')[0],
          claimed: false,
          dataSource: 'IL_IDFPR' as const,
          sourceUrl: `https://online-dfpr.micropact.com/lookup/licenselookup.aspx?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
          verified: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      });

    // Save to output
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'illinois-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1: IDFPR License Lookup');
  console.log('   → https://online-dfpr.micropact.com/lookup/licenselookup.aspx');
  console.log('   → Select Board: "Roofing Contractor" / "Plumber" / etc.');
  console.log('   → Search by city/county for manageable result sets');
  console.log('');
  console.log('   Option 2: IDFPR Check License Page');
  console.log('   → https://idfpr.illinois.gov/checklicense.html');
  console.log('   → Select profession and search');
  console.log('');
  console.log('   Option 3: Illinois Open Data Portal');
  console.log('   → https://data.illinois.gov/');
  console.log('   → Search "IDFPR" or "contractor license"');
  console.log('   → Download available CSV datasets');
  console.log('');
  console.log('   Option 4: FOIA Request');
  console.log('   → IDFPR FOIA Officer: (217) 785-0800');
  console.log('   → Email: FPR.FOIA@illinois.gov');
  console.log('   → Request: Active licensee data for construction trades');
  console.log('   → Profession codes: 104 (Roofing), 055 (Plumbing), 014 (Electrical)');
  console.log('   → Under Illinois FOIA (5 ILCS 140)');
  console.log('');
  console.log('   ⚠️  Important: IDFPR manages 100+ professions.');
  console.log('   Construction-relevant codes: 104, 105, 055, 056, 014, 090');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/illinois-idfpr.ts --file /path/to/downloaded.csv');
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

      const contractors: RawILContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 4) {
          // Filter to construction trades only
          const profCode = fields[3] || '';
          if (!CONSTRUCTION_PROF_CODES.some(code => profCode.includes(code))) {
            continue; // Skip non-construction professions
          }

          contractors.push({
            licenseNumber: fields[0] || '',
            businessName: fields[1] || '',
            ownerName: fields[2] || '',
            licenseType: fields[3] || '',
            professionCode: profCode,
            status: fields[4] || '',
            address: fields[5] || '',
            city: fields[6] || '',
            state: 'IL',
            zipCode: fields[7] || '',
            county: fields[8] || '',
            phone: fields[9] || '',
            issueDate: fields[10] || '',
            expirationDate: fields[11] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} construction contractors from local file`);
      console.log(`   (Filtered to construction trades only)`);

      // Normalize and save
      const normalized = contractors
        .filter(c => c.licenseNumber && (c.businessName || c.ownerName))
        .map((c, i) => {
          const typeInfo = parseLicenseType(c.licenseNumber, c.professionCode);
          return {
            id: `il-${String(i + 1).padStart(3, '0')}`,
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
            state: 'IL' as const,
            zipCode: c.zipCode.substring(0, 5),
            county: c.county || undefined,
            issueDate: c.issueDate || '2020-01-01',
            expirationDate: c.expirationDate || '2026-12-31',
            lastUpdated: new Date().toISOString().split('T')[0],
            claimed: false,
            dataSource: 'IL_IDFPR' as const,
            sourceUrl: `https://online-dfpr.micropact.com/lookup/licenselookup.aspx?LicenseNumber=${encodeURIComponent(c.licenseNumber)}`,
            verified: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        });

      const outputDir = path.join(__dirname, '..', 'output');
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, 'illinois-contractors.json');
      fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
      console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

      return normalized;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from IDFPR and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeIllinois()
  .then((result) => {
    console.log(`\n✅ Illinois scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Illinois scraper failed:', err);
    process.exit(1);
  });
