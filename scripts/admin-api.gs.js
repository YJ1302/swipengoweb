// ============================================
// SWIPE N GO ADMIN API
// Version: 1.0
// Deploy as Web App with "Execute as: Me" and "Access: Anyone"
// ============================================

// IMPORTANT: Change this to match your .env.local ADMIN_KEY
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

    // For POST requests without action parameter, default to addLead (for website form)
    if (method === 'POST' && !action && e.postData && e.postData.contents) {
        action = 'addLead';
    }

    // Public endpoint: addLead (for website form)
    if (action === 'addLead') {
        return addLead(e);
    }

    // All other endpoints require admin key
    if (key !== ADMIN_KEY) {
        return jsonResponse({ error: 'Unauthorized' }, 401);
    }

    try {
        switch (action) {
            // Leads
            case 'getLeads': return getLeads(e);
            case 'updateLead': return updateLead(e);

            // Packages
            case 'getPackages': return getPackages(e);
            case 'addPackage': return addPackage(e);
            case 'updatePackage': return updatePackage(e);
            case 'deletePackage': return deletePackage(e);

            // Gallery
            case 'getGallery': return getGallery(e);
            case 'addGalleryItem': return addGalleryItem(e);
            case 'updateGalleryItem': return updateGalleryItem(e);
            case 'deleteGalleryItem': return deleteGalleryItem(e);

            // Settings
            case 'testConnection': return testConnection();

            default:
                return jsonResponse({ error: 'Unknown action: ' + action }, 400);
        }
    } catch (err) {
        return jsonResponse({ error: err.message }, 500);
    }
}

function jsonResponse(data, status) {
    status = status || 200;
    return ContentService
        .createTextOutput(JSON.stringify({ ...data, status: status }))
        .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// LEADS FUNCTIONS
// ============================================

function addLead(e) {
    var sheet = getOrCreateSheet('Leads', ['Timestamp', 'Name', 'Phone', 'Destination', 'Travel_Month', 'Travelers', 'Budget', 'Notes', 'Source', 'Status']);
    var data = JSON.parse(e.postData.contents);

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

    return jsonResponse({ success: true, message: 'Lead added' });
}

function getLeads(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    if (!sheet) return jsonResponse({ leads: [] });

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var leads = [];

    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var obj = { _rowIndex: i + 1 };
        for (var j = 0; j < headers.length; j++) {
            var key = headers[j].toString().toLowerCase().replace(/\s+/g, '_');
            obj[key] = row[j];
        }
        leads.push(obj);
    }

    leads.reverse(); // Newest first
    return jsonResponse({ leads: leads });
}

function updateLead(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
    var data = JSON.parse(e.postData.contents);
    var rowIndex = data._rowIndex;

    if (!rowIndex) return jsonResponse({ error: 'Row index required' }, 400);

    // Update status column (column J = 10)
    if (data.status) {
        sheet.getRange(rowIndex, 10).setValue(data.status);
    }

    return jsonResponse({ success: true });
}

// ============================================
// PACKAGES FUNCTIONS
// ============================================

function getPackages(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Packages');
    if (!sheet) return jsonResponse({ packages: [] });

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var packages = [];

    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var obj = { _rowIndex: i + 1 };
        for (var j = 0; j < headers.length; j++) {
            var key = headers[j].toString().toLowerCase().replace(/\s+/g, '_');
            obj[key] = row[j];
        }
        packages.push(obj);
    }

    return jsonResponse({ packages: packages });
}

function addPackage(e) {
    var headers = ['slug', 'title', 'price', 'duration', 'location', 'description', 'includes', 'excludes', 'image_url', 'whatsapp_text', 'active', 'order', 'lat', 'lng', 'country', 'city', 'category', 'best_time', 'highlights', 'itinerary', 'what_to_carry'];
    var sheet = getOrCreateSheet('Packages', headers);
    var data = JSON.parse(e.postData.contents);

    // Validate slug
    var slug = (data.slug || '').toString().trim().toLowerCase().replace(/\s+/g, '-');
    if (!slug) return jsonResponse({ error: 'Slug is required' }, 400);

    // Check slug uniqueness
    var existing = sheet.getDataRange().getValues();
    for (var i = 1; i < existing.length; i++) {
        if (existing[i][0].toString().toLowerCase() === slug) {
            return jsonResponse({ error: 'Slug already exists' }, 400);
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
        data.active === true || data.active === 'TRUE' ? 'TRUE' : 'FALSE',
        parseInt(data.order) || 0,
        parseCoord(data.lat),
        parseCoord(data.lng),
        (data.country || '').toString().trim(),
        (data.city || '').toString().trim(),
        (data.category || '').toString().trim(),
        (data.best_time || '').toString().trim(),
        (data.highlights || '').toString().trim(),
        (data.itinerary || '').toString().trim(),
        (data.what_to_carry || '').toString().trim()
    ]);

    return jsonResponse({ success: true, slug: slug });
}

