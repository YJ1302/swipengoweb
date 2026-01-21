import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        console.log(`[AdminAPI] Fetching Packages from: ${ADMIN_API_URL}`);

        const response = await fetch(`${ADMIN_API_URL}?action=getPackages&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[AdminAPI] Packages fetch failed: ${response.status}`);
            return NextResponse.json({ error: 'Upstream error' }, { status: 502 });
        }

        const json = await response.json();

        if (!json.ok) {
            console.error('[AdminAPI] Packages error:', json.error);
            return NextResponse.json({ error: json.error || 'Failed to fetch packages' }, { status: 500 });
        }

        // Map 'data' to 'packages'
        return NextResponse.json({ packages: json.data || [] });
    } catch (error) {
        console.error('Failed to fetch packages:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=addPackage&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to add package:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=updatePackage&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to update package:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=deletePackage&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();
        if (!json.ok) return NextResponse.json({ error: json.error }, { status: 500 });
        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to delete package:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
