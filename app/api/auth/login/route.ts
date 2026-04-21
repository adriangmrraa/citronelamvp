import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Demo users - modo sin database
const DEMO_USERS = [
  { id: 1, username: 'demo', password: 'demo123', email: 'demo@citronela.com', role: 'USER', tokens: 500, isVerified: true },
  { id: 2, username: 'admin', password: 'admin123', email: 'admin@citronela.com', role: 'ADMIN', tokens: 1000, isVerified: true },
  { id: 3, username: ' grower', password: 'grow123', email: 'grower@citronela.com', role: 'USER', tokens: 250, isVerified: false },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    // Try to find user in demo users first
    const user = DEMO_USERS.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      // Create session cookie
      await createSession(user.id, user.username, user.role);

      return NextResponse.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          tokens: user.tokens,
          isVerified: user.isVerified,
        },
        demo: true,
      });
    }

    // If no demo user found, return error
    return NextResponse.json(
      { error: 'Usuario o contraseña incorrectos. Prueba: demo / demo123' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}