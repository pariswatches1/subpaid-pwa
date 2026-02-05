#!/usr/bin/env node

/**
 * Generate realistic contractor data for all 10 states
 * 100 contractors per state = 1,000 total
 *
 * Usage: node scripts/generate-all-states.js
 * Output: src/lib/contractors-data.ts
 */

const fs = require('fs');
const path = require('path');

// Seeded PRNG for reproducible output
let seed = 42;
function random() {
  seed = (seed * 16807 + 0) % 2147483647;
  return (seed - 1) / 2147483646;
}
function randInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[Math.floor(random() * arr.length)];
}
function weightedPick(items) {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = random() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

// Business name parts
const firstNames = ['Michael', 'James', 'Robert', 'David', 'John', 'William', 'Richard', 'Joseph', 'Thomas', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Carlos', 'Jose', 'Luis', 'Miguel', 'Kevin', 'Brian', 'Jason', 'Timothy', 'Ronald', 'Edward', 'Ryan', 'Jeffrey', 'Jacob', 'Gary', 'Nicholas', 'Eric', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon', 'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Frank', 'Alexander', 'Patrick', 'Jack', 'Dennis', 'Jerry', 'Tyler'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'];
const bizSuffixes = ['Construction', 'Contracting', 'Builders', 'Services', 'Solutions', 'Group', 'Enterprises', 'Corp', 'Inc', 'LLC', 'Pros', 'Mechanical', 'Electric', 'Plumbing', 'Systems'];
const bizPrefixes = ['Premier', 'Elite', 'Advanced', 'Pro', 'Quality', 'Superior', 'Precision', 'American', 'National', 'Capital', 'First Choice', 'All-Star', 'Reliable', 'Integrity', 'Apex', 'Summit', 'Eagle', 'Patriot', 'Liberty', 'United'];
const emailDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'aol.com', 'hotmail.com', 'comcast.net', 'att.net'];
const streetNames = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm Blvd', 'Washington Ave', 'Park Dr', 'Lake Rd', 'Valley Ave', 'Commerce Way', 'Industrial Blvd', 'Business Park Dr', 'Trade Center Dr', 'Enterprise Rd', 'Market St', 'Broadway', 'Church St', 'Mill Rd', 'River Rd'];

function generateBusinessName() {
  const style = randInt(1, 5);
  const fn = pick(firstNames);
  const ln = pick(lastNames);
  const suffix = pick(bizSuffixes);
  const prefix = pick(bizPrefixes);
  switch (style) {
    case 1: return `${ln} & Sons ${suffix}`;
    case 2: return `${prefix} ${suffix}`;
    case 3: return `${fn} ${ln} ${suffix}`;
    case 4: return `${ln} ${suffix} ${pick(['Co', 'Inc', 'LLC', 'Group'])}`;
    default: return `${prefix} ${ln} ${suffix}`;
  }
}

function generatePhone(areaCodes) {
  const ac = pick(areaCodes);
  return `(${ac}) ${randInt(200, 999)}-${String(randInt(1000, 9999))}`;
}

function generateEmail(name) {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '').substring(0, 8);
  return `${clean}${randInt(1, 999)}@${pick(emailDomains)}`;
}

function generateAddress() {
  return `${randInt(100, 9999)} ${pick(streetNames)}${random() > 0.7 ? `, Suite ${randInt(100, 999)}` : ''}`;
}

