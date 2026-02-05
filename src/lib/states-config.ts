// State configuration — single source of truth for all 50 states
// Every state reference in the app imports from here

export type StateCode =
  | 'AK' | 'AL' | 'AR' | 'AZ' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

export type DataSourceCode =
  | 'AK_DCCED'
  | 'AL_LBGC'
  | 'AR_CLB'
  | 'AZ_ROC'
  | 'CA_CSLB'
  | 'CO_DORA'
  | 'CT_DCP'
  | 'DE_DLLR'
  | 'FL_DBPR'
  | 'GA_SOS'
  | 'HI_DCCA'
  | 'ID_DBS'
  | 'IL_IDFPR'
  | 'IN_PLA'
  | 'IA_DIA'
  | 'KS_AG'
  | 'KY_DHBC'
  | 'LA_LSLBC'
  | 'ME_OPLA'
  | 'MD_DLLR'
  | 'MA_DPL'
  | 'MI_LARA'
  | 'MN_DLI'
  | 'MS_SBC'
  | 'MO_AG'
  | 'MT_DLI'
  | 'NE_DHHS'
  | 'NV_NSCB'
  | 'NH_OPLA'
  | 'NJ_DCA'
  | 'NM_RLD'
  | 'NY_COUNTY'
  | 'NC_NCLBGC'
  | 'ND_SOS'
  | 'OH_OCILB'
  | 'OK_CIB'
  | 'OR_CCB'
  | 'PA_AG'
  | 'RI_CRB'
  | 'SC_LLR'
  | 'SD_DLRS'
  | 'TN_TBLC'
  | 'TX_TDLR'
  | 'UT_DOPL'
  | 'VT_OPHER'
  | 'VA_DPOR'
  | 'WA_LNI'
  | 'WV_DOL'
  | 'WI_DSPS'
  | 'WY_DWS';

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
  AK: { code: 'AK', name: 'Alaska', emoji: '🏔️', color: '#5DADE2', agency: 'Alaska DCCED Division of Corporations', agencyAbbr: 'AK DCCED', dataSource: 'AK_DCCED', sourceBaseUrl: 'https://www.prior.prior-commerce.state.ak.us/', estimatedRecords: 8000, difficulty: 'hard', idPrefix: 'ak', contractorScope: 'All contractor types' },
  AL: { code: 'AL', name: 'Alabama', emoji: '🔶', color: '#CD6155', agency: 'Alabama Licensing Board for General Contractors', agencyAbbr: 'AL LBGC', dataSource: 'AL_LBGC', sourceBaseUrl: 'https://genconbd.alabama.gov/verification/', estimatedRecords: 45000, difficulty: 'medium', idPrefix: 'al', contractorScope: 'General contractors' },
  AR: { code: 'AR', name: 'Arkansas', emoji: '💎', color: '#A569BD', agency: 'Arkansas Contractors Licensing Board', agencyAbbr: 'AR CLB', dataSource: 'AR_CLB', sourceBaseUrl: 'https://www.aclb.arkansas.gov/verify/', estimatedRecords: 25000, difficulty: 'medium', idPrefix: 'ar', contractorScope: 'All contractor types' },
  AZ: { code: 'AZ', name: 'Arizona', emoji: '🟤', color: '#C0392B', agency: 'Arizona Registrar of Contractors', agencyAbbr: 'AZ ROC', dataSource: 'AZ_ROC', sourceBaseUrl: 'https://roc.az.gov/contractor-search', estimatedRecords: 80000, difficulty: 'easy', idPrefix: 'az', contractorScope: 'All residential & commercial' },
  CA: { code: 'CA', name: 'California', emoji: '🔵', color: '#54A0FF', agency: 'California Contractors State License Board', agencyAbbr: 'CA CSLB', dataSource: 'CA_CSLB', sourceBaseUrl: 'https://www.cslb.ca.gov/onlineservices/checklicenseII/checklicense.aspx', estimatedRecords: 400000, difficulty: 'easy', idPrefix: 'ca', contractorScope: 'All 45 classifications' },
  CO: { code: 'CO', name: 'Colorado', emoji: '🏔️', color: '#2E86C1', agency: 'Colorado DORA Division of Professions', agencyAbbr: 'CO DORA', dataSource: 'CO_DORA', sourceBaseUrl: 'https://apps.colorado.gov/dora/licensing/', estimatedRecords: 60000, difficulty: 'easy', idPrefix: 'co', contractorScope: 'All contractor types' },
  CT: { code: 'CT', name: 'Connecticut', emoji: '🍂', color: '#6C3483', agency: 'Connecticut DCP Home Improvement', agencyAbbr: 'CT DCP', dataSource: 'CT_DCP', sourceBaseUrl: 'https://www.elicense.ct.gov/', estimatedRecords: 35000, difficulty: 'medium', idPrefix: 'ct', contractorScope: 'Home improvement contractors' },
  DE: { code: 'DE', name: 'Delaware', emoji: '🏛️', color: '#1A5276', agency: 'Delaware DPR Division of Professional Regulation', agencyAbbr: 'DE DLLR', dataSource: 'DE_DLLR', sourceBaseUrl: 'https://dpr.delaware.gov/boardsandcommissions/', estimatedRecords: 10000, difficulty: 'medium', idPrefix: 'de', contractorScope: 'All contractor types' },
  FL: { code: 'FL', name: 'Florida', emoji: '🟠', color: '#FF9F43', agency: 'Florida Department of Business and Professional Regulation', agencyAbbr: 'FL DBPR', dataSource: 'FL_DBPR', sourceBaseUrl: 'https://www.myfloridalicense.com/LicenseDetail.asp?SID=&id=', estimatedRecords: 300000, difficulty: 'easy', idPrefix: 'fl', contractorScope: 'All contractor types' },
  GA: { code: 'GA', name: 'Georgia', emoji: '🍑', color: '#E67E22', agency: 'Georgia Secretary of State - Licensing Board', agencyAbbr: 'GA SOS', dataSource: 'GA_SOS', sourceBaseUrl: 'https://sos.ga.gov/state-licensing-board-residential-and-commercial-general-contractors', estimatedRecords: 100000, difficulty: 'medium', idPrefix: 'ga', contractorScope: 'General contractors only' },
  HI: { code: 'HI', name: 'Hawaii', emoji: '🌺', color: '#E74C3C', agency: 'Hawaii DCCA Professional Licensing', agencyAbbr: 'HI DCCA', dataSource: 'HI_DCCA', sourceBaseUrl: 'https://pvl.ehawaii.gov/pvlsearch/', estimatedRecords: 15000, difficulty: 'medium', idPrefix: 'hi', contractorScope: 'All contractor types' },
  ID: { code: 'ID', name: 'Idaho', emoji: '🥔', color: '#784212', agency: 'Idaho DBS Division of Building Safety', agencyAbbr: 'ID DBS', dataSource: 'ID_DBS', sourceBaseUrl: 'https://apps.dbs.idaho.gov/licensing/', estimatedRecords: 20000, difficulty: 'easy', idPrefix: 'id', contractorScope: 'All contractor types' },
  IL: { code: 'IL', name: 'Illinois', emoji: '🏙️', color: '#2C3E50', agency: 'Illinois Department of Financial and Professional Regulation', agencyAbbr: 'IL IDFPR', dataSource: 'IL_IDFPR', sourceBaseUrl: 'https://idfpr.illinois.gov/checklicense.html', estimatedRecords: 100000, difficulty: 'medium', idPrefix: 'il', contractorScope: 'Roofing & specialty trades' },
  IN: { code: 'IN', name: 'Indiana', emoji: '🏎️', color: '#1F618D', agency: 'Indiana PLA Professional Licensing Agency', agencyAbbr: 'IN PLA', dataSource: 'IN_PLA', sourceBaseUrl: 'https://mylicense.in.gov/everification/', estimatedRecords: 50000, difficulty: 'medium', idPrefix: 'in', contractorScope: 'All contractor types' },
  IA: { code: 'IA', name: 'Iowa', emoji: '🌽', color: '#F4D03F', agency: 'Iowa DIA Division of Labor', agencyAbbr: 'IA DIA', dataSource: 'IA_DIA', sourceBaseUrl: 'https://eservices.iowa.gov/licensediniowa/', estimatedRecords: 25000, difficulty: 'medium', idPrefix: 'ia', contractorScope: 'Electrical & plumbing' },
  KS: { code: 'KS', name: 'Kansas', emoji: '🌻', color: '#D4AC0D', agency: 'Kansas AG Consumer Protection', agencyAbbr: 'KS AG', dataSource: 'KS_AG', sourceBaseUrl: 'https://www.ink.org/profreg/', estimatedRecords: 20000, difficulty: 'medium', idPrefix: 'ks', contractorScope: 'All contractor types' },
  KY: { code: 'KY', name: 'Kentucky', emoji: '🐎', color: '#196F3D', agency: 'Kentucky DHBC Housing and Construction', agencyAbbr: 'KY DHBC', dataSource: 'KY_DHBC', sourceBaseUrl: 'https://dhbc.ky.gov/Licensure/', estimatedRecords: 30000, difficulty: 'medium', idPrefix: 'ky', contractorScope: 'All contractor types' },
  LA: { code: 'LA', name: 'Louisiana', emoji: '⚜️', color: '#7D3C98', agency: 'Louisiana State Licensing Board for Contractors', agencyAbbr: 'LA LSLBC', dataSource: 'LA_LSLBC', sourceBaseUrl: 'https://www.lslbc.louisiana.gov/contractor-search/', estimatedRecords: 40000, difficulty: 'easy', idPrefix: 'la', contractorScope: 'All contractor types' },
  ME: { code: 'ME', name: 'Maine', emoji: '🦞', color: '#1E8449', agency: 'Maine OPLA Office of Professional Licensing', agencyAbbr: 'ME OPLA', dataSource: 'ME_OPLA', sourceBaseUrl: 'https://www.maine.gov/pfr/professionallicensing/', estimatedRecords: 10000, difficulty: 'medium', idPrefix: 'me', contractorScope: 'All contractor types' },
  MD: { code: 'MD', name: 'Maryland', emoji: '🦀', color: '#C0392B', agency: 'Maryland DLLR Home Improvement', agencyAbbr: 'MD DLLR', dataSource: 'MD_DLLR', sourceBaseUrl: 'https://www.dllr.state.md.us/license/mhic/', estimatedRecords: 40000, difficulty: 'medium', idPrefix: 'md', contractorScope: 'Home improvement contractors' },
  MA: { code: 'MA', name: 'Massachusetts', emoji: '🏛️', color: '#2471A3', agency: 'Massachusetts DPL Division of Professional Licensure', agencyAbbr: 'MA DPL', dataSource: 'MA_DPL', sourceBaseUrl: 'https://www.mass.gov/orgs/division-of-professional-licensure', estimatedRecords: 50000, difficulty: 'medium', idPrefix: 'ma', contractorScope: 'All contractor types' },
  MI: { code: 'MI', name: 'Michigan', emoji: '🚗', color: '#2874A6', agency: 'Michigan LARA Licensing and Regulatory Affairs', agencyAbbr: 'MI LARA', dataSource: 'MI_LARA', sourceBaseUrl: 'https://aca-prod.accela.com/MILARA/', estimatedRecords: 60000, difficulty: 'medium', idPrefix: 'mi', contractorScope: 'All contractor types' },
  MN: { code: 'MN', name: 'Minnesota', emoji: '❄️', color: '#5B2C6F', agency: 'Minnesota DLI Construction Codes', agencyAbbr: 'MN DLI', dataSource: 'MN_DLI', sourceBaseUrl: 'https://www.dli.mn.gov/business/contractor-licensing/', estimatedRecords: 45000, difficulty: 'medium', idPrefix: 'mn', contractorScope: 'All contractor types' },
  MS: { code: 'MS', name: 'Mississippi', emoji: '🎸', color: '#1A237E', agency: 'Mississippi State Board of Contractors', agencyAbbr: 'MS SBC', dataSource: 'MS_SBC', sourceBaseUrl: 'https://www.msboc.us/search/', estimatedRecords: 20000, difficulty: 'medium', idPrefix: 'ms', contractorScope: 'General contractors' },
  MO: { code: 'MO', name: 'Missouri', emoji: '🎺', color: '#6E2C00', agency: 'Missouri AG Consumer Protection', agencyAbbr: 'MO AG', dataSource: 'MO_AG', sourceBaseUrl: 'https://ago.mo.gov/consumer-protection/', estimatedRecords: 40000, difficulty: 'medium', idPrefix: 'mo', contractorScope: 'All contractor types' },
  MT: { code: 'MT', name: 'Montana', emoji: '🦌', color: '#4A235A', agency: 'Montana DLI Building Codes', agencyAbbr: 'MT DLI', dataSource: 'MT_DLI', sourceBaseUrl: 'https://bsd.dli.mt.gov/license-searches', estimatedRecords: 10000, difficulty: 'easy', idPrefix: 'mt', contractorScope: 'All contractor types' },
  NE: { code: 'NE', name: 'Nebraska', emoji: '🌾', color: '#B7950B', agency: 'Nebraska DHHS Licensure Unit', agencyAbbr: 'NE DHHS', dataSource: 'NE_DHHS', sourceBaseUrl: 'https://dhhs.ne.gov/licensure/', estimatedRecords: 15000, difficulty: 'medium', idPrefix: 'ne', contractorScope: 'Electrical & plumbing' },
  NV: { code: 'NV', name: 'Nevada', emoji: '🎰', color: '#B03A2E', agency: 'Nevada State Contractors Board', agencyAbbr: 'NV NSCB', dataSource: 'NV_NSCB', sourceBaseUrl: 'https://app.nvcontractorsboard.com/Clients/NVSCB/Public/', estimatedRecords: 35000, difficulty: 'easy', idPrefix: 'nv', contractorScope: 'All contractor types' },
  NH: { code: 'NH', name: 'New Hampshire', emoji: '🏔️', color: '#1B4F72', agency: 'New Hampshire OPLA Licensing', agencyAbbr: 'NH OPLA', dataSource: 'NH_OPLA', sourceBaseUrl: 'https://www.oplc.nh.gov/electricians', estimatedRecords: 10000, difficulty: 'medium', idPrefix: 'nh', contractorScope: 'Electrical only' },
  NJ: { code: 'NJ', name: 'New Jersey', emoji: '🏖️', color: '#D68910', agency: 'New Jersey DCA Consumer Affairs', agencyAbbr: 'NJ DCA', dataSource: 'NJ_DCA', sourceBaseUrl: 'https://newjersey.mylicense.com/verification/', estimatedRecords: 60000, difficulty: 'medium', idPrefix: 'nj', contractorScope: 'Home improvement contractors' },
  NM: { code: 'NM', name: 'New Mexico', emoji: '🌶️', color: '#E67E22', agency: 'New Mexico RLD Construction Industries', agencyAbbr: 'NM RLD', dataSource: 'NM_RLD', sourceBaseUrl: 'https://www.rld.nm.gov/construction-industries/', estimatedRecords: 20000, difficulty: 'medium', idPrefix: 'nm', contractorScope: 'All contractor types' },
  NY: { code: 'NY', name: 'New York', emoji: '🗽', color: '#8E44AD', agency: 'New York - County-based Licensing', agencyAbbr: 'NY DOB', dataSource: 'NY_COUNTY', sourceBaseUrl: 'https://a810-bisweb.nyc.gov/', estimatedRecords: 150000, difficulty: 'hard', idPrefix: 'ny', contractorScope: 'Varies by county' },
  NC: { code: 'NC', name: 'North Carolina', emoji: '🟢', color: '#27AE60', agency: 'North Carolina Licensing Board for General Contractors', agencyAbbr: 'NC NCLBGC', dataSource: 'NC_NCLBGC', sourceBaseUrl: 'https://portal.nclbgc.org/public/search', estimatedRecords: 90000, difficulty: 'easy', idPrefix: 'nc', contractorScope: 'General contractors only' },
  ND: { code: 'ND', name: 'North Dakota', emoji: '🌾', color: '#1B2631', agency: 'North Dakota SOS Contractor Licensing', agencyAbbr: 'ND SOS', dataSource: 'ND_SOS', sourceBaseUrl: 'https://firststop.sos.nd.gov/', estimatedRecords: 8000, difficulty: 'easy', idPrefix: 'nd', contractorScope: 'All contractor types' },
  OH: { code: 'OH', name: 'Ohio', emoji: '🔴', color: '#E74C3C', agency: 'Ohio Construction Industry Licensing Board', agencyAbbr: 'OH OCILB', dataSource: 'OH_OCILB', sourceBaseUrl: 'https://elicense4.com.ohio.gov/', estimatedRecords: 80000, difficulty: 'medium', idPrefix: 'oh', contractorScope: 'Electrical, HVAC, Plumbing, Hydronics, Refrigeration' },
  OK: { code: 'OK', name: 'Oklahoma', emoji: '🤠', color: '#CA6F1E', agency: 'Oklahoma CIB Construction Industries Board', agencyAbbr: 'OK CIB', dataSource: 'OK_CIB', sourceBaseUrl: 'https://cib.ok.gov/license-verification', estimatedRecords: 30000, difficulty: 'medium', idPrefix: 'ok', contractorScope: 'All contractor types' },
  OR: { code: 'OR', name: 'Oregon', emoji: '🌲', color: '#0E6251', agency: 'Oregon CCB Construction Contractors Board', agencyAbbr: 'OR CCB', dataSource: 'OR_CCB', sourceBaseUrl: 'https://search.ccb.state.or.us/', estimatedRecords: 45000, difficulty: 'easy', idPrefix: 'or', contractorScope: 'All contractor types' },
  PA: { code: 'PA', name: 'Pennsylvania', emoji: '🔔', color: '#3498DB', agency: 'Pennsylvania Attorney General - Home Improvement Registration', agencyAbbr: 'PA AG', dataSource: 'PA_AG', sourceBaseUrl: 'https://hicsearch.attorneygeneral.gov/', estimatedRecords: 120000, difficulty: 'medium', idPrefix: 'pa', contractorScope: 'Home improvement contractors' },
  RI: { code: 'RI', name: 'Rhode Island', emoji: '⛵', color: '#2980B9', agency: 'Rhode Island CRB Contractors Registration Board', agencyAbbr: 'RI CRB', dataSource: 'RI_CRB', sourceBaseUrl: 'https://crb.ri.gov/search/', estimatedRecords: 8000, difficulty: 'medium', idPrefix: 'ri', contractorScope: 'All contractor types' },
  SC: { code: 'SC', name: 'South Carolina', emoji: '🌴', color: '#148F77', agency: 'South Carolina LLR Contractor Licensing', agencyAbbr: 'SC LLR', dataSource: 'SC_LLR', sourceBaseUrl: 'https://verify.llronline.com/LicLookup/', estimatedRecords: 35000, difficulty: 'medium', idPrefix: 'sc', contractorScope: 'General & mechanical' },
  SD: { code: 'SD', name: 'South Dakota', emoji: '🦬', color: '#7B7D7D', agency: 'South Dakota DLRS Contractor Registration', agencyAbbr: 'SD DLRS', dataSource: 'SD_DLRS', sourceBaseUrl: 'https://dlr.sd.gov/electrical/', estimatedRecords: 6000, difficulty: 'easy', idPrefix: 'sd', contractorScope: 'Electrical & plumbing' },
  TN: { code: 'TN', name: 'Tennessee', emoji: '🎵', color: '#F39C12', agency: 'Tennessee Board for Licensing Contractors', agencyAbbr: 'TN TBLC', dataSource: 'TN_TBLC', sourceBaseUrl: 'https://verify.tn.gov/', estimatedRecords: 40000, difficulty: 'easy', idPrefix: 'tn', contractorScope: 'All contractor types' },
  TX: { code: 'TX', name: 'Texas', emoji: '⭐', color: '#E74C3C', agency: 'Texas Department of Licensing and Regulation', agencyAbbr: 'TX TDLR', dataSource: 'TX_TDLR', sourceBaseUrl: 'https://www.tdlr.texas.gov/verify.htm', estimatedRecords: 200000, difficulty: 'medium', idPrefix: 'tx', contractorScope: 'Electricians & HVAC only' },
  UT: { code: 'UT', name: 'Utah', emoji: '⛷️', color: '#D35400', agency: 'Utah DOPL Division of Professional Licensing', agencyAbbr: 'UT DOPL', dataSource: 'UT_DOPL', sourceBaseUrl: 'https://dopl.utah.gov/verify/', estimatedRecords: 30000, difficulty: 'easy', idPrefix: 'ut', contractorScope: 'All contractor types' },
  VT: { code: 'VT', name: 'Vermont', emoji: '🍁', color: '#1D8348', agency: 'Vermont OPHER Licensing', agencyAbbr: 'VT OPHER', dataSource: 'VT_OPHER', sourceBaseUrl: 'https://sos.vermont.gov/opr/', estimatedRecords: 5000, difficulty: 'medium', idPrefix: 'vt', contractorScope: 'Electrical & plumbing' },
  VA: { code: 'VA', name: 'Virginia', emoji: '🏛️', color: '#154360', agency: 'Virginia DPOR Board for Contractors', agencyAbbr: 'VA DPOR', dataSource: 'VA_DPOR', sourceBaseUrl: 'https://www.dpor.virginia.gov/LicenseLookup/', estimatedRecords: 70000, difficulty: 'easy', idPrefix: 'va', contractorScope: 'All contractor types' },
  WA: { code: 'WA', name: 'Washington', emoji: '🌧️', color: '#1ABC9C', agency: 'Washington L&I Contractor Registration', agencyAbbr: 'WA LNI', dataSource: 'WA_LNI', sourceBaseUrl: 'https://secure.lni.wa.gov/verify/', estimatedRecords: 70000, difficulty: 'easy', idPrefix: 'wa', contractorScope: 'All contractor types' },
  WV: { code: 'WV', name: 'West Virginia', emoji: '⛰️', color: '#5D6D7E', agency: 'West Virginia DOL Contractor Licensing', agencyAbbr: 'WV DOL', dataSource: 'WV_DOL', sourceBaseUrl: 'https://www.wvlabor.com/verify/', estimatedRecords: 12000, difficulty: 'medium', idPrefix: 'wv', contractorScope: 'All contractor types' },
  WI: { code: 'WI', name: 'Wisconsin', emoji: '🧀', color: '#B9770E', agency: 'Wisconsin DSPS Safety and Professional Services', agencyAbbr: 'WI DSPS', dataSource: 'WI_DSPS', sourceBaseUrl: 'https://online.dsps.wi.gov/CredentialSearch/', estimatedRecords: 40000, difficulty: 'medium', idPrefix: 'wi', contractorScope: 'All contractor types' },
  WY: { code: 'WY', name: 'Wyoming', emoji: '🤠', color: '#616A6B', agency: 'Wyoming DWS Workforce Services', agencyAbbr: 'WY DWS', dataSource: 'WY_DWS', sourceBaseUrl: 'https://wyomingworkforce.org/', estimatedRecords: 5000, difficulty: 'easy', idPrefix: 'wy', contractorScope: 'All contractor types' },
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
