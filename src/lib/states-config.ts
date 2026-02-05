// State configuration — single source of truth for all 10 states
// Every state reference in the app imports from here

export type StateCode = 'FL' | 'CA' | 'AZ' | 'NC' | 'TX' | 'GA' | 'OH' | 'PA' | 'IL' | 'NY';

export type DataSourceCode =
  | 'FL_DBPR'
  | 'CA_CSLB'
  | 'AZ_ROC'
  | 'NC_NCLBGC'
  | 'TX_TDLR'
  | 'GA_SOS'
  | 'OH_OCILB'
  | 'PA_AG'
  | 'IL_IDFPR'
  | 'NY_COUNTY';

export interface StateConfig {
  code: StateCode;
  name: string;
  emoji: string;
  color: string;
  agency: string;
  agencyAbbr: string;
  dataSource: DataSourceCode;
  sourceBaseUrl: string;
  estimatedRecords: number;
  difficulty: 'easy' | 'medium' | 'hard';
  idPrefix: string;
  contractorScope: string;
}

export const STATES: Record<StateCode, StateConfig> = {
  FL: {
    code: 'FL',
    name: 'Florida',
    emoji: '🟠',
    color: '#FF9F43',
    agency: 'Florida Department of Business and Professional Regulation',
    agencyAbbr: 'FL DBPR',
    dataSource: 'FL_DBPR',
    sourceBaseUrl: 'https://www.myfloridalicense.com/LicenseDetail.asp?SID=&id=',
    estimatedRecords: 300000,
    difficulty: 'easy',
    idPrefix: 'fl',
    contractorScope: 'All contractor types',
  },
  CA: {
    code: 'CA',
    name: 'California',
    emoji: '🔵',
    color: '#54A0FF',
    agency: 'California Contractors State License Board',
    agencyAbbr: 'CA CSLB',
    dataSource: 'CA_CSLB',
    sourceBaseUrl: 'https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx',
    estimatedRecords: 400000,
    difficulty: 'easy',
    idPrefix: 'ca',
    contractorScope: 'All 45 classifications',
  },
  AZ: {
    code: 'AZ',
    name: 'Arizona',
    emoji: '🟤',
    color: '#C0392B',
    agency: 'Arizona Registrar of Contractors',
    agencyAbbr: 'AZ ROC',
    dataSource: 'AZ_ROC',
    sourceBaseUrl: 'https://roc.az.gov/contractor-search',
    estimatedRecords: 80000,
    difficulty: 'easy',
    idPrefix: 'az',
    contractorScope: 'All residential & commercial',
  },
  NC: {
    code: 'NC',
    name: 'North Carolina',
    emoji: '🟢',
    color: '#27AE60',
    agency: 'North Carolina Licensing Board for General Contractors',
    agencyAbbr: 'NC NCLBGC',
    dataSource: 'NC_NCLBGC',
    sourceBaseUrl: 'https://portal.nclbgc.org/public/search',
    estimatedRecords: 90000,
    difficulty: 'easy',
    idPrefix: 'nc',
    contractorScope: 'General contractors only',
  },
  TX: {
    code: 'TX',
    name: 'Texas',
    emoji: '⭐',
    color: '#E74C3C',
    agency: 'Texas Department of Licensing and Regulation',
    agencyAbbr: 'TX TDLR',
    dataSource: 'TX_TDLR',
    sourceBaseUrl: 'https://www.tdlr.texas.gov/verify.htm',
    estimatedRecords: 200000,
    difficulty: 'medium',
    idPrefix: 'tx',
    contractorScope: 'Electricians & HVAC only',
  },
  GA: {
    code: 'GA',
    name: 'Georgia',
    emoji: '🍑',
    color: '#E67E22',
    agency: 'Georgia Secretary of State - Licensing Board',
    agencyAbbr: 'GA SOS',
    dataSource: 'GA_SOS',
    sourceBaseUrl: 'https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors',
    estimatedRecords: 100000,
    difficulty: 'medium',
    idPrefix: 'ga',
    contractorScope: 'General contractors only',
  },
  OH: {
    code: 'OH',
    name: 'Ohio',
    emoji: '🔴',
    color: '#E74C3C',
    agency: 'Ohio Construction Industry Licensing Board',
    agencyAbbr: 'OH OCILB',
    dataSource: 'OH_OCILB',
    sourceBaseUrl: 'https://elicense4.com.ohio.gov/',
    estimatedRecords: 80000,
    difficulty: 'medium',
    idPrefix: 'oh',
    contractorScope: 'Electrical, HVAC, Plumbing, Hydronics, Refrigeration',
  },
  PA: {
    code: 'PA',
    name: 'Pennsylvania',
    emoji: '🔔',
    color: '#3498DB',
    agency: 'Pennsylvania Attorney General - Home Improvement Registration',
    agencyAbbr: 'PA AG',
    dataSource: 'PA_AG',
    sourceBaseUrl: 'https://hicsearch.attorneygeneral.gov/',
    estimatedRecords: 120000,
    difficulty: 'medium',
    idPrefix: 'pa',
    contractorScope: 'Home improvement contractors',
  },
  IL: {
    code: 'IL',
    name: 'Illinois',
    emoji: '🏙️',
    color: '#2C3E50',
    agency: 'Illinois Department of Financial and Professional Regulation',
    agencyAbbr: 'IL IDFPR',
    dataSource: 'IL_IDFPR',
    sourceBaseUrl: 'https://idfpr.illinois.gov/checklicense.html',
    estimatedRecords: 100000,
    difficulty: 'medium',
    idPrefix: 'il',
    contractorScope: 'Roofing & specialty trades',
  },
  NY: {
    code: 'NY',
    name: 'New York',
    emoji: '🗽',
    color: '#8E44AD',
    agency: 'New York - County-based Licensing',
    agencyAbbr: 'NY DOB',
    dataSource: 'NY_COUNTY',
    sourceBaseUrl: 'https://a810-bisweb.nyc.gov/',
    estimatedRecords: 150000,
    difficulty: 'hard',
    idPrefix: 'ny',
    contractorScope: 'Varies by county',
  },
};

// Derived helper arrays
export const ALL_STATE_CODES: StateCode[] = Object.keys(STATES) as StateCode[];
export const ALL_DATA_SOURCES: DataSourceCode[] = ALL_STATE_CODES.map((s) => STATES[s].dataSource);

// Helper functions
export function getStateName(code: StateCode): string {
  return STATES[code]?.name || code;
}

export function getDataSourceLabel(code: StateCode): string {
  return STATES[code]?.agencyAbbr || code;
}

export function getDataSourceFullName(code: StateCode): string {
  return STATES[code]?.agency || code;
}

export function getStateByDataSource(ds: DataSourceCode): StateConfig | undefined {
  return Object.values(STATES).find((s) => s.dataSource === ds);
}

export function isValidStateCode(s: string): s is StateCode {
  return s in STATES;
}
