import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL;

export async function GET() {

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value || "redondi";

    const res = await fetch(`${API_URL}/stats/total-orders`, {
        method: "GET",
        headers: {
            "authorization": `Bearer ${token}`
        },
        next: { revalidate: 3600 }
    });

    const data = await res.json();

    if (!res.ok) {
        return NextResponse.json({ error: data.message || 'Not Found' }, { status: res.status });
    }

    return NextResponse.json(data);
}