//app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';
import jwt from 'jsonwebtoken';

const loginSchema = z.object({
  email: z.string().email('El formato del correo electrónico no es válido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

interface DatabaseUser {
  id: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { email, password } = result.data;

    const users = await query<DatabaseUser>(
      'SELECT id, email, password FROM users WHERE email = $1',
      [email]
    );

    const user = users[0];

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'El correo electrónico o la contraseña son incorrectos' }, 
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error('Falta la variable de entorno obligatoria: JWT_SECRET');
      return NextResponse.json(
        { error: 'Error de configuración interna del servidor' }, 
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token }, { status: 200 });

  } catch (error) {
    console.error('Error detectado en inicio de sesión:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la autenticación' }, 
      { status: 500 }
    );
  }
}
