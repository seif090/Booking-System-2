import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../services/booking.service';
import { ServiceCardComponent } from '../../components/service-card/service-card.component';
import { BookingModalComponent } from '../../components/booking-modal/booking-modal.component';
import { SkeletonComponent } from '../../../../shared/components/skeleton/skeleton.component';
import { Service, ServiceType } from '../../../../shared/models/service.model';

@Component({
  selector: 'app-marketplace-page',
  standalone: true,
  imports: [FormsModule, ServiceCardComponent, BookingModalComponent, SkeletonComponent],
  template: `
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">اكتشف خدماتنا</h1>
          <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">احجز الفنادق، النقل، المطاعم، والتأشيرات بكل سهولة وأمان</p>
        </div>

        <div class="sticky top-20 z-30 bg-gray-50/95 dark:bg-gray-800/95 backdrop-blur-sm py-4 mb-8 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div class="flex flex-col gap-3 px-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <div class="relative flex-1">
                <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (ngModelChange)="onSearch($event)"
                  placeholder="ابحث عن خدمة..."
                  class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div class="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                @for (filter of filters; track filter.value) {
                  <button
                    (click)="setFilter(filter.value)"
                    class="px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
                    [class.bg-primary-600]="activeFilter === filter.value"
                    [class.text-white]="activeFilter === filter.value"
                    [class.bg-white]="activeFilter !== filter.value"
                    [class.text-gray-600]="activeFilter !== filter.value"
                    [class.border]="activeFilter !== filter.value"
                    [class.border-gray-200]="activeFilter !== filter.value"
                    [class.dark:bg-gray-700]="activeFilter !== filter.value"
                    [class.dark:text-gray-300]="activeFilter !== filter.value"
                    [class.dark:border-gray-600]="activeFilter !== filter.value"
                  >
                    {{ filter.label }}
                  </button>
                }
              </div>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span class="text-gray-600 dark:text-gray-400 whitespace-nowrap">نطاق السعر:</span>
              <input
                type="number"
                [(ngModel)]="minPrice"
                (ngModelChange)="onPriceChange()"
                placeholder="من"
                min="0"
                class="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span class="text-gray-400">-</span>
              <input
                type="number"
                [(ngModel)]="maxPrice"
                (ngModelChange)="onPriceChange()"
                placeholder="إلى"
                min="0"
                class="w-24 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span class="text-gray-500 dark:text-gray-400">ر.س</span>
              @if (minPrice || maxPrice) {
                <button
                  (click)="clearPriceFilter()"
                  class="text-red-600 hover:text-red-700 text-xs font-medium"
                >
                  مسح
                </button>
              }
            </div>
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
                placeholder="ابحث عن خدمة..."
                class="w-full pr-10 pl-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div class="flex gap-2">
              <input
                type="number"
                [(ngModel)]="minPrice"
                (ngModelChange)="onPriceChange()"
                placeholder="من"
                class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
              />
              <input
                type="number"
                [(ngModel)]="maxPrice"
                (ngModelChange)="onPriceChange()"
                placeholder="إلى"
                class="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 w-24"
              />
              @if (minPrice || maxPrice) {
                <button
                  (click)="clearPriceFilter()"
                  class="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  مسح
                </button>
              }
            </div>
          </div>
        </div>

        @if (comparingIds.size > 0) {
          <div class="bg-primary-50 dark:bg-primary-900/30 rounded-2xl shadow-sm p-4 mb-6 border border-primary-200 dark:border-primary-700">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-primary-700 dark:text-primary-300">{{ comparingIds.size }} خدمات للمقارنة</span>
              <div class="flex gap-2">
                @if (comparingIds.size >= 2) {
                  <button
                    class="px-4 py-2 rounded-xl text-xs font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    مقارنة
                  </button>
                }
                <button
                  (click)="clearComparison()"
                  class="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  مسح
                </button>
              </div>
            </div>
          </div>
        }

        @if (isLoading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (_ of [1,2,3,4,5,6,7,8]; track $index) {
              <app-skeleton></app-skeleton>
            }
          </div>
        } @else if (filteredServices().length === 0) {
          <div class="text-center py-20">
            <div class="text-6xl mb-4">🔍</div>
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">لا توجد نتائج</h3>
            <p class="text-gray-500 dark:text-gray-400">جرب البحث بكلمات مختلفة أو إعادة ضبط الفلتر</p>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (service of filteredServices(); track service.id) {
              <app-service-card
                [service]="service"
                [isComparing]="comparingIds.has(service.id)"
                (bookClick)="openBookingModal($event)"
                (detailsClick)="navigateToDetails($event)"
                (compareToggle)="onCompareToggle($event)"
              ></app-service-card>
            }
          </div>
        }
      </div>
    </section>

    @if (selectedService()) {
      <app-booking-modal
        [service]="selectedService()!"
        (closeClick)="selectedService.set(null)"
        (booked)="selectedService.set(null)"
      ></app-booking-modal>
    }
  `,
})
export class MarketplacePageComponent implements OnInit {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  isLoading = signal(true);
  selectedService = signal<Service | null>(null);
  searchQuery = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  comparingIds = new Set<string>();

  readonly filters: { value: ServiceType | '' | 'favorites'; label: string }[] = [
    { value: '', label: 'الكل' },
    { value: 'hotel', label: 'فنادق' },
    { value: 'transport', label: 'نقل' },
    { value: 'food', label: 'مطاعم' },
    { value: 'visa', label: 'تأشيرات' },
    { value: 'favorites', label: 'المفضلة ❤️' },
  ];

  get activeFilter(): ServiceType | '' {
    return this.bookingService.filterType();
  }

  get filteredServices() {
    return this.bookingService.filteredServices;
  }

  ngOnInit(): void {
    setTimeout(() => this.isLoading.set(false), 800);
  }

  onSearch(query: string): void {
    this.bookingService.setSearch(query);
  }

  setFilter(type: ServiceType | '' | 'favorites'): void {
    if (type === 'favorites') {
      this.bookingService.setShowFavoritesOnly(true);
    } else {
      this.bookingService.setShowFavoritesOnly(false);
      this.bookingService.setFilterType(type);
    }
  }

  onPriceChange(): void {
    this.bookingService.setPriceRange(this.minPrice, this.maxPrice);
  }

  clearPriceFilter(): void {
    this.minPrice = null;
    this.maxPrice = null;
    this.bookingService.setPriceRange(null, null);
  }

  onCompareToggle(event: { id: string; selected: boolean }): void {
    if (event.selected) {
      if (this.comparingIds.size >= 3) {
        return;
      }
      this.comparingIds.add(event.id);
    } else {
      this.comparingIds.delete(event.id);
    }
  }

  clearComparison(): void {
    this.comparingIds.clear();
  }

  get comparingServices(): Service[] {
    return this.bookingService.services().filter((s) => this.comparingIds.has(s.id));
  }

  openBookingModal(serviceId: string): void {
    const svc = this.bookingService.getServiceById(serviceId);
    if (svc) {
      this.selectedService.set(svc);
    }
  }

  navigateToDetails(serviceId: string): void {
    this.router.navigate(['/service', serviceId]);
  }
}
