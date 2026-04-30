import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BOOKING_STATUS_LABELS } from '../../../../shared/models/booking.model';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-booking-details-page',
  standalone: true,
  imports: [RouterLink, ConfirmModalComponent],
  template: `
    @if (booking && service) {
      <section class="py-8">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <a routerLink="/my-bookings" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <span>→</span>
            <span>العودة لحجوزاتي</span>
          </a>

          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div class="relative h-48 sm:h-64">
              <img [src]="service.image" class="w-full h-full object-cover" [alt]="service.title" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-6 right-6 text-white">
                <h1 class="text-2xl sm:text-3xl font-bold mb-1">{{ service.title }}</h1>
                <p class="text-sm opacity-90">{{ formattedDate }}</p>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                <div class="flex-1 space-y-4">
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">رقم الحجز</h3>
                    <p class="text-lg font-bold text-gray-900">{{ booking.id.slice(0, 8) }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">الحالة</h3>
                    <span
                      class="inline-block px-3 py-1 rounded-full text-sm font-bold"
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
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">الاسم</h3>
                    <p class="text-lg font-medium text-gray-900">{{ booking.userName }}</p>
                  </div>
                  <div>
                    <h3 class="text-sm font-medium text-gray-500 mb-1">رقم الهاتف</h3>
                    <p class="text-lg font-medium text-gray-900">{{ booking.phone }}</p>
                  </div>
                  @if (booking.notes) {
                    <div>
                      <h3 class="text-sm font-medium text-gray-500 mb-1">ملاحظات</h3>
                      <p class="text-gray-700">{{ booking.notes }}</p>
                    </div>
                  }
                </div>
                <div class="text-center sm:text-left">
                  <div class="text-4xl font-bold text-primary-600 mb-1">{{ service.price }}</div>
                  <div class="text-sm text-gray-500 mb-4">ريال سعودي</div>
                  @if (booking.status === 'pending') {
                    <div class="space-y-2">
                      <button
                        (click)="updateStatus('confirmed')"
                        class="w-full py-2.5 px-4 rounded-xl font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                      >
                        تأكيد الحجز
                      </button>
                      <button
                        (click)="showCancelModal = true"
                        class="w-full py-2.5 px-4 rounded-xl font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                      >
                        إلغاء الحجز
                      </button>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      @if (showCancelModal) {
        <app-confirm-modal
          title="إلغاء الحجز"
          message="هل أنت متأكد من إلغاء هذا الحجز؟ لا يمكن التراجع عن هذا الإجراء."
          (confirmClick)="onCancelConfirm()"
          (cancelClick)="showCancelModal = false"
        ></app-confirm-modal>
      }
    } @else {
      <div class="text-center py-20">
        <div class="text-6xl mb-4">📋</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">الحجز غير موجود</h3>
        <a routerLink="/my-bookings" class="text-primary-600 hover:underline">العودة لحجوزاتي</a>
      </div>
    }
  `,
})
export class BookingDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  booking: Booking | null = null;
  service: any = null;
  showCancelModal = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const allBookings = this.bookingService.bookings();
      const found = allBookings.find((b: Booking) => b.id === id);
      if (found) {
        this.booking = found;
        this.service = this.bookingService.getServiceById(found.serviceId);
      } else {
        this.router.navigate(['/my-bookings']);
      }
    } else {
      this.router.navigate(['/my-bookings']);
    }
  }

  get statusLabel(): string {
    return this.booking ? BOOKING_STATUS_LABELS[this.booking.status] : '';
  }

  get formattedDate(): string {
    if (!this.booking) return '';
    const d = new Date(this.booking.createdAt);
    return d.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  updateStatus(status: 'confirmed' | 'cancelled'): void {
    if (this.booking) {
      this.bookingService.updateBookingStatus(this.booking.id, status);
      this.showCancelModal = false;
    }
  }

  onCancelConfirm(): void {
    this.updateStatus('cancelled');
  }
}
