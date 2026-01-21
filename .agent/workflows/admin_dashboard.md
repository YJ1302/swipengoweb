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
