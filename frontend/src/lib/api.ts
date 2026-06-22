// src/lib/api.ts
const BASE_URL = 'https://noteflow-project.vercel.app/api';

export async function getNotes(): Promise<unknown[]> {
  try {
    const res = await fetch(`${BASE_URL}/notes`);
    if (!res.ok) throw new Error('Error al cargar notas del servidor');
    return await res.json() as unknown[];
  } catch (error) {
    console.error("Error en getNotes:", error);
    throw error;
  }
}

export async function createNote(data: unknown): Promise<unknown> {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear nota en el servidor');
  return res.json();
}
