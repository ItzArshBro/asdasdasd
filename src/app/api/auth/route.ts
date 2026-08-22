import { NextResponse } from 'next/server';
import { verifyAdminCredentials, createAdminSessionToken, getAdminSession } from '@/lib/auth';
import { updateAdminLastLogin } from '@/lib/db';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'rj_admin_session';

export async function GET() {
  try {
    const isAuthenticated = await getAdminSession();
    return NextResponse.json({ authenticated: isAuthenticated });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });
    }

    if (username.trim().toLowerCase() !== 'rambadevi') {
      return NextResponse.json({ success: false, error: 'Invalid admin username' }, { status: 401 });
    }

    const isValid = await verifyAdminCredentials(password);
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid admin password' }, { status: 401 });
    }

    const token = await createAdminSessionToken();
    updateAdminLastLogin();

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ success: true, message: 'Logged in successfully' });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
