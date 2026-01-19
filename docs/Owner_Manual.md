# ✈️ Swipe N Go Website - Owner's Manual

This guide explains how to update your website content using Google Sheets.

## 🔗 Access the Content
Open your specific Google Sheet (Swipe N Go Content). This is your control center.

---

## 📦 Managing Packages (Trips)
Navigate to the **`packages`** tab at the bottom of the screen.

### key Columns Explained
1.  **`slug` (Important!)**: This creates the unique link for the trip.
    *   ✅ Correct: `bali-honeymoon-special`
    *   ❌ Incorrect: `Bali Honeymoon Special` (No spaces or capitals!)
2.  **`includes`**: List the package features separated by a vertical bar `|`.
    *   Example: `Flights included|5 Star Hotel|Breakfast`
3.  **`image_url`**: The main photo for the package. Use a direct link or Google Drive link.
4.  **`active`**:
    *   Type `TRUE` to show the package on the website.
    *   Type `FALSE` to hide it (useful for drafts or sold-out trips).
5.  **`order`**: Use numbers (`1`, `2`, `3`) to change the order they appear on the site.

---

## 🖼️ Managing Gallery
Navigate to the **`gallery`** tab.

1.  **`location`**: Photos with the exact same location name (e.g., "Maldives") will be grouped together into one album.
2.  **`is_cover`**:
    *   Set **one** photo per location to `TRUE`. This photo will be the "Cover Card" on the main gallery page.
    *   Set all others to `FALSE`.
3.  **`image_url`**: Paste your photo links here.

---

## 📷 How to Add Photos (Google Drive)
You can use photos directly from your Google Drive:

1.  **Upload** your photo to Google Drive.
2.  Right-click the file and select **Share** -> **Share**.
3.  Under "General Access", change "Restricted" to **"Anyone with the link"**.
4.  Click **Copy Link**.
5.  **Paste** this link directly into the `image_url` column in your sheet.
    *   *The website will automatically convert it for you.*

---

## ⚡ Seeing Your Changes
1.  Make your edits in the Google Sheet.
2.  Go to your website (`swipengoholidays.com`).
3.  **Refresh the page**. Your changes should appear immediately!