function generateDate(startYear, endYear) {
  const y = randInt(startYear, endYear);
  const m = String(randInt(1, 12)).padStart(2, '0');
  const d = String(randInt(1, 28)).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function generatePayScore() {
  // Weighted: most contractors are in 60-85 range
  const r = random();
  if (r < 0.05) return randInt(30, 49);   // 5% poor
  if (r < 0.15) return randInt(50, 64);   // 10% fair
  if (r < 0.55) return randInt(65, 79);   // 40% good
  if (r < 0.85) return randInt(80, 89);   // 30% very good
  return randInt(90, 98);                  // 15% excellent
}

// ============================================
// STATE-SPECIFIC SEED DATA
// ============================================

const STATES = {
  FL: {
    name: 'Florida',
    dataSource: 'FL_DBPR',
    sourceUrlTemplate: (num) => `https://www.myfloridalicense.com/LicenseDetail.asp?SID=&id=${num}`,
    cities: [
      { name: 'Miami', county: 'Miami-Dade', zips: ['33101','33109','33125','33126','33127','33128','33130','33131','33132','33133','33134','33135','33136','33137','33138','33139','33140','33141','33142','33143'], areaCodes: ['305','786'], count: 20 },
      { name: 'Tampa', county: 'Hillsborough', zips: ['33601','33602','33603','33604','33605','33606','33607','33609','33610','33611','33612','33613','33614','33615','33616','33617'], areaCodes: ['813'], count: 15 },
      { name: 'Orlando', county: 'Orange', zips: ['32801','32803','32804','32805','32806','32807','32808','32809','32810','32811','32812','32814','32817','32818','32819','32822'], areaCodes: ['407','321'], count: 15 },
      { name: 'Jacksonville', county: 'Duval', zips: ['32099','32201','32202','32204','32205','32206','32207','32208','32209','32210','32211','32216','32217','32218'], areaCodes: ['904'], count: 12 },
      { name: 'Fort Lauderdale', county: 'Broward', zips: ['33301','33304','33305','33306','33308','33309','33311','33312','33313','33314','33315','33316'], areaCodes: ['954'], count: 10 },
      { name: 'Naples', county: 'Collier', zips: ['34101','34102','34103','34104','34105','34108','34109','34110','34112','34116'], areaCodes: ['239'], count: 8 },
      { name: 'Tallahassee', county: 'Leon', zips: ['32301','32303','32304','32305','32308','32309','32310','32311','32312'], areaCodes: ['850'], count: 5 },
      { name: 'Gainesville', county: 'Alachua', zips: ['32601','32603','32605','32606','32607','32608','32609','32641'], areaCodes: ['352'], count: 5 },
      { name: 'Sarasota', county: 'Sarasota', zips: ['34230','34231','34232','34233','34234','34235','34236','34237','34238','34239'], areaCodes: ['941'], count: 5 },
      { name: 'West Palm Beach', county: 'Palm Beach', zips: ['33401','33402','33403','33404','33405','33406','33407','33409','33410','33411'], areaCodes: ['561'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'CG', type: 'Certified General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'EC', type: 'Certified Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'CF', type: 'Certified Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'CA', type: 'Certified HVAC Contractor', classification: 'HVAC/Mechanical', weight: 15 },
      { prefix: 'CCC', type: 'Certified Roofing Contractor', classification: 'Roofing', weight: 10 },
      { prefix: 'CBC', type: 'Certified Building Contractor', classification: 'Building', weight: 10 },
      { prefix: 'CMC', type: 'Certified Mechanical Contractor', classification: 'Mechanical', weight: 5 },
    ],
    genLicense: (prefix) => `${prefix}${randInt(1000000, 9999999)}`,
  },
  CA: {
    name: 'California',
    dataSource: 'CA_CSLB',
    sourceUrlTemplate: (num) => `https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx?val=${num}`,
    cities: [
      { name: 'Los Angeles', county: 'Los Angeles', zips: ['90001','90003','90004','90005','90006','90007','90008','90010','90011','90012','90013','90014','90015','90016','90017','90018','90019','90020'], areaCodes: ['213','310','323','424','818'], count: 20 },
      { name: 'San Diego', county: 'San Diego', zips: ['92101','92102','92103','92104','92105','92106','92107','92108','92109','92110','92111','92113','92114','92115','92116','92117'], areaCodes: ['619','858'], count: 15 },
      { name: 'San Francisco', county: 'San Francisco', zips: ['94102','94103','94104','94105','94107','94108','94109','94110','94111','94112','94114','94115','94116','94117','94118'], areaCodes: ['415','628'], count: 12 },
      { name: 'Sacramento', county: 'Sacramento', zips: ['95811','95812','95814','95815','95816','95817','95818','95819','95820','95821','95822','95823','95824','95825'], areaCodes: ['916'], count: 12 },
      { name: 'San Jose', county: 'Santa Clara', zips: ['95110','95111','95112','95113','95116','95117','95118','95119','95120','95121','95122','95123','95124','95125','95126','95127'], areaCodes: ['408','669'], count: 10 },
      { name: 'Fresno', county: 'Fresno', zips: ['93650','93701','93702','93703','93704','93705','93706','93710','93711','93720','93721','93722','93726','93727','93728'], areaCodes: ['559'], count: 8 },
      { name: 'Oakland', county: 'Alameda', zips: ['94601','94602','94603','94605','94606','94607','94609','94610','94611','94612','94613'], areaCodes: ['510'], count: 5 },
      { name: 'Anaheim', county: 'Orange', zips: ['92801','92802','92804','92805','92806','92807'], areaCodes: ['714','657'], count: 5 },
      { name: 'Long Beach', county: 'Los Angeles', zips: ['90802','90803','90804','90805','90806','90807','90808','90810','90813','90814','90815'], areaCodes: ['562'], count: 5 },
      { name: 'Riverside', county: 'Riverside', zips: ['92501','92503','92504','92505','92506','92507','92508','92509'], areaCodes: ['951'], count: 8 },
    ],
    licenseTypes: [
      { prefix: 'B-', type: 'General Building Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'C-10', type: 'Electrical Contractor', classification: 'Electrical', weight: 18 },
      { prefix: 'C-20', type: 'HVAC Contractor', classification: 'HVAC', weight: 14 },
      { prefix: 'C-36', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 14 },
      { prefix: 'C-39', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
      { prefix: 'C-33', type: 'Painting Contractor', classification: 'Painting', weight: 8 },
      { prefix: 'C-8', type: 'Concrete Contractor', classification: 'Concrete', weight: 6 },
      { prefix: 'C-27', type: 'Landscaping Contractor', classification: 'Landscaping', weight: 5 },
    ],
    genLicense: () => `${randInt(100000, 1099999)}`,
  },
  AZ: {
    name: 'Arizona',
    dataSource: 'AZ_ROC',
    sourceUrlTemplate: (num) => `https://roc.az.gov/contractor-search?license=${num}`,
    cities: [
      { name: 'Phoenix', county: 'Maricopa', zips: ['85001','85003','85004','85006','85007','85008','85009','85012','85013','85014','85015','85016','85017','85018','85019','85020','85021','85022','85023','85024'], areaCodes: ['602','480'], count: 25 },
      { name: 'Tucson', county: 'Pima', zips: ['85701','85705','85706','85710','85711','85712','85713','85714','85716','85718','85719','85730'], areaCodes: ['520'], count: 20 },
      { name: 'Mesa', county: 'Maricopa', zips: ['85201','85202','85203','85204','85205','85206','85207','85208','85209','85210','85212','85213'], areaCodes: ['480'], count: 15 },
      { name: 'Scottsdale', county: 'Maricopa', zips: ['85250','85251','85253','85254','85255','85256','85257','85258','85259','85260','85262'], areaCodes: ['480'], count: 10 },
      { name: 'Chandler', county: 'Maricopa', zips: ['85224','85225','85226','85248','85249','85286'], areaCodes: ['480'], count: 10 },
      { name: 'Tempe', county: 'Maricopa', zips: ['85281','85282','85283','85284'], areaCodes: ['480'], count: 8 },
      { name: 'Glendale', county: 'Maricopa', zips: ['85301','85302','85303','85304','85305','85306','85307','85308'], areaCodes: ['623'], count: 7 },
      { name: 'Flagstaff', county: 'Coconino', zips: ['86001','86003','86004','86011'], areaCodes: ['928'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'ROC', type: 'General Residential Contractor', classification: 'General Residential', weight: 25 },
      { prefix: 'ROC', type: 'General Commercial Contractor', classification: 'General Commercial', weight: 15 },
      { prefix: 'ROC', type: 'Electrical Contractor (C-11)', classification: 'Electrical', weight: 18 },
      { prefix: 'ROC', type: 'Plumbing Contractor (C-37)', classification: 'Plumbing', weight: 15 },
      { prefix: 'ROC', type: 'HVAC Contractor (C-39)', classification: 'HVAC', weight: 12 },
      { prefix: 'ROC', type: 'Roofing Contractor (C-42)', classification: 'Roofing', weight: 10 },
      { prefix: 'ROC', type: 'Painting Contractor (C-31)', classification: 'Painting', weight: 5 },
    ],
    genLicense: () => `ROC${randInt(100000, 399999)}`,
  },
  NC: {
    name: 'North Carolina',
    dataSource: 'NC_NCLBGC',
    sourceUrlTemplate: (num) => `https://portal.nclbgc.org/public/search?license=${num}`,
    cities: [
      { name: 'Charlotte', county: 'Mecklenburg', zips: ['28201','28202','28203','28204','28205','28206','28207','28208','28209','28210','28211','28212','28213','28214','28215','28216','28217'], areaCodes: ['704','980'], count: 25 },
      { name: 'Raleigh', county: 'Wake', zips: ['27601','27603','27604','27605','27606','27607','27608','27609','27610','27612','27613','27614','27615','27616','27617'], areaCodes: ['919','984'], count: 20 },
      { name: 'Greensboro', county: 'Guilford', zips: ['27401','27403','27405','27406','27407','27408','27409','27410','27455'], areaCodes: ['336'], count: 15 },
      { name: 'Durham', county: 'Durham', zips: ['27701','27703','27704','27705','27707','27712','27713'], areaCodes: ['919','984'], count: 12 },
      { name: 'Winston-Salem', county: 'Forsyth', zips: ['27101','27103','27104','27105','27106','27107','27127'], areaCodes: ['336'], count: 10 },
      { name: 'Fayetteville', county: 'Cumberland', zips: ['28301','28303','28304','28305','28306','28311','28314'], areaCodes: ['910'], count: 8 },
      { name: 'Asheville', county: 'Buncombe', zips: ['28801','28803','28804','28805','28806'], areaCodes: ['828'], count: 5 },
      { name: 'Wilmington', county: 'New Hanover', zips: ['28401','28403','28405','28409','28411','28412'], areaCodes: ['910'], count: 5 },
    ],
    licenseTypes: [
      { prefix: '', type: 'General Contractor (Unlimited)', classification: 'General Building', weight: 35 },
      { prefix: '', type: 'General Contractor (Limited)', classification: 'General Building', weight: 25 },
      { prefix: '', type: 'Building Contractor', classification: 'Building', weight: 20 },
      { prefix: '', type: 'Residential Contractor', classification: 'Residential', weight: 20 },
    ],
    genLicense: () => `${randInt(10000, 99999)}`,
  },
  TX: {
    name: 'Texas',
    dataSource: 'TX_TDLR',
    sourceUrlTemplate: (num) => `https://www.tdlr.texas.gov/verify.htm?license=${num}`,
    cities: [
      { name: 'Houston', county: 'Harris', zips: ['77001','77002','77003','77004','77005','77006','77007','77008','77009','77010','77011','77012','77013','77014','77015','77016','77017','77018','77019','77020'], areaCodes: ['713','281','832','346'], count: 20 },
      { name: 'Dallas', county: 'Dallas', zips: ['75201','75202','75203','75204','75205','75206','75207','75208','75209','75210','75211','75212','75214','75215','75216','75217','75218','75219'], areaCodes: ['214','469','972'], count: 18 },
      { name: 'San Antonio', county: 'Bexar', zips: ['78201','78202','78203','78204','78205','78207','78208','78209','78210','78211','78212','78213','78214','78215','78216','78217'], areaCodes: ['210'], count: 15 },
      { name: 'Austin', county: 'Travis', zips: ['78701','78702','78703','78704','78705','78712','78721','78722','78723','78724','78725','78726','78727','78728','78729','78730'], areaCodes: ['512'], count: 15 },
      { name: 'Fort Worth', county: 'Tarrant', zips: ['76101','76102','76103','76104','76105','76106','76107','76108','76109','76110','76111','76112','76114','76115','76116'], areaCodes: ['817','682'], count: 10 },
      { name: 'El Paso', county: 'El Paso', zips: ['79901','79902','79903','79904','79905','79906','79907','79911','79912','79915','79920','79922','79924','79925','79927','79930'], areaCodes: ['915'], count: 8 },
      { name: 'Arlington', county: 'Tarrant', zips: ['76001','76002','76006','76010','76011','76012','76013','76014','76015','76016','76017','76018'], areaCodes: ['817','682'], count: 7 },
      { name: 'Plano', county: 'Collin', zips: ['75023','75024','75025','75074','75075','75093'], areaCodes: ['469','972'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'TECL', type: 'Master Electrician', classification: 'Electrical', weight: 25 },
      { prefix: 'TECL', type: 'Journeyman Electrician', classification: 'Electrical', weight: 20 },
      { prefix: 'TECL', type: 'Electrical Contractor', classification: 'Electrical', weight: 15 },
      { prefix: 'TACLB', type: 'HVAC Contractor', classification: 'HVAC', weight: 20 },
      { prefix: 'TACLB', type: 'HVAC Technician', classification: 'HVAC', weight: 20 },
    ],
    genLicense: (prefix) => `${prefix}${randInt(10000, 99999)}`,
  },
  GA: {
    name: 'Georgia',
    dataSource: 'GA_SOS',
    sourceUrlTemplate: (num) => `https://sos.ga.gov/contractors/search?license=${num}`,
    cities: [
      { name: 'Atlanta', county: 'Fulton', zips: ['30301','30303','30305','30306','30307','30308','30309','30310','30311','30312','30313','30314','30315','30316','30317','30318','30319','30324','30326','30327'], areaCodes: ['404','470','678','770'], count: 30 },
      { name: 'Savannah', county: 'Chatham', zips: ['31401','31404','31405','31406','31407','31408','31410','31411','31415','31419'], areaCodes: ['912'], count: 15 },
      { name: 'Augusta', county: 'Richmond', zips: ['30901','30903','30904','30905','30906','30907','30909','30912'], areaCodes: ['706','762'], count: 12 },
      { name: 'Columbus', county: 'Muscogee', zips: ['31901','31903','31904','31905','31906','31907','31909'], areaCodes: ['706','762'], count: 10 },
      { name: 'Macon', county: 'Bibb', zips: ['31201','31204','31206','31207','31210','31211','31216','31217'], areaCodes: ['478'], count: 8 },
      { name: 'Athens', county: 'Clarke', zips: ['30601','30605','30606','30607'], areaCodes: ['706','762'], count: 8 },
      { name: 'Marietta', county: 'Cobb', zips: ['30060','30062','30064','30066','30067','30068'], areaCodes: ['770','678'], count: 10 },
      { name: 'Roswell', county: 'Fulton', zips: ['30075','30076','30077'], areaCodes: ['770','678'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GCRES', type: 'Residential General Contractor', classification: 'General Residential', weight: 35 },
      { prefix: 'GCCOM', type: 'Commercial General Contractor', classification: 'General Commercial', weight: 30 },
      { prefix: 'GCRLC', type: 'Residential-Light Commercial Contractor', classification: 'Residential/Light Commercial', weight: 20 },
      { prefix: 'GCQA', type: 'Qualifying Agent', classification: 'General', weight: 15 },
    ],
    genLicense: (prefix) => `${prefix}-${randInt(10000, 99999)}`,
  },
  OH: {
    name: 'Ohio',
    dataSource: 'OH_OCILB',
    sourceUrlTemplate: (num) => `https://elicense4.com.ohio.gov/lookup?license=${num}`,
    cities: [
      { name: 'Columbus', county: 'Franklin', zips: ['43201','43202','43203','43204','43205','43206','43207','43209','43210','43211','43212','43213','43214','43215','43219','43220','43221','43222','43223','43224'], areaCodes: ['614'], count: 20 },
      { name: 'Cleveland', county: 'Cuyahoga', zips: ['44101','44102','44103','44104','44105','44106','44107','44108','44109','44110','44111','44112','44113','44114','44115','44116','44118','44119','44120','44121'], areaCodes: ['216'], count: 18 },
      { name: 'Cincinnati', county: 'Hamilton', zips: ['45201','45202','45203','45204','45205','45206','45207','45208','45209','45210','45211','45212','45213','45214','45215','45216','45217','45218','45219','45220'], areaCodes: ['513'], count: 18 },
      { name: 'Toledo', county: 'Lucas', zips: ['43601','43604','43605','43606','43607','43608','43609','43610','43611','43612','43613','43614','43615','43620'], areaCodes: ['419'], count: 10 },
      { name: 'Akron', county: 'Summit', zips: ['44301','44302','44303','44304','44305','44306','44307','44308','44310','44311','44312','44313','44314','44319','44320'], areaCodes: ['330'], count: 10 },
      { name: 'Dayton', county: 'Montgomery', zips: ['45401','45402','45403','45404','45405','45406','45409','45410','45414','45415','45416','45417','45419','45420'], areaCodes: ['937'], count: 10 },
      { name: 'Canton', county: 'Stark', zips: ['44701','44702','44703','44704','44705','44706','44707','44708','44709','44710','44714'], areaCodes: ['330'], count: 7 },
      { name: 'Youngstown', county: 'Mahoning', zips: ['44501','44502','44503','44504','44505','44506','44507','44509','44510','44511','44512','44514','44515'], areaCodes: ['330'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'EL', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'HV', type: 'HVAC Contractor', classification: 'HVAC', weight: 25 },
      { prefix: 'PL', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'HY', type: 'Hydronics Contractor', classification: 'Hydronics', weight: 12 },
      { prefix: 'RF', type: 'Refrigeration Contractor', classification: 'Refrigeration', weight: 13 },
    ],
    genLicense: (prefix) => `OH-${prefix}-${randInt(10000, 99999)}`,
  },
  PA: {
    name: 'Pennsylvania',
    dataSource: 'PA_AG',
    sourceUrlTemplate: (num) => `https://hicsearch.attorneygeneral.gov/?reg=${num}`,
    cities: [
      { name: 'Philadelphia', county: 'Philadelphia', zips: ['19101','19102','19103','19104','19106','19107','19109','19111','19112','19114','19115','19116','19118','19119','19120','19121','19122','19123','19124','19125','19126','19127','19128','19129','19130','19131','19132','19133','19134','19135','19136','19137','19138','19139','19140','19141','19142','19143','19144','19145','19146','19147','19148','19149','19150','19151','19152','19153','19154'], areaCodes: ['215','267'], count: 25 },
      { name: 'Pittsburgh', county: 'Allegheny', zips: ['15201','15202','15203','15204','15205','15206','15207','15208','15209','15210','15211','15212','15213','15214','15215','15216','15217','15218','15219','15220','15221','15222','15224','15226','15227','15228','15229','15232','15233','15234','15235','15236','15237','15238','15239','15240'], areaCodes: ['412'], count: 20 },
      { name: 'Allentown', county: 'Lehigh', zips: ['18101','18102','18103','18104','18105','18109'], areaCodes: ['610','484'], count: 12 },
      { name: 'Erie', county: 'Erie', zips: ['16501','16502','16503','16504','16505','16506','16507','16508','16509','16510','16511'], areaCodes: ['814'], count: 10 },
      { name: 'Reading', county: 'Berks', zips: ['19601','19602','19604','19605','19606','19607','19608','19609','19610','19611'], areaCodes: ['610','484'], count: 8 },
      { name: 'Scranton', county: 'Lackawanna', zips: ['18501','18503','18504','18505','18507','18508','18509','18510'], areaCodes: ['570'], count: 8 },
      { name: 'Harrisburg', county: 'Dauphin', zips: ['17101','17102','17103','17104','17109','17110','17111','17112'], areaCodes: ['717'], count: 10 },
      { name: 'Bethlehem', county: 'Northampton', zips: ['18015','18016','18017','18018','18020'], areaCodes: ['610','484'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'PA', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 50 },
      { prefix: 'PA', type: 'Home Improvement Contractor (Residential)', classification: 'Residential Improvement', weight: 30 },
      { prefix: 'PA', type: 'Home Improvement Salesperson', classification: 'Sales', weight: 20 },
    ],
    genLicense: () => `PA-HIC-${randInt(100000, 999999)}`,
  },
  IL: {
    name: 'Illinois',
    dataSource: 'IL_IDFPR',
    sourceUrlTemplate: (num) => `https://idfpr.illinois.gov/checklicense.html?license=${num}`,
    cities: [
      { name: 'Chicago', county: 'Cook', zips: ['60601','60602','60603','60604','60605','60606','60607','60608','60609','60610','60611','60612','60613','60614','60615','60616','60617','60618','60619','60620','60621','60622','60623','60624','60625','60626','60628','60629','60630','60631','60632','60634','60636','60637','60638','60639','60640','60641','60642','60643','60644','60645','60646','60647','60649','60651','60652','60653','60654','60655','60656','60657','60659','60660','60661'], areaCodes: ['312','773','872'], count: 30 },
      { name: 'Aurora', county: 'Kane', zips: ['60502','60503','60504','60505','60506','60507'], areaCodes: ['630','331'], count: 12 },
      { name: 'Naperville', county: 'DuPage', zips: ['60540','60563','60564','60565'], areaCodes: ['630','331'], count: 10 },
      { name: 'Rockford', county: 'Winnebago', zips: ['61101','61102','61103','61104','61107','61108','61109','61112','61114'], areaCodes: ['815','779'], count: 10 },
      { name: 'Joliet', county: 'Will', zips: ['60431','60432','60433','60434','60435','60436'], areaCodes: ['815','779'], count: 8 },
      { name: 'Springfield', county: 'Sangamon', zips: ['62701','62702','62703','62704','62707','62711','62712'], areaCodes: ['217'], count: 10 },
      { name: 'Peoria', county: 'Peoria', zips: ['61601','61602','61603','61604','61605','61606','61607','61614','61615'], areaCodes: ['309'], count: 10 },
      { name: 'Elgin', county: 'Kane', zips: ['60120','60123','60124'], areaCodes: ['847','224'], count: 10 },
    ],
    licenseTypes: [
      { prefix: '104', type: 'Roofing Contractor', classification: 'Roofing', weight: 30 },
      { prefix: '104', type: 'Roofing Contractor (Limited)', classification: 'Roofing', weight: 15 },
      { prefix: '072', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: '007', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: '006', type: 'General Contractor', classification: 'General Building', weight: 15 },
    ],
    genLicense: (prefix) => `${prefix}.${String(randInt(1000, 99999)).padStart(6, '0')}`,
  },
  NY: {
    name: 'New York',
    dataSource: 'NY_COUNTY',
    sourceUrlTemplate: (num) => `https://a810-bisweb.nyc.gov/bisweb/LicenseQueryServlet?licno=${num}`,
    cities: [
      { name: 'New York City', county: 'New York', zips: ['10001','10002','10003','10004','10005','10006','10007','10009','10010','10011','10012','10013','10014','10016','10017','10018','10019','10020','10021','10022','10023','10024','10025','10026','10027','10028','10029','10030','10031','10032','10033','10034','10035','10036','10037','10038','10039','10040'], areaCodes: ['212','646','917','718','347','929'], count: 30 },
      { name: 'Buffalo', county: 'Erie', zips: ['14201','14202','14203','14204','14206','14207','14208','14209','14210','14211','14212','14213','14214','14215','14216','14217','14218','14219','14220'], areaCodes: ['716'], count: 12 },
      { name: 'Rochester', county: 'Monroe', zips: ['14604','14605','14606','14607','14608','14609','14610','14611','14612','14613','14614','14615','14616','14617','14618','14619','14620','14621'], areaCodes: ['585'], count: 12 },
      { name: 'Syracuse', county: 'Onondaga', zips: ['13201','13202','13203','13204','13205','13206','13207','13208','13209','13210','13211','13212','13214','13215','13219','13224'], areaCodes: ['315'], count: 10 },
      { name: 'Albany', county: 'Albany', zips: ['12201','12202','12203','12204','12205','12206','12207','12208','12209','12210','12211','12212'], areaCodes: ['518'], count: 10 },
      { name: 'Yonkers', county: 'Westchester', zips: ['10701','10702','10703','10704','10705','10710'], areaCodes: ['914'], count: 8 },
      { name: 'New Rochelle', county: 'Westchester', zips: ['10801','10802','10803','10804','10805'], areaCodes: ['914'], count: 8 },
      { name: 'White Plains', county: 'Westchester', zips: ['10601','10603','10604','10605','10606','10607'], areaCodes: ['914'], count: 10 },
    ],
    licenseTypes: [
      { prefix: 'HIC', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 30 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'LMP', type: 'Licensed Master Plumber', classification: 'Plumbing', weight: 15 },
      { prefix: 'LE', type: 'Licensed Electrician', classification: 'Electrical', weight: 15 },
      { prefix: 'FP', type: 'Fire Protection Contractor', classification: 'Fire Protection', weight: 10 },
      { prefix: 'SSC', type: 'Site Safety Contractor', classification: 'Site Safety', weight: 5 },
    ],
    genLicense: (prefix) => `${prefix}-${randInt(100000, 999999)}`,
  },
  // ============================================
  // 40 NEW STATES (alphabetical)
  // ============================================
  AK: {
    name: 'Alaska',
    dataSource: 'AK_DCCED',
    sourceUrlTemplate: (num) => `https://www.prior.prior-commerce.state.ak.us/?id=${num}`,
    cities: [
      { name: 'Anchorage', county: 'Anchorage', zips: ['99501','99502','99503','99504','99507','99508','99515','99516','99517','99518'], areaCodes: ['907'], count: 40 },
      { name: 'Fairbanks', county: 'Fairbanks North Star', zips: ['99701','99702','99705','99707','99709','99712'], areaCodes: ['907'], count: 20 },
      { name: 'Juneau', county: 'Juneau', zips: ['99801','99802','99803'], areaCodes: ['907'], count: 15 },
      { name: 'Wasilla', county: 'Matanuska-Susitna', zips: ['99654','99687'], areaCodes: ['907'], count: 10 },
      { name: 'Kenai', county: 'Kenai Peninsula', zips: ['99611','99612'], areaCodes: ['907'], count: 8 },
      { name: 'Sitka', county: 'Sitka', zips: ['99835','99836'], areaCodes: ['907'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
    ],
    genLicense: (prefix) => `AK-${prefix}-${randInt(10000, 99999)}`,
  },
  AL: {
    name: 'Alabama',
    dataSource: 'AL_LBGC',
    sourceUrlTemplate: (num) => `https://genconbd.alabama.gov/verification/?lic=${num}`,
    cities: [
      { name: 'Birmingham', county: 'Jefferson', zips: ['35201','35203','35204','35205','35206','35207','35208','35209','35210','35211','35212','35213'], areaCodes: ['205','659'], count: 25 },
      { name: 'Huntsville', county: 'Madison', zips: ['35801','35802','35803','35805','35806','35810','35811','35816'], areaCodes: ['256'], count: 18 },
      { name: 'Mobile', county: 'Mobile', zips: ['36601','36602','36603','36604','36605','36606','36607','36608','36609','36610'], areaCodes: ['251'], count: 15 },
      { name: 'Montgomery', county: 'Montgomery', zips: ['36101','36104','36105','36106','36107','36108','36109','36110','36111','36116','36117'], areaCodes: ['334'], count: 12 },
      { name: 'Tuscaloosa', county: 'Tuscaloosa', zips: ['35401','35403','35404','35405','35406','35407'], areaCodes: ['205'], count: 10 },
      { name: 'Hoover', county: 'Shelby', zips: ['35226','35242','35244'], areaCodes: ['205'], count: 8 },
      { name: 'Dothan', county: 'Houston', zips: ['36301','36303','36305'], areaCodes: ['334'], count: 7 },
      { name: 'Auburn', county: 'Lee', zips: ['36830','36832'], areaCodes: ['334'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'BE', type: 'Building Contractor', classification: 'Building', weight: 25 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `AL-${prefix}-${randInt(10000, 99999)}`,
  },
  AR: {
    name: 'Arkansas',
    dataSource: 'AR_CLB',
    sourceUrlTemplate: (num) => `https://www.aclb.arkansas.gov/verify/?num=${num}`,
    cities: [
      { name: 'Little Rock', county: 'Pulaski', zips: ['72201','72202','72204','72205','72207','72209','72210','72211','72212'], areaCodes: ['501'], count: 30 },
      { name: 'Fort Smith', county: 'Sebastian', zips: ['72901','72903','72904','72908'], areaCodes: ['479'], count: 18 },
      { name: 'Fayetteville', county: 'Washington', zips: ['72701','72703','72704'], areaCodes: ['479'], count: 15 },
      { name: 'Springdale', county: 'Washington', zips: ['72762','72764','72766'], areaCodes: ['479'], count: 12 },
      { name: 'Jonesboro', county: 'Craighead', zips: ['72401','72404'], areaCodes: ['870'], count: 10 },
      { name: 'Conway', county: 'Faulkner', zips: ['72032','72034'], areaCodes: ['501'], count: 8 },
      { name: 'Rogers', county: 'Benton', zips: ['72756','72758'], areaCodes: ['479'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'RC', type: 'Residential Contractor', classification: 'Residential', weight: 25 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 20 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
    ],
    genLicense: (prefix) => `AR-${prefix}${randInt(10000, 99999)}`,
  },
  CO: {
    name: 'Colorado',
    dataSource: 'CO_DORA',
    sourceUrlTemplate: (num) => `https://apps.colorado.gov/dora/licensing/?id=${num}`,
    cities: [
      { name: 'Denver', county: 'Denver', zips: ['80201','80202','80203','80204','80205','80206','80207','80209','80210','80211','80212','80216'], areaCodes: ['303','720'], count: 22 },
      { name: 'Colorado Springs', county: 'El Paso', zips: ['80901','80903','80904','80905','80906','80907','80909','80910','80911'], areaCodes: ['719'], count: 18 },
      { name: 'Aurora', county: 'Arapahoe', zips: ['80010','80011','80012','80013','80014','80015','80016','80017'], areaCodes: ['303','720'], count: 12 },
      { name: 'Fort Collins', county: 'Larimer', zips: ['80521','80524','80525','80526','80528'], areaCodes: ['970'], count: 10 },
      { name: 'Lakewood', county: 'Jefferson', zips: ['80214','80215','80226','80227','80228'], areaCodes: ['303'], count: 8 },
      { name: 'Thornton', county: 'Adams', zips: ['80229','80233','80241'], areaCodes: ['303','720'], count: 8 },
      { name: 'Arvada', county: 'Jefferson', zips: ['80002','80003','80004','80005'], areaCodes: ['303','720'], count: 7 },
      { name: 'Boulder', county: 'Boulder', zips: ['80301','80302','80303','80304','80305'], areaCodes: ['303','720'], count: 5 },
      { name: 'Westminster', county: 'Adams', zips: ['80030','80031','80035'], areaCodes: ['303'], count: 5 },
      { name: 'Pueblo', county: 'Pueblo', zips: ['81001','81003','81004','81005','81006','81008'], areaCodes: ['719'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `CO-${prefix}-${randInt(100000, 999999)}`,
  },
  CT: {
    name: 'Connecticut', dataSource: 'CT_DCP', sourceUrlTemplate: (num) => `https://www.elicense.ct.gov/?id=${num}`,
    cities: [
      { name: 'Hartford', county: 'Hartford', zips: ['06101','06103','06105','06106','06112','06114'], areaCodes: ['860'], count: 22 },
      { name: 'New Haven', county: 'New Haven', zips: ['06510','06511','06513','06515','06519'], areaCodes: ['203'], count: 20 },
      { name: 'Bridgeport', county: 'Fairfield', zips: ['06601','06604','06605','06606','06607','06608','06610'], areaCodes: ['203'], count: 18 },
      { name: 'Stamford', county: 'Fairfield', zips: ['06901','06902','06905','06906','06907'], areaCodes: ['203'], count: 12 },
      { name: 'Waterbury', county: 'New Haven', zips: ['06701','06702','06704','06705','06706','06708'], areaCodes: ['203'], count: 10 },
      { name: 'Norwalk', county: 'Fairfield', zips: ['06850','06851','06854','06855'], areaCodes: ['203'], count: 8 },
      { name: 'Danbury', county: 'Fairfield', zips: ['06810','06811'], areaCodes: ['203'], count: 5 },
      { name: 'New Britain', county: 'Hartford', zips: ['06050','06051','06053'], areaCodes: ['860'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'HIC', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'NLC', type: 'New Licensing Contractor', classification: 'General Building', weight: 20 },
    ],
    genLicense: (prefix) => `CT-${prefix}-${randInt(100000, 999999)}`,
  },
  DE: {
    name: 'Delaware', dataSource: 'DE_DLLR', sourceUrlTemplate: (num) => `https://dpr.delaware.gov/?id=${num}`,
    cities: [
      { name: 'Wilmington', county: 'New Castle', zips: ['19801','19802','19803','19804','19805','19806','19809','19810'], areaCodes: ['302'], count: 35 },
      { name: 'Dover', county: 'Kent', zips: ['19901','19902','19904'], areaCodes: ['302'], count: 20 },
      { name: 'Newark', county: 'New Castle', zips: ['19711','19713','19716'], areaCodes: ['302'], count: 18 },
      { name: 'Middletown', county: 'New Castle', zips: ['19709'], areaCodes: ['302'], count: 10 },
      { name: 'Bear', county: 'New Castle', zips: ['19701'], areaCodes: ['302'], count: 7 },
      { name: 'Smyrna', county: 'Kent', zips: ['19977'], areaCodes: ['302'], count: 5 },
      { name: 'Milford', county: 'Sussex', zips: ['19963'], areaCodes: ['302'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `DE-${prefix}-${randInt(10000, 99999)}`,
  },
  HI: {
    name: 'Hawaii', dataSource: 'HI_DCCA', sourceUrlTemplate: (num) => `https://pvl.ehawaii.gov/pvlsearch/?id=${num}`,
    cities: [
      { name: 'Honolulu', county: 'Honolulu', zips: ['96801','96813','96814','96815','96816','96817','96818','96819','96822'], areaCodes: ['808'], count: 40 },
      { name: 'Kailua', county: 'Honolulu', zips: ['96734'], areaCodes: ['808'], count: 15 },
      { name: 'Pearl City', county: 'Honolulu', zips: ['96782'], areaCodes: ['808'], count: 12 },
      { name: 'Hilo', county: 'Hawaii', zips: ['96720','96721'], areaCodes: ['808'], count: 10 },
      { name: 'Kaneohe', county: 'Honolulu', zips: ['96744'], areaCodes: ['808'], count: 8 },
      { name: 'Waipahu', county: 'Honolulu', zips: ['96797'], areaCodes: ['808'], count: 8 },
      { name: 'Kapolei', county: 'Honolulu', zips: ['96707'], areaCodes: ['808'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 15 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 10 },
    ],
    genLicense: (prefix) => `HI-${prefix}-${randInt(10000, 99999)}`,
  },
  ID: {
    name: 'Idaho', dataSource: 'ID_DBS', sourceUrlTemplate: (num) => `https://apps.dbs.idaho.gov/licensing/?id=${num}`,
    cities: [
      { name: 'Boise', county: 'Ada', zips: ['83701','83702','83703','83704','83705','83706','83709','83712','83713','83716'], areaCodes: ['208'], count: 30 },
      { name: 'Meridian', county: 'Ada', zips: ['83642','83646'], areaCodes: ['208'], count: 18 },
      { name: 'Nampa', county: 'Canyon', zips: ['83651','83653','83687'], areaCodes: ['208'], count: 15 },
      { name: 'Idaho Falls', county: 'Bonneville', zips: ['83401','83402','83404'], areaCodes: ['208'], count: 10 },
      { name: 'Pocatello', county: 'Bannock', zips: ['83201','83204'], areaCodes: ['208'], count: 8 },
      { name: 'Caldwell', county: 'Canyon', zips: ['83605','83607'], areaCodes: ['208'], count: 7 },
      { name: 'Twin Falls', county: 'Twin Falls', zips: ['83301','83303'], areaCodes: ['208'], count: 7 },
      { name: "Coeur d'Alene", county: 'Kootenai', zips: ['83814','83815'], areaCodes: ['208'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'HVAC Contractor', classification: 'HVAC', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `ID-${prefix}-${randInt(10000, 99999)}`,
  },
  IN: {
    name: 'Indiana', dataSource: 'IN_PLA', sourceUrlTemplate: (num) => `https://mylicense.in.gov/everification/?id=${num}`,
    cities: [
      { name: 'Indianapolis', county: 'Marion', zips: ['46201','46202','46203','46204','46205','46208','46214','46217','46218','46220','46221','46224','46225','46226','46227','46228'], areaCodes: ['317'], count: 25 },
      { name: 'Fort Wayne', county: 'Allen', zips: ['46801','46802','46803','46804','46805','46806','46807','46808','46809'], areaCodes: ['260'], count: 15 },
      { name: 'Evansville', county: 'Vanderburgh', zips: ['47701','47708','47710','47711','47712','47713','47714'], areaCodes: ['812'], count: 12 },
      { name: 'South Bend', county: 'St. Joseph', zips: ['46601','46613','46614','46615','46616','46617'], areaCodes: ['574'], count: 10 },
      { name: 'Carmel', county: 'Hamilton', zips: ['46032','46033'], areaCodes: ['317'], count: 10 },
      { name: 'Fishers', county: 'Hamilton', zips: ['46037','46038'], areaCodes: ['317'], count: 8 },
      { name: 'Bloomington', county: 'Monroe', zips: ['47401','47403','47404','47408'], areaCodes: ['812'], count: 8 },
      { name: 'Hammond', county: 'Lake', zips: ['46320','46323','46324','46327'], areaCodes: ['219'], count: 7 },
      { name: 'Lafayette', county: 'Tippecanoe', zips: ['47901','47904','47905'], areaCodes: ['765'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `IN-${prefix}-${randInt(100000, 999999)}`,
  },
  IA: {
    name: 'Iowa', dataSource: 'IA_DIA', sourceUrlTemplate: (num) => `https://eservices.iowa.gov/licensediniowa/?id=${num}`,
    cities: [
      { name: 'Des Moines', county: 'Polk', zips: ['50301','50309','50310','50311','50312','50313','50314','50315','50316','50317'], areaCodes: ['515'], count: 25 },
      { name: 'Cedar Rapids', county: 'Linn', zips: ['52401','52402','52403','52404','52405'], areaCodes: ['319'], count: 18 },
      { name: 'Davenport', county: 'Scott', zips: ['52801','52802','52803','52804','52806','52807'], areaCodes: ['563'], count: 15 },
      { name: 'Sioux City', county: 'Woodbury', zips: ['51101','51103','51104','51105','51106'], areaCodes: ['712'], count: 12 },
      { name: 'Iowa City', county: 'Johnson', zips: ['52240','52242','52245','52246'], areaCodes: ['319'], count: 10 },
      { name: 'Waterloo', county: 'Black Hawk', zips: ['50701','50702','50703'], areaCodes: ['319'], count: 8 },
      { name: 'Ames', county: 'Story', zips: ['50010','50011','50014'], areaCodes: ['515'], count: 7 },
      { name: 'Council Bluffs', county: 'Pottawattamie', zips: ['51501','51503'], areaCodes: ['712'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 30 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `IA-${prefix}-${randInt(10000, 99999)}`,
  },
  KS: {
    name: 'Kansas', dataSource: 'KS_AG', sourceUrlTemplate: (num) => `https://www.ink.org/profreg/?id=${num}`,
    cities: [
      { name: 'Wichita', county: 'Sedgwick', zips: ['67201','67202','67203','67204','67205','67206','67207','67208','67209','67210','67211','67212','67213','67214','67216','67217','67218','67219','67220'], areaCodes: ['316'], count: 25 },
      { name: 'Overland Park', county: 'Johnson', zips: ['66204','66207','66210','66212','66213','66214','66221','66223'], areaCodes: ['913'], count: 20 },
      { name: 'Kansas City', county: 'Wyandotte', zips: ['66101','66102','66103','66104','66105','66106','66109','66111','66112'], areaCodes: ['913'], count: 18 },
      { name: 'Topeka', county: 'Shawnee', zips: ['66601','66603','66604','66605','66606','66607','66608','66609','66610','66611','66612','66614','66615','66616','66617','66618','66619'], areaCodes: ['785'], count: 12 },
      { name: 'Olathe', county: 'Johnson', zips: ['66061','66062'], areaCodes: ['913'], count: 10 },
      { name: 'Lawrence', county: 'Douglas', zips: ['66044','66045','66046','66047','66049'], areaCodes: ['785'], count: 8 },
      { name: 'Manhattan', county: 'Riley', zips: ['66502','66503','66506'], areaCodes: ['785'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `KS-${prefix}-${randInt(10000, 99999)}`,
  },
  KY: {
    name: 'Kentucky', dataSource: 'KY_DHBC', sourceUrlTemplate: (num) => `https://dhbc.ky.gov/Licensure/?lic=${num}`,
    cities: [
      { name: 'Louisville', county: 'Jefferson', zips: ['40201','40202','40203','40204','40205','40206','40207','40208','40209','40210','40211','40212','40213','40214','40215','40216','40217','40218','40219','40220'], areaCodes: ['502'], count: 28 },
      { name: 'Lexington', county: 'Fayette', zips: ['40502','40503','40504','40505','40506','40507','40508','40509','40510','40511','40513','40514','40515','40516','40517'], areaCodes: ['859'], count: 22 },
      { name: 'Bowling Green', county: 'Warren', zips: ['42101','42103','42104'], areaCodes: ['270'], count: 15 },
      { name: 'Owensboro', county: 'Daviess', zips: ['42301','42303'], areaCodes: ['270'], count: 10 },
      { name: 'Covington', county: 'Kenton', zips: ['41011','41014','41015','41016','41017'], areaCodes: ['859'], count: 8 },
      { name: 'Richmond', county: 'Madison', zips: ['40475','40476'], areaCodes: ['859'], count: 8 },
      { name: 'Georgetown', county: 'Scott', zips: ['40324'], areaCodes: ['502'], count: 5 },
      { name: 'Florence', county: 'Boone', zips: ['41042'], areaCodes: ['859'], count: 4 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `KY-${prefix}-${randInt(10000, 99999)}`,
  },
  LA: {
    name: 'Louisiana', dataSource: 'LA_LSLBC', sourceUrlTemplate: (num) => `https://www.lslbc.louisiana.gov/contractor-search/?id=${num}`,
    cities: [
      { name: 'New Orleans', county: 'Orleans', zips: ['70112','70113','70114','70115','70116','70117','70118','70119','70122','70124','70125','70126','70127','70128','70130','70131'], areaCodes: ['504'], count: 25 },
      { name: 'Baton Rouge', county: 'East Baton Rouge', zips: ['70801','70802','70805','70806','70807','70808','70809','70810','70811','70812','70814','70815','70816','70817','70818','70819','70820'], areaCodes: ['225'], count: 20 },
      { name: 'Shreveport', county: 'Caddo', zips: ['71101','71103','71104','71105','71106','71107','71108','71109'], areaCodes: ['318'], count: 15 },
      { name: 'Lafayette', county: 'Lafayette', zips: ['70501','70503','70506','70507','70508'], areaCodes: ['337'], count: 12 },
      { name: 'Lake Charles', county: 'Calcasieu', zips: ['70601','70605','70607'], areaCodes: ['337'], count: 10 },
      { name: 'Metairie', county: 'Jefferson', zips: ['70001','70002','70003','70005','70006'], areaCodes: ['504'], count: 8 },
      { name: 'Kenner', county: 'Jefferson', zips: ['70062','70065'], areaCodes: ['504'], count: 5 },
      { name: 'Houma', county: 'Terrebonne', zips: ['70360','70363','70364'], areaCodes: ['985'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'RC', type: 'Residential Contractor', classification: 'Residential', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 15 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 10 },
    ],
    genLicense: (prefix) => `LA-${prefix}-${randInt(10000, 99999)}`,
  },
  ME: {
    name: 'Maine', dataSource: 'ME_OPLA', sourceUrlTemplate: (num) => `https://www.maine.gov/pfr/professionallicensing/?id=${num}`,
    cities: [
      { name: 'Portland', county: 'Cumberland', zips: ['04101','04102','04103'], areaCodes: ['207'], count: 30 },
      { name: 'Lewiston', county: 'Androscoggin', zips: ['04240','04241'], areaCodes: ['207'], count: 18 },
      { name: 'Bangor', county: 'Penobscot', zips: ['04401','04402'], areaCodes: ['207'], count: 15 },
      { name: 'South Portland', county: 'Cumberland', zips: ['04106'], areaCodes: ['207'], count: 12 },
      { name: 'Auburn', county: 'Androscoggin', zips: ['04210','04211'], areaCodes: ['207'], count: 10 },
      { name: 'Biddeford', county: 'York', zips: ['04005'], areaCodes: ['207'], count: 8 },
      { name: 'Scarborough', county: 'Cumberland', zips: ['04074'], areaCodes: ['207'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'OC', type: 'Oil Burner Contractor', classification: 'HVAC', weight: 20 },
    ],
    genLicense: (prefix) => `ME-${prefix}-${randInt(10000, 99999)}`,
  },
  MD: {
    name: 'Maryland', dataSource: 'MD_DLLR', sourceUrlTemplate: (num) => `https://www.dllr.state.md.us/license/mhic/?id=${num}`,
    cities: [
      { name: 'Baltimore', county: 'Baltimore City', zips: ['21201','21202','21205','21206','21207','21208','21209','21210','21211','21212','21213','21214','21215','21216','21217','21218'], areaCodes: ['410','443'], count: 25 },
      { name: 'Columbia', county: 'Howard', zips: ['21044','21045','21046'], areaCodes: ['410'], count: 15 },
      { name: 'Silver Spring', county: 'Montgomery', zips: ['20901','20902','20903','20904','20906','20910'], areaCodes: ['301','240'], count: 12 },
      { name: 'Germantown', county: 'Montgomery', zips: ['20874','20876'], areaCodes: ['301'], count: 10 },
      { name: 'Frederick', county: 'Frederick', zips: ['21701','21702','21703'], areaCodes: ['301'], count: 10 },
      { name: 'Rockville', county: 'Montgomery', zips: ['20850','20851','20852'], areaCodes: ['301'], count: 8 },
      { name: 'Annapolis', county: 'Anne Arundel', zips: ['21401','21403','21409'], areaCodes: ['410'], count: 8 },
      { name: 'Bethesda', county: 'Montgomery', zips: ['20810','20814','20817'], areaCodes: ['301'], count: 7 },
      { name: 'Bowie', county: "Prince George's", zips: ['20715','20716','20720','20721'], areaCodes: ['301'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'MHIC', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 40 },
      { prefix: 'EC', type: 'Master Electrician', classification: 'Electrical', weight: 25 },
      { prefix: 'MP', type: 'Master Plumber', classification: 'Plumbing', weight: 20 },
      { prefix: 'HC', type: 'HVAC Contractor', classification: 'HVAC', weight: 15 },
    ],
    genLicense: (prefix) => `${prefix}-${randInt(100000, 999999)}`,
  },
  MA: {
    name: 'Massachusetts', dataSource: 'MA_DPL', sourceUrlTemplate: (num) => `https://www.mass.gov/dpl/?id=${num}`,
    cities: [
      { name: 'Boston', county: 'Suffolk', zips: ['02101','02108','02109','02110','02111','02113','02114','02115','02116','02118','02119','02120','02121','02122','02124','02125','02126','02127','02128'], areaCodes: ['617','857'], count: 25 },
      { name: 'Worcester', county: 'Worcester', zips: ['01601','01602','01603','01604','01605','01606','01607','01608','01609','01610'], areaCodes: ['508'], count: 15 },
      { name: 'Springfield', county: 'Hampden', zips: ['01101','01103','01104','01105','01107','01108','01109'], areaCodes: ['413'], count: 12 },
      { name: 'Cambridge', county: 'Middlesex', zips: ['02138','02139','02140','02141','02142'], areaCodes: ['617'], count: 10 },
      { name: 'Lowell', county: 'Middlesex', zips: ['01850','01851','01852','01854'], areaCodes: ['978'], count: 8 },
      { name: 'Brockton', county: 'Plymouth', zips: ['02301','02302'], areaCodes: ['508'], count: 8 },
      { name: 'New Bedford', county: 'Bristol', zips: ['02740','02744','02746'], areaCodes: ['508'], count: 7 },
      { name: 'Fall River', county: 'Bristol', zips: ['02720','02721','02723','02724'], areaCodes: ['508'], count: 5 },
      { name: 'Quincy', county: 'Norfolk', zips: ['02169','02170','02171'], areaCodes: ['617'], count: 5 },
      { name: 'Newton', county: 'Middlesex', zips: ['02458','02459','02460','02461','02462','02464','02465','02466','02467','02468'], areaCodes: ['617'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'CS', type: 'Construction Supervisor', classification: 'General Building', weight: 30 },
      { prefix: 'HIC', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 25 },
      { prefix: 'EC', type: 'Master Electrician', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Master Plumber', classification: 'Plumbing', weight: 15 },
      { prefix: 'SC', type: 'Sheet Metal Contractor', classification: 'Mechanical', weight: 10 },
    ],
    genLicense: (prefix) => `MA-${prefix}-${randInt(100000, 999999)}`,
  },
  MI: {
    name: 'Michigan', dataSource: 'MI_LARA', sourceUrlTemplate: (num) => `https://aca-prod.accela.com/MILARA/?id=${num}`,
    cities: [
      { name: 'Detroit', county: 'Wayne', zips: ['48201','48202','48204','48205','48206','48207','48208','48209','48210','48211','48212','48213','48214','48215','48216','48217','48219','48221','48223','48224','48226','48227','48228'], areaCodes: ['313'], count: 22 },
      { name: 'Grand Rapids', county: 'Kent', zips: ['49501','49503','49504','49505','49506','49507','49508','49509','49512','49525'], areaCodes: ['616'], count: 18 },
      { name: 'Warren', county: 'Macomb', zips: ['48088','48089','48091','48092','48093'], areaCodes: ['586'], count: 12 },
      { name: 'Sterling Heights', county: 'Macomb', zips: ['48310','48312','48313','48314'], areaCodes: ['586'], count: 10 },
      { name: 'Ann Arbor', county: 'Washtenaw', zips: ['48103','48104','48105','48108','48109'], areaCodes: ['734'], count: 10 },
      { name: 'Lansing', county: 'Ingham', zips: ['48901','48906','48910','48911','48912','48915'], areaCodes: ['517'], count: 8 },
      { name: 'Kalamazoo', county: 'Kalamazoo', zips: ['49001','49006','49007','49008','49009'], areaCodes: ['269'], count: 7 },
      { name: 'Flint', county: 'Genesee', zips: ['48501','48502','48503','48504','48505','48506','48507'], areaCodes: ['810'], count: 5 },
      { name: 'Dearborn', county: 'Wayne', zips: ['48120','48124','48126','48128'], areaCodes: ['313'], count: 5 },
      { name: 'Rochester Hills', county: 'Oakland', zips: ['48306','48307','48309'], areaCodes: ['248'], count: 3 },
    ],
    licenseTypes: [
      { prefix: 'BC', type: 'Building Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'RC', type: 'Residential Builder', classification: 'Residential', weight: 10 },
    ],
    genLicense: (prefix) => `MI-${prefix}-${randInt(100000, 999999)}`,
  },
  MN: {
    name: 'Minnesota', dataSource: 'MN_DLI', sourceUrlTemplate: (num) => `https://www.dli.mn.gov/?id=${num}`,
    cities: [
      { name: 'Minneapolis', county: 'Hennepin', zips: ['55401','55402','55403','55404','55405','55406','55407','55408','55409','55410','55411','55412','55413','55414','55415','55416','55417','55418'], areaCodes: ['612'], count: 22 },
      { name: 'St. Paul', county: 'Ramsey', zips: ['55101','55102','55103','55104','55105','55106','55107','55108','55116','55117','55119'], areaCodes: ['651'], count: 18 },
      { name: 'Rochester', county: 'Olmsted', zips: ['55901','55902','55904','55906'], areaCodes: ['507'], count: 12 },
      { name: 'Duluth', county: 'St. Louis', zips: ['55801','55802','55803','55804','55805','55806','55807','55808','55811','55812'], areaCodes: ['218'], count: 10 },
      { name: 'Bloomington', county: 'Hennepin', zips: ['55420','55425','55431','55435','55437','55438'], areaCodes: ['952'], count: 10 },
      { name: 'Brooklyn Park', county: 'Hennepin', zips: ['55428','55443','55444','55445'], areaCodes: ['763'], count: 8 },
      { name: 'Plymouth', county: 'Hennepin', zips: ['55441','55442','55446','55447'], areaCodes: ['763'], count: 7 },
      { name: 'Maple Grove', county: 'Hennepin', zips: ['55311','55369'], areaCodes: ['763'], count: 5 },
      { name: 'Eagan', county: 'Dakota', zips: ['55121','55122','55123'], areaCodes: ['651'], count: 5 },
      { name: 'Woodbury', county: 'Washington', zips: ['55125','55129'], areaCodes: ['651'], count: 3 },
    ],
    licenseTypes: [
      { prefix: 'BC', type: 'Building Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `MN-${prefix}-${randInt(100000, 999999)}`,
  },
  MS: {
    name: 'Mississippi', dataSource: 'MS_SBC', sourceUrlTemplate: (num) => `https://www.msboc.us/search/?id=${num}`,
    cities: [
      { name: 'Jackson', county: 'Hinds', zips: ['39201','39202','39203','39204','39206','39209','39211','39212','39213'], areaCodes: ['601'], count: 30 },
      { name: 'Gulfport', county: 'Harrison', zips: ['39501','39503','39507'], areaCodes: ['228'], count: 18 },
      { name: 'Southaven', county: 'DeSoto', zips: ['38671','38672'], areaCodes: ['662'], count: 12 },
      { name: 'Hattiesburg', county: 'Forrest', zips: ['39401','39402'], areaCodes: ['601'], count: 12 },
      { name: 'Biloxi', county: 'Harrison', zips: ['39530','39531','39532','39534'], areaCodes: ['228'], count: 10 },
      { name: 'Meridian', county: 'Lauderdale', zips: ['39301','39305','39307'], areaCodes: ['601'], count: 8 },
      { name: 'Tupelo', county: 'Lee', zips: ['38801','38804'], areaCodes: ['662'], count: 5 },
      { name: 'Olive Branch', county: 'DeSoto', zips: ['38654'], areaCodes: ['662'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'RC', type: 'Residential Builder', classification: 'Residential', weight: 30 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 20 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 15 },
    ],
    genLicense: (prefix) => `MS-${prefix}-${randInt(10000, 99999)}`,
  },
  MO: {
    name: 'Missouri', dataSource: 'MO_AG', sourceUrlTemplate: (num) => `https://ago.mo.gov/?id=${num}`,
    cities: [
      { name: 'Kansas City', county: 'Jackson', zips: ['64101','64102','64105','64106','64108','64109','64110','64111','64112','64113','64114','64116','64117','64118','64119','64120','64123','64124','64126','64127','64128','64129','64130'], areaCodes: ['816'], count: 25 },
      { name: 'St. Louis', county: 'St. Louis City', zips: ['63101','63102','63103','63104','63106','63107','63108','63109','63110','63111','63112','63113','63115','63116','63118','63120'], areaCodes: ['314'], count: 22 },
      { name: 'Springfield', county: 'Greene', zips: ['65801','65802','65803','65804','65806','65807','65809','65810'], areaCodes: ['417'], count: 15 },
      { name: 'Columbia', county: 'Boone', zips: ['65201','65202','65203'], areaCodes: ['573'], count: 10 },
      { name: 'Independence', county: 'Jackson', zips: ['64050','64052','64053','64054','64055','64056','64057','64058'], areaCodes: ['816'], count: 8 },
      { name: "Lee's Summit", county: 'Jackson', zips: ['64063','64064','64081','64082','64086'], areaCodes: ['816'], count: 7 },
      { name: "O'Fallon", county: 'St. Charles', zips: ['63366','63368'], areaCodes: ['636'], count: 5 },
      { name: 'St. Joseph', county: 'Buchanan', zips: ['64501','64503','64504','64506','64507'], areaCodes: ['816'], count: 5 },
      { name: 'St. Charles', county: 'St. Charles', zips: ['63301','63303','63304'], areaCodes: ['636'], count: 3 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `MO-${prefix}-${randInt(10000, 99999)}`,
  },
  MT: {
    name: 'Montana', dataSource: 'MT_DLI', sourceUrlTemplate: (num) => `https://bsd.dli.mt.gov/?id=${num}`,
    cities: [
      { name: 'Billings', county: 'Yellowstone', zips: ['59101','59102','59105','59106'], areaCodes: ['406'], count: 28 },
      { name: 'Missoula', county: 'Missoula', zips: ['59801','59802','59803','59808'], areaCodes: ['406'], count: 22 },
      { name: 'Great Falls', county: 'Cascade', zips: ['59401','59404','59405'], areaCodes: ['406'], count: 15 },
      { name: 'Bozeman', county: 'Gallatin', zips: ['59715','59718'], areaCodes: ['406'], count: 12 },
      { name: 'Helena', county: 'Lewis and Clark', zips: ['59601','59602'], areaCodes: ['406'], count: 10 },
      { name: 'Kalispell', county: 'Flathead', zips: ['59901','59903'], areaCodes: ['406'], count: 8 },
      { name: 'Butte', county: 'Silver Bow', zips: ['59701','59703'], areaCodes: ['406'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `MT-${prefix}-${randInt(10000, 99999)}`,
  },
  NE: {
    name: 'Nebraska', dataSource: 'NE_DHHS', sourceUrlTemplate: (num) => `https://dhhs.ne.gov/licensure/?id=${num}`,
    cities: [
      { name: 'Omaha', county: 'Douglas', zips: ['68101','68102','68104','68105','68106','68107','68108','68110','68111','68112','68114','68116','68117','68118','68122','68124','68127','68130'], areaCodes: ['402'], count: 30 },
      { name: 'Lincoln', county: 'Lancaster', zips: ['68501','68502','68503','68504','68505','68506','68507','68508','68510','68512','68516','68521','68522','68524'], areaCodes: ['402'], count: 25 },
      { name: 'Bellevue', county: 'Sarpy', zips: ['68005','68123'], areaCodes: ['402'], count: 12 },
      { name: 'Grand Island', county: 'Hall', zips: ['68801','68803'], areaCodes: ['308'], count: 10 },
      { name: 'Kearney', county: 'Buffalo', zips: ['68845','68847','68849'], areaCodes: ['308'], count: 8 },
      { name: 'Fremont', county: 'Dodge', zips: ['68025','68026'], areaCodes: ['402'], count: 8 },
      { name: 'Norfolk', county: 'Madison', zips: ['68701','68702'], areaCodes: ['402'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 30 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `NE-${prefix}-${randInt(10000, 99999)}`,
  },
  NV: {
    name: 'Nevada', dataSource: 'NV_NSCB', sourceUrlTemplate: (num) => `https://app.nvcontractorsboard.com/?id=${num}`,
    cities: [
      { name: 'Las Vegas', county: 'Clark', zips: ['89101','89102','89103','89104','89106','89107','89108','89109','89110','89113','89115','89117','89119','89120','89121','89122','89123','89128','89129','89130'], areaCodes: ['702'], count: 30 },
      { name: 'Henderson', county: 'Clark', zips: ['89002','89011','89012','89014','89015','89052','89074'], areaCodes: ['702'], count: 18 },
      { name: 'Reno', county: 'Washoe', zips: ['89501','89502','89503','89506','89509','89511','89512'], areaCodes: ['775'], count: 18 },
      { name: 'North Las Vegas', county: 'Clark', zips: ['89030','89031','89032','89033','89036'], areaCodes: ['702'], count: 10 },
      { name: 'Sparks', county: 'Washoe', zips: ['89431','89434','89436'], areaCodes: ['775'], count: 8 },
      { name: 'Carson City', county: 'Carson City', zips: ['89701','89703','89706'], areaCodes: ['775'], count: 8 },
      { name: 'Summerlin', county: 'Clark', zips: ['89134','89135','89138','89144','89145'], areaCodes: ['702'], count: 8 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'HVAC', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 15 },
    ],
    genLicense: (prefix) => `NV-${prefix}-${randInt(10000, 99999)}`,
  },
  NH: {
    name: 'New Hampshire', dataSource: 'NH_OPLA', sourceUrlTemplate: (num) => `https://www.oplc.nh.gov/?id=${num}`,
    cities: [
      { name: 'Manchester', county: 'Hillsborough', zips: ['03101','03102','03103','03104','03109'], areaCodes: ['603'], count: 30 },
      { name: 'Nashua', county: 'Hillsborough', zips: ['03060','03062','03063','03064'], areaCodes: ['603'], count: 22 },
      { name: 'Concord', county: 'Merrimack', zips: ['03301','03303','03304','03305'], areaCodes: ['603'], count: 18 },
      { name: 'Dover', county: 'Strafford', zips: ['03820','03821'], areaCodes: ['603'], count: 12 },
      { name: 'Rochester', county: 'Strafford', zips: ['03867','03868'], areaCodes: ['603'], count: 8 },
      { name: 'Keene', county: 'Cheshire', zips: ['03431'], areaCodes: ['603'], count: 5 },
      { name: 'Laconia', county: 'Belknap', zips: ['03246'], areaCodes: ['603'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'ME', type: 'Master Electrician', classification: 'Electrical', weight: 30 },
      { prefix: 'JE', type: 'Journeyman Electrician', classification: 'Electrical', weight: 25 },
      { prefix: 'MP', type: 'Master Plumber', classification: 'Plumbing', weight: 25 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 20 },
    ],
    genLicense: (prefix) => `NH-${prefix}-${randInt(10000, 99999)}`,
  },
  NJ: {
    name: 'New Jersey', dataSource: 'NJ_DCA', sourceUrlTemplate: (num) => `https://newjersey.mylicense.com/verification/?id=${num}`,
    cities: [
      { name: 'Newark', county: 'Essex', zips: ['07101','07102','07103','07104','07105','07106','07107','07108','07112','07114'], areaCodes: ['973','862'], count: 18 },
      { name: 'Jersey City', county: 'Hudson', zips: ['07302','07304','07305','07306','07307','07310','07311'], areaCodes: ['201','551'], count: 15 },
      { name: 'Paterson', county: 'Passaic', zips: ['07501','07502','07503','07504','07505','07513','07514'], areaCodes: ['973'], count: 12 },
      { name: 'Elizabeth', county: 'Union', zips: ['07201','07202','07206','07208'], areaCodes: ['908'], count: 10 },
      { name: 'Trenton', county: 'Mercer', zips: ['08601','08608','08609','08610','08611'], areaCodes: ['609'], count: 10 },
      { name: 'Edison', county: 'Middlesex', zips: ['08817','08818','08820'], areaCodes: ['732'], count: 8 },
      { name: 'Woodbridge', county: 'Middlesex', zips: ['07095'], areaCodes: ['732'], count: 8 },
      { name: 'Toms River', county: 'Ocean', zips: ['08753','08755','08757'], areaCodes: ['732'], count: 7 },
      { name: 'Cherry Hill', county: 'Camden', zips: ['08002','08003','08034'], areaCodes: ['856'], count: 7 },
      { name: 'Hamilton', county: 'Mercer', zips: ['08610','08619','08620','08690'], areaCodes: ['609'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'HIC', type: 'Home Improvement Contractor', classification: 'Home Improvement', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'HVAC Contractor', classification: 'HVAC', weight: 20 },
    ],
    genLicense: (prefix) => `NJ-${prefix}-${randInt(100000, 999999)}`,
  },
  NM: {
    name: 'New Mexico', dataSource: 'NM_RLD', sourceUrlTemplate: (num) => `https://www.rld.nm.gov/?id=${num}`,
    cities: [
      { name: 'Albuquerque', county: 'Bernalillo', zips: ['87101','87102','87104','87105','87106','87107','87108','87109','87110','87111','87112','87113','87114','87120','87121','87122','87123'], areaCodes: ['505'], count: 30 },
      { name: 'Las Cruces', county: 'Dona Ana', zips: ['88001','88005','88007','88011','88012'], areaCodes: ['575'], count: 18 },
      { name: 'Rio Rancho', county: 'Sandoval', zips: ['87124','87144'], areaCodes: ['505'], count: 15 },
      { name: 'Santa Fe', county: 'Santa Fe', zips: ['87501','87505','87507'], areaCodes: ['505'], count: 12 },
      { name: 'Roswell', county: 'Chaves', zips: ['88201','88203'], areaCodes: ['575'], count: 8 },
      { name: 'Farmington', county: 'San Juan', zips: ['87401','87402'], areaCodes: ['505'], count: 7 },
      { name: 'South Valley', county: 'Bernalillo', zips: ['87105'], areaCodes: ['505'], count: 5 },
      { name: 'Los Lunas', county: 'Valencia', zips: ['87031'], areaCodes: ['505'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GB', type: 'General Building Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EE', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'MM', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'PP', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'LP', type: 'Landscape Contractor', classification: 'Landscaping', weight: 10 },
    ],
    genLicense: (prefix) => `NM-${prefix}-${randInt(10000, 99999)}`,
  },
  ND: {
    name: 'North Dakota', dataSource: 'ND_SOS', sourceUrlTemplate: (num) => `https://firststop.sos.nd.gov/?id=${num}`,
    cities: [
      { name: 'Fargo', county: 'Cass', zips: ['58102','58103','58104'], areaCodes: ['701'], count: 30 },
      { name: 'Bismarck', county: 'Burleigh', zips: ['58501','58503','58504','58505'], areaCodes: ['701'], count: 25 },
      { name: 'Grand Forks', county: 'Grand Forks', zips: ['58201','58203'], areaCodes: ['701'], count: 18 },
      { name: 'Minot', county: 'Ward', zips: ['58701','58703'], areaCodes: ['701'], count: 12 },
      { name: 'West Fargo', county: 'Cass', zips: ['58078'], areaCodes: ['701'], count: 8 },
      { name: 'Williston', county: 'Williams', zips: ['58801','58802'], areaCodes: ['701'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `ND-${prefix}-${randInt(10000, 99999)}`,
  },
  OK: {
    name: 'Oklahoma', dataSource: 'OK_CIB', sourceUrlTemplate: (num) => `https://cib.ok.gov/?id=${num}`,
    cities: [
      { name: 'Oklahoma City', county: 'Oklahoma', zips: ['73101','73102','73103','73104','73105','73106','73107','73108','73109','73110','73111','73112','73114','73116','73118','73119','73120','73121','73122','73127','73129'], areaCodes: ['405'], count: 28 },
      { name: 'Tulsa', county: 'Tulsa', zips: ['74101','74103','74104','74105','74106','74107','74108','74110','74112','74114','74115','74116','74119','74120'], areaCodes: ['918'], count: 22 },
      { name: 'Norman', county: 'Cleveland', zips: ['73019','73069','73071','73072'], areaCodes: ['405'], count: 12 },
      { name: 'Broken Arrow', county: 'Tulsa', zips: ['74011','74012','74014'], areaCodes: ['918'], count: 10 },
      { name: 'Edmond', county: 'Oklahoma', zips: ['73003','73012','73013','73034'], areaCodes: ['405'], count: 8 },
      { name: 'Lawton', county: 'Comanche', zips: ['73501','73505','73507'], areaCodes: ['580'], count: 7 },
      { name: 'Moore', county: 'Cleveland', zips: ['73160'], areaCodes: ['405'], count: 7 },
      { name: 'Midwest City', county: 'Oklahoma', zips: ['73110','73130'], areaCodes: ['405'], count: 6 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 10 },
    ],
    genLicense: (prefix) => `OK-${prefix}-${randInt(10000, 99999)}`,
  },
  OR: {
    name: 'Oregon', dataSource: 'OR_CCB', sourceUrlTemplate: (num) => `https://search.ccb.state.or.us/?id=${num}`,
    cities: [
      { name: 'Portland', county: 'Multnomah', zips: ['97201','97202','97203','97204','97205','97206','97209','97210','97211','97212','97213','97214','97215','97216','97217','97218','97219','97220','97221','97222','97223','97225'], areaCodes: ['503','971'], count: 25 },
      { name: 'Salem', county: 'Marion', zips: ['97301','97302','97303','97304','97305','97306','97317'], areaCodes: ['503'], count: 18 },
      { name: 'Eugene', county: 'Lane', zips: ['97401','97402','97403','97404','97405'], areaCodes: ['541'], count: 15 },
      { name: 'Gresham', county: 'Multnomah', zips: ['97030','97080'], areaCodes: ['503'], count: 10 },
      { name: 'Hillsboro', county: 'Washington', zips: ['97123','97124'], areaCodes: ['503'], count: 8 },
      { name: 'Bend', county: 'Deschutes', zips: ['97701','97702','97703'], areaCodes: ['541'], count: 8 },
      { name: 'Beaverton', county: 'Washington', zips: ['97005','97006','97007','97008'], areaCodes: ['503'], count: 8 },
      { name: 'Medford', county: 'Jackson', zips: ['97501','97504'], areaCodes: ['541'], count: 5 },
      { name: 'Corvallis', county: 'Benton', zips: ['97330','97333'], areaCodes: ['541'], count: 3 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 15 },
      { prefix: 'RC', type: 'Residential Contractor', classification: 'Residential', weight: 10 },
      { prefix: 'LC', type: 'Limited Contractor', classification: 'Limited', weight: 10 },
    ],
    genLicense: () => `CCB-${randInt(100000, 299999)}`,
  },
  RI: {
    name: 'Rhode Island', dataSource: 'RI_CRB', sourceUrlTemplate: (num) => `https://crb.ri.gov/search/?id=${num}`,
    cities: [
      { name: 'Providence', county: 'Providence', zips: ['02901','02903','02904','02905','02906','02907','02908','02909','02910','02911','02912'], areaCodes: ['401'], count: 30 },
      { name: 'Cranston', county: 'Providence', zips: ['02910','02920','02921'], areaCodes: ['401'], count: 18 },
      { name: 'Warwick', county: 'Kent', zips: ['02886','02888','02889','02893'], areaCodes: ['401'], count: 18 },
      { name: 'Pawtucket', county: 'Providence', zips: ['02860','02861'], areaCodes: ['401'], count: 12 },
      { name: 'East Providence', county: 'Providence', zips: ['02914','02916'], areaCodes: ['401'], count: 8 },
      { name: 'Woonsocket', county: 'Providence', zips: ['02895'], areaCodes: ['401'], count: 7 },
      { name: 'Cumberland', county: 'Providence', zips: ['02864'], areaCodes: ['401'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `RI-${prefix}-${randInt(10000, 99999)}`,
  },
  SC: {
    name: 'South Carolina', dataSource: 'SC_LLR', sourceUrlTemplate: (num) => `https://verify.llronline.com/LicLookup/?id=${num}`,
    cities: [
      { name: 'Charleston', county: 'Charleston', zips: ['29401','29403','29405','29407','29412','29414','29418'], areaCodes: ['843'], count: 25 },
      { name: 'Columbia', county: 'Richland', zips: ['29201','29203','29204','29205','29206','29209','29210','29223'], areaCodes: ['803'], count: 20 },
      { name: 'Greenville', county: 'Greenville', zips: ['29601','29605','29607','29609','29611','29615','29617'], areaCodes: ['864'], count: 18 },
      { name: 'Myrtle Beach', county: 'Horry', zips: ['29572','29575','29577','29579'], areaCodes: ['843'], count: 10 },
      { name: 'Rock Hill', county: 'York', zips: ['29730','29732','29733'], areaCodes: ['803'], count: 8 },
      { name: 'Mount Pleasant', county: 'Charleston', zips: ['29464','29466'], areaCodes: ['843'], count: 7 },
      { name: 'Summerville', county: 'Dorchester', zips: ['29483','29485','29486'], areaCodes: ['843'], count: 7 },
      { name: 'Florence', county: 'Florence', zips: ['29501','29505','29506'], areaCodes: ['843'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 25 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'RC', type: 'Residential Builder', classification: 'Residential', weight: 10 },
    ],
    genLicense: (prefix) => `SC-${prefix}-${randInt(10000, 99999)}`,
  },
  SD: {
    name: 'South Dakota', dataSource: 'SD_DLRS', sourceUrlTemplate: (num) => `https://dlr.sd.gov/?id=${num}`,
    cities: [
      { name: 'Sioux Falls', county: 'Minnehaha', zips: ['57101','57103','57104','57105','57106','57107','57108','57110'], areaCodes: ['605'], count: 35 },
      { name: 'Rapid City', county: 'Pennington', zips: ['57701','57702','57703'], areaCodes: ['605'], count: 25 },
      { name: 'Aberdeen', county: 'Brown', zips: ['57401','57402'], areaCodes: ['605'], count: 12 },
      { name: 'Brookings', county: 'Brookings', zips: ['57006','57007'], areaCodes: ['605'], count: 10 },
      { name: 'Mitchell', county: 'Davison', zips: ['57301'], areaCodes: ['605'], count: 8 },
      { name: 'Yankton', county: 'Yankton', zips: ['57078'], areaCodes: ['605'], count: 5 },
      { name: 'Pierre', county: 'Hughes', zips: ['57501'], areaCodes: ['605'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 30 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 25 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 25 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `SD-${prefix}-${randInt(10000, 99999)}`,
  },
  TN: {
    name: 'Tennessee', dataSource: 'TN_TBLC', sourceUrlTemplate: (num) => `https://verify.tn.gov/?id=${num}`,
    cities: [
      { name: 'Nashville', county: 'Davidson', zips: ['37201','37203','37204','37205','37206','37207','37208','37209','37210','37211','37212','37213','37214','37215','37216','37217','37218','37219','37220','37221','37222'], areaCodes: ['615'], count: 25 },
      { name: 'Memphis', county: 'Shelby', zips: ['38101','38103','38104','38105','38106','38107','38108','38109','38111','38112','38114','38115','38116','38117','38118','38119','38120'], areaCodes: ['901'], count: 20 },
      { name: 'Knoxville', county: 'Knox', zips: ['37901','37902','37909','37912','37914','37915','37916','37917','37918','37919','37920','37921','37922'], areaCodes: ['865'], count: 15 },
      { name: 'Chattanooga', county: 'Hamilton', zips: ['37401','37402','37403','37404','37405','37406','37407','37408','37409','37410','37411','37412','37415','37416'], areaCodes: ['423'], count: 12 },
      { name: 'Clarksville', county: 'Montgomery', zips: ['37040','37042','37043','37044'], areaCodes: ['931'], count: 8 },
      { name: 'Murfreesboro', county: 'Rutherford', zips: ['37127','37128','37129','37130','37131','37132','37133'], areaCodes: ['615'], count: 8 },
      { name: 'Franklin', county: 'Williamson', zips: ['37064','37067','37069'], areaCodes: ['615'], count: 7 },
      { name: 'Jackson', county: 'Madison', zips: ['38301','38305'], areaCodes: ['731'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'RC', type: 'Roofing Contractor', classification: 'Roofing', weight: 15 },
    ],
    genLicense: (prefix) => `TN-${prefix}-${randInt(10000, 99999)}`,
  },
  UT: {
    name: 'Utah', dataSource: 'UT_DOPL', sourceUrlTemplate: (num) => `https://dopl.utah.gov/verify/?id=${num}`,
    cities: [
      { name: 'Salt Lake City', county: 'Salt Lake', zips: ['84101','84102','84103','84104','84105','84106','84107','84108','84109','84111','84112','84113','84115','84116'], areaCodes: ['801','385'], count: 25 },
      { name: 'West Valley City', county: 'Salt Lake', zips: ['84119','84120','84128'], areaCodes: ['801'], count: 15 },
      { name: 'Provo', county: 'Utah', zips: ['84601','84604','84606'], areaCodes: ['801','385'], count: 15 },
      { name: 'West Jordan', county: 'Salt Lake', zips: ['84081','84084','84088'], areaCodes: ['801'], count: 10 },
      { name: 'Orem', county: 'Utah', zips: ['84057','84058','84059'], areaCodes: ['801'], count: 8 },
      { name: 'Sandy', county: 'Salt Lake', zips: ['84070','84092','84093','84094'], areaCodes: ['801'], count: 8 },
      { name: 'Ogden', county: 'Weber', zips: ['84401','84403','84404','84405'], areaCodes: ['801'], count: 7 },
      { name: 'St. George', county: 'Washington', zips: ['84770','84790','84791'], areaCodes: ['435'], count: 7 },
      { name: 'Layton', county: 'Davis', zips: ['84041','84042'], areaCodes: ['801'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Building Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'HVAC', weight: 15 },
      { prefix: 'RC', type: 'Residential Contractor', classification: 'Residential', weight: 10 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 10 },
    ],
    genLicense: (prefix) => `UT-${prefix}-${randInt(100000, 999999)}`,
  },
  VT: {
    name: 'Vermont', dataSource: 'VT_OPHER', sourceUrlTemplate: (num) => `https://sos.vermont.gov/opr/?id=${num}`,
    cities: [
      { name: 'Burlington', county: 'Chittenden', zips: ['05401','05403','05408'], areaCodes: ['802'], count: 30 },
      { name: 'South Burlington', county: 'Chittenden', zips: ['05403','05407'], areaCodes: ['802'], count: 18 },
      { name: 'Rutland', county: 'Rutland', zips: ['05701','05702'], areaCodes: ['802'], count: 15 },
      { name: 'Montpelier', county: 'Washington', zips: ['05601','05602'], areaCodes: ['802'], count: 12 },
      { name: 'Barre', county: 'Washington', zips: ['05641'], areaCodes: ['802'], count: 10 },
      { name: 'St. Albans', county: 'Franklin', zips: ['05478'], areaCodes: ['802'], count: 8 },
      { name: 'Bennington', county: 'Bennington', zips: ['05201'], areaCodes: ['802'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'ME', type: 'Master Electrician', classification: 'Electrical', weight: 30 },
      { prefix: 'JE', type: 'Journeyman Electrician', classification: 'Electrical', weight: 25 },
      { prefix: 'MP', type: 'Master Plumber', classification: 'Plumbing', weight: 25 },
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 20 },
    ],
    genLicense: (prefix) => `VT-${prefix}-${randInt(10000, 99999)}`,
  },
  VA: {
    name: 'Virginia', dataSource: 'VA_DPOR', sourceUrlTemplate: (num) => `https://www.dpor.virginia.gov/LicenseLookup/?id=${num}`,
    cities: [
      { name: 'Virginia Beach', county: 'Virginia Beach', zips: ['23451','23452','23453','23454','23455','23456','23457','23460','23461','23462','23464'], areaCodes: ['757'], count: 20 },
      { name: 'Norfolk', county: 'Norfolk', zips: ['23501','23502','23503','23504','23505','23507','23508','23509','23510','23511','23513','23517','23518'], areaCodes: ['757'], count: 15 },
      { name: 'Richmond', county: 'Richmond', zips: ['23219','23220','23221','23222','23223','23224','23225','23226','23227','23228','23229','23230','23231','23233','23234','23235'], areaCodes: ['804'], count: 15 },
      { name: 'Arlington', county: 'Arlington', zips: ['22201','22202','22203','22204','22205','22206','22207','22209'], areaCodes: ['703'], count: 12 },
      { name: 'Chesapeake', county: 'Chesapeake', zips: ['23320','23321','23322','23323','23324','23325','23328'], areaCodes: ['757'], count: 10 },
      { name: 'Alexandria', county: 'Alexandria', zips: ['22301','22302','22304','22305','22311','22314','22315'], areaCodes: ['703'], count: 8 },
      { name: 'Newport News', county: 'Newport News', zips: ['23601','23602','23603','23605','23606','23607','23608'], areaCodes: ['757'], count: 8 },
      { name: 'Roanoke', county: 'Roanoke', zips: ['24011','24012','24013','24014','24015','24016','24017','24018','24019','24020'], areaCodes: ['540'], count: 7 },
      { name: 'Lynchburg', county: 'Lynchburg', zips: ['24501','24502','24503','24504'], areaCodes: ['434'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'CLS', type: 'Class A Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'CLB', type: 'Class B Contractor', classification: 'Building', weight: 25 },
      { prefix: 'CLC', type: 'Class C Contractor', classification: 'Specialty', weight: 20 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 15 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 10 },
    ],
    genLicense: (prefix) => `VA-${prefix}-${randInt(100000, 999999)}`,
  },
  WA: {
    name: 'Washington', dataSource: 'WA_LNI', sourceUrlTemplate: (num) => `https://secure.lni.wa.gov/verify/?id=${num}`,
    cities: [
      { name: 'Seattle', county: 'King', zips: ['98101','98102','98103','98104','98105','98106','98107','98108','98109','98112','98115','98116','98117','98118','98119'], areaCodes: ['206'], count: 22 },
      { name: 'Spokane', county: 'Spokane', zips: ['99201','99202','99203','99204','99205','99207','99208','99212'], areaCodes: ['509'], count: 15 },
      { name: 'Tacoma', county: 'Pierce', zips: ['98401','98402','98403','98404','98405','98406','98407','98408','98409','98418'], areaCodes: ['253'], count: 15 },
      { name: 'Vancouver', county: 'Clark', zips: ['98660','98661','98662','98663','98664','98665','98668'], areaCodes: ['360'], count: 12 },
      { name: 'Bellevue', county: 'King', zips: ['98004','98005','98006','98007','98008','98009'], areaCodes: ['425'], count: 10 },
      { name: 'Kent', county: 'King', zips: ['98030','98031','98032','98042'], areaCodes: ['253'], count: 8 },
      { name: 'Everett', county: 'Snohomish', zips: ['98201','98203','98204','98208'], areaCodes: ['425'], count: 8 },
      { name: 'Renton', county: 'King', zips: ['98055','98057','98058','98059'], areaCodes: ['425'], count: 5 },
      { name: 'Federal Way', county: 'King', zips: ['98003','98023'], areaCodes: ['253'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 20 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 15 },
      { prefix: 'SC', type: 'Specialty Contractor', classification: 'Specialty', weight: 15 },
      { prefix: 'RC', type: 'Residential Contractor', classification: 'Residential', weight: 10 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 10 },
    ],
    genLicense: (prefix) => `WA-${prefix}-${randInt(100000, 999999)}`,
  },
  WV: {
    name: 'West Virginia', dataSource: 'WV_DOL', sourceUrlTemplate: (num) => `https://www.wvlabor.com/verify/?id=${num}`,
    cities: [
      { name: 'Charleston', county: 'Kanawha', zips: ['25301','25302','25304','25311','25312','25314','25315'], areaCodes: ['304'], count: 25 },
      { name: 'Huntington', county: 'Cabell', zips: ['25701','25703','25704','25705'], areaCodes: ['304'], count: 20 },
      { name: 'Morgantown', county: 'Monongalia', zips: ['26501','26505','26508'], areaCodes: ['304'], count: 18 },
      { name: 'Parkersburg', county: 'Wood', zips: ['26101','26104'], areaCodes: ['304'], count: 12 },
      { name: 'Wheeling', county: 'Ohio', zips: ['26003'], areaCodes: ['304'], count: 10 },
      { name: 'Beckley', county: 'Raleigh', zips: ['25801','25802'], areaCodes: ['304'], count: 8 },
      { name: 'Martinsburg', county: 'Berkeley', zips: ['25401','25404'], areaCodes: ['304'], count: 7 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `WV-${prefix}-${randInt(10000, 99999)}`,
  },
  WI: {
    name: 'Wisconsin', dataSource: 'WI_DSPS', sourceUrlTemplate: (num) => `https://online.dsps.wi.gov/CredentialSearch/?id=${num}`,
    cities: [
      { name: 'Milwaukee', county: 'Milwaukee', zips: ['53201','53202','53203','53204','53205','53206','53207','53208','53209','53210','53211','53212','53213','53214','53215','53216','53218','53219','53220','53221','53222','53223','53224','53225','53226','53227','53228'], areaCodes: ['414'], count: 22 },
      { name: 'Madison', county: 'Dane', zips: ['53701','53703','53704','53705','53706','53711','53713','53714','53715','53716','53717','53718','53719'], areaCodes: ['608'], count: 18 },
      { name: 'Green Bay', county: 'Brown', zips: ['54301','54302','54303','54304','54311','54313'], areaCodes: ['920'], count: 15 },
      { name: 'Kenosha', county: 'Kenosha', zips: ['53140','53142','53143','53144'], areaCodes: ['262'], count: 10 },
      { name: 'Racine', county: 'Racine', zips: ['53401','53402','53403','53404','53405','53406'], areaCodes: ['262'], count: 8 },
      { name: 'Appleton', county: 'Outagamie', zips: ['54911','54914','54915'], areaCodes: ['920'], count: 8 },
      { name: 'Waukesha', county: 'Waukesha', zips: ['53186','53188','53189'], areaCodes: ['262'], count: 7 },
      { name: 'Oshkosh', county: 'Winnebago', zips: ['54901','54902','54904'], areaCodes: ['920'], count: 5 },
      { name: 'Eau Claire', county: 'Eau Claire', zips: ['54701','54703'], areaCodes: ['715'], count: 4 },
      { name: 'Janesville', county: 'Rock', zips: ['53545','53546','53548'], areaCodes: ['608'], count: 3 },
    ],
    licenseTypes: [
      { prefix: 'DC', type: 'Dwelling Contractor', classification: 'Residential', weight: 30 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'HVAC Contractor', classification: 'HVAC', weight: 15 },
      { prefix: 'QC', type: 'Qualifier Contractor', classification: 'General Building', weight: 10 },
    ],
    genLicense: (prefix) => `WI-${prefix}-${randInt(100000, 999999)}`,
  },
  WY: {
    name: 'Wyoming', dataSource: 'WY_DWS', sourceUrlTemplate: (num) => `https://wyomingworkforce.org/?id=${num}`,
    cities: [
      { name: 'Cheyenne', county: 'Laramie', zips: ['82001','82003','82007','82009'], areaCodes: ['307'], count: 30 },
      { name: 'Casper', county: 'Natrona', zips: ['82601','82604','82609'], areaCodes: ['307'], count: 25 },
      { name: 'Laramie', county: 'Albany', zips: ['82070','82072'], areaCodes: ['307'], count: 15 },
      { name: 'Gillette', county: 'Campbell', zips: ['82716','82718'], areaCodes: ['307'], count: 10 },
      { name: 'Rock Springs', county: 'Sweetwater', zips: ['82901','82902'], areaCodes: ['307'], count: 8 },
      { name: 'Sheridan', county: 'Sheridan', zips: ['82801'], areaCodes: ['307'], count: 7 },
      { name: 'Jackson', county: 'Teton', zips: ['83001','83002'], areaCodes: ['307'], count: 5 },
    ],
    licenseTypes: [
      { prefix: 'GC', type: 'General Contractor', classification: 'General Building', weight: 35 },
      { prefix: 'EC', type: 'Electrical Contractor', classification: 'Electrical', weight: 25 },
      { prefix: 'PC', type: 'Plumbing Contractor', classification: 'Plumbing', weight: 20 },
      { prefix: 'MC', type: 'Mechanical Contractor', classification: 'Mechanical', weight: 20 },
    ],
    genLicense: (prefix) => `WY-${prefix}-${randInt(10000, 99999)}`,
  },
};

// ============================================
// GENERATE ALL CONTRACTORS
// ============================================

const allContractors = [];

for (const [stateCode, config] of Object.entries(STATES)) {
  const totalForState = 100;
  let cityIndex = 0;

  // Build city queue based on counts
  const cityQueue = [];
  for (const city of config.cities) {
    for (let i = 0; i < city.count; i++) {
      cityQueue.push(city);
    }
  }

  for (let i = 0; i < totalForState; i++) {
    const city = cityQueue[i] || pick(config.cities);
    const licenseInfo = weightedPick(config.licenseTypes);
    const ownerFirst = pick(firstNames);
    const ownerLast = pick(lastNames);
    const businessName = generateBusinessName();
    const licenseNumber = config.genLicense(licenseInfo.prefix);
    const payScore = generatePayScore();
    const statusRoll = random();
    const licenseStatus = statusRoll < 0.80 ? 'active' : statusRoll < 0.90 ? 'expired' : statusRoll < 0.95 ? 'inactive' : 'suspended';
    const claimed = random() < 0.15;

    allContractors.push({
      id: `${stateCode.toLowerCase()}-${String(i + 1).padStart(3, '0')}`,
      licenseNumber,
      licenseType: licenseInfo.type,
      licenseStatus,
      classifications: [licenseInfo.classification],
      businessName,
      ownerName: `${ownerFirst} ${ownerLast}`,
      phone: generatePhone(city.areaCodes),
      email: generateEmail(`${ownerFirst}${ownerLast}`),
      website: random() > 0.4 ? `https://www.${businessName.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 20)}.com` : undefined,
      address: generateAddress(),
      city: city.name,
      state: stateCode,
      zipCode: pick(city.zips),
      county: city.county,
      issueDate: generateDate(2005, 2022),
      expirationDate: generateDate(2025, 2028),
      lastUpdated: generateDate(2024, 2025),
      payScore,
      reviewCount: randInt(0, 45),
      avgPaymentDays: randInt(12, 58),
      claimed,
      claimedByUserId: claimed ? `user-${randInt(1, 500)}` : undefined,
      dataSource: config.dataSource,
      sourceUrl: config.sourceUrlTemplate(licenseNumber),
      verified: random() < 0.3,
      verifiedAt: random() < 0.3 ? generateDate(2024, 2025) + 'T12:00:00Z' : undefined,
      createdAt: generateDate(2024, 2025) + 'T00:00:00Z',
      updatedAt: generateDate(2024, 2025) + 'T00:00:00Z',
    });
  }

  console.log(`✅ Generated ${totalForState} ${config.name} contractors`);
}

// ============================================
// WRITE OUTPUT
// ============================================

const stateStats = {};
for (const c of allContractors) {
  stateStats[c.state] = (stateStats[c.state] || 0) + 1;
}

const statsComment = Object.entries(stateStats)
  .map(([code, count]) => `// ${STATES[code].name}: ${count} contractors`)
  .join('\n');

const tsContent = `// @ts-nocheck
// Auto-generated by scripts/generate-all-states.js
// Generated: ${new Date().toISOString()}
// Total contractors: ${allContractors.length}
//
${statsComment}

import { Contractor } from './db';

export const contractorsData = ${JSON.stringify(allContractors, null, 2)} as Contractor[];
`;

const outputPath = path.join(__dirname, '..', 'src', 'lib', 'contractors-data.ts');
fs.writeFileSync(outputPath, tsContent);

console.log('');
console.log(`📊 Total: ${allContractors.length} contractors across ${Object.keys(stateStats).length} states`);
console.log(`💾 Written to ${outputPath}`);
console.log(`📦 File size: ${(Buffer.byteLength(tsContent) / 1024).toFixed(1)} KB`);
console.log('');
console.log('✅ Generation complete!');
