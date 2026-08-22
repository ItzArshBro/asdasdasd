import { supabase, supabaseAdmin } from './supabase';
import { Product, DailyRates, CustomDesignInquiry, RepairBooking, WebStats } from './types';
import { DEFAULT_RATES } from './constants';

// ==================== MAP INTERFACES BACK & FORTH ====================

function mapProductFromDb(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    nepaliName: p.nepali_name || undefined,
    sku: p.sku,
    category: p.category,
    metalType: p.metal_type,
    karat: p.karat,
    weightGrams: Number(p.weight_grams),
    weightTola: p.weight_tola ? Number(p.weight_tola) : Number((Number(p.weight_grams) / 11.6638).toFixed(3)),
    makingChargePercentage: Number(p.making_charge_percentage),
    description: p.description || '',
    features: p.features || [],
    images: p.images || [],
    inStock: p.in_stock,
    isFeatured: p.is_featured,
    isTrending: p.is_trending,
    createdAt: p.created_at,
  };
}

function mapProductToDb(p: Partial<Product>) {
  const mapped: any = {};
  if (p.name !== undefined) mapped.name = p.name;
  if (p.nepaliName !== undefined) mapped.nepali_name = p.nepaliName || null;
  if (p.sku !== undefined) mapped.sku = p.sku;
  if (p.category !== undefined) mapped.category = p.category;
  if (p.metalType !== undefined) mapped.metal_type = p.metalType;
  if (p.karat !== undefined) mapped.karat = p.karat;
  if (p.weightGrams !== undefined) mapped.weight_grams = p.weightGrams;
  if (p.weightTola !== undefined) mapped.weight_tola = p.weightTola;
  if (p.makingChargePercentage !== undefined) mapped.making_charge_percentage = p.makingChargePercentage;
  if (p.description !== undefined) mapped.description = p.description;
  if (p.features !== undefined) mapped.features = p.features;
  if (p.images !== undefined) mapped.images = p.images;
  if (p.inStock !== undefined) mapped.in_stock = p.inStock;
  if (p.isFeatured !== undefined) mapped.is_featured = p.isFeatured;
  if (p.isTrending !== undefined) mapped.is_trending = p.isTrending;
  return mapped;
}

function mapRatesFromDb(r: any): DailyRates {
  return {
    gold24kPerTola: Number(r.gold_24k_per_tola),
    gold22kPerTola: Number(r.gold_22k_per_tola),
    gold18kPerGram: Number(r.gold_18k_per_gram),
    silverPerTola: Number(r.silver_per_tola),
    silverPerGram: Number(r.silver_per_gram),
    updatedAt: r.updated_at,
    source: r.source,
    notes: r.notes || undefined,
  };
}

function mapCustomInquiryFromDb(i: any): CustomDesignInquiry {
  return {
    id: i.id,
    customerName: i.customer_name,
    phone: i.phone,
    whatsapp: i.whatsapp || undefined,
    metalType: i.metal_type,
    category: i.category,
    weightRange: i.weight_range,
    budgetNpr: i.budget_npr,
    notes: i.notes || '',
    referenceImageUrl: i.reference_image_url || undefined,
    status: i.status as any,
    createdAt: i.created_at,
  };
}

function mapRepairBookingFromDb(b: any): RepairBooking {
  return {
    id: b.id,
    customerName: b.customer_name,
    phone: b.phone,
    whatsapp: b.whatsapp || undefined,
    itemType: b.category || '',
    serviceType: b.notes || '',
    preferredDate: b.preferred_date || undefined,
    preferredTimeSlot: b.preferred_time_slot || undefined,
    damageDescription: b.damage_description || undefined,
    status: b.status as any,
    createdAt: b.created_at,
  };
}

// ==================== PRODUCTS ====================

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapProductFromDb);
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return [];
  }
}

