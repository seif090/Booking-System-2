import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingCardComponent } from '../../components/booking-card/booking-card.component';
import { BookingFilterComponent } from '../../components/booking-filter/booking-filter.component';

@Component({
  selector: 'app-my-bookings-page',
  standalone: true,
  imports: [BookingCardComponent, BookingFilterComponent, RouterLink, FormsModule],
  template: `
    <section class="py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">حجوزاتي</h1>
            <p class="text-gray-500 dark:text-gray-400 mt-1">إدارة ومتابعة جميع حجوزاتك</p>
          </div>
          <div class="flex items-center gap-3">
            <app-booking-filter></app-booking-filter>
            @if (bookings().length > 0) {
              <button
                (click)="exportToCSV()"
                class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <span>📥</span>
                <span>تصدير CSV</span>
              </button>
            }
          </div>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
          <div class="flex flex-col lg:flex-row gap-4">
            <div class="relative flex-1">
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch($event)"
                placeholder="ابحث بالاسم أو الهاتف..."
                class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div class="flex gap-2">
              <input
                type="date"
                [(ngModel)]="dateFrom"
                (ngModelChange)="onDateChange()"
                class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="date"
                [(ngModel)]="dateTo"
                (ngModelChange)="onDateChange()"
                class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <select
                [(ngModel)]="sortBy"
                (ngModelChange)="onSortChange($event)"
                class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="date">الأحدث</option>
                <option value="status">الحالة</option>
              </select>
            </div>
          </div>
        </div>

        @if (filteredBookings().length === 0) {
          <div class="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">لا توجد حجوزات</h3>
            <p class="text-gray-500 dark:text-gray-400 mb-6">ابدأ بإنشاء حجزك الأول الآن</p>
            <a
              routerLink="/"
              class="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
            >
              تصفح الخدمات
            </a>
          </div>
        } @else {
          <div class="space-y-4">
            @for (booking of filteredBookings(); track booking.id) {
              <app-booking-card [booking]="booking"></app-booking-card>
            }
          </div>
        }
      </div>
    </section>
  `,
})
export class MyBookingsPageComponent {
  private readonly bookingService = inject(BookingService);

  searchQuery = '';
  dateFrom: string | null = null;
  dateTo: string | null = null;
  sortBy: 'date' | 'status' = 'date';

  get filteredBookings() {
    return this.bookingService.filteredBookings;
  }

  get bookings() {
    return this.bookingService.bookings;
  }

  onSearch(query: string): void {
    this.bookingService.setBookingsSearch(query);
  }

  onDateChange(): void {
    this.bookingService.setDateRange(this.dateFrom, this.dateTo);
  }

  onSortChange(sort: 'date' | 'status'): void {
    this.bookingService.setSortBy(sort);
  }

  exportToCSV(): void {
    this.bookingService.exportBookingsToCSV();
  }
}
