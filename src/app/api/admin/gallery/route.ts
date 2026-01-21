import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        console.log(`[AdminAPI] Fetching Gallery from: ${ADMIN_API_URL}`);

        const response = await fetch(`${ADMIN_API_URL}?action=getGallery&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[AdminAPI] Gallery fetch failed: ${response.status}`);
            return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
        }

        const json = await response.json();

        if (!json.ok) {
            console.error('[AdminAPI] Gallery error:', json.error);
            return NextResponse.json({ error: json.error || 'Failed to fetch gallery' }, { status: 500 });
        }

        // Map 'data' to 'gallery'
        return NextResponse.json({ gallery: json.data || [] });
    } catch (error) {
        console.error('Failed to fetch gallery:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=addGalleryItem&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to add gallery item:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=updateGalleryItem&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to update gallery item:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=deleteGalleryItem&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to delete gallery item:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
