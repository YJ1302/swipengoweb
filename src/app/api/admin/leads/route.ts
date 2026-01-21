import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        console.log(`[AdminAPI] Fetching Leads from: ${ADMIN_API_URL}`);

        const response = await fetch(`${ADMIN_API_URL}?action=getLeads&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[AdminAPI] Leads fetch failed: ${response.status} ${response.statusText}`);
            return NextResponse.json({ error: `Upstream error: ${response.status}` }, { status: 502 });
        }

        const json = await response.json();

        // Log upstream response for debugging
        if (process.env.NODE_ENV === 'development') {
            console.log('[AdminAPI] Leads response:', JSON.stringify(json).substring(0, 200) + '...');
        }

        if (!json.ok) {
            console.error('[AdminAPI] Leads error:', json.error);
            return NextResponse.json({ error: json.error || 'Failed to fetch leads' }, { status: 500 });
        }

        // Map 'data' to 'leads' for frontend compatibility
        return NextResponse.json({ leads: json.data || [] });
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch(`${ADMIN_API_URL}?action=updateLead&key=${ADMIN_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const json = await response.json();

        if (!json.ok) {
            return NextResponse.json({ error: json.error }, { status: 500 });
        }

        return NextResponse.json(json);
    } catch (error) {
        console.error('Failed to update lead:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}
