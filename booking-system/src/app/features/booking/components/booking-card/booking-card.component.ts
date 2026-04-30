import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Booking, BookingStatus, BOOKING_STATUS_LABELS } from '../../../../shared/models/booking.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-booking-card',
  standalone: true,
  template: `
    @if (service) {
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row cursor-pointer" (click)="navigateToDetails()">
        <div class="sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
          <img [src]="service.image" class="w-full h-full object-cover" [alt]="service.title" />
        </div>
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-3 mb-3">
            <div>
              <h3 class="text-base font-bold text-gray-900 dark:text-white">{{ service.title }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formattedDate }}</p>
            </div>
            <span
              class="px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
              [class.bg-yellow-50]="booking.status === 'pending'"
              [class.text-yellow-700]="booking.status === 'pending'"
              [class.bg-emerald-50]="booking.status === 'confirmed'"
              [class.text-emerald-700]="booking.status === 'confirmed'"
              [class.bg-red-50]="booking.status === 'cancelled'"
              [class.text-red-700]="booking.status === 'cancelled'"
            >
              {{ statusLabel }}
            </span>
          </div>
          <div class="space-y-1 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <p><span class="font-medium text-gray-900 dark:text-white">الاسم:</span> {{ booking.userName }}</p>
            <p><span class="font-medium text-gray-900 dark:text-white">الهاتف:</span> {{ booking.phone }}</p>
            @if (booking.notes) {
              <p><span class="font-medium text-gray-900 dark:text-white">ملاحظات:</span> {{ booking.notes }}</p>
            }
          </div>
          <div class="mt-auto flex items-center gap-2">
            @if (booking.status === 'pending') {
              <button
                (click)="$event.stopPropagation(); onUpdateStatus('confirmed')"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
              >
                تأكيد
              </button>
              <button
                (click)="$event.stopPropagation(); onUpdateStatus('cancelled')"
                class="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
              >
                إلغاء
              </button>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class BookingCardComponent {
  @Input({ required: true }) booking!: Booking;
  @Output() statusChanged = new EventEmitter<void>();

  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  get service() {
    return this.bookingService.getServiceById(this.booking.serviceId);
  }

  get statusLabel(): string {
    return BOOKING_STATUS_LABELS[this.booking.status];
  }

  get formattedDate(): string {
    const d = new Date(this.booking.createdAt);
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  onUpdateStatus(status: BookingStatus): void {
    this.bookingService.updateBookingStatus(this.booking.id, status);
    this.statusChanged.emit();
  }

  navigateToDetails(): void {
    this.router.navigate(['/my-bookings', this.booking.id]);
  }
}
