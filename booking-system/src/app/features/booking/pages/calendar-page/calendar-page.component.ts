import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../../../shared/models/booking.model';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">تقويم الحجوزات</h1>
          <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">عرض حجوزاتك على تقويم شهري</p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6">
          <div class="flex items-center justify-between mb-6">
            <button
              (click)="previousMonth()"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="text-xl">→</span>
            </button>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ currentMonthYear() }}</h2>
            <button
              (click)="nextMonth()"
              class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <span class="text-xl">←</span>
            </button>
          </div>

          <div class="grid grid-cols-7 gap-2 mb-2">
            @for (day of weekDays; track day) {
              <div class="text-center text-sm font-medium text-gray-500 dark:text-gray-400 py-2">{{ day }}</div>
            }
          </div>

          <div class="grid grid-cols-7 gap-2">
            @for (date of calendarDays(); track date.day) {
              <div
                class="min-h-24 p-2 rounded-lg border transition-colors"
                [class.bg-gray-50]="date.isCurrentMonth"
                [class.bg-gray-100]="!date.isCurrentMonth"
                [class.border-gray-200]="date.isCurrentMonth"
                [class.border-gray-300]="!date.isCurrentMonth"
                [class.dark:bg-gray-700]="date.isCurrentMonth"
                [class.dark:bg-gray-800]="!date.isCurrentMonth"
                [class.dark:border-gray-600]="date.isCurrentMonth"
                [class.dark:border-gray-700]="!date.isCurrentMonth"
              >
                <div class="text-sm font-medium text-gray-900 dark:text-white mb-1">{{ date.day }}</div>
                @if (date.bookings.length > 0) {
                  <div class="space-y-1">
                    @for (booking of date.bookings; track booking.id) {
                      <a
                        [routerLink]="['/my-bookings', booking.id]"
                        class="block text-xs px-2 py-1 rounded truncate"
                        [class.bg-yellow-100]="booking.status === 'pending'"
                        [class.text-yellow-800]="booking.status === 'pending'"
                        [class.bg-emerald-100]="booking.status === 'confirmed'"
                        [class.text-emerald-800]="booking.status === 'confirmed'"
                        [class.bg-red-100]="booking.status === 'cancelled'"
                        [class.text-red-800]="booking.status === 'cancelled'"
                        [class.dark:bg-yellow-900]="booking.status === 'pending'"
                        [class.dark:text-yellow-200]="booking.status === 'pending'"
                        [class.dark:bg-emerald-900]="booking.status === 'confirmed'"
                        [class.dark:text-emerald-200]="booking.status === 'confirmed'"
                        [class.dark:bg-red-900]="booking.status === 'cancelled'"
                        [class.dark:text-red-200]="booking.status === 'cancelled'"
                      >
                        {{ booking.serviceTitle }}
                      </a>
                    }
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div class="text-center">
          <a
            routerLink="/my-bookings"
            class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-bold transition-colors"
          >
            عرض جميع الحجوزات
          </a>
        </div>
      </div>
    </section>
  `,
})
export class CalendarPageComponent {
  private readonly bookingService = inject(BookingService);

  readonly bookings = this.bookingService.bookings;

  private readonly _currentDate = new Date();
  private readonly _viewMonth = new Date();

  readonly weekDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  readonly currentMonthYear = computed(() => {
    return this._viewMonth.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
  });

  readonly calendarDays = computed(() => {
    const year = this._viewMonth.getFullYear();
    const month = this._viewMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Array<{ day: number; isCurrentMonth: boolean; bookings: Array<{ id: string; serviceTitle: string; status: string }> }> = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ day: prevMonthLastDay - i, isCurrentMonth: false, bookings: [] });
    }

    for (let i = 1; i <= totalDays; i++) {
      const dayBookings = this.bookings()
        .filter((b: Booking) => {
          const bookingDate = new Date(b.createdAt);
          return (
            bookingDate.getDate() === i &&
            bookingDate.getMonth() === month &&
            bookingDate.getFullYear() === year
          );
        })
        .map((b: Booking) => {
          const service = this.bookingService.getServiceById(b.serviceId);
          return {
            id: b.id,
            serviceTitle: service?.title ?? 'Unknown',
            status: b.status,
          };
        });

      days.push({ day: i, isCurrentMonth: true, bookings: dayBookings });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({ day: i, isCurrentMonth: false, bookings: [] });
    }

    return days;
  });

  previousMonth(): void {
    this._viewMonth.setMonth(this._viewMonth.getMonth() - 1);
  }

  nextMonth(): void {
    this._viewMonth.setMonth(this._viewMonth.getMonth() + 1);
  }
}
