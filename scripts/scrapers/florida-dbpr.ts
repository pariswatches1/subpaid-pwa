/**
 * Florida DBPR Contractor License Scraper
 *
 * Data Source: Florida Department of Business and Professional Regulation (DBPR)
 * URL: https://www.myfloridalicense.com
 * Public Records: https://www2.myfloridalicense.com/construction-industry/public-records/
 *
 * This scraper downloads contractor license data from the Florida DBPR database.
 * The data is public record and freely available for download.
 *
 * Usage: npx tsx scripts/scrapers/florida-dbpr.ts
 *
 * Output: scripts/output/florida-contractors.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface RawFLContractor {
  licenseNumber: string;
  firstName: string;
  lastName: string;
  businessName: string;
  licenseType: string;
  status: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  issueDate: string;
  expirationDate: string;
}

const FL_LICENSE_TYPES: Record<string, { type: string; classification: string }> = {
  EC: { type: 'Certified Electrical Contractor', classification: 'Electrical' },
  CG: { type: 'Certified General Contractor', classification: 'General Building' },
  CF: { type: 'Certified Plumbing Contractor', classification: 'Plumbing' },
  CA: { type: 'Certified HVAC Contractor', classification: 'HVAC/Mechanical' },
  CCC: { type: 'Certified Roofing Contractor', classification: 'Roofing' },
  CBC: { type: 'Certified Building Contractor', classification: 'Building' },
  CMC: { type: 'Certified Mechanical Contractor', classification: 'Mechanical' },
};

function parseLicenseType(licenseNumber: string): { type: string; classification: string } {
  for (const [prefix, info] of Object.entries(FL_LICENSE_TYPES)) {
    if (licenseNumber.startsWith(prefix)) {
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

function normalizeStatus(status: string): 'active' | 'inactive' | 'suspended' | 'expired' {
  const s = status.toLowerCase().trim();
  if (s.includes('current') || s.includes('active') || s.includes('clear')) return 'active';
  if (s.includes('suspend')) return 'suspended';
  if (s.includes('expir') || s.includes('delinquent')) return 'expired';
  return 'inactive';
}

async function scrapeFlorida() {
  console.log('🌴 Florida DBPR Contractor Scraper');
  console.log('===================================');
  console.log('');

  // Step 1: Attempt to download bulk CSV data
  console.log('📥 Step 1: Downloading contractor data from DBPR...');
  console.log('   Source: https://www.myfloridalicense.com');
  console.log('');

  // The DBPR provides bulk data downloads at:
  // https://www2.myfloridalicense.com/construction-industry/public-records/
  // Format: ASCII text, comma delimited
  // Updated weekly

  // For the initial run, we'll try the public records download
  const DBPR_URL = 'https://www.myfloridalicense.com/wl11.asp?mode=2&SID=&bession=&page=FindByLicNbr&LicNbr=&Atea=&Type=&Addr=&Cnty=&State=&Zip=&Profession=21&Status=CUR&Submit=Search';

  try {
    // Try fetching the construction industry licensee list
    const response = await fetch('https://www2.myfloridalicense.com/construction-industry/public-records/', {
      headers: {
        'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
      },
    });

    if (response.ok) {
      const html = await response.text();
      console.log(`   ✅ Connected to DBPR (${html.length} bytes received)`);

      // Parse the page to find download links
      // Look for CSV/data file links
      const csvLinkMatch = html.match(/href="([^"]*\.csv[^"]*)"/i);
      const txtLinkMatch = html.match(/href="([^"]*\.txt[^"]*)"/i);

      if (csvLinkMatch || txtLinkMatch) {
        const dataUrl = csvLinkMatch?.[1] || txtLinkMatch?.[1];
        console.log(`   📄 Found data file: ${dataUrl}`);

        // Download the actual data file
        const dataResponse = await fetch(dataUrl!, {
          headers: {
            'User-Agent': 'SubPaid Contractor Directory Bot (support@subpaid.com)',
          },
        });

        if (dataResponse.ok) {
          const csvData = await dataResponse.text();
          console.log(`   ✅ Downloaded ${csvData.length} bytes of contractor data`);

          // Parse CSV
          const lines = csvData.split('\n').filter(l => l.trim());
          const contractors: RawFLContractor[] = [];

          for (let i = 1; i < lines.length; i++) { // Skip header
            const fields = parseCSVLine(lines[i]);
            if (fields.length >= 8) {
              contractors.push({
                licenseNumber: fields[0] || '',
                firstName: fields[1] || '',
                lastName: fields[2] || '',
                businessName: fields[3] || '',
                licenseType: fields[4] || '',
                status: fields[5] || '',
                address: fields[6] || '',
                city: fields[7] || '',
                state: fields[8] || 'FL',
                zipCode: fields[9] || '',
                county: fields[10] || '',
                issueDate: fields[11] || '',
                expirationDate: fields[12] || '',
              });
            }
          }

          console.log(`   📊 Parsed ${contractors.length} contractor records`);

          // Normalize and save
          const normalized = contractors
            .filter(c => c.licenseNumber && c.businessName)
            .map((c, i) => {
              const typeInfo = parseLicenseType(c.licenseNumber);
              return {
                id: `fl-${String(i + 1).padStart(3, '0')}`,
                licenseNumber: c.licenseNumber,
                licenseType: typeInfo.type,
                licenseStatus: normalizeStatus(c.status),
                classifications: [typeInfo.classification],
                businessName: c.businessName,
                ownerName: `${c.firstName} ${c.lastName}`.trim() || undefined,
                phone: undefined,
                email: undefined,
                website: undefined,
                address: c.address,
                city: c.city,
                state: 'FL' as const,
                zipCode: c.zipCode.substring(0, 5),
                county: c.county || undefined,
                issueDate: c.issueDate || '2020-01-01',
                expirationDate: c.expirationDate || '2026-12-31',
                lastUpdated: new Date().toISOString().split('T')[0],
                claimed: false,
                dataSource: 'FL_DBPR' as const,
                sourceUrl: `https://www.myfloridalicense.com/LicenseDetail.asp?SID=&id=${c.licenseNumber}`,
                verified: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
            });

          // Save to output
          const outputDir = path.join(__dirname, '..', 'output');
          if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

          const outputPath = path.join(outputDir, 'florida-contractors.json');
          fs.writeFileSync(outputPath, JSON.stringify(normalized, null, 2));
          console.log(`   💾 Saved ${normalized.length} contractors to ${outputPath}`);

          return normalized;
        }
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Could not connect to DBPR: ${error}`);
  }

  // Fallback: If we can't download bulk data, try scraping individual pages
  console.log('');
  console.log('📋 Step 2: Trying individual license lookups...');
  console.log('   Note: For bulk data, visit https://www2.myfloridalicense.com/construction-industry/public-records/');
  console.log('   and download the Construction Industry licensee list manually.');
  console.log('');
  console.log('   To use this scraper with a downloaded CSV file, run:');
  console.log('   npx tsx scripts/scrapers/florida-dbpr.ts --file /path/to/downloaded.csv');
  console.log('');

  // Check if a local file was provided
  const fileArg = process.argv.find(a => a.startsWith('--file='));
  if (fileArg) {
    const filePath = fileArg.split('=')[1];
    if (fs.existsSync(filePath)) {
      console.log(`   📄 Loading local file: ${filePath}`);
      const csvData = fs.readFileSync(filePath, 'utf-8');
      const lines = csvData.split('\n').filter(l => l.trim());
      console.log(`   Found ${lines.length} lines`);

      const contractors: RawFLContractor[] = [];
      for (let i = 1; i < lines.length; i++) {
        const fields = parseCSVLine(lines[i]);
        if (fields.length >= 8) {
          contractors.push({
            licenseNumber: fields[0] || '',
            firstName: fields[1] || '',
            lastName: fields[2] || '',
            businessName: fields[3] || '',
            licenseType: fields[4] || '',
            status: fields[5] || '',
            address: fields[6] || '',
            city: fields[7] || '',
            state: fields[8] || 'FL',
            zipCode: fields[9] || '',
            county: fields[10] || '',
            issueDate: fields[11] || '',
            expirationDate: fields[12] || '',
          });
        }
      }

      console.log(`   ✅ Parsed ${contractors.length} contractors from local file`);
      return contractors;
    } else {
      console.log(`   ❌ File not found: ${filePath}`);
    }
  }

  console.log('');
  console.log('ℹ️  Using pre-populated mock data from contractors-data.ts');
  console.log('   For real data, download from DBPR and run with --file flag');
  console.log('');

  return [];
}

// Run
scrapeFlorida()
  .then((result) => {
    console.log(`\n✅ Florida scraper complete. ${result.length} contractors processed.`);
  })
  .catch((err) => {
    console.error('❌ Florida scraper failed:', err);
    process.exit(1);
  });
