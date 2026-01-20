import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const COOKIE_NAME = 'admin_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request: NextRequest) {
    try {
        const { password } = await request.json();

        if (password === ADMIN_PASSWORD) {
            // Create a simple session token
            const sessionToken = Buffer.from(`${Date.now()}-${ADMIN_PASSWORD}`).toString('base64');

            const cookieStore = await cookies();
            cookieStore.set(COOKIE_NAME, sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: COOKIE_MAX_AGE,
                path: '/',
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    } catch {
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete(COOKIE_NAME);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
    }
}

export async function GET() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get(COOKIE_NAME);

        if (session?.value) {
            return NextResponse.json({ authenticated: true });
        }

        return NextResponse.json({ authenticated: false }, { status: 401 });
    } catch {
        return NextResponse.json({ authenticated: false }, { status: 500 });
    }
}
