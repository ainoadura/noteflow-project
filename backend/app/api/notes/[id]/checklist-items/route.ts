// backend/app/api/notes/[id]/checklist-items/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const itemSchema = z.object({
  id: z.string(), 
  text: z.string().min(1),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id: noteId } = await params;
    const body = await request.json();

    const result = itemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { id, text } = result.data;

    const [newItem] = await query(
      'INSERT INTO checklist_items (id, note_id, text, is_completed) VALUES ($1, $2, $3, FALSE) RETURNING *',
      [id, noteId, text]
    );

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Database POST Checklist Item Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
