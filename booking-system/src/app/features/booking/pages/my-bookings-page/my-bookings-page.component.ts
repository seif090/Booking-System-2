import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingCardComponent } from '../../components/booking-card/booking-card.component';
import { BookingFilterComponent } from '../../components/booking-filter/booking-filter.component';

@Component({
  selector: 'app-my-bookings-page',
  standalone: true,
  imports: [BookingCardComponent, BookingFilterComponent, RouterLink],
  template: `
    <section class="py-8">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-gray-900">حجوزاتي</h1>
            <p class="text-gray-500 mt-1">إدارة ومتابعة جميع حجوزاتك</p>
          </div>
          <app-booking-filter></app-booking-filter>
        </div>

        @if (filteredBookings().length === 0) {
          <div class="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <div class="text-6xl mb-4">📋</div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">لا توجد حجوزات</h3>
            <p class="text-gray-500 mb-6">ابدأ بإنشاء حجزك الأول الآن</p>
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

  get filteredBookings() {
    return this.bookingService.filteredBookings;
  }
}