function updatePackage(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Packages');
    var data = JSON.parse(e.postData.contents);
    var rowIndex = data._rowIndex;

    if (!rowIndex) return jsonResponse({ error: 'Row index required' }, 400);

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    for (var colIndex = 0; colIndex < headers.length; colIndex++) {
        var key = headers[colIndex].toString().toLowerCase().replace(/\s+/g, '_');
        if (data.hasOwnProperty(key) && key !== '_rowindex') {
            var value = data[key];
            if (key === 'active') value = value === true || value === 'TRUE' ? 'TRUE' : 'FALSE';
            if (key === 'lat' || key === 'lng') value = parseCoord(value);
            if (key === 'order') value = parseInt(value) || 0;
            sheet.getRange(rowIndex, colIndex + 1).setValue(value);
        }
    }

    return jsonResponse({ success: true });
}

function deletePackage(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Packages');
    var data = JSON.parse(e.postData.contents);
    var rowIndex = data._rowIndex;

    if (!rowIndex) return jsonResponse({ error: 'Row index required' }, 400);

    sheet.deleteRow(rowIndex);
    return jsonResponse({ success: true });
}

// ============================================
// GALLERY FUNCTIONS
// ============================================

function getGallery(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery');
    if (!sheet) return jsonResponse({ gallery: [] });

    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var gallery = [];

    for (var i = 1; i < data.length; i++) {
        var row = data[i];
        var obj = { _rowIndex: i + 1 };
        for (var j = 0; j < headers.length; j++) {
            var key = headers[j].toString().toLowerCase().replace(/\s+/g, '_');
            obj[key] = row[j];
        }
        gallery.push(obj);
    }

    return jsonResponse({ gallery: gallery });
}

function addGalleryItem(e) {
    var sheet = getOrCreateSheet('Gallery', ['image_url', 'caption', 'location', 'is_cover', 'active', 'order']);
    var data = JSON.parse(e.postData.contents);

    if (!data.image_url) return jsonResponse({ error: 'Image URL is required' }, 400);

    // If setting as cover, unset existing covers for same location
    if (data.is_cover === true || data.is_cover === 'TRUE') {
        unsetCoversForLocation(sheet, data.location);
    }

    sheet.appendRow([
        (data.image_url || '').toString().trim(),
        (data.caption || '').toString().trim(),
        (data.location || 'Other').toString().trim(),
        data.is_cover === true || data.is_cover === 'TRUE' ? 'TRUE' : 'FALSE',
        data.active === true || data.active === 'TRUE' ? 'TRUE' : 'FALSE',
        parseInt(data.order) || 0
    ]);

    return jsonResponse({ success: true });
}

function updateGalleryItem(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery');
    var data = JSON.parse(e.postData.contents);
    var rowIndex = data._rowIndex;

    if (!rowIndex) return jsonResponse({ error: 'Row index required' }, 400);

    // If setting as cover, unset existing covers for same location
    if (data.is_cover === true || data.is_cover === 'TRUE') {
        var location = data.location || sheet.getRange(rowIndex, 3).getValue();
        unsetCoversForLocation(sheet, location);
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    for (var colIndex = 0; colIndex < headers.length; colIndex++) {
        var key = headers[colIndex].toString().toLowerCase().replace(/\s+/g, '_');
        if (data.hasOwnProperty(key) && key !== '_rowindex') {
            var value = data[key];
            if (key === 'is_cover' || key === 'active') value = value === true || value === 'TRUE' ? 'TRUE' : 'FALSE';
            if (key === 'order') value = parseInt(value) || 0;
            sheet.getRange(rowIndex, colIndex + 1).setValue(value);
        }
    }

    return jsonResponse({ success: true });
}

function deleteGalleryItem(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Gallery');
    var data = JSON.parse(e.postData.contents);
    var rowIndex = data._rowIndex;

    if (!rowIndex) return jsonResponse({ error: 'Row index required' }, 400);

    sheet.deleteRow(rowIndex);
    return jsonResponse({ success: true });
}

function unsetCoversForLocation(sheet, location) {
    var data = sheet.getDataRange().getValues();
    var headers = data[0];
    var locCol = -1;
    var coverCol = -1;

    for (var i = 0; i < headers.length; i++) {
        if (headers[i].toString().toLowerCase() === 'location') locCol = i;
        if (headers[i].toString().toLowerCase() === 'is_cover') coverCol = i;
    }

    if (locCol === -1 || coverCol === -1) return;

    for (var i = 1; i < data.length; i++) {
        if (data[i][locCol] === location && data[i][coverCol] === 'TRUE') {
            sheet.getRange(i + 1, coverCol + 1).setValue('FALSE');
        }
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function getOrCreateSheet(name, headers) {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
        sheet = ss.insertSheet(name);
        sheet.appendRow(headers);
    }
    return sheet;
}

function parseCoord(value) {
    if (!value) return '';
    var str = value.toString().trim().replace(',', '.');
    var num = parseFloat(str);
    return isNaN(num) ? '' : num;
}

function testConnection() {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheets = ss.getSheets();
    var tabNames = [];
    for (var i = 0; i < sheets.length; i++) {
        tabNames.push(sheets[i].getName());
    }
    return jsonResponse({
        success: true,
        sheetName: ss.getName(),
        tabs: tabNames,
        timestamp: new Date().toISOString()
    });
}
