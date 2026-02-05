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

const tsContent = `// Auto-generated by scripts/generate-all-states.js
// Generated: ${new Date().toISOString()}
// Total contractors: ${allContractors.length}
//
${statsComment}

import { Contractor } from './db';

export const contractorsData: Contractor[] = ${JSON.stringify(allContractors, null, 2)};
`;

const outputPath = path.join(__dirname, '..', 'src', 'lib', 'contractors-data.ts');
fs.writeFileSync(outputPath, tsContent);

console.log('');
console.log(`📊 Total: ${allContractors.length} contractors across ${Object.keys(stateStats).length} states`);
console.log(`💾 Written to ${outputPath}`);
console.log(`📦 File size: ${(Buffer.byteLength(tsContent) / 1024).toFixed(1)} KB`);
console.log('');
console.log('✅ Generation complete!');
