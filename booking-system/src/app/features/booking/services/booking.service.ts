import { Injectable, signal, computed, effect } from '@angular/core';
import { Service, ServiceType } from '../../../shared/models/service.model';
import { Booking, BookingStatus, BookingFormValue } from '../../../shared/models/booking.model';

const STORAGE_KEY = 'bs_bookings';
const FAVORITES_KEY = 'bs_favorites';

const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    title: 'فندق الأبراج الفاخر',
    description: 'إقامة فاخرة في قلب المدينة مع إطلالة بانورامية وخدمات سبا متكاملة. تشمل وجبة إفطار يومية وواي فاي مجاني.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
    type: 'hotel',
    price: 850,
    location: 'الرياض، حي العليا',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'نقل VIP المطار',
    description: 'خدمة نقل خاصة من وإلى المطار بسيارات فاخرة مع سائق محترف. سيارة ليموزين مكيّفة.',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80',
    type: 'transport',
    price: 200,
    location: 'جميع المطارات',
    rating: 4.9,
  },
  {
    id: '3',
    title: 'مطعم الذواقة',
    description: 'تجربة طعام فاخرة مع قائمة طعام عالمية وأجواء راقية. تشمل 3 أطباق رئيسية.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    type: 'food',
    price: 350,
    location: 'جدة، الكورنيش',
    rating: 4.7,
  },
  {
    id: '4',
    title: 'تأشيرة شنغن السريعة',
    description: 'خدمة استخراج تأشيرة شنغن خلال 5 أيام عمل مع متابعة كاملة. تشمل ترجمة المستندات.',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    type: 'visa',
    price: 1200,
    location: 'خدمة أونلاين',
    rating: 4.6,
  },
  {
    id: '5',
    title: 'فندق الواحة السياحي',
    description: 'منتجع سياحي على الشاطئ مع أنشطة مائية وملاعب للأطفال. إقامة شاملة.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80',
    type: 'hotel',
    price: 1200,
    location: 'جدة، شاطئ الهدى',
    rating: 4.5,
  },
  {
    id: '6',
    title: 'حافلة الجماعات',
    description: 'حافلات حديثة ومكيفة للرحلات الجماعية مع سائق متمرس. حتى 20 شخص.',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&q=80',
    type: 'transport',
    price: 500,
    location: 'جميع المدن',
    rating: 4.4,
  },
  {
    id: '7',
    title: 'بوفيه إفطار رمضان',
    description: 'بوفيه إفطار فاخر يشمل أشهى المأكولات العربية والعالمية. حتى 10 أشخاص.',
    image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
    type: 'food',
    price: 800,
    location: 'الرياض، حي الملز',
    rating: 4.8,
  },
  {
    id: '8',
    title: 'تأشيرة بريطانيا',
    description: 'خدمة استخراج تأشيرة المملكة المتحدة مع جدولة موعد السفارة. متابعة كاملة.',
    image: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=600&q=80',
    type: 'visa',
    price: 1500,
    location: 'خدمة أونلاين',
    rating: 4.7,
  },
];

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly _services = signal<Service[]>(MOCK_SERVICES);
  private readonly _bookings = signal<Booking[]>([]);
  private readonly _searchQuery = signal('');
  private readonly _filterType = signal<ServiceType | ''>('');
  private readonly _bookingsFilter = signal<BookingStatus | ''>('');
  private readonly _bookingsSearch = signal('');
  private readonly _dateFrom = signal<string | null>(null);
  private readonly _dateTo = signal<string | null>(null);
  private readonly _sortBy = signal<'date' | 'status'>('date');
  private readonly _minPrice = signal<number | null>(null);
  private readonly _maxPrice = signal<number | null>(null);
  private readonly _favorites = signal<Set<string>>(new Set());
  private readonly _showFavoritesOnly = signal(false);

  readonly services = this._services.asReadonly();
  readonly bookings = this._bookings.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filterType = this._filterType.asReadonly();
  readonly bookingsFilter = this._bookingsFilter.asReadonly();
  readonly bookingsSearch = this._bookingsSearch.asReadonly();
  readonly dateFrom = this._dateFrom.asReadonly();
  readonly dateTo = this._dateTo.asReadonly();
  readonly sortBy = this._sortBy.asReadonly();
  readonly minPrice = this._minPrice.asReadonly();
  readonly maxPrice = this._maxPrice.asReadonly();
  readonly favorites = this._favorites.asReadonly();
  readonly showFavoritesOnly = this._showFavoritesOnly.asReadonly();

  readonly filteredServices = computed(() => {
    const search = this._searchQuery().toLowerCase().trim();
    const type = this._filterType();
    const min = this._minPrice();
    const max = this._maxPrice();
    const showFavorites = this._showFavoritesOnly();
    const favorites = this._favorites();
    return this._services().filter((s: Service) => {
      const matchesSearch = !search || s.title.toLowerCase().includes(search) || s.description.toLowerCase().includes(search);
      const matchesType = !type || s.type === type;
      const matchesMin = !min || s.price >= min;
      const matchesMax = !max || s.price <= max;
      const matchesFavorites = !showFavorites || favorites.has(s.id);
      return matchesSearch && matchesType && matchesMin && matchesMax && matchesFavorites;
    });
  });

  readonly filteredBookings = computed(() => {
    const status = this._bookingsFilter();
    const search = this._bookingsSearch().toLowerCase().trim();
    const from = this._dateFrom();
    const to = this._dateTo();
    const sort = this._sortBy();

    let filtered = this._bookings();

    if (status) {
      filtered = filtered.filter((b: Booking) => b.status === status);
    }

    if (search) {
      filtered = filtered.filter((b: Booking) =>
        b.userName.toLowerCase().includes(search) ||
        b.phone.includes(search) ||
        b.notes?.toLowerCase().includes(search)
      );
    }

    if (from) {
      const fromDate = new Date(from);
      filtered = filtered.filter((b: Booking) => new Date(b.createdAt) >= fromDate);
    }

    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((b: Booking) => new Date(b.createdAt) <= toDate);
    }

    if (sort === 'date') {
      filtered = [...filtered].sort((a: Booking, b: Booking) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sort === 'status') {
      const statusOrder: Record<BookingStatus, number> = { pending: 0, confirmed: 1, cancelled: 2 };
      filtered = [...filtered].sort((a: Booking, b: Booking) =>
        statusOrder[a.status] - statusOrder[b.status]
      );
    }

    return filtered;
  });

  constructor() {
    this._loadFromStorage();
    this._loadFavorites();
    effect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._bookings()));
    });
    effect(() => {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify([...this._favorites()]));
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

  private _loadFavorites(): void {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        this._favorites.set(new Set(JSON.parse(saved) as string[]));
      }
    } catch {
      this._favorites.set(new Set());
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

  setBookingsSearch(query: string): void {
    this._bookingsSearch.set(query);
  }

  setDateRange(from: string | null, to: string | null): void {
    this._dateFrom.set(from);
    this._dateTo.set(to);
  }

  setSortBy(sort: 'date' | 'status'): void {
    this._sortBy.set(sort);
  }

  setPriceRange(min: number | null, max: number | null): void {
    this._minPrice.set(min);
    this._maxPrice.set(max);
  }

  setShowFavoritesOnly(show: boolean): void {
    this._showFavoritesOnly.set(show);
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

  isFavorite(serviceId: string): boolean {
    return this._favorites().has(serviceId);
  }

  toggleFavorite(serviceId: string): void {
    this._favorites.update((set: Set<string>) => {
      const newSet = new Set(set);
      if (newSet.has(serviceId)) {
        newSet.delete(serviceId);
      } else {
        newSet.add(serviceId);
      }
      return newSet;
    });
  }

  exportBookingsToCSV(): void {
    const bookings = this._bookings();
    if (bookings.length === 0) return;

    const headers = ['ID', 'Service', 'User Name', 'Phone', 'Status', 'Notes', 'Created At'];
    const rows = bookings.map((b: Booking) => {
      const service = this.getServiceById(b.serviceId);
      return [
        b.id,
        service?.title ?? 'Unknown',
        b.userName,
        b.phone,
        b.status,
        b.notes ?? '',
        b.createdAt,
      ];
    });

    const csvContent = [headers, ...rows]
      .map((row: string[]) => row.map((cell: string) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }
}
