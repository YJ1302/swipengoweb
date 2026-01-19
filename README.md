# Swipe N Go Vacations - Travel Agency Website

A premium, fully editable travel agency website built with Next.js, TypeScript, and Tailwind CSS. Content is managed via Google Sheets for easy updates without touching code.

## Features

- ✨ **Modern Design**: Premium travel agency aesthetics with dark theme
- 📱 **Mobile-First**: Fully responsive on all devices
- 📊 **Google Sheets CMS**: Edit content directly in Google Sheets
- ⚡ **Fast Performance**: ISR with 60-second revalidation
- 🔍 **SEO Optimized**: Meta tags, OpenGraph, clean URLs
- 💬 **WhatsApp Integration**: Direct booking via WhatsApp

## Quick Start

### 1. Install Dependencies

```bash
cd swipengoweb
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
SHEET_ID=your_google_sheet_id
NEXT_PUBLIC_WHATSAPP_NUMBER=1234567890
NEXT_PUBLIC_BUSINESS_NAME=Swipe N Go Vacations
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/swipe_n_go_vacations
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Google Sheets Setup

### Step 1: Create the Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Rename it to "Swipe N Go Vacations CMS"

### Step 2: Create the `packages` Tab

Create a tab named `packages` with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| `slug` | URL-friendly identifier | `cancun-paradise` |
| `title` | Package name | `Cancun Paradise Escape` |
| `price` | Display price | `$1,299` |
| `duration` | Trip duration | `5 Days / 4 Nights` |
| `location` | Destination | `Cancun, Mexico` |
| `description` | Full description (supports line breaks) | `Experience the...` |
| `includes` | Pipe-separated list | `Resort\|Transfers\|Meals` |
| `image_url` | Full image URL | `https://...` |
| `whatsapp_text` | Pre-filled message | `Hi! I'm interested in...` |
| `active` | Show on site | `TRUE` or `FALSE` |
| `order` | Sort order | `1`, `2`, `3`... |

### Step 3: Create the `gallery` Tab

Create a tab named `gallery` with these columns:

| Column | Description | Example |
|--------|-------------|---------|
| `image_url` | Full image URL | `https://...` |
| `caption` | Image caption (optional) | `Beach sunset` |
| `active` | Show on site | `TRUE` or `FALSE` |
| `order` | Sort order | `1`, `2`, `3`... |

### Step 4: Publish the Sheet

1. Go to **File → Share → Publish to web**
2. Select **Entire Document** and **CSV**
3. Click **Publish**
4. Copy the Sheet ID from your URL:
   ```
   https://docs.google.com/spreadsheets/d/SHEET_ID_HERE/edit
   ```

---

## Vercel Deployment

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/swipengoweb.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **Add New → Project**
3. Import your GitHub repository
4. Add Environment Variables:
   - `SHEET_ID`: Your Google Sheet ID
   - `NEXT_PUBLIC_WHATSAPP_NUMBER`: WhatsApp number
   - `NEXT_PUBLIC_BUSINESS_NAME`: Business name
   - `NEXT_PUBLIC_INSTAGRAM_URL`: Instagram URL
5. Click **Deploy**

---

## GoDaddy Domain Setup

### Step 1: Get Vercel DNS Records

After deploying, go to **Vercel → Project Settings → Domains**

Add your domain (e.g., `swipeandgovacations.com`)

Vercel will show you the required DNS records.

### Step 2: Configure GoDaddy DNS

1. Log in to [GoDaddy](https://godaddy.com)
2. Go to **My Products → DNS**
3. Add/Edit these records:

#### For apex domain (swipeandgovacations.com):

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | `76.76.21.21` | 600 |

#### For www subdomain:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | `cname.vercel-dns.com` | 600 |

### Step 3: Verify in Vercel

1. Return to Vercel Domain settings
2. Click **Refresh** to verify DNS propagation
3. Wait for SSL certificate (automatic)

**Note**: DNS propagation can take up to 48 hours, but usually completes within 1-2 hours.

---

## Updating Content

### To Add/Edit Packages:
1. Open your Google Sheet
2. Edit rows in the `packages` tab
3. Changes appear on the site within 60 seconds

### To Add/Edit Gallery:
1. Open your Google Sheet
2. Edit rows in the `gallery` tab
3. Changes appear on the site within 60 seconds

### Tips:
- Use `active = FALSE` to hide items without deleting
- Use `order` numbers to control display order
- For `includes`, separate items with `|` (pipe character)
- Use full URLs for images (e.g., from Unsplash, Imgur)

---

## Project Structure

```
swipengoweb/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with Header/Footer
│   │   ├── page.tsx            # Home page
│   │   ├── packages/           # Packages pages
│   │   │   ├── page.tsx        # Packages grid
│   │   │   └── [slug]/page.tsx # Package details
│   │   ├── gallery/page.tsx    # Gallery page
│   │   └── contact/page.tsx    # Contact page
│   ├── components/             # React components
│   │   ├── layout/             # Header, Footer
│   │   ├── home/               # Hero, Features, etc.
│   │   ├── packages/           # PackageCard, PackageGrid
│   │   ├── gallery/            # GalleryGrid
│   │   └── ui/                 # Button, WhatsAppButton
│   ├── lib/                    # Utilities
│   │   ├── sheets.ts           # Google Sheets fetching
│   │   └── utils.ts            # Helper functions
│   └── types/                  # TypeScript types
├── .env.example                # Environment template
└── package.json
```

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **CMS**: Google Sheets (via CSV)
- **Hosting**: Vercel
- **CSV Parsing**: PapaParse

---

## Support

Need help? Contact the developer or check the [Next.js documentation](https://nextjs.org/docs).
