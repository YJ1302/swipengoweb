// ============================================
// SWIPE N GO ADMIN API
// Version: 2.0 (Strict JSON, Robust Parsing)
// Deploy as Web App with "Execute as: Me" and "Access: Anyone"
// ============================================

// IMPORTANT: Change this to match your .env.local ADMIN_KEY
// In production, this should be a strong secret.
const ADMIN_KEY = 'swipengoadmin2024';

function doGet(e) {
    return handleRequest(e, 'GET');
}

function doPost(e) {
    return handleRequest(e, 'POST');
}

function handleRequest(e, method) {
    var action = e.parameter.action || '';
    var key = e.parameter.key || '';

    // Check header for key if not in params (for cleaner URLs)
    // Note: Apps Script might not expose all headers in 'e' depending on context, 
    // but we can check if passed via query param as fallback.
    // e.parameter is case-sensitive.

    // Default action for POST (e.g. from website form)
    if (method === 'POST' && !action && e.postData && e.postData.contents) {
        action = 'addLead';
    }

    // 1. Auth Check
    // Public endpoint: addLead (for website form) - no key required
    if (action === 'addLead') {
        return addLead(e);
    }

    // Admin endpoints - require key
    /*
      The user requirement says: 
      "Add a simple auth check for admin endpoints: require key query param OR x-admin-key header value matching ADMIN_KEY."
      Google Apps Script web apps don't always reliably pass custom headers in `e` to `doGet`/`doPost` depending on the runtime/deployment.
      Query param is the most reliable method for GAS. We'll support query param 'key'.
    */
    if (key !== ADMIN_KEY) {
        return createResponse({ error: 'Unauthorized: Invalid or missing API key' }, false, 401);
    }

    try {
        switch (action) {
            // Leads (READ/WRITE)
            case 'getLeads': return getLeads();
            case 'updateLead': return updateLead(e);

            // Packages (READ/WRITE)
            case 'getPackages': return getPackages();
            case 'addPackage': return addPackage(e);
            case 'updatePackage': return updatePackage(e);
            case 'deletePackage': return deletePackage(e);

            // Gallery (READ/WRITE)
            case 'getGallery': return getGallery();
            case 'addGalleryItem': return addGalleryItem(e);
            case 'updateGalleryItem': return updateGalleryItem(e);
            case 'deleteGalleryItem': return deleteGalleryItem(e);

            // Diagnostic
            case 'testConnection': return testConnection();

            default:
                return createResponse({ error: 'Unknown action: ' + action }, false, 400);
        }
    } catch (err) {
        return createResponse({ error: err.toString(), stack: err.stack }, false, 500);
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function createResponse(payload, ok, status) {
    // Standard response shape: { ok: boolean, data?: any, error?: string }
    var response = {
        ok: ok,
        status: status || 200
    };

    if (ok) {
        response.data = payload;
    } else {
        response.error = payload.error || 'Unknown error';
        if (payload.stack) response.debug = payload.stack;
    }

    return ContentService
        .createTextOutput(JSON.stringify(response))
        .setMimeType(ContentService.MimeType.JSON);
}

function getSheetData(sheetName) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) throw new Error('Sheet not found: ' + sheetName);

    var range = sheet.getDataRange();
    var values = range.getValues();

    if (values.length < 2) return []; // Only headers or empty

    var headers = values[0].map(function (h) {
        return h.toString().trim().toLowerCase().replace(/\s+/g, '_');
    });

    var result = [];

    for (var i = 1; i < values.length; i++) {
        var row = values[i];

        // Skip completely empty rows
        var isEmpty = row.every(function (cell) { return cell === '' || cell === null; });
        if (isEmpty) continue;

        var obj = { _rowIndex: i + 1 };
        for (var j = 0; j < headers.length; j++) {
            var val = row[j];
            // Basic trimming if string
            if (typeof val === 'string') val = val.trim();
            obj[headers[j]] = val;
        }
        result.push(obj);
    }

    return result;
}

function getOrCreateSheet(name, headers) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
        sheet = ss.insertSheet(name);
        sheet.appendRow(headers);
    }
    return sheet;
}

// Robust number parsing
function parseNumber(val) {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    // Handle commas for decimals if present (e.g. European style)
    var normalized = val.toString().replace(',', '.');
    var num = parseFloat(normalized);
    return isNaN(num) ? 0 : num;
}

