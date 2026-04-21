import 'server-only';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';

// Fallback para modo demo sin DB
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'demo-secret-key-citronela-2024-change-in-production'
);
const SESSION_COOKIE = 'session';
const SESSION_EXPIRY_DAYS = 7;

// Demo users en memoria para el modo sin DB
const DEMO_USERS: Record<number, { id: number; username: string; email: string; role: string; tokens: number; isVerified: boolean }> = {
  1: { id: 1, username: 'demo', email: 'demo@citronela.com', role: 'USER', tokens: 500, isVerified: true },
  2: { id: 2, username: 'admin', email: 'admin@citronela.com', role: 'ADMIN', tokens: 1000, isVerified: true },
  3: { id: 3, username: 'grower', email: 'grower@citronela.com', role: 'USER', tokens: 250, isVerified: false },
  100: { id: 100, username: 'demo-user', email: 'new@demo.com', role: 'USER', tokens: 100, isVerified: false },
};

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
  
  // En modo demo sin DB, devolvemos el usuario de memoria
  const user = DEMO_USERS[session.userId];
  if (user) return user;
  
  // Si no existe en memoria, crear uno temporal
  return {
    id: session.userId,
    username: session.username,
    email: `${session.username}@demo.com`,
    role: session.role,
    tokens: 100,
    isVerified: false,
  };
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