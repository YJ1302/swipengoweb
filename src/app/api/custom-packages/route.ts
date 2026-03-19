import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';

export const revalidate = 60; // Cache for 60 seconds (or 0 for no cache)

export async function GET() {
    try {
        const response = await fetch(`${ADMIN_API_URL}?action=getCustomPackagesPublic`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 } // revalidate every minute
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
        }

        const json = await response.json();
        if (!json.ok) {
            return NextResponse.json({ error: json.error || 'Failed to fetch public custom packages' }, { status: 500 });
        }

        return NextResponse.json({ customPackages: json.data || [] });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
