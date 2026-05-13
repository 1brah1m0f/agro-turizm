export interface Place {
  id: string;
  title: string;
  description: string;
  category: string;
  region: string;
  lat: number;
  lng: number;
  pricePerPerson: number;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  entrepreneurId: string;
  approved: boolean;
}
