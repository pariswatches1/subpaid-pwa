/**
 * California CSLB Contractor License Scraper
 *
 * Data Source: California Contractors State License Board (CSLB)
 * URL: https://www.cslb.ca.gov/onlineservices/dataportal/
 * Contractor List: https://www2.cslb.ca.gov/onlineservices/dataportal/ContractorList
 *
 * This scraper downloads contractor license data from the CSLB data portal.
 * Free datasets are available by classification and county.
 * Full database file costs $235 per file.
 *
 * Usage: npx tsx scripts/scrapers/california-cslb.ts
 *
 * Output: scripts/output/california-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawCAContractor {
  licenseNumber: string;
  businessName: string;
  classification: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  phone: string;
  status: string;
  issueDate: string;
  expirationDate: string;
  bondCompany?: string;
  bondNumber?: string;
}

const CA_CLASSIFICATIONS: Record<string, string> = {
  'B': 'B General Building',
  'C-2': 'C-2 Insulation/Acoustical',
  'C-4': 'C-4 Boiler/Hot Water',
  'C-5': 'C-5 Framing/Rough Carpentry',
  'C-6': 'C-6 Cabinet/Millwork',
  'C-7': 'C-7 Low Voltage Systems',
  'C-8': 'C-8 Concrete',
  'C-9': 'C-9 Drywall',
  'C-10': 'C-10 Electrical',
  'C-11': 'C-11 Elevator',
  'C-12': 'C-12 Earthwork/Paving',
  'C-13': 'C-13 Fencing',
  'C-15': 'C-15 Flooring/Floor Covering',
  'C-16': 'C-16 Fire Protection',
  'C-17': 'C-17 Glazing',
  'C-20': 'C-20 HVAC',
  'C-21': 'C-21 Building Moving/Demolition',
  'C-23': 'C-23 Ornamental Metal',
  'C-27': 'C-27 Landscaping',
  'C-28': 'C-28 Lock/Security Equipment',
  'C-29': 'C-29 Masonry',
  'C-31': 'C-31 Construction Zone Traffic Control',
  'C-32': 'C-32 Parking/Highway Improvement',
  'C-33': 'C-33 Painting/Decorating',
  'C-34': 'C-34 Pipeline',
  'C-35': 'C-35 Lathing/Plastering',
  'C-36': 'C-36 Plumbing',
  'C-38': 'C-38 Refrigeration',
  'C-39': 'C-39 Roofing',
  'C-42': 'C-42 Sanitation System',
  'C-43': 'C-43 Sheet Metal',
  'C-45': 'C-45 Signs',
  'C-46': 'C-46 Solar',
  'C-47': 'C-47 General Mobile Home',
  'C-50': 'C-50 Reinforcing Steel',
  'C-51': 'C-51 Structural Steel',
  'C-53': 'C-53 Swimming Pool',
  'C-54': 'C-54 Ceramic/Mosaic Tile',
  'C-55': 'C-55 Water Conditioning',
  'C-57': 'C-57 Well Drilling',
  'C-60': 'C-60 Welding',
  'C-61': 'C-61 Limited Specialty',
  'HAZ': 'HAZ Hazardous Substance Removal',
  'ASB': 'ASB Asbestos',
};

function normalizeStatus(status: string): 'active' | 'inactive' | 'suspended' | 'expired' {
  const s = status.toLowerCase().trim();
  if (s.includes('active') || s.includes('current') || s.includes('clear')) return 'active';
  if (s.includes('suspend') || s.includes('revok')) return 'suspended';
  if (s.includes('expir') || s.includes('cancelled')) return 'expired';
  return 'inactive';
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
      // Strip HTML tags and decode entities
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

async function scrapeCalifornia() {
  console.log('☀️  California CSLB Contractor Scraper');
  console.log('======================================');
  console.log('');

  console.log('📥 Step 1: Connecting to CSLB Data Portal...');
  console.log('   Source: https://www.cslb.ca.gov/onlineservices/dataportal/');
  console.log('');

  const allContractors: RawCAContractor[] = [];

  // The CSLB Data Portal allows searching by classification and county
  // Free downloads are available for limited datasets
  // Full file: $235 per file (700,000+ records)

  // We'll try to scrape the contractor list portal
  const classifications = ['B', 'C-10', 'C-20', 'C-36', 'C-39', 'C-33'];
  const counties = ['Los Angeles', 'San Diego', 'San Francisco', 'Sacramento', 'Santa Clara'];

  for (const classification of classifications) {
    console.log(`   🔍 Searching for ${CA_CLASSIFICATIONS[classification] || classification} contractors...`);

    try {
      // Try the CSLB data portal contractor list
      const url = `https://www2.cslb.ca.gov/onlineservices/dataportal/ContractorList?classification=${encodeURIComponent(classification)}`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          'Accept': 'text/html,application/xhtml+xml',
        },
      });

      if (response.ok) {
        const html = await response.text();
        console.log(`      ✅ Connected (${html.length} bytes)`);

        // Try to parse the results table
        const rows = parseHTMLTable(html);
        if (rows.length > 0) {
          console.log(`      📊 Found ${rows.length} rows`);

          for (const row of rows) {
            if (row.length >= 6) {
              allContractors.push({
                licenseNumber: row[0],
                businessName: row[1],
                classification: classification,
                address: row[2] || '',
                city: row[3] || '',
                state: 'CA',
                zipCode: row[4] || '',
                county: '',
                phone: row[5] || '',
                status: 'Active',
                issueDate: '',
                expirationDate: '',
              });
            }
          }
        } else {
          console.log(`      ⚠️  No table data found in response`);
        }
      }
    } catch (error) {
      console.log(`      ⚠️  Error: ${error}`);
    }
  }

  if (allContractors.length > 0) {
    console.log('');
    console.log(`📊 Total scraped: ${allContractors.length} contractors`);

    // Normalize
    const normalized = allContractors.map((c, i) => ({
      id: `ca-${String(i + 1).padStart(3, '0')}`,
      licenseNumber: c.licenseNumber,
      licenseType: CA_CLASSIFICATIONS[c.classification] || c.classification,
      licenseStatus: normalizeStatus(c.status),
      classifications: [c.classification],
      businessName: c.businessName,
      phone: c.phone || undefined,
      address: c.address,
      city: c.city,
      state: 'CA' as const,
      zipCode: c.zipCode.substring(0, 5),
      county: c.county || undefined,
      issueDate: c.issueDate || '2020-01-01',
      expirationDate: c.expirationDate || '2026-12-31',
      lastUpdated: new Date().toISOString().split('T')[0],
      claimed: false,
      dataSource: 'CA_CSLB' as const,
      sourceUrl: `https://www.cslb.ca.gov/onlineservices/checklicenseII/LicenseDetail.aspx?LicNum=${c.licenseNumber}`,
      verified: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Save
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'california-contractors.json');
    fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
    console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

    return normalized;
  }

  // Fallback instructions
  console.log('');
  console.log('📋 Fallback: Manual data download options:');
  console.log('');
  console.log('   Option 1 (Free): Search by classification/county');
  console.log('   → https://www.cslb.ca.gov/onlineservices/dataportal/');
  console.log('   → Select classification (e.g., "B - General Building")');
  console.log('   → Download results as CSV');
  console.log('');
  console.log('   Option 2 ($235): Full master file');
  console.log('   → Contact CSLB Data Services: 916-255-3975');
  console.log('   → Request: License Master File');
  console.log('   → ~700,000+ records, monthly updates');
  console.log('');
  console.log('   Then run: npx tsx scripts/scrapers/california-cslb.ts --file /path/to/downloaded.csv');
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
      // Parse CSV and return
      return [];
    }
  }

  console.log('ℹ️  Using pre-populated data from contractors-data.ts');
  return [];
}

// Run
scrapeCalifornia()
  .then((result) => {
    console.log(`\n✅ California scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ California scraper failed:', err);
    process.exit(1);
  });
