# Google Sheets CMS Setup

Follow these steps to connect your website to Google Sheets for easy content management.

## 1. Create the Google Sheet
1.  Go to [Google Sheets](https://sheets.google.com).
2.  Create a **New Spreadsheet**.
3.  Name it `Swipe N Go Content` (or similar).

## 2. Setup "packages" Tab
1.  Rename the first tab (at the bottom) to `packages`.
2.  Open the file `src/data/packages.csv` in your project (or text editor).
3.  Copy **all the content** (including the header row).
4.  Paste it into cell **A1** of the `packages` tab.
    -   *Tip: If it pastes into one column, use Data -> Split text to columns.*
    -   *Better:* Import the CSV directly via `File -> Import -> Upload`.
5.  Ensure column headers match exactly: `slug`, `title`, `price`, `duration`, `location`, `description`, `includes`, `image_url`, `whatsapp_text`, `active`, `order`.

## 3. Setup "gallery" Tab
1.  Click the **+** icon at the bottom to add a new sheet.
2.  Rename it `gallery`.
3.  Open `src/data/gallery.csv`.
4.  Copy/Paste or Import the content.
5.  Ensure headers match: `image_url`, `caption`, `location`, `is_cover`, `active`, `order`.

## 4. Enable Access
1.  Click the **Share** button (top right).
2.  Under "General access", change "Restricted" to **"Anyone with the link"**.
3.  Set the role to **"Viewer"**.
4.  Click **Done**.

## 5. Get Sheet ID
1.  Look at the URL of your spreadsheet. It looks like this:
    `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0`
2.  Copy the long ID string between `/d/` and `/edit`.
    -   In this example: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 6. Connect to Website
1.  Open your project code.
2.  Create a file named `.env.local` to the root folder (if it doesn't exist).
3.  Add the following line, replacing `YOUR_ID` with the ID you copied:

```env
SHEET_ID=YOUR_COPIED_ID_HERE
```

4.  Restart your development server (`npm run dev`) or redeploy to Vercel.

## 7. Verify
 Refresh your website. The content is now pulling from Google Sheets!
 - Try changing a Title in the sheet, wait 1 minute (data is cached), and refresh.

## Troubleshooting
- **Images don't load?** Ensure `image_url` is a direct link (like standard Unsplash or hosted image).
- **Updates not showing?** The site caches data for 60 seconds (ISR). Wait briefly and refresh.
- **Empty sections?** Check column names for typos. They must be lowercase.
