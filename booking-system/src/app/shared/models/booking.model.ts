export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Booking {
  id: string;
  serviceId: string;
  userName: string;
  phone: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface BookingFormValue {
  serviceId: string;
  userName: string;
  phone: string;
  notes: string;
}

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'قيد الانتظار',
  confirmed: 'مؤكد',
  cancelled: 'ملغى',
};
