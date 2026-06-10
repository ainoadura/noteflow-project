// backend/app/api/checklist-items/[itemId]/route.ts
import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { z } from 'zod';

const patchItemSchema = z.object({
  is_completed: z.boolean(),
});

type RouteParams = { params: Promise<{ itemId: string }> };

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params;
    const body = await request.json();

    const result = patchItemSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ errors: result.error.issues }, { status: 400 });
    }

    const { is_completed } = result.data;

    const [updatedItem] = await query(
      'UPDATE checklist_items SET is_completed = $1 WHERE id = $2 RETURNING *',
      [is_completed, itemId]
    );

    if (!updatedItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('Database PATCH Item Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { itemId } = await params;

    await query('DELETE FROM checklist_items WHERE id = $1', [itemId]);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Database DELETE Item Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