function parseBoolean(val) {
    if (val === true || val === 'TRUE' || val === 'true' || val === 1 || val === '1') return true;
    return false;
}

// ============================================
// LEADS
// ============================================

function getLeads() {
    var rawLeads = getSheetData('Leads');
    // Sort logic handled in frontend? Or here? 
    // Previous script did reverse() for newest first.
    return createResponse(rawLeads.reverse(), true);
}

function addLead(e) {
    var sheet = getOrCreateSheet('Leads', ['Timestamp', 'Name', 'Phone', 'Destination', 'Travel_Month', 'Travelers', 'Budget', 'Notes', 'Source', 'Status']);

    // Support JSON body or Form encoded
    var data;
    if (e.postData && e.postData.contents) {
        try {
            data = JSON.parse(e.postData.contents);
        } catch (err) {
            // fallback if not JSON
            data = e.parameter;
        }
    } else {
        data = e.parameter;
    }

    sheet.appendRow([
        new Date(),
        (data.name || '').toString().trim(),
        (data.phone || '').toString().trim(),
        (data.destination || '').toString().trim(),
        (data.travel_month || '').toString().trim(),
        (data.num_people || '').toString(),
        (data.budget_range || '').toString().trim(),
        (data.notes || '').toString().trim(),
        (data.source || '').toString().trim(),
        'New'
    ]);

    return createResponse({ message: 'Lead added successfully' }, true);
}

function updateLead(e) {
    var data = JSON.parse(e.postData.contents);
    if (!data._rowIndex) throw new Error('Row index required');

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    // Status is column J (10)
    if (data.status) {
        sheet.getRange(data._rowIndex, 10).setValue(data.status);
    }

    return createResponse({ message: 'Lead updated' }, true);
}

// ============================================
// PACKAGES
// ============================================

function getPackages() {
    var raw = getSheetData('Packages');
    var processed = raw.map(function (item) {
        // Enforce types
        item.active = parseBoolean(item.active);
        item.order = parseNumber(item.order);
        item.lat = parseNumber(item.lat);
        item.lng = parseNumber(item.lng);
        return item;
    });
    return createResponse(processed, true);
}

function addPackage(e) {
    var headers = ['slug', 'title', 'price', 'duration', 'location', 'description',
        'includes', 'excludes', 'image_url', 'whatsapp_text', 'active',
        'order', 'lat', 'lng', 'country', 'city', 'category', 'best_time',
        'highlights', 'itinerary', 'what_to_carry'];

    var sheet = getOrCreateSheet('Packages', headers);
    var data = JSON.parse(e.postData.contents);

    var slug = (data.slug || '').toString().trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug) throw new Error('Slug is required');

    // Check dupe slug
    var existing = sheet.getDataRange().getValues();
    for (var i = 1; i < existing.length; i++) {
        // Slug is col 1 (index 0)
        if (existing[i][0].toString().toLowerCase() === slug) {
            throw new Error('Slug already exists');
        }
    }

    sheet.appendRow([
        slug,
        (data.title || '').toString().trim(),
        (data.price || '').toString().trim(),
        (data.duration || '').toString().trim(),
        (data.location || '').toString().trim(),
        (data.description || '').toString().trim(),
        (data.includes || '').toString().trim(),
        (data.excludes || '').toString().trim(),
        (data.image_url || '').toString().trim(),
        (data.whatsapp_text || '').toString().trim(),
        parseBoolean(data.active) ? 'TRUE' : 'FALSE',
        parseNumber(data.order),
        parseNumber(data.lat),
        parseNumber(data.lng),
        (data.country || '').toString().trim(),
        (data.city || '').toString().trim(),
        (data.category || '').toString().trim(),
        (data.best_time || '').toString().trim(),
        (data.highlights || '').toString().trim(),
        (data.itinerary || '').toString().trim(),
        (data.what_to_carry || '').toString().trim()
    ]);

    return createResponse({ message: 'Package added', slug: slug }, true);
}

