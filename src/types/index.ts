// Type definitions for Swipe N Go Vacations

export interface Package {
  slug: string;
  title: string;
  price: string;
  duration: string;
  location: string;
  description: string;
  includes: string[];
  excludes: string[];
  image_url: string;
  whatsapp_text: string;
  active: boolean;
  order: number;
  lat: number;
  lng: number;
  // New fields
  country: string;
  city: string;
  category: string;
  best_time: string;
  highlights: string[];
  itinerary: ItineraryDay[];
  what_to_carry: string[];
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

export interface GalleryItem {
  image_url: string;
  caption: string;
  location: string;
  is_cover: boolean;
  active: boolean;
  order: number;
}

export interface LocationGroup {
  name: string;
  coverImage: GalleryItem;
  photos: GalleryItem[];
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
  trip_name?: string;
}

export interface QuoteRequest {
  name: string;
  phone: string;
  destination: string;
  travel_month: string;
  num_people: number;
  budget_range: string;
  notes: string;
}
