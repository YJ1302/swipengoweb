import Papa from 'papaparse';
import { Package, GalleryItem, LocationGroup, ItineraryDay } from '@/types';
import { parseItinerary } from '@/utils/itinerary';

const SHEET_ID = process.env.SHEET_ID;

// Build Google Sheets CSV URL for a specific tab
function getSheetUrl(tabName: string): string {
    return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${tabName}`;
}

// Fetch and parse CSV data from Google Sheets
async function fetchSheetData<T>(tabName: string): Promise<T[]> {
    if (!SHEET_ID) {
        console.warn('SHEET_ID not configured, returning empty data');
        return [];
    }

    try {
        const url = getSheetUrl(tabName);
        const response = await fetch(url, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${tabName}: ${response.statusText}`);
        }

        const csvText = await response.text();

        return new Promise((resolve, reject) => {
            Papa.parse<T>(csvText, {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    // Normalize keys to lowercase and trim
                    const normalizedData = results.data.map((row: any) => {
                        const newRow: any = {};
                        Object.keys(row).forEach(key => {
                            newRow[key.trim().toLowerCase()] = row[key];
                        });
                        return newRow;
                    });
                    resolve(normalizedData as T[]);
                },
                error: (error: Error) => {
                    reject(error);
                },
            });
        });
    } catch (error) {
        console.error(`Error fetching ${tabName}:`, error);
        return [];
    }
}

// Raw package from sheet
interface RawPackage {
    slug?: string;
    title?: string;
    price?: string;
    duration?: string;
    location?: string;
    description?: string;
    includes?: string;
    excludes?: string;
    image_url?: string;
    whatsapp_text?: string;
    active?: string;
    order?: string;
    lat?: string;
    lng?: string;
    country?: string;
    city?: string;
    category?: string;
    best_time?: string;
    highlights?: string;
    itinerary?: string;
    what_to_carry?: string;
}

// Helper to convert various image links (Drive, etc.) to direct URLs
function getDirectImageUrl(url: string): string {
    if (!url) return '';
    const trimmedUrl = url.trim();

    if (trimmedUrl.includes('drive.google.com') || trimmedUrl.includes('docs.google.com')) {
        let id = '';
        const parts = trimmedUrl.split(/\/d\/|id=/);
        if (parts.length > 1) {
            const sub = parts[1].split(/[/?&]/)[0];
            if (sub && sub.length > 20) {
                id = sub;
            }
        }

        if (id) {
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
    }

    return trimmedUrl;
}

// Parse coordinate values (handles comma decimals like -12,0464)
function parseCoordinate(value: string | undefined): number {
    if (!value) return 0;
    const trimmed = value.trim();
    if (!trimmed) return 0;
    const normalized = trimmed.replace(',', '.');
    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
}

// Check truthy values (TRUE, true, 1, YES, SI, SÍ, etc.)
function isTruthy(value: string | undefined): boolean {
    if (!value) return false;
    const normalized = value.trim().toUpperCase();
    return ['TRUE', '1', 'YES', 'SI', 'SÍ', 'Y', 'S'].includes(normalized);
}

// Parse pipe-separated list
function parseList(value: string | undefined): string[] {
    if (!value) return [];
    return value.split('|').map(s => s.trim()).filter(s => s.length > 0);
}

// Parse itinerary moved to @/utils/itinerary

function transformPackage(raw: RawPackage): Package {
    return {
        slug: (raw.slug || '').trim(),
        title: (raw.title || '').trim(),
        price: (raw.price || '').trim(),
        duration: (raw.duration || '').trim(),
        location: (raw.location || '').trim(),
        description: (raw.description || '').trim(),
        includes: parseList(raw.includes),
        excludes: parseList(raw.excludes),
        image_url: getDirectImageUrl(raw.image_url || ''),
        whatsapp_text: (raw.whatsapp_text || '').trim(),
        active: isTruthy(raw.active),
        order: parseInt((raw.order || '0').trim(), 10) || 0,
        lat: parseCoordinate(raw.lat),
        lng: parseCoordinate(raw.lng),
        country: (raw.country || '').trim(),
        city: (raw.city || '').trim(),
        category: (raw.category || '').trim(),
        best_time: (raw.best_time || '').trim(),
        highlights: parseList(raw.highlights),
        itinerary: parseItinerary(raw.itinerary),
        what_to_carry: parseList(raw.what_to_carry),
    };
}

// Raw gallery item
interface RawGalleryItem {
    image_url?: string;
    caption?: string;
    location?: string;
    is_cover?: string;
    active?: string;
    order?: string;
    section?: string;
}

function transformGalleryItem(raw: RawGalleryItem): GalleryItem {
    return {
        image_url: getDirectImageUrl(raw.image_url || ''),
        caption: raw.caption || '',
        location: raw.location || 'Destinations',
        is_cover: isTruthy(raw.is_cover),
        active: isTruthy(raw.active),
        order: parseInt(raw.order || '0', 10),
    };
}

// Get all active packages, sorted by order
export async function getPackages(): Promise<Package[]> {
    const rawData = await fetchSheetData<RawPackage>('Packages');

    console.log(`[Packages Debug] Total rows from sheet: ${rawData.length}`);

    const packages = rawData
        .map(transformPackage)
        .filter(pkg => {
            if (!pkg.active) return false;
            // Strict valid coordinate check
            if (!pkg.lat || pkg.lat === 0 || isNaN(pkg.lat)) return false;
            if (!pkg.lng || pkg.lng === 0 || isNaN(pkg.lng)) return false;
            return true;
        })
        .sort((a, b) => a.order - b.order);

    if (process.env.NODE_ENV === 'development') {
        const total = rawData.length;
        const activeCount = rawData.filter(r => isTruthy(r.active)).length;
        const validCoordsCount = packages.length;

        console.log(`[Packages Debug] Fetch Summary:
        - Total Rows: ${total}
        - Active Rows: ${activeCount}
        - Renderable (Active + Valid Coords): ${validCoordsCount}`);

        if (total > 0 && validCoordsCount === 0) {
            console.warn('[Packages Debug] No packages renderable! Check active flag or lat/lng parsing.');
        }
    }

    return packages;
}

// Get all packages (including those without coords) for detail pages
export async function getAllPackages(): Promise<Package[]> {
    const rawData = await fetchSheetData<RawPackage>('Packages');

    return rawData
        .map(transformPackage)
        .filter(pkg => pkg.active && pkg.slug)
        .sort((a, b) => a.order - b.order);
}

// Get a single package by slug
export async function getPackageBySlug(slug: string): Promise<Package | null> {
    const packages = await getAllPackages();
    return packages.find(pkg => pkg.slug === slug) || null;
}

// Get all active gallery items, sorted by order
export async function getGallery(): Promise<GalleryItem[]> {
    const rawData = await fetchSheetData<RawGalleryItem>('Gallery');

    return rawData
        .filter(item => {
            const section = (item.section || '').toLowerCase();
            return section !== 'homepage';
        })
        .map(transformGalleryItem)
        .filter(item => item.active && item.image_url)
        .sort((a, b) => a.order - b.order);
}

export async function getGalleryLocations(): Promise<LocationGroup[]> {
    const items = await getGallery();
    const groups: Record<string, GalleryItem[]> = {};

    items.forEach(item => {
        const loc = item.location || 'Other';
        if (!groups[loc]) {
            groups[loc] = [];
        }
        groups[loc].push(item);
    });

    return Object.keys(groups).map(location => {
        const photos = groups[location];
        const coverImage = photos.find(p => p.is_cover) || photos[0];

        return {
            name: location,
            coverImage,
            photos
        };
    });
}
