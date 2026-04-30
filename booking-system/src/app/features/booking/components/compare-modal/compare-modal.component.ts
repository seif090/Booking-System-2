import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Service } from '../../../../shared/models/service.model';

@Component({
  selector: 'app-compare-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">مقارنة الخدمات</h2>
          <button
            (click)="closeClick.emit()"
            class="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span class="text-2xl">×</span>
          </button>
        </div>
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          @if (services.length === 0) {
            <div class="text-center py-12">
              <div class="text-6xl mb-4">📊</div>
              <p class="text-gray-500 dark:text-gray-400">اختر خدمات للمقارنة</p>
            </div>
          } @else {
            <div class="grid grid-cols-{{ services.length }} gap-6">
              @for (service of services; track service.id) {
                <div class="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                  <div class="aspect-video rounded-lg overflow-hidden mb-4">
                    <img [src]="service.image" class="w-full h-full object-cover" [alt]="service.title" />
                  </div>
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">{{ service.title }}</h3>
                  <div class="space-y-3">
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">السعر:</span>
                      <div class="text-2xl font-bold text-primary-600">{{ service.price }} ر.س</div>
                    </div>
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">النوع:</span>
                      <div class="font-medium text-gray-900 dark:text-white">{{ service.type }}</div>
                    </div>
                    @if (service.rating) {
                      <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">التقييم:</span>
                        <div class="flex items-center gap-1">
                          <span class="text-yellow-400">{{ getStarRating(service.rating) }}</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ service.rating }}</span>
                        </div>
                      </div>
                    }
                    @if (service.location) {
                      <div>
                        <span class="text-sm text-gray-500 dark:text-gray-400">الموقع:</span>
                        <div class="font-medium text-gray-900 dark:text-white">{{ service.location }}</div>
                      </div>
                    }
                    <div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">الوصف:</span>
                      <p class="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{{ service.description }}</p>
                    </div>
                  </div>
                  <button
                    (click)="bookService(service.id)"
                    class="w-full mt-4 py-3 rounded-xl font-bold bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                  >
                    احجز هذه الخدمة
                  </button>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class CompareModalComponent {
  @Input() services: Service[] = [];
  @Output() closeClick = new EventEmitter<void>();
  @Output() bookClick = new EventEmitter<string>();

  getStarRating(rating: number): string {
    return '⭐'.repeat(Math.round(rating));
  }

  bookService(serviceId: string): void {
    this.bookClick.emit(serviceId);
  }
}
