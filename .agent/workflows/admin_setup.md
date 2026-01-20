---
description: Setup Google Sheets Admin Workflow (Looker Studio + AppSheet)
---

# Google Sheets Admin Workflow Setup

Follow these steps to transform your Google Sheet into a powerful backend for your travel business.

## Phase 1: Prepare the Google Sheet

1.  Open your existing Google Sheet (`swipengoweb`).
2.  Ensure you have the following **3 Tabs** with the exact headers (row 1).

### Tab 1: `Leads`
Used for storing customer inquiries and Looker Studio reporting.
*   **A1**: `Timestamp`
*   **B1**: `Name`
*   **C1**: `Phone`
*   **D1**: `Destination`
*   **E1**: `Travel_Month`
*   **F1**: `Travelers`
*   **G1**: `Budget`
*   **H1**: `Notes`
*   **I1**: `Source` (e.g., "Quote Page", "Package Page")
*   **J1**: `Status` (Data Validation: `New`, `Contacted`, `Quote Sent`, `Converted`, `Lost`)

### Tab 2: `Packages`
Used for your website content and AppSheet management.
*   **A1**: `slug` (Unique ID, e.g., `goa-trip` - no spaces)
*   **B1**: `title`
*   **C1**: `location`
*   **D1**: `price` (e.g., `12000`)
*   **E1**: `duration` (e.g., `4 Days / 3 Nights`)
*   **F1**: `active` (TRUE/FALSE)
*   **G1**: `image_url`
*   **H1**: `category` (e.g., `Beach`, `Honeymoon`)
*   **I1**: `description`
*   **J1**: `includes` (Pipe separated: `Hotel|Meals`)
*   **K1**: `itinerary` (Format: `Day 1: Title - Details | Day 2: ...`)
*   **L1**: `lat` (Latitude)
*   **M1**: `lng` (Longitude)
*   **N1**: `order` (Number for sorting)
*   **O1**: `highlights` (Pipe separated)
*   **P1**: `excludes` (Pipe separated)
*   **Q1**: `what_to_carry` (Pipe separated)
*   **R1**: `best_time` (e.g., `Oct-Mar`)

### Tab 3: `Gallery`
Used for the website gallery.
*   **A1**: `image_url`
*   **B1**: `caption`
*   **C1**: `location` (Grouping category, e.g., `Maldives`)
*   **D1**: `is_cover` (TRUE/FALSE - show as folder cover)
*   **E1**: `active` (TRUE = visible)
*   **F1**: `order`

---

## Phase 2: Connect Leads to Website (Google Apps Script)

To let the website write to your sheet *securely* without exposing your password:

1.  In your Google Sheet, go to **Extensions > Apps Script**.
2.  Delete any code there and paste this:

```javascript
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Leads");
    // Parse the JSON body from the request
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.name,
      data.phone,
      data.destination,
      data.travel_month,
      data.num_people,
      data.budget_range,
      data.notes,
      data.source || 'Website',
      'New'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": e }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

3.  Click the **Deploy** button (blue button top right) > **New deployment**.
4.  **Select type**: `Web app`.
5.  **Description**: `Lead Collector`.
6.  **Execute as**: `Me` (your email).
7.  **Who has access**: `Anyone` (Important! This allows the website to send data).
8.  Click **Deploy**.
9.  **Copy the Web App URL**.
10. Send this URL to me (or update your `.env.local` file with `NEXT_PUBLIC_LEADS_SCRIPT_URL=your_url_here`).

---

## Phase 3: Looker Studio (Leads Dashboard)

1.  Go to [lookerstudio.google.com](https://lookerstudio.google.com/).
2.  Click **Create > Report**.
3.  Select **Google Sheets** as the connector.
4.  Select your spreadsheet file and choose the **Leads** worksheet.
5.  Click **Add**.
6.  **Create your Charts**:
    *   **Total Leads**: Add a "Scorecard" chart. Metric: `Record Count`.
    *   **Leads Over Time**: Add a "Time series" chart. Dimension: `Timestamp`. Metric: `Record Count`.
    *   **Leads by Destination**: Add a "Bar" or "Pie" chart. Dimension: `Destination`. Metric: `Record Count`.
    *   **Leads by Status**: Add a "Donut" chart. Dimension: `Status`. Metric: `Record Count`.
    *   **Leads by Source**: Add a "Pie" chart. Dimension: `Source`. Metric: `Record Count`.

---

## Phase 4: AppSheet (Admin App)

1.  In your Google Sheet, go to **Extensions > AppSheet > Create an App**.
2.  AppSheet will automatically generate an app based on your data.
3.  **Configure "Leads" View**:
    *   Go to **Data > Columns > Leads**.
    *   Set `Phone` type to `Phone`.
    *   Set `Status` type to `Enum` (Values: `New`, `Contacted`, `Converted`, `Lost`).
    *   Go to **UX > Views > Leads**. Select "Deck" or "Table" view. Sort by `Timestamp` (Descending).
4.  **Configure "Packages" View**:
    *   Go to **Data > Columns > Packages**.
    *   Set `image_url` to `Url` (or `Image` if uploading directly).
    *   Set `active` type to `Yes/No`.
    *   Go to **UX > Views**. Create a new View "Manage Packages". View type: "Card".
5.  **Configure "Gallery" View**:
    *   Go to **Data > Columns > Gallery**.
    *   Set `image_url` to `Url`.
    *   Set `is_cover` and `active` to `Yes/No`.
    *   Go to **UX > Views**. Create/Edit "Gallery" View. View type: "Table" or "Deck".
6.  **Deploy**:
    *   Click the "Not Deployed" icon > "Move to Deployed State".
    *   Install the AppSheet app on your phone to manage your business on the go!
