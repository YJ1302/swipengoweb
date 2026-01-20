import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        const response = await fetch(`${ADMIN_API_URL}?action=getLeads&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to fetch leads:', error);
        return NextResponse.json({ error: 'Failed to fetch leads', leads: [] }, { status: 500 });
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

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Failed to update lead:', error);
        return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
    }
}
