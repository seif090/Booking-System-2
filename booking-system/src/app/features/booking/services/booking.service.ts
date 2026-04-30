import { Injectable, signal, computed, effect } from '@angular/core';
import { Service, ServiceType } from '../../../shared/models/service.model';
import { Booking, BookingStatus, BookingFormValue } from '../../../shared/models/booking.model';

const STORAGE_KEY = 'bs_bookings';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'فندق الأبراج الفاخر',
    description: 'إقامة فاخرة في قلب المدينة مع إطلالة بانورامية وخدمات سبا متكاملة.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    type: 'hotel',
  },
  {
    id: '2',
    title: 'نقل VIP المطار',
    description: 'خدمة نقل خاصة من وإلى المطار بسيارات فاخرة مع سائق محترف.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
    type: 'transport',
  },
  {
    id: '3',
    title: 'مطعم الذواقة',
    description: 'تجربة طعام فاخرة مع قائمة طعام عالمية وأجواء راقية.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    type: 'food',
  },
  {
    id: '4',
    title: 'تأشيرة شنغن السريعة',
    description: 'خدمة استخراج تأشيرة شنغن خلال 5 أيام عمل مع متابعة كاملة.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    type: 'visa',
  },
  {
    id: '5',
    title: 'فندق الواحة السياحي',
    description: 'منتجع سياحي على الشاطئ مع أنشطة مائية وملاعب للأطفال.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    type: 'hotel',
  },
  {
    id: '6',
    title: 'حافلة الجماعات',
    description: 'حافلات حديثة ومكيفة للرحلات الجماعية مع سائق متمرس.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    type: 'transport',
  },
  {
    id: '7',
    title: 'بوفيه إفطار رمضان',
    description: 'بوفيه إفطار فاخر يشمل أشهى المأكولات العربية والعالمية.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    type: 'food',
  },
  {
    id: '8',
    title: 'تأشيرة بريطانيا',
    description: 'خدمة استخراج تأشيرة المملكة المتحدة مع جدولة موعد السفارة.',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80',
    type: 'visa',
  },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly _services = signal<Service[]>(MOCK_SERVICES);
  private readonly _bookings = signal<Booking[]>([]);
  private readonly _searchQuery = signal('');
  private readonly _filterType = signal<ServiceType | ''>('');
  private readonly _bookingsFilter = signal<BookingStatus | ''>('');

  readonly services = this._services.asReadonly();
  readonly bookings = this._bookings.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filterType = this._filterType.asReadonly();
  readonly bookingsFilter = this._bookingsFilter.asReadonly();

  readonly filteredServices = computed(() => {
    const search = this._searchQuery().toLowerCase().trim();
    const type = this._filterType();
    return this._services().filter((s: Service) => {
      const matchesSearch = !search || s.title.toLowerCase().includes(search) || s.description.toLowerCase().includes(search);
      const matchesType = !type || s.type === type;
      return matchesSearch && matchesType;
    });
  });

  readonly filteredBookings = computed(() => {
    const status = this._bookingsFilter();
    const all = this._bookings();
    if (!status) return all;
    return all.filter((b: Booking) => b.status === status);
  });

  constructor() {
    this._loadFromStorage();
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._bookings()));
    });
  }

  private _loadFromStorage(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this._bookings.set(JSON.parse(saved) as Booking[]);
      }
    } catch {
      this._bookings.set([]);
    }
  }

  setSearch(query: string): void {
    this._searchQuery.set(query);
  }

  setFilterType(type: ServiceType | ''): void {
    this._filterType.set(type);
  }

  setBookingsFilter(status: BookingStatus | ''): void {
    this._bookingsFilter.set(status);
  }

  createBooking(formValue: BookingFormValue): Booking {
    const booking: Booking = {
      id: crypto.randomUUID(),
      serviceId: formValue.serviceId,
      userName: formValue.userName.trim(),
      phone: formValue.phone.trim(),
      notes: formValue.notes?.trim() ?? '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    this._bookings.update((list: Booking[]) => [booking, ...list]);
    return booking;
  }

  updateBookingStatus(id: string, status: BookingStatus): void {
    this._bookings.update((list: Booking[]) =>
      list.map((b: Booking) => (b.id === id ? { ...b, status } : b))
    );
  }

  getServiceById(id: string): Service | undefined {
    return this._services().find((s: Service) => s.id === id);
  }
}
