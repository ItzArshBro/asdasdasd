import { StoreInfo, DailyRates } from './types';

export const STORE_INFO: StoreInfo = {
  name: 'RAMBADEVI Jewellers',
  tagline: 'Exquisite Craftsmanship, Timeless Purity & Trust in Devdaha',
  address: 'Devdaha-5, Khaireni',
  city: 'Khaireni',
  district: 'Rupandehi',
  country: 'Nepal',
  phone: '9857073727',
  whatsapp: '9713805456', // International format +9779713805456
  email: 'rambadevijewellers@gmail.com',
  workingHours: '9:30 AM - 7:30 PM',
  openDays: 'Sunday - Friday (Saturday Open on festive seasons)',
  googleMapsUrl: 'https://maps.google.com/?q=Devdaha+Khaireni+Rupandehi+Nepal',
};

export const GRAMS_PER_TOLA = 11.6638;
export const LAL_PER_TOLA = 100;
export const AANA_PER_TOLA = 16;

// Standard initial Nepali Gold & Silver Market Rates (NPR)
export const DEFAULT_RATES: DailyRates = {
  gold24kPerTola: 172000,       // 24K Chhapawal Gold per Tola (NPR)
  gold22kPerTola: 171200,       // 22K Tejabi Gold per Tola (NPR)
  gold18kPerGram: 11050,        // 18K Hallmarked Gold per Gram (NPR)
  silverPerTola: 2050,          // Fine Silver per Tola (NPR)
  silverPerGram: 175.75,        // Fine Silver per Gram (NPR)
  updatedAt: new Date().toISOString(),
  source: 'Federation of Nepal Gold & Silver Dealers (FENEGOSIDA) Official Daily Rates',
  notes: 'Live market rates updated daily for Rupandehi and national bullion market.',
};

export const CATEGORIES = [
  'All',
  'Bridal Sets',
  'Rani Haar & Necklaces',
  'Bangles & Kadas',
  'Earrings & Jhumkas',
  'Rings',
  'Mangalsutra & Tilhari',
  'Men\'s Collection',
  'Silver & Coins'
] as const;

export const REPAIR_SERVICES = [
  { id: 'polish_buff', name: 'High-Gloss Ultrasonic Polish & Buffing', desc: 'Restores brilliant mirror shine and eliminates surface scratches.' },
  { id: 'resizing', name: 'Ring & Bangle Resizing', desc: 'Precision sizing for gold, silver, and diamond rings without compromising stones.' },
  { id: 'soldering', name: 'Chain & Bangle Laser Soldering', desc: 'Invisible and durable joint repair for broken chains, necklaces, and bangles.' },
  { id: 'stone_setting', name: 'Stone & Diamond Replacement / Tightening', desc: 'Secure prong tightening and replacement of missing precious stones.' },
  { id: 'rhodium', name: 'Rhodium & Gold Electroplating', desc: 'Fresh protective plating for white gold, two-tone jewelry, and silver.' },
  { id: 'antique_restoration', name: 'Traditional & Antique Jewelry Restoration', desc: 'Careful refurbishment of generational heritage gold ornaments.' },
];
