// backend/app/api/notes/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const noteSchema = z.object({
  id: z.string(), 
  title: z.string().min(1),
  type: z.enum(['standard', 'checklist', 'idea']), 
  content: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const sqlQuery = `
      SELECT 
        n.*,
        COALESCE(json_agg(ci.*) FILTER (WHERE ci.id IS NOT NULL), '[]') as items
      FROM notes n
      LEFT JOIN checklist_items ci ON n.id = ci.note_id
      GROUP BY n.id
      ORDER BY n.created_at DESC;
    `;
    
    const notes = await query(sqlQuery);
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error('Database GET JSON_AGG Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const result = noteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { id, title, type, content, color } = result.data;
    
    const now = new Date().toISOString();

    const [note] = await query(
      'INSERT INTO notes (id, title, type, content, color, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, title, type, content || null, color || null, now, now]
    );

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error('Database POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
