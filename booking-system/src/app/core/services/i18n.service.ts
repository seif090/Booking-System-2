import { Injectable, signal, effect } from '@angular/core';

const LANG_KEY = 'bs_lang';

export type Language = 'ar' | 'en';

interface Translations {
  [key: string]: string;
}

const ARABIC: Translations = {
  nav_services: 'الخدمات',
  nav_dashboard: 'الإحصائيات',
  nav_bookings: 'حجوزاتي',
  nav_dark_mode: 'تبديل الوضع الليلي',
  marketplace_title: 'اكتشف خدماتنا',
  marketplace_subtitle: 'احجز الفنادق، النقل، المطاعم، والتأشيرات بكل سهولة وأمان',
  search_placeholder: 'ابحث عن خدمة...',
  filter_all: 'الكل',
  filter_hotel: 'فنادق',
  filter_transport: 'نقل',
  filter_food: 'مطاعم',
  filter_visa: 'تأشيرات',
  filter_favorites: 'المفضلة ❤️',
  price_range: 'نطاق السعر:',
  price_from: 'من',
  price_to: 'إلى',
  price_clear: 'مسح',
  price_currency: 'ر.س',
  book_now: 'احجز الآن',
  my_bookings_title: 'حجوزاتي',
  my_bookings_subtitle: 'إدارة ومتابعة جميع حجوزاتك',
  search_bookings: 'ابحث بالاسم أو الهاتف...',
  sort_newest: 'الأحدث',
  sort_status: 'الحالة',
  export_csv: 'تصدير CSV',
  no_bookings: 'لا توجد حجوزات',
  no_bookings_desc: 'ابدأ بإنشاء حجزك الأول الآن',
  browse_services: 'تتصفح الخدمات',
  no_results: 'لا توجد نتائج',
  no_results_desc: 'جرب البحث بكلمات مختلفة أو إعادة ضبط الفلتر',
  status_pending: 'قيد الانتظار',
  status_confirmed: 'مؤكد',
  status_cancelled: 'ملغى',
  confirm_booking: 'تأكيد الحجز',
  cancel_booking: 'إلغاء الحجز',
  duplicate_booking: 'نسخ الحجز',
  print_booking: 'طباعة',
  rate_experience: 'قيم تجربتك',
  rating_label: 'التقييم:',
  review_placeholder: 'اكتب تقييمك هنا (اختياري)...',
  submit_rating: 'إرسال التقييم',
  your_rating: 'تقييمك',
  booking_not_found: 'الحجز غير موجود',
  back_to_bookings: 'العودة لحجوزاتي',
  booking_id: 'رقم الحجز',
  booking_status: 'الحالة',
  booking_name: 'الاسم',
  booking_phone: 'رقم الهاتف',
  booking_notes: 'ملاحظات',
  dashboard_title: 'لوحة الإحصائيات',
  dashboard_subtitle: 'نظرة عامة على حجوزاتك وأداء الخدمات',
  total_bookings: 'إجمالي الحجوزات',
  pending_bookings: 'قيد الانتظار',
  confirmed_bookings: 'مؤكد',
  cancelled_bookings: 'ملغى',
  booking_status_chart: 'حالة الحجوزات',
  top_services: 'الخدمات الأكثر حجزاً',
  bookings_count: 'حجز',
  view_all_bookings: 'عرض جميع الحجوزات',
  footer: 'نظام الحجز - Booking System © 2024',
};

const ENGLISH: Translations = {
  nav_services: 'Services',
  nav_dashboard: 'Dashboard',
  nav_bookings: 'My Bookings',
  nav_dark_mode: 'Toggle Dark Mode',
  marketplace_title: 'Discover Our Services',
  marketplace_subtitle: 'Book hotels, transport, restaurants, and visas with ease and security',
  search_placeholder: 'Search for a service...',
  filter_all: 'All',
  filter_hotel: 'Hotels',
  filter_transport: 'Transport',
  filter_food: 'Restaurants',
  filter_visa: 'Visas',
  filter_favorites: 'Favorites ❤️',
  price_range: 'Price Range:',
  price_from: 'From',
  price_to: 'To',
  price_clear: 'Clear',
  price_currency: 'SAR',
  book_now: 'Book Now',
  my_bookings_title: 'My Bookings',
  my_bookings_subtitle: 'Manage and track all your bookings',
  search_bookings: 'Search by name or phone...',
  sort_newest: 'Newest',
  sort_status: 'Status',
  export_csv: 'Export CSV',
  no_bookings: 'No Bookings',
  no_bookings_desc: 'Start by creating your first booking',
  browse_services: 'Browse Services',
  no_results: 'No Results',
  no_results_desc: 'Try different search terms or reset filters',
  status_pending: 'Pending',
  status_confirmed: 'Confirmed',
  status_cancelled: 'Cancelled',
  confirm_booking: 'Confirm Booking',
  cancel_booking: 'Cancel Booking',
  duplicate_booking: 'Duplicate Booking',
  print_booking: 'Print',
  rate_experience: 'Rate Your Experience',
  rating_label: 'Rating:',
  review_placeholder: 'Write your review here (optional)...',
  submit_rating: 'Submit Rating',
  your_rating: 'Your Rating',
  booking_not_found: 'Booking Not Found',
  back_to_bookings: 'Back to My Bookings',
  booking_id: 'Booking ID',
  booking_status: 'Status',
  booking_name: 'Name',
  booking_phone: 'Phone',
  booking_notes: 'Notes',
  dashboard_title: 'Statistics Dashboard',
  dashboard_subtitle: 'Overview of your bookings and service performance',
  total_bookings: 'Total Bookings',
  pending_bookings: 'Pending',
  confirmed_bookings: 'Confirmed',
  cancelled_bookings: 'Cancelled',
  booking_status_chart: 'Booking Status',
  top_services: 'Top Booked Services',
  bookings_count: 'bookings',
  view_all_bookings: 'View All Bookings',
  footer: 'Booking System © 2024',
};

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly _lang = signal<Language>('ar');
  readonly lang = this._lang.asReadonly();

  constructor() {
    this._loadFromStorage();
    effect(() => {
      localStorage.setItem(LANG_KEY, this._lang());
      document.documentElement.dir = this._lang() === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = this._lang();
    });
  }

  private _loadFromStorage(): void {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ar' || saved === 'en') {
      this._lang.set(saved);
    }
  }

  toggle(): void {
    this._lang.update((l: Language) => (l === 'ar' ? 'en' : 'ar'));
  }

  setLang(lang: Language): void {
    this._lang.set(lang);
  }

  t(key: string): string {
    const translations = this._lang() === 'ar' ? ARABIC : ENGLISH;
    return translations[key] || key;
  }
}
