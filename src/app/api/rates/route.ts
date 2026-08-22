import { NextResponse } from 'next/server';
import { getDailyRates, updateDailyRates } from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const rates = await getDailyRates();
    return NextResponse.json({ success: true, rates });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch rates' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { gold24kPerTola, gold22kPerTola, gold18kPerGram, silverPerTola, silverPerGram, source, notes } = body;

    if (!gold24kPerTola || !gold22kPerTola || !silverPerTola) {
      return NextResponse.json({ success: false, error: 'Invalid rate numbers' }, { status: 400 });
    }

    const updated = await updateDailyRates({
      gold24kPerTola: Number(gold24kPerTola),
      gold22kPerTola: Number(gold22kPerTola),
      gold18kPerGram: Number(gold18kPerGram) || (Number(gold24kPerTola) / 11.6638) * 0.75,
      silverPerTola: Number(silverPerTola),
      silverPerGram: Number(silverPerGram) || Number(silverPerTola) / 11.6638,
      source: source || 'Admin Manual Update',
      notes: notes || '',
    });

    return NextResponse.json({ success: true, rates: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update rates' }, { status: 500 });
  }
}
