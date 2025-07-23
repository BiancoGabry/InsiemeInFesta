import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL;

export async function GET() {
    const res = await fetch(`${API_URL}/foods`, { next: { revalidate: 3600 } });
    const data = await res.json();
    return NextResponse.json(data);
}