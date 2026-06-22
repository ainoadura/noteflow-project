//app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('El formato del correo electrónico no es válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { email, password } = result.data;

    const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Este correo electrónico ya se encuentra registrado' }, 
        { status: 400 }
      );
    }

    await query(
      'INSERT INTO users (email, password) VALUES ($1, $2)',
      [email, password]
    );

    return NextResponse.json(
      { message: 'Usuario registrado con éxito' }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('Error detectado en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la solicitud' }, 
      { status: 500 }
    );
  }
}
