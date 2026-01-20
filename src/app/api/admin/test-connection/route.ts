import { NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

export async function GET() {
    try {
        if (!ADMIN_API_URL || !ADMIN_KEY) {
            return NextResponse.json({
                success: false,
                error: 'Admin API not configured. Check ADMIN_API_URL and ADMIN_KEY in .env.local'
            });
        }

        const response = await fetch(`${ADMIN_API_URL}?action=testConnection&key=${ADMIN_KEY}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Connection test failed:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Connection test failed'
        }, { status: 500 });
    }
}
