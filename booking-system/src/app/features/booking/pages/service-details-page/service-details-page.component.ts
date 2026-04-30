import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal.component';
import { Service } from '../../../../shared/models/service.model';

@Component({
  selector: 'app-service-details-page',
  standalone: true,
  imports: [RouterLink, BookingModalComponent],
  template: `
    @if (service) {
      <section class="py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <a routerLink="/" class="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <span>→</span>
            <span>العودة للخدمات</span>
          </a>

          <div class="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div class="relative h-64 sm:h-80">
              <img [src]="service.image" class="w-full h-full object-cover" [alt]="service.title" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div class="absolute bottom-6 right-6 text-white">
                <h1 class="text-3xl sm:text-4xl font-bold mb-2">{{ service.title }}</h1>
                <div class="flex items-center gap-4">
                  @if (service.rating) {
                    <div class="flex items-center gap-1">
                      <span>⭐</span>
                      <span class="font-bold">{{ service.rating }}</span>
                    </div>
                  }
                  @if (service.location) {
                    <div class="flex items-center gap-1">
                      <span>📍</span>
                      <span>{{ service.location }}</span>
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="p-6 sm:p-8">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
                <div class="flex-1">
                  <h2 class="text-xl font-bold text-gray-900 mb-3">عن الخدمة</h2>
                  <p class="text-gray-600 leading-relaxed">{{ service.description }}</p>
                </div>
                <div class="text-center sm:text-left">
                  <div class="text-4xl font-bold text-primary-600 mb-1">{{ service.price }}</div>
                  <div class="text-sm text-gray-500">ريال سعودي</div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  (click)="showBookingModal = true"
                  class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  احجز الآن
                </button>
                <a
                  routerLink="/"
                  class="flex-1 text-center py-3 px-6 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  تصفح خدمات أخرى
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      @if (showBookingModal) {
        <app-booking-modal
          [service]="service"
          (closeClick)="showBookingModal = false"
          (booked)="showBookingModal = false"
        ></app-booking-modal>
      }
    } @else {
      <div class="text-center py-20">
        <div class="text-6xl mb-4">🔍</div>
        <h3 class="text-lg font-bold text-gray-900 mb-2">الخدمة غير موجودة</h3>
        <a routerLink="/" class="text-primary-600 hover:underline">العودة للخدمات</a>
      </div>
    }
  `,
})
export class ServiceDetailsPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);

  service: Service | null = null;
  showBookingModal = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const svc = this.bookingService.getServiceById(id);
      if (svc) {
        this.service = svc;
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
