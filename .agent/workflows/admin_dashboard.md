---
description: Admin Dashboard Setup and Usage Guide
---

# Admin Dashboard Setup Guide

This guide explains how to set up and use the Admin Dashboard for Swipe N Go Vacations.

## Prerequisites

- Google Sheet with tabs: `Leads`, `Packages`, `Gallery`
- Apps Script deployed as Web App

---

## Step 1: Deploy the Admin API Apps Script

1. Open your project folder and locate the file: `scripts/admin-api.gs.js`
2. **Copy the entire content of this file.**
3. Open your Google Sheet.
4. Go to **Extensions > Apps Script**.
5. Paste the copied code into the editor (replace existing code).
6. **IMPORTANT:** Update the `ADMIN_KEY` variable at the top of the script if you want a custom key.
7. Click **Deploy > New Deployment**.
8. Select type: **Web app**.
9. Execute as: **Me**.
10. Who has access: **Anyone**.
11. Click **Deploy**.
12. **Copy the Web App URL**.

---

## Step 2: Set Environment Variables

Add these to your `.env.local`:

```bash
# Data Source
SHEET_ID=your_sheet_id_here

# Scripts
# Use the SAME URL for both unless you have separate scripts
NEXT_PUBLIC_LEADS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
ADMIN_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Security
ADMIN_KEY=swipengoadmin2024  # Must match the key in your Apps Script!
ADMIN_PASSWORD=your_secure_password
```

---

## Step 3: Access the Admin Dashboard

1. **Restart your local server** (`npm run dev`) to apply environment updates.
2. Go to `http://localhost:3000/admin`
3. Enter your admin password.

---

## Usage Guide

### Overview Page
- View KPIs: Total Leads, New Leads, Conversions
- See recent leads with quick actions
- Charts showing lead trends

### Leads Page
- View all leads in a table
- Filter by status, date, destination
- Click a row to see details
- Change status inline
- **Refresh Button:** Manually fetch the latest data from Google Sheets
- Export to CSV

### Packages Page
- View all packages
- Add new packages with the + button
- Edit or delete existing packages
- **Active Toggle:** Instantly enable/disable packages (updates public site)
- Changes reflect on public site instantly (after refresh)

### Gallery Page
- Images grouped by location
- Add new images by URL
- Set cover images for each location
- Reorder and manage visibility

---

## Troubleshooting

**"Unauthorized" error:**
- Check that `ADMIN_KEY` matches in both `.env.local` and Apps Script.

**"Cannot read properties of undefined":**
- Make sure all required columns exist in your Google Sheet (Leads, Packages, Gallery).

**"Lead not appearing":**
- Click the "Refresh" button on the Leads page.
- Check the Google Sheet "Leads" tab directly.

**Changes not appearing on public site:**
- The public site reads from Sheet on each request.
- Hard refresh the browser (Ctrl+Shift+R).

---

## System Architecture

- **Public Site**: `src/app/(public)` (Uses Header/Footer)
- **Admin Panel**: `src/app/admin` (Uses Admin Sidebar)
- **API**: Next.js API Routes (`src/app/api`) proxy requests to Google Apps Script.

## Deployment to Vercel (Production)

When deploying to Vercel, ensure you set the following **Environment Variables** in the **Production** environment (NOT just Preview/Development).

Go to **Project Settings > Environment Variables** and add:

1. **`ADMIN_API_URL`**
   - Value: Your Google Apps Script Web App URL (ending in `/exec`)
   - Description: Used by the server-side API routes to fetch/write data.

2. **`ADMIN_KEY`**
   - Value: `swipengoadmin2024` (or your custom secure key)
   - Description: Authenticates requests to the Apps Script.

3. **`NEXT_PUBLIC_LEADS_SCRIPT_URL`**
   - Value: Same as `ADMIN_API_URL` (usually)
   - Description: Used by the public website's "Get a Quote" form to submit leads directly (no-cors).

4. **`SHEET_ID`**
   - Value: The ID of your Google Sheet
   - Description: Used by the public site's data fetching logic (`src/lib/sheets.ts`).

5. **`ADMIN_PASSWORD`**
   - Value: Your chosen dashboard password
   - Description: Secures the admin login page.

**Note:** If these are missing in Production, the Admin Dashboard will show "No packages/leads" and the Settings page diagnostics will show "Not Configured".

---

## Verifying Apps Script Deployment

After deploying your Apps Script, verify it's working:

### Method 1: Browser Test
1. Open your Web App URL in a browser:
   ```
   https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec?action=testConnection&key=swipengoadmin2024
   ```
2. You should see JSON response like:
   ```json
   {"ok":true,"data":{"connected":true,"sheetName":"...","tabs":[...]}}
   ```

### Method 2: Debug Endpoint (Admin-Only)
1. Visit: `https://your-domain.com/api/debug/lead-test?key=YOUR_ADMIN_KEY`
2. This creates a test lead and shows the full response from Apps Script.
3. Check your Leads sheet for `[TEST] Debug Lead`.

### Method 3: Admin Settings Page
1. Go to `/admin/settings`
2. Click "Test Connection"
3. Should show green checkmark with sheet name and tabs.

---

## Lead Capture End-to-End Checklist

Use this checklist to verify lead capture is working in production:

### Prerequisites
- [ ] Apps Script deployed with latest `scripts/admin-api.gs.js`
- [ ] `ADMIN_API_URL` set in Vercel Production environment
- [ ] `NEXT_PUBLIC_LEADS_SCRIPT_URL` set in Vercel Production environment (same URL)
- [ ] Vercel deployment completed after setting env vars

### Testing
1. [ ] Visit `/api/debug/lead-test?key=YOUR_ADMIN_KEY` - should return `success: true`
2. [ ] Check Google Sheet "Leads" tab for `[TEST] Debug Lead` row
3. [ ] Submit a real quote from the public website
4. [ ] Verify WhatsApp opens with pre-filled message
5. [ ] Wait 30 seconds, then refresh Admin Leads page
6. [ ] New lead should appear in the list

### Troubleshooting Lead Capture

**Lead not appearing in sheet:**
1. Check browser console for errors (F12 → Console)
2. Verify `ADMIN_API_URL` is set in Vercel (not just locally)
3. Re-deploy Apps Script if recently updated
4. Check Apps Script executions log: Extensions → Apps Script → Executions

**"Server configuration error" on submit:**
- `ADMIN_API_URL` is not set in Vercel Production environment

**Form submits but sheet empty:**
- Apps Script may be using wrong spreadsheet
- Check that script is bound to the correct Google Sheet
- Verify the "Leads" tab exists with correct headers:
  `Timestamp, Name, Phone, Destination, Travel_Month, Travelers, Budget, Notes, Source, Status`
