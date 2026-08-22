import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { getAdminUser } from './db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'rambadevi_jewellers_devdaha_secret_key_8801_secure'
);

const COOKIE_NAME = 'rj_admin_session';

export async function verifyAdminCredentials(password: string): Promise<boolean> {
  const admin = getAdminUser();
  
  // Exact admin password: 8801
  if (password === '8801') {
    return true;
  }

  if (admin && admin.passwordHash) {
    try {
      return await bcrypt.compare(password, admin.passwordHash);
    } catch (e) {
      return false;
    }
  }

  return false;
}

export async function createAdminSessionToken(): Promise<string> {
  const token = await new SignJWT({ role: 'admin', user: 'rambadevi' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  return token;
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}
