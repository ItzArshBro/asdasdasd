export type MetalType = 'gold_24k' | 'gold_22k' | 'gold_18k' | 'silver_999' | 'silver_925' | 'diamond';

export type ProductCategory = 
  | 'All'
  | 'Bridal Sets'
  | 'Rani Haar & Necklaces'
  | 'Bangles & Kadas'
  | 'Earrings & Jhumkas'
  | 'Rings'
  | 'Mangalsutra & Tilhari'
  | 'Men\'s Collection'
  | 'Silver & Coins';

export interface Product {
  id: string;
  name: string;
  nepaliName?: string;
  sku: string;
  category: ProductCategory;
  metalType: MetalType;
  karat: string;
  weightGrams: number;
  weightTola: number;
  makingChargePercentage: number;
  makingChargeFlatNpr?: number;
  description: string;
  features: string[];
  images: string[];
  inStock: boolean;
  isFeatured: boolean;
  isTrending?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface DailyRates {
  gold24kPerTola: number;       // Rate for 24K Fine Gold / Chhapawal per 1 Tola (11.6638g) in NPR
  gold22kPerTola: number;       // Rate for 22K Tejabi Gold per 1 Tola in NPR
  gold18kPerGram: number;       // Rate for 18K Hallmarked Gold per 1 Gram in NPR
  silverPerTola: number;        // Rate for Fine Silver per 1 Tola in NPR
  silverPerGram: number;        // Rate for Fine Silver per 1 Gram in NPR
  updatedAt: string;
  source: string;
  notes?: string;
}

export interface CustomDesignInquiry {
  id: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  metalType: string;
  category: string;
  weightRange: string;
  budgetNpr?: string;
  notes: string;
  referenceImageUrl?: string;
  status: 'new' | 'contacted' | 'in_discussion' | 'in_progress' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface RepairBooking {
  id: string;
  customerName: string;
  phone: string;
  whatsapp?: string;
  itemType: string;
  serviceType: string;
  preferredDate: string;
  preferredTimeSlot: string;
  damageDescription: string;
  referenceImageUrl?: string;
  status: 'new' | 'confirmed' | 'in_progress' | 'ready_for_pickup' | 'completed';
  createdAt: string;
}

export interface InquiryCartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface WebStats {
  totalProductViews: number;
  totalWhatsAppClicks: number;
  totalCustomDesignInquiries: number;
  totalRepairBookings: number;
  totalCartInquiries: number;
  lastUpdated: string;
}

export interface StoreInfo {
  name: string;
  tagline: string;
  address: string;
  city: string;
  district: string;
  country: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingHours: string;
  openDays: string;
  googleMapsUrl: string;
}