export async function getProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`id.eq.${id},sku.ilike.${id}`)
      .maybeSingle();

    if (error) throw error;
    return data ? mapProductFromDb(data) : undefined;
  } catch (err) {
    console.error(`Error fetching product by ID/SKU ${id} from Supabase:`, err);
    return undefined;
  }
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const dbPayload = mapProductToDb(productData);
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert([dbPayload])
    .select()
    .single();

  if (error) throw error;
  return mapProductFromDb(data);
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const dbPayload = mapProductToDb(updates);
  const { data, error } = await supabaseAdmin
    .from('products')
    .update(dbPayload)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data ? mapProductFromDb(data) : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product from Supabase:', error);
    return false;
  }
  return true;
}

// ==================== DAILY RATES ====================

export async function getDailyRates(): Promise<DailyRates> {
  try {
    const { data, error } = await supabase
      .from('rates')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    return data ? mapRatesFromDb(data) : DEFAULT_RATES;
  } catch (err) {
    console.error('Error fetching daily rates from Supabase:', err);
    return DEFAULT_RATES;
  }
}

export async function updateDailyRates(newRates: Partial<DailyRates>): Promise<DailyRates> {
  const dbPayload: any = {};
  if (newRates.gold24kPerTola !== undefined) dbPayload.gold_24k_per_tola = newRates.gold24kPerTola;
  if (newRates.gold22kPerTola !== undefined) dbPayload.gold_22k_per_tola = newRates.gold22kPerTola;
  if (newRates.gold18kPerGram !== undefined) dbPayload.gold_18k_per_gram = newRates.gold18kPerGram;
  if (newRates.silverPerTola !== undefined) dbPayload.silver_per_tola = newRates.silverPerTola;
  if (newRates.silverPerGram !== undefined) dbPayload.silver_per_gram = newRates.silverPerGram;
  if (newRates.source !== undefined) dbPayload.source = newRates.source;
  if (newRates.notes !== undefined) dbPayload.notes = newRates.notes;
  dbPayload.updated_at = new Date().toISOString();

  const { data, error } = await supabaseAdmin
    .from('rates')
    .update(dbPayload)
    .eq('id', 1)
    .select()
    .single();

  if (error) throw error;
  return mapRatesFromDb(data);
}

// ==================== CUSTOM DESIGN INQUIRIES ====================

export async function getCustomInquiries(): Promise<CustomDesignInquiry[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('type', 'custom_design')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapCustomInquiryFromDb);
  } catch (err) {
    console.error('Error fetching custom design inquiries from Supabase:', err);
    return [];
  }
}

export async function createCustomInquiry(
  data: Omit<CustomDesignInquiry, 'id' | 'status' | 'createdAt'>
): Promise<CustomDesignInquiry> {
  const { data: record, error } = await supabaseAdmin
    .from('inquiries')
    .insert([
      {
        type: 'custom_design',
        customer_name: data.customerName,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        metal_type: data.metalType,
        category: data.category,
        weight_range: data.weightRange,
        budget_npr: data.budgetNpr,
        notes: data.notes,
        reference_image_url: data.referenceImageUrl || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Increment statistic count in background
  await incrementStat('totalCustomDesignInquiries');

  return mapCustomInquiryFromDb(record);
}

export async function updateCustomInquiryStatus(id: string, status: CustomDesignInquiry['status']): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating custom inquiry status:', error);
    return false;
  }
  return true;
}

// ==================== REPAIR BOOKINGS ====================

export async function getRepairBookings(): Promise<RepairBooking[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .select('*')
      .eq('type', 'repair')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map(mapRepairBookingFromDb);
  } catch (err) {
    console.error('Error fetching repair bookings from Supabase:', err);
    return [];
  }
}

