import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

interface Params {
    id: string;
}

const API_URL = process.env.API_URL;

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { id } = await params;
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value || "redondi";

    const res = await fetch(`${API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: {
            "authorization": `Bearer ${token}`
        }
    });

    revalidatePath("/api/stats/foods-ordered");
    revalidatePath("/api/stats/revenue");
    revalidatePath("/api/stats/total-orders");

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}