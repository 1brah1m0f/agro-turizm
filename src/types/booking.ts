export type BookingStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  placeId: string;
  touristId: string;
  date: Date;
  participants: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: Date;
}
