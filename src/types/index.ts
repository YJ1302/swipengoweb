// Type definitions for Swipe N Go Vacations

export interface Package {
  slug: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  description: string;
  includes: string[];
  image_url: string;
  whatsapp_text: string;
  active: boolean;
  order: number;
}

export interface GalleryItem {
  image_url: string;
  caption: string;
  active: boolean;
  order: number;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}
