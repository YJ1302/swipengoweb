import Papa from 'papaparse';
import { Package, GalleryItem, LocationGroup } from '@/types';

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
            cache: 'no-store' // Fetch fresh data on every request
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
                    resolve(results.data);
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

// Transform raw sheet data to Package type
interface RawPackage {
    slug?: string;
    title?: string;
    price?: string;
    duration?: string;
    location?: string;
    description?: string;
    includes?: string;
    image_url?: string;
    whatsapp_text?: string;
    active?: string;
    order?: string;
}

// Helper to convert various image links (Drive, etc.) to direct URLs
function getDirectImageUrl(url: string): string {
    if (!url) return '';
    const trimmedUrl = url.trim();

    // Google Drive typical sharing links
    // 1. https://drive.google.com/file/d/THE_ID/view...
    // 2. https://drive.google.com/open?id=THE_ID
    if (trimmedUrl.includes('drive.google.com') || trimmedUrl.includes('docs.google.com')) {
        let id = '';
        const parts = trimmedUrl.split(/\/d\/|id=/);
        if (parts.length > 1) {
            // Extract content after /d/ or id=
            const sub = parts[1].split(/[/?&]/)[0]; // Stop at next / or ? or &
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

function transformPackage(raw: RawPackage): Package {
    return {
        slug: raw.slug || '',
        title: raw.title || '',
        price: raw.price || '',
        duration: raw.duration || '',
        location: raw.location || '',
        description: raw.description || '',
        includes: raw.includes ? raw.includes.split('|').map(s => s.trim()) : [],
        image_url: getDirectImageUrl(raw.image_url || ''),
        whatsapp_text: raw.whatsapp_text || '',
        active: raw.active?.toUpperCase() === 'TRUE',
        order: parseInt(raw.order || '0', 10),
    };
}

// Transform raw sheet data to GalleryItem type
interface RawGalleryItem {
    image_url?: string;
    caption?: string;
    location?: string;
    is_cover?: string;
    active?: string;
    order?: string;
}

function transformGalleryItem(raw: RawGalleryItem): GalleryItem {
    return {
        image_url: getDirectImageUrl(raw.image_url || ''),
        caption: raw.caption || '',
        location: raw.location || 'Destinations',
        is_cover: raw.is_cover?.toUpperCase() === 'TRUE',
        active: raw.active?.toUpperCase() === 'TRUE',
        order: parseInt(raw.order || '0', 10),
    };
}

// Get all active packages, sorted by order
export async function getPackages(): Promise<Package[]> {
    const rawData = await fetchSheetData<RawPackage>('packages');

    return rawData
        .map(transformPackage)
        .filter(pkg => pkg.active && pkg.slug)
        .sort((a, b) => a.order - b.order);
}

// Get a single package by slug
export async function getPackageBySlug(slug: string): Promise<Package | null> {
    const packages = await getPackages();
    return packages.find(pkg => pkg.slug === slug) || null;
}

// Get all active gallery items, sorted by order
export async function getGallery(): Promise<GalleryItem[]> {
    const rawData = await fetchSheetData<RawGalleryItem>('gallery');

    return rawData
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
        // Priority: is_cover=true, then lowest order (which they are already sorted by)
        const coverImage = photos.find(p => p.is_cover) || photos[0];

        return {
            name: location,
            coverImage,
            photos
        };
    });
}
