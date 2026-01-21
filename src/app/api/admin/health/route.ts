import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        console.log(`[AdminHealth] Testing connection to: ${ADMIN_API_URL}`);

        const response = await fetch(`${ADMIN_API_URL}?action=testConnection&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[AdminHealth] Connection failed: ${response.status}`);
            return NextResponse.json({ error: `Upstream error: ${response.status}` }, { status: 502 });
        }

        const json = await response.json();

        if (!json.ok) {
            console.error('[AdminHealth] Health check error:', json.error);
            return NextResponse.json({ error: json.error || 'Health check failed' }, { status: 500 });
        }

        return NextResponse.json({
            ...json.data,
            config: {
                apiUrl: ADMIN_API_URL ? `...${ADMIN_API_URL.slice(-10)}` : 'Not Configured',
                keyConfigured: !!ADMIN_KEY
            }
        });
    } catch (error) {
        console.error('Failed to check health:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
