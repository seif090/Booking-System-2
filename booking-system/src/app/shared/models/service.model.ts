export type ServiceType = 'hotel' | 'transport' | 'food' | 'visa';

export interface Service {
  id: string;
  title: string;
  description: string;
  image: string;
  type: ServiceType;
  price: number;
  location?: string;
  rating?: number;
}

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  hotel: 'فندق',
  transport: 'نقل',
  food: 'طعام',
  visa: 'تأشيرة',
};
