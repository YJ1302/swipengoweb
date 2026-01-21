import { NextRequest, NextResponse } from 'next/server';

const ADMIN_API_URL = process.env.ADMIN_API_URL || '';

/**
 * Server-side proxy for lead submission.
 * This avoids CORS issues by making the request from the server.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('[LeadSubmit] Received lead submission:', {
            name: body.name,
            destination: body.destination,
            source: body.source,
        });

        if (!ADMIN_API_URL) {
            console.error('[LeadSubmit] ADMIN_API_URL is not configured');
            return NextResponse.json({
                success: false,
                error: 'Server configuration error'
            }, { status: 500 });
        }

        // Prepare the lead data
        const leadData = {
            name: body.name || '',
            phone: body.phone || '',
            destination: body.destination || '',
            travel_month: body.travel_month || '',
            num_people: body.num_people || '',
            budget_range: body.budget_range || '',
            notes: body.notes || '',
            source: body.source || 'Website',
        };

        console.log('[LeadSubmit] Sending to Apps Script:', ADMIN_API_URL);

        // Call Apps Script directly from server (no CORS issues)
        const response = await fetch(ADMIN_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(leadData),
        });

        const text = await response.text();
        console.log('[LeadSubmit] Apps Script response:', response.status, text.substring(0, 200));

        let json;
        try {
            json = JSON.parse(text);
        } catch {
            // If not JSON, wrap it
            json = { raw: text, status: response.status };
        }

        if (response.ok && json.ok !== false) {
            return NextResponse.json({
                success: true,
                message: 'Lead saved successfully'
            });
        } else {
            console.error('[LeadSubmit] Apps Script error:', json);
            return NextResponse.json({
                success: false,
                error: json.error || 'Failed to save lead'
            }, { status: 500 });
        }
    } catch (error) {
        console.error('[LeadSubmit] Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}