function updatePackage(e) {
    var data = JSON.parse(e.postData.contents);
    if (!data._rowIndex) throw new Error('Row index required');

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Packages');
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    for (var col = 0; col < headers.length; col++) {
        var key = headers[col].toString().toLowerCase().replace(/\s+/g, '_');
        if (data.hasOwnProperty(key) && key !== '_rowindex') {
            var val = data[key];
            if (key === 'active') val = parseBoolean(val) ? 'TRUE' : 'FALSE';
            else if (key === 'lat' || key === 'lng') val = parseNumber(val);
            else if (key === 'order') val = parseNumber(val);

            sheet.getRange(data._rowIndex, col + 1).setValue(val);
        }
    }

    return createResponse({ message: 'Package updated' }, true);
}

function deletePackage(e) {
    var data = JSON.parse(e.postData.contents);
    if (!data._rowIndex) throw new Error('Row index required');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Packages');
    sheet.deleteRow(data._rowIndex);
    return createResponse({ message: 'Package deleted' }, true);
}

// ============================================
// GALLERY
// ============================================

function getGallery() {
    var raw = getSheetData('Gallery');
    var processed = raw.map(function (item) {
        item.active = parseBoolean(item.active);
        item.is_cover = parseBoolean(item.is_cover);
        item.order = parseNumber(item.order);
        return item;
    });
    return createResponse(processed, true);
}

function addGalleryItem(e) {
    // headers: image_url, caption, location, is_cover, active, order
    var sheet = getOrCreateSheet('Gallery', ['image_url', 'caption', 'location', 'is_cover', 'active', 'order']);
    var data = JSON.parse(e.postData.contents);

    if (!data.image_url) throw new Error('Image URL required');

    if (parseBoolean(data.is_cover)) {
        unsetCoversForLocation(sheet, data.location);
    }

    sheet.appendRow([
        data.image_url.toString().trim(),
        (data.caption || '').toString().trim(),
        (data.location || 'Other').toString().trim(),
        parseBoolean(data.is_cover) ? 'TRUE' : 'FALSE',
        parseBoolean(data.active) ? 'TRUE' : 'FALSE',
        parseNumber(data.order)
    ]);

    return createResponse({ message: 'Gallery item added' }, true);
}

function updateGalleryItem(e) {
    var data = JSON.parse(e.postData.contents);
    if (!data._rowIndex) throw new Error('Row index required');
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery');

    if (parseBoolean(data.is_cover)) {
        var location = data.location || sheet.getRange(data._rowIndex, 3).getValue();
        unsetCoversForLocation(sheet, location);
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    for (var col = 0; col < headers.length; col++) {
        var key = headers[col].toString().toLowerCase().replace(/\s+/g, '_');
        if (data.hasOwnProperty(key) && key !== '_rowindex') {
            var val = data[key];
            if (key === 'active' || key === 'is_cover') val = parseBoolean(val) ? 'TRUE' : 'FALSE';
            else if (key === 'order') val = parseNumber(val);

            sheet.getRange(data._rowIndex, col + 1).setValue(val);
        }
    }
    return createResponse({ message: 'Gallery item updated' }, true);
}

function deleteGalleryItem(e) {
    var data = JSON.parse(e.postData.contents);
    if (!data._rowIndex) throw new Error('Row index required');
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery').deleteRow(data._rowIndex);
    return createResponse({ message: 'Gallery item deleted' }, true);
}

function unsetCoversForLocation(sheet, location) {
    var range = sheet.getDataRange();
    var values = range.getValues();
    var locCol = -1, coverCol = -1;

    // Find cols
    values[0].forEach(function (h, i) {
        var ht = h.toString().toLowerCase();
        if (ht === 'location') locCol = i;
        if (ht === 'is_cover') coverCol = i;
    });

    if (locCol === -1 || coverCol === -1) return;

    for (var i = 1; i < values.length; i++) {
        if (values[i][locCol] === location && values[i][coverCol] === 'TRUE') {
            sheet.getRange(i + 1, coverCol + 1).setValue('FALSE');
        }
    }
}

// ============================================
// SYSTEM
// ============================================

function testConnection() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var tabNames = [];
    var counts = {};

    for (var i = 0; i < sheets.length; i++) {
        var name = sheets[i].getName();
        tabNames.push(name);
        counts[name] = sheets[i].getLastRow() - 1; // approx count minus header
    }

    return createResponse({
        connected: true,
        sheetName: ss.getName(),
        tabs: tabNames,
        counts: counts,
        timestamp: new Date().toISOString()
    }, true);
}
