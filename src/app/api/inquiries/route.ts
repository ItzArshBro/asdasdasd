import { NextResponse } from 'next/server';
import {
  getCustomInquiries,
  getRepairBookings,
  createCustomInquiry,
  createRepairBooking,
  updateCustomInquiryStatus,
  updateRepairBookingStatus,
} from '@/lib/db';
import { getAdminSession } from '@/lib/auth';

export async function GET() {
  try {
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const customInquiries = getCustomInquiries();
    const repairBookings = getRepairBookings();

    return NextResponse.json({
      success: true,
      customInquiries,
      repairBookings,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type } = body; // 'custom_design' or 'repair_booking'

    if (type === 'custom_design') {
      const { customerName, phone, whatsapp, metalType, category, weightRange, budgetNpr, notes, referenceImageUrl } = body;
      if (!customerName || !phone || !metalType || !category || !notes) {
        return NextResponse.json({ success: false, error: 'Please fill in all required fields' }, { status: 400 });
      }

      const inquiry = createCustomInquiry({
        customerName,
        phone,
        whatsapp: whatsapp || phone,
        metalType,
        category,
        weightRange: weightRange || 'Flexible',
        budgetNpr: budgetNpr || '',
        notes,
        referenceImageUrl: referenceImageUrl || '',
      });

      return NextResponse.json({ success: true, inquiry });
    } else if (type === 'repair_booking') {
      const { customerName, phone, whatsapp, itemType, serviceType, preferredDate, preferredTimeSlot, damageDescription, referenceImageUrl } = body;
      if (!customerName || !phone || !itemType || !serviceType || !damageDescription) {
        return NextResponse.json({ success: false, error: 'Please fill in all required fields' }, { status: 400 });
      }

      const booking = createRepairBooking({
        customerName,
        phone,
        whatsapp: whatsapp || phone,
        itemType,
        serviceType,
        preferredDate: preferredDate || new Date().toISOString().split('T')[0],
        preferredTimeSlot: preferredTimeSlot || 'Morning (10 AM - 1 PM)',
        damageDescription,
        referenceImageUrl: referenceImageUrl || '',
      });

      return NextResponse.json({ success: true, booking });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid inquiry type' }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to submit inquiry' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const isAdmin = await getAdminSession();
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, id, status } = body;

    if (type === 'custom_design') {
      const success = updateCustomInquiryStatus(id, status);
      return NextResponse.json({ success });
    } else if (type === 'repair_booking') {
      const success = updateRepairBookingStatus(id, status);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: 'Invalid update target' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update status' }, { status: 500 });
  }
}
