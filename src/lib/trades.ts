// Comprehensive list of construction trades for subcontractors
export const TRADES = [
  'Electrical',
  'Plumbing',
  'HVAC',
  'Drywall',
  'Roofing',
  'Painting',
  'Concrete',
  'Framing',
  'Flooring',
  'Masonry',
  'Fire Protection',
  'Insulation',
  'Glazing',
  'Landscaping',
  'Fencing',
  'Demolition',
  'Excavation',
  'Steel Erection',
  'Welding',
  'Tile & Stone',
  'Cabinetry',
  'Carpentry',
  'Waterproofing',
  'Siding',
  'Stucco',
  'Gutters',
  'Solar',
  'Security Systems',
  'Audio/Visual',
  'Elevator',
] as const;

export type Trade = (typeof TRADES)[number];

// Trade aliases for search optimization
export const TRADE_ALIASES: Record<string, string[]> = {
  Electrical: ['electrician', 'electric', 'electrical contractor', 'electrical work'],
  Plumbing: ['plumber', 'plumbing contractor', 'pipe fitter', 'pipefitter'],
  HVAC: ['heating', 'cooling', 'air conditioning', 'hvac contractor', 'mechanical'],
  Drywall: ['sheetrock', 'gypsum', 'drywall contractor', 'drywall installer'],
  Roofing: ['roofer', 'roofing contractor', 'roof repair', 'roof replacement'],
  Painting: ['painter', 'painting contractor', 'interior painting', 'exterior painting'],
  Concrete: ['concrete contractor', 'cement', 'flatwork', 'concrete finisher'],
  Framing: ['framer', 'framing contractor', 'rough carpentry', 'structural framing'],
  Flooring: ['flooring contractor', 'floor installer', 'hardwood', 'carpet', 'laminate'],
  Masonry: ['mason', 'brick', 'block', 'stone mason', 'bricklayer'],
  'Fire Protection': ['fire sprinkler', 'fire suppression', 'fire alarm', 'sprinkler fitter'],
  Insulation: ['insulation contractor', 'insulation installer', 'spray foam'],
  Glazing: ['glazier', 'glass', 'window', 'glass contractor', 'storefront'],
  Landscaping: ['landscaper', 'landscape contractor', 'lawn care', 'irrigation'],
  Fencing: ['fence contractor', 'fence installer', 'fencing contractor'],
  Demolition: ['demo contractor', 'demolition contractor', 'wrecking'],
  Excavation: ['excavator', 'excavation contractor', 'grading', 'earthwork', 'sitework'],
  'Steel Erection': ['ironworker', 'steel contractor', 'structural steel', 'iron worker'],
  Welding: ['welder', 'welding contractor', 'fabrication'],
  'Tile & Stone': ['tile setter', 'tile contractor', 'stone installer', 'tile installer'],
  Cabinetry: ['cabinet maker', 'cabinet installer', 'millwork', 'casework'],
  Carpentry: ['carpenter', 'finish carpentry', 'trim carpentry', 'wood work'],
  Waterproofing: ['waterproofer', 'waterproofing contractor', 'foundation waterproofing'],
  Siding: ['siding contractor', 'siding installer', 'vinyl siding', 'fiber cement'],
  Stucco: ['stucco contractor', 'plastering', 'EIFS', 'exterior plaster'],
  Gutters: ['gutter installer', 'gutter contractor', 'rain gutters', 'downspouts'],
  Solar: ['solar installer', 'solar contractor', 'photovoltaic', 'PV installer'],
  'Security Systems': ['security installer', 'alarm installer', 'access control', 'CCTV'],
  'Audio/Visual': ['AV installer', 'low voltage', 'AV contractor', 'audio video'],
  Elevator: ['elevator contractor', 'elevator installer', 'lift installer', 'escalator'],
};

// Get all keywords for a trade including aliases
export function getTradeKeywords(trade: Trade): string[] {
  const aliases = TRADE_ALIASES[trade] || [];
  return [trade.toLowerCase(), ...aliases.map((a) => a.toLowerCase())];
}
