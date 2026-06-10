// backend/app/api/notes/[id]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
});

type RouteParams = { params: Promise<{ id: string }> };

// Handler GET
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const [note] = await query('SELECT * FROM notes WHERE id = $1', [id]);
    
    if (!note) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }
    
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error('Database GET Dynamic Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//Handler PATCH
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const result = updateNoteSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const [existingNote] = await query('SELECT * FROM notes WHERE id = $1', [id]);
    if (!existingNote) {
      return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    }

    const { title, content, color } = result.data;
    const updatedTitle = title !== undefined ? title : (existingNote as any).title;
    const updatedContent = content !== undefined ? content : (existingNote as any).content;
    const updatedColor = color !== undefined ? color : (existingNote as any).color;
    const now = new Date().toISOString();

    const [updatedNote] = await query(
      'UPDATE notes SET title = $1, content = $2, color = $3, updated_at = $4 WHERE id = $5 RETURNING *',
      [updatedTitle, updatedContent, updatedColor, now, id]
    );

    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error('Database PATCH Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

//Handler DELETE
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;

    await query('DELETE FROM notes WHERE id = $1', [id]);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Database DELETE Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
