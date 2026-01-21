export const formatPrice = (price: string | number | undefined | null): string => {
    if (!price) return '₹';
    // If it's a string that already contains currency symbols, strip them?
    // Or just assume the valid number part is what we want.
    // If the string is purely text like "Contact us", return it.
    if (typeof price === 'string') {
        const num = parseFloat(price.replace(/[^0-9.]/g, ''));
        if (isNaN(num)) return price; // Return original text if valid text
        // If it looks like a number, format it
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(num);
    }
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price);
};

export const formatCoordinates = (lat: number | undefined, lng: number | undefined): string => {
    if (lat === undefined || lng === undefined || lat === 0 || lng === 0) return '';

    // Simple decimal format with direction
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';

    return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
};

export const toDMS = (deg: number): string => {
    const d = Math.floor(deg);
    const minfloat = (deg - d) * 60;
    const m = Math.floor(minfloat);
    const s = Math.round((minfloat - m) * 60);
    return `${d}° ${m}' ${s}"`;
};

export const formatCoordinatesDMS = (lat: number | undefined, lng: number | undefined): string => {
    if (lat === undefined || lng === undefined || lat === 0 || lng === 0) return '';
    const latDir = lat >= 0 ? 'N' : 'S';
    const lngDir = lng >= 0 ? 'E' : 'W';
    return `${toDMS(Math.abs(lat))} ${latDir}, ${toDMS(Math.abs(lng))} ${lngDir}`;
};
