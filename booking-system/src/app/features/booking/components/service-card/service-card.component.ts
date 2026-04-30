import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Service, SERVICE_TYPE_LABELS } from '../../../../shared/models/service.model';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-service-card',
  standalone: true,
  template: `
    <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col h-full cursor-pointer" (click)="detailsClick.emit(service.id)">
      <div class="relative overflow-hidden aspect-[16/10]">
        <img
          [src]="service.image"
          [alt]="service.title"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <span class="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-black/40 backdrop-blur-sm">
          {{ typeLabel }}
        </span>
        @if (service.rating) {
          <div class="absolute top-3 left-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white bg-black/40 backdrop-blur-sm">
            <span>⭐</span>
            <span>{{ service.rating }}</span>
          </div>
        }
        <div class="absolute top-3 left-3 flex gap-2">
          <button
            (click)="$event.stopPropagation(); toggleFavorite()"
            class="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            title="أضف للمفضلة"
          >
            <span class="text-xl">{{ isFav ? '❤️' : '🤍' }}</span>
          </button>
          <button
            (click)="$event.stopPropagation(); toggleCompare()"
            class="p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors shadow-sm"
            title="أضف للمقارنة"
          >
            <span class="text-xl">{{ isComparing ? '📊' : '📈' }}</span>
          </button>
        </div>
        <button
          (click)="$event.stopPropagation(); bookClick.emit(service.id)"
          class="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          title="احجز الآن"
        >
          <span class="text-lg">احجز</span>
        </button>
      </div>
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex items-start justify-between gap-2 mb-2">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{{ service.title }}</h3>
          @if (service.rating) {
            <div class="flex items-center gap-1 text-sm">
              <span>⭐</span>
              <span class="font-medium">{{ service.rating }}</span>
            </div>
          }
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{{ service.description }}</p>
        <div class="mt-auto flex items-center justify-between">
          <div>
            <span class="text-2xl font-bold text-primary-600">{{ service.price }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">ر.س</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;
  @Input() isComparing = false;
  @Output() bookClick = new EventEmitter<string>();
  @Output() compareToggle = new EventEmitter<{ id: string; selected: boolean }>();
  @Output() detailsClick = new EventEmitter<string>();

  private readonly bookingService = inject(BookingService);

  get typeLabel(): string {
    return SERVICE_TYPE_LABELS[this.service.type] ?? this.service.type;
  }

  get isFav(): boolean {
    return this.bookingService.isFavorite(this.service.id);
  }

  toggleFavorite(): void {
    this.bookingService.toggleFavorite(this.service.id);
  }

  toggleCompare(): void {
    this.compareToggle.emit({ id: this.service.id, selected: !this.isComparing });
  }
}
