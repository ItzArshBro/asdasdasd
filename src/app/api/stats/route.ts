import { NextResponse } from 'next/server';
import { getWebStats, incrementStat, getProducts, getCustomInquiries, getRepairBookings } from '@/lib/db';

export async function GET() {
  try {
    const stats = await getWebStats();
    const products = await getProducts();
    const customInquiries = await getCustomInquiries();
    const repairBookings = await getRepairBookings();

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        totalProductsCount: products.length,
        pendingCustomInquiries: customInquiries.filter((i) => i.status === 'new').length,
        pendingRepairBookings: repairBookings.filter((b) => b.status === 'new').length,
        inStockProducts: products.filter((p) => p.inStock).length,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event } = body;
    if (['totalProductViews', 'totalWhatsAppClicks', 'totalCartInquiries'].includes(event)) {
      const updated = await incrementStat(event);
      return NextResponse.json({ success: true, stats: updated });
    }
    return NextResponse.json({ success: false, error: 'Invalid event' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to record event' }, { status: 500 });
  }
}
