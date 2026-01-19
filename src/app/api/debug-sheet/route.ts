import { NextResponse } from 'next/server';

export async function GET() {
    const SHEET_ID = process.env.SHEET_ID;

    // Check 1: Is Env Var loaded?
    if (!SHEET_ID) {
        return NextResponse.json({
            success: false,
            message: 'SHEET_ID is missing. Make sure .env.local exists and server was restarted.'
        }, { status: 500 });
    }

    const tabName = 'packages';
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;

    try {
        const response = await fetch(url, { cache: 'no-store' });
        const text = await response.text();

        // Check 2: Google Auth Redirect (Common issue)
        const isLoginScreen = text.includes('<!DOCTYPE html>') || text.includes('google.com/accounts');

        return NextResponse.json({
            success: !isLoginScreen && response.ok,
            sheetId: SHEET_ID,
            httpStatus: response.status,
            isLoginScreen,
            contentPreview: text.substring(0, 500), // Show first 500 chars to check if it's CSV or HTML
            diagnosis: isLoginScreen
                ? "Google returned a Login Page. Share settings are likely 'Restricted'. Set to 'Anyone with link'."
                : (response.status !== 200 ? "HTTP Error. Check Sheet ID." : "Connection successful. Check contentPreview to see if it's CSV.")
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
