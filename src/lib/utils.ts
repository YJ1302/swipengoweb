import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Generate WhatsApp URL with pre-filled message
export function getWhatsAppUrl(message?: string): string {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
    const encodedMessage = encodeURIComponent(message || 'Hello! I am interested in your travel packages.');
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

// Get business name from environment
export function getBusinessName(): string {
    return process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Swipe N Go Vacations';
}

// Get Instagram URL from environment
export function getInstagramUrl(): string {
    return process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/swipe_n_go_vacations';
}

// Format price for display
export function formatPrice(price: string): string {
    if (!price) return '';
    // If it's already formatted or has currency symbol, return as is
    if (price.includes('$') || price.includes('€')) return price;
    // Otherwise, assume it's a number and format it
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return `$${num.toLocaleString()}`;
}
