import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/session';

// Demo mode - create user in memory
let demoUserId = 100;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Usuario y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'El usuario debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    // Create demo user
    demoUserId++;
    const newUser = {
      id: demoUserId,
      username,
      email: email || `${username}@demo.com`,
      role: 'USER' as const,
      tokens: 100,
      isVerified: false,
      isDemo: true,
    };

    // Create session cookie
    await createSession(newUser.id, newUser.username, newUser.role);

    return NextResponse.json({
      user: newUser,
      demo: true,
      message: 'Cuenta demo creada. ¡Podes explorar la app!',
    });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}