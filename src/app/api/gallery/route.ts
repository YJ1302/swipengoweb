import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export const dynamic = 'force-dynamic'; // Use caching headers instead for better control? Or revalidate.

export async function GET() {
    try {
        if (!ADMIN_API_URL) return NextResponse.json({ error: 'Config Error' }, { status: 500 });

        const response = await fetch(`${ADMIN_API_URL}?action=getGallery&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            next: { revalidate: 60 } // Cache for 60 seconds
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
        }

        const json = await response.json();

        if (!json.ok) {
            return NextResponse.json({ error: json.error || 'Failed' }, { status: 500 });
        }

        // Return only active items to public
        const allItems = json.data || [];
        const activeItems = allItems.filter((item: any) => item.active === true || item.active === 'TRUE');

        return NextResponse.json({ gallery: activeItems });
    } catch (error) {
        console.error('Failed to fetch public gallery:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
