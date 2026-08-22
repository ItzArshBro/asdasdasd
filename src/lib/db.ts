import fs from 'fs';
import path from 'path';
import { Product, DailyRates, CustomDesignInquiry, RepairBooking, WebStats } from './types';
import { DEFAULT_RATES } from './constants';
import { SEED_PRODUCTS } from './seedData';

interface DatabaseSchema {
  products: Product[];
  rates: DailyRates;
  customInquiries: CustomDesignInquiry[];
  repairBookings: RepairBooking[];
  stats: WebStats;
  admin: {
    username: string;
    passwordHash: string; // bcrypt hash or salted verification
    lastLogin?: string;
  };
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Default initial state
function getInitialData(): DatabaseSchema {
  return {
    products: [],
    rates: DEFAULT_RATES,
    customInquiries: [],
    repairBookings: [],
    stats: {
      totalProductViews: 0,
      totalWhatsAppClicks: 0,
      totalCustomDesignInquiries: 0,
      totalRepairBookings: 0,
      totalCartInquiries: 0,
      lastUpdated: new Date().toISOString(),
    },
    admin: {
      username: 'rambadevi',
      passwordHash: '$2a$10$7Z8Kq4k0mN3/vW3C0bYk..sBw0uIq9E.F6vR4gP.Gq3T3N7rW/0Y2',
    }
  };
}

function ensureDataFile(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error ensuring data file:', err);
  }
}

function readDb(): DatabaseSchema {
  ensureDataFile();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, returning initial state:', err);
    return getInitialData();
  }
}

function writeDb(data: DatabaseSchema): void {
  ensureDataFile();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing to database file:', err);
  }
}

// ==================== PRODUCTS ====================

export function getProducts(): Product[] {
  const db = readDb();
  return db.products || [];
}

export function getProductById(id: string): Product | undefined {
  const db = readDb();
  return db.products.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase());
}

export function createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
  const db = readDb();
  const newProduct: Product = {
    ...productData,
    id: `prod-rj-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  db.products.unshift(newProduct);
  writeDb(db);
  return newProduct;
}

export function updateProduct(id: string, updates: Partial<Product>): Product | null {
  const db = readDb();
  const index = db.products.findIndex((p) => p.id === id);
  if (index === -1) return null;

  db.products[index] = {
    ...db.products[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.products[index];
}

export function deleteProduct(id: string): boolean {
  const db = readDb();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => p.id !== id);
  if (db.products.length !== initialLength) {
    writeDb(db);
    return true;
  }
  return false;
}

// ==================== DAILY RATES ====================

export function getDailyRates(): DailyRates {
  const db = readDb();
  return db.rates || DEFAULT_RATES;
}

export function updateDailyRates(newRates: Partial<DailyRates>): DailyRates {
  const db = readDb();
  db.rates = {
    ...db.rates,
    ...newRates,
    updatedAt: new Date().toISOString(),
  };
  writeDb(db);
  return db.rates;
}

// ==================== CUSTOM DESIGN INQUIRIES ====================

export function getCustomInquiries(): CustomDesignInquiry[] {
  const db = readDb();
  return db.customInquiries || [];
}

export function createCustomInquiry(data: Omit<CustomDesignInquiry, 'id' | 'status' | 'createdAt'>): CustomDesignInquiry {
  const db = readDb();
  const newInquiry: CustomDesignInquiry = {
    ...data,
    id: `inq-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  if (!db.customInquiries) db.customInquiries = [];
  db.customInquiries.unshift(newInquiry);
  db.stats.totalCustomDesignInquiries = (db.stats.totalCustomDesignInquiries || 0) + 1;
  writeDb(db);
  return newInquiry;
}

export function updateCustomInquiryStatus(id: string, status: CustomDesignInquiry['status']): boolean {
  const db = readDb();
  const inquiry = db.customInquiries.find((i) => i.id === id);
  if (inquiry) {
    inquiry.status = status;
    writeDb(db);
    return true;
  }
  return false;
}

// ==================== REPAIR BOOKINGS ====================

export function getRepairBookings(): RepairBooking[] {
  const db = readDb();
  return db.repairBookings || [];
}

export function createRepairBooking(data: Omit<RepairBooking, 'id' | 'status' | 'createdAt'>): RepairBooking {
  const db = readDb();
  const newBooking: RepairBooking = {
    ...data,
    id: `rep-${Date.now()}`,
    status: 'new',
    createdAt: new Date().toISOString(),
  };
  if (!db.repairBookings) db.repairBookings = [];
  db.repairBookings.unshift(newBooking);
  db.stats.totalRepairBookings = (db.stats.totalRepairBookings || 0) + 1;
  writeDb(db);
  return newBooking;
}

export function updateRepairBookingStatus(id: string, status: RepairBooking['status']): boolean {
  const db = readDb();
  const booking = db.repairBookings.find((b) => b.id === id);
  if (booking) {
    booking.status = status;
    writeDb(db);
    return true;
  }
  return false;
}

// ==================== WEB STATS ====================

export function getWebStats(): WebStats {
  const db = readDb();
  return db.stats || {
    totalProductViews: 0,
    totalWhatsAppClicks: 0,
    totalCustomDesignInquiries: 0,
    totalRepairBookings: 0,
    totalCartInquiries: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export function incrementStat(key: keyof Omit<WebStats, 'lastUpdated'>): WebStats {
  const db = readDb();
  if (!db.stats) {
    db.stats = {
      totalProductViews: 0,
      totalWhatsAppClicks: 0,
      totalCustomDesignInquiries: 0,
      totalRepairBookings: 0,
      totalCartInquiries: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
  db.stats[key] = (db.stats[key] || 0) + 1;
  db.stats.lastUpdated = new Date().toISOString();
  writeDb(db);
  return db.stats;
}

// ==================== ADMIN AUTH ====================

export function getAdminUser() {
  const db = readDb();
  return db.admin;
}

export function updateAdminLastLogin(): void {
  const db = readDb();
  if (db.admin) {
    db.admin.lastLogin = new Date().toISOString();
    writeDb(db);
  }
}
