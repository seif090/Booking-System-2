import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus, BOOKING_STATUS_LABELS } from '../../../../shared/models/booking.model';
import { Service } from '../../../../shared/models/service.model';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">لوحة الإحصائيات</h1>
          <p class="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">نظرة عامة على حجوزاتك وأداء الخدمات</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div class="text-3xl mb-2">📊</div>
            <div class="text-3xl font-bold text-gray-900 dark:text-white">{{ totalBookings() }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">إجمالي الحجوزات</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div class="text-3xl mb-2">⏳</div>
            <div class="text-3xl font-bold text-yellow-600">{{ pendingCount() }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">قيد الانتظار</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div class="text-3xl mb-2">✅</div>
            <div class="text-3xl font-bold text-emerald-600">{{ confirmedCount() }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">مؤكد</div>
          </div>
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div class="text-3xl mb-2">❌</div>
            <div class="text-3xl font-bold text-red-600">{{ cancelledCount() }}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">ملغى</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">حالة الحجوزات</h2>
            <div class="space-y-4">
              @for (stat of statusStats(); track stat.status) {
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ stat.label }}</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ stat.count }}</span>
                  </div>
                  <div class="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-500"
                      [class.bg-yellow-500]="stat.status === 'pending'"
                      [class.bg-emerald-500]="stat.status === 'confirmed'"
                      [class.bg-red-500]="stat.status === 'cancelled'"
                      [style.width.%]="stat.percentage"
                    ></div>
                  </div>
                </div>
              }
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">الخدمات الأكثر حجزاً</h2>
            <div class="space-y-3">
              @for (service of topServices(); track service.id) {
                <div class="flex items-center gap-3">
                  <img [src]="service.image" class="w-12 h-12 rounded-lg object-cover" [alt]="service.title" />
                  <div class="flex-1">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ service.title }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ service.count }} حجز</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">اتجاه الحجوزات الشهرية</h2>
            <div class="flex items-end gap-2 h-40">
              @for (month of monthlyBookings(); track month.month) {
                <div class="flex-1 flex flex-col items-center gap-1">
                  <div
                    class="w-full bg-primary-500 rounded-t transition-all duration-500 hover:bg-primary-600"
                    [style.height.%]="month.percentage"
                    [title]="month.count + ' حجز'"
                  ></div>
                  <span class="text-xs text-gray-500 dark:text-gray-400">{{ month.label }}</span>
                </div>
              }
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4">توزيع أنواع الخدمات</h2>
            <div class="flex items-center gap-6">
              <div
                class="w-32 h-32 rounded-full"
                [style.background]="serviceTypeDistribution().gradient"
              ></div>
              <div class="flex-1 space-y-2">
                @for (type of serviceTypeDistribution().types; track type.name) {
                  <div class="flex items-center gap-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      [style.background-color]="type.color"
                    ></div>
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ type.label }}</span>
                    <span class="text-sm font-bold text-gray-900 dark:text-white">{{ type.percentage }}%</span>
                  </div>
                }
              </div>
            </div>
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
export class DashboardPageComponent {
  private readonly bookingService = inject(BookingService);

  readonly bookings = this.bookingService.bookings;
  readonly services = this.bookingService.services;

  readonly totalBookings = computed(() => this.bookings().length);

  readonly pendingCount = computed(() =>
    this.bookings().filter((b: Booking) => b.status === 'pending').length
  );

  readonly confirmedCount = computed(() =>
    this.bookings().filter((b: Booking) => b.status === 'confirmed').length
  );

  readonly cancelledCount = computed(() =>
    this.bookings().filter((b: Booking) => b.status === 'cancelled').length
  );

  readonly statusStats = computed(() => {
    const total = this.totalBookings();
    const statuses: BookingStatus[] = ['pending', 'confirmed', 'cancelled'];
    return statuses.map((status: BookingStatus) => {
      const count = this.bookings().filter((b: Booking) => b.status === status).length;
      return {
        status,
        label: BOOKING_STATUS_LABELS[status],
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      };
    });
  });

  readonly topServices = computed(() => {
    const serviceCounts = new Map<string, number>();
    this.bookings().forEach((b: Booking) => {
      serviceCounts.set(b.serviceId, (serviceCounts.get(b.serviceId) ?? 0) + 1);
    });

    return this.services()
      .map((s: Service) => ({
        ...s,
        count: serviceCounts.get(s.id) ?? 0,
      }))
      .filter((s: Service & { count: number }) => s.count > 0)
      .sort((a: Service & { count: number }, b: Service & { count: number }) => b.count - a.count)
      .slice(0, 5);
  });

  readonly monthlyBookings = computed(() => {
    const months = [
      { month: 0, label: 'يناير', count: 0 },
      { month: 1, label: 'فبراير', count: 0 },
      { month: 2, label: 'مارس', count: 0 },
      { month: 3, label: 'أبريل', count: 0 },
      { month: 4, label: 'مايو', count: 0 },
      { month: 5, label: 'يونيو', count: 0 },
    ];

    const currentYear = new Date().getFullYear();
    this.bookings().forEach((b: Booking) => {
      const date = new Date(b.createdAt);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (monthIndex < 6) {
          months[monthIndex].count++;
        }
      }
    });

    const maxCount = Math.max(...months.map((m) => m.count), 1);
    return months.map((m) => ({
      ...m,
      percentage: (m.count / maxCount) * 100,
    }));
  });

  readonly serviceTypeDistribution = computed(() => {
    const typeCounts = new Map<string, number>();
    this.bookings().forEach((b: Booking) => {
      const service = this.services().find((s) => s.id === b.serviceId);
      if (service) {
        typeCounts.set(service.type, (typeCounts.get(service.type) ?? 0) + 1);
      }
    });

    const total = this.bookings().length;
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const labels: Record<string, string> = {
      hotel: 'فنادق',
      transport: 'نقل',
      food: 'مطاعم',
      visa: 'تأشيرات',
    };

    const types = Array.from(typeCounts.entries()).map(([name, count], index) => ({
      name,
      label: labels[name] || name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: colors[index % colors.length],
    }));

    let gradient = '#E5E7EB';
    if (types.length > 0) {
      const segments = types.map((t, i) => {
        const start = i * (100 / types.length);
        const end = (i + 1) * (100 / types.length);
        return `${t.color} ${start}% ${end}%`;
      });
      gradient = `conic-gradient(${segments.join(', ')})`;
    }

    return { types, gradient };
  });
}
