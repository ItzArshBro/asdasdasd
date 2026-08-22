import { NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    let products = getProducts();

    if (category && category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === 'true') {
      products = products.filter((p) => p.isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.nepaliName && p.nepaliName.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      nepaliName,
      sku,
      category,
      metalType,
      karat,
      weightGrams,
      weightTola,
      makingChargePercentage,
      makingChargeFlatNpr,
      description,
      features,
      images,
      inStock,
      isFeatured,
      isTrending,
    } = body;

    if (!name || !sku || !category || !metalType || !weightGrams) {
      return NextResponse.json({ success: false, error: 'Missing required product fields' }, { status: 400 });
    }

    const newProduct = createProduct({
      name,
      nepaliName: nepaliName || '',
      sku: sku.toUpperCase(),
      category,
      metalType,
      karat: karat || '24K',
      weightGrams: Number(weightGrams),
      weightTola: weightTola ? Number(weightTola) : Number((Number(weightGrams) / 11.6638).toFixed(2)),
      makingChargePercentage: Number(makingChargePercentage) || 10,
      makingChargeFlatNpr: makingChargeFlatNpr ? Number(makingChargeFlatNpr) : undefined,
      description: description || '',
      features: Array.isArray(features) ? features : (features ? features.split('\n').filter(Boolean) : []),
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80'],
      inStock: inStock ?? true,
      isFeatured: isFeatured ?? false,
      isTrending: isTrending ?? false,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
