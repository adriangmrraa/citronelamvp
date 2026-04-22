import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { getUserById } from './auth';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'demo-secret-key-citronela-2024-change-in-production'
);
const SESSION_COOKIE = 'session';
const SESSION_EXPIRY_DAYS = 7;

// ============ TYPES ============
export interface SessionPayload {
  userId: number;
  username: string;
  role: string;
  exp: number;
}

// ============ ENCRYPT/DECRYPT ============
export async function encrypt(session: SessionPayload): Promise<string> {
  return new SignJWT({ userId: session.userId, username: session.username, role: session.role })
    .setExpirationTime(`${SESSION_EXPIRY_DAYS}d`)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(JWT_SECRET);
}

export async function decrypt(sessionValue: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(sessionValue, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ============ SESSION OPERATIONS ============
export async function createSession(userId: number, username: string, role: string) {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, username, role, exp: expiresAt.getTime() });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionValue) return null;
  return decrypt(sessionValue);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

// ============ AUTH HELPERS ============
export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await getUserById(session.userId);
  if (!user) return null;

  // Don't return password
  const { password: _, ...safeUser } = user;
  return safeUser;
}

export async function requireAuth(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) {
    throw new Error('No autenticado');
  }
  return session;
}

export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireAuth();
  if (session.role !== 'ADMIN' && session.role !== 'STAFF') {
    throw new Error('No autorizado');
  }
  return session;
}
