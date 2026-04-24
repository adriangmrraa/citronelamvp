import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, tokenTransactions } from '@/db/schema';
import { hashPassword, generateVerificationToken, getUserByUsername, getUserByEmail } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    if (!username || !password || !email) {
      return NextResponse.json(
        { error: 'Usuario, email y contraseña son requeridos' },
        { status: 400 }
      );
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'El usuario debe tener al menos 3 caracteres' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Check existing
    const existingUsername = await getUserByUsername(username);
    if (existingUsername) {
      return NextResponse.json(
        { error: 'El nombre de usuario ya está en uso' },
        { status: 409 }
      );
    }

    const existingEmail = await getUserByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = await generateVerificationToken();

    if (!db) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    // Beta/Dev: auto-approve — todos los registros se verifican automáticamente
    // En producción, cambiar isVerified a false y tokens a 0
    const INITIAL_TOKENS = 300;
    const [newUser] = await db.insert(users).values({
      username,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: true,
      emailVerified: true,
      tokens: INITIAL_TOKENS,
    }).returning({ id: users.id, username: users.username, email: users.email });

    return NextResponse.json({
      user: { id: newUser.id, username: newUser.username, email: newUser.email },
      message: 'Cuenta creada. Ya podés iniciar sesión.',
    }, { status: 201 });
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