export async function createRepairBooking(
  data: Omit<RepairBooking, 'id' | 'status' | 'createdAt'>
): Promise<RepairBooking> {
  const { data: record, error } = await supabaseAdmin
    .from('inquiries')
    .insert([
      {
        type: 'repair',
        customer_name: data.customerName,
        phone: data.phone,
        whatsapp: data.whatsapp || null,
        category: data.itemType, // Map itemType to category
        notes: data.serviceType, // Map serviceType to notes
        preferred_date: data.preferredDate || null,
        preferred_time_slot: data.preferredTimeSlot || null,
        damage_description: data.damageDescription || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  // Increment stats
  await incrementStat('totalRepairBookings');

  return mapRepairBookingFromDb(record);
}

export async function updateRepairBookingStatus(id: string, status: RepairBooking['status']): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('inquiries')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating repair booking status:', error);
    return false;
  }
  return true;
}

// ==================== WEB STATS ====================

export async function getWebStats(): Promise<WebStats> {
  try {
    const { data, error } = await supabase
      .from('stats')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;

    return data
      ? {
          totalProductViews: data.product_views,
          totalWhatsAppClicks: data.whatsapp_clicks,
          totalCustomDesignInquiries: data.custom_inquiries,
          totalRepairBookings: data.repair_bookings,
          totalCartInquiries: data.cart_inquiries,
          lastUpdated: data.last_updated,
        }
      : {
          totalProductViews: 0,
          totalWhatsAppClicks: 0,
          totalCustomDesignInquiries: 0,
          totalRepairBookings: 0,
          totalCartInquiries: 0,
          lastUpdated: new Date().toISOString(),
        };
  } catch (err) {
    console.error('Error fetching web stats from Supabase:', err);
    return {
      totalProductViews: 0,
      totalWhatsAppClicks: 0,
      totalCustomDesignInquiries: 0,
      totalRepairBookings: 0,
      totalCartInquiries: 0,
      lastUpdated: new Date().toISOString(),
    };
  }
}

export async function incrementStat(key: keyof Omit<WebStats, 'lastUpdated'>): Promise<WebStats> {
  try {
    // Map stats JS key to DB columns
    const columnMap: Record<string, string> = {
      totalProductViews: 'product_views',
      totalWhatsAppClicks: 'whatsapp_clicks',
      totalCustomDesignInquiries: 'custom_inquiries',
      totalRepairBookings: 'repair_bookings',
      totalCartInquiries: 'cart_inquiries',
      custom_inquiries: 'custom_inquiries',
      repair_bookings: 'repair_bookings',
    };

    const columnName = columnMap[key];
    if (!columnName) throw new Error(`Unknown stat key: ${key}`);

    // Call RPC or simple increment via service client to keep stats accurate
    const { data, error } = await supabaseAdmin.rpc('increment_stat_column', {
      col_name: columnName,
    });

    if (error) {
      // Fallback: Read current count, increment, update
      const { data: currentStats } = await supabaseAdmin
        .from('stats')
        .select('*')
        .eq('id', 1)
        .single();

      if (currentStats) {
        const nextVal = (currentStats[columnName] || 0) + 1;
        const { data: updated } = await supabaseAdmin
          .from('stats')
          .update({
            [columnName]: nextVal,
            last_updated: new Date().toISOString(),
          })
          .eq('id', 1)
          .select()
          .single();

        if (updated) {
          return {
            totalProductViews: updated.product_views,
            totalWhatsAppClicks: updated.whatsapp_clicks,
            totalCustomDesignInquiries: updated.custom_inquiries,
            totalRepairBookings: updated.repair_bookings,
            totalCartInquiries: updated.cart_inquiries,
            lastUpdated: updated.last_updated,
          };
        }
      }
    }

    return getWebStats();
  } catch (err) {
    console.error(`Failed to increment stat ${key} on Supabase:`, err);
    return getWebStats();
  }
}

// ==================== ADMIN AUTH ====================

export function getAdminUser() {
  // Safe environment variables fallback for admin portal credentials verification
  return {
    username: process.env.ADMIN_USERNAME || 'rambadevi',
    passwordHash: '$2a$10$7Z8Kq4k0mN3/vW3C0bYk..sBw0uIq9E.F6vR4gP.Gq3T3N7rW/0Y2', // Defaults to bcrypt hash of '8801'
  };
}

export function updateAdminLastLogin() {
  // Analytics logging of logins
  console.log('[ADMIN] Session created successfully at', new Date().toISOString());
}
