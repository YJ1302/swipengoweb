import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';

/**
 * Debug endpoint to test lead creation.
 * This can be used to verify the Apps Script is working correctly.
 * 
 * Usage: GET /api/debug/lead-test
 * This will create a test lead to verify the pipeline works.
 */
export async function GET(request: NextRequest) {
    // Only allow in development or with admin key
    const url = new URL(request.url);
    const key = url.searchParams.get('key');

    if (process.env.NODE_ENV === 'production' && key !== process.env.ADMIN_KEY) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const testLead = {
        name: '[TEST] Debug Lead',
        phone: '0000000000',
        destination: 'Test Destination',
        travel_month: 'TestMonth',
        num_people: '1',
        budget_range: 'Test Budget',
        notes: 'This is a test lead created by /api/debug/lead-test at ' + new Date().toISOString(),
        source: '/api/debug/lead-test',
    };

    console.log('[DebugLeadTest] Testing lead creation with payload:', testLead);
    console.log('[DebugLeadTest] ADMIN_API_URL configured:', !!ADMIN_API_URL);

    if (!ADMIN_API_URL) {
        return NextResponse.json({
            success: false,
            error: 'ADMIN_API_URL is not configured',
            env: {
                ADMIN_API_URL: '(not set)',
                NEXT_PUBLIC_LEADS_SCRIPT_URL: process.env.NEXT_PUBLIC_LEADS_SCRIPT_URL ? '(set)' : '(not set)',
            }
        }, { status: 500 });
    }

    try {
        // Call Apps Script directly from server (no CORS issues)
        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testLead),
        });

        const text = await response.text();
        console.log('[DebugLeadTest] Response status:', response.status);
        console.log('[DebugLeadTest] Response text:', text.substring(0, 500));

        let json;
        try {
            json = JSON.parse(text);
        } catch {
            json = { raw: text };
        }

        return NextResponse.json({
            success: response.ok,
            status: response.status,
            response: json,
            testLead,
            message: response.ok
                ? 'Test lead created successfully! Check your Leads sheet.'
                : 'Failed to create test lead. Check the response for details.',
        });
    } catch (error) {
        console.error('[DebugLeadTest] Error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error),
            testLead,
        }, { status: 500 });
    }
}
