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
        <button
          (click)="$event.stopPropagation(); toggleFavorite()"
          class="absolute bottom-3 left-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-gray-700 transition-colors shadow-sm"
          [title]="isFavorite() ? 'إزالة من المفضلة' : 'إضافة للمفضلة'"
        >
          <span class="text-xl">{{ isFavorite() ? '❤️' : '🤍' }}</span>
        </button>
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">{{ service.title }}</h3>
        @if (service.location) {
          <p class="text-xs text-gray-400 dark:text-gray-500 mb-2 flex items-center gap-1">
            <span>📍</span>
            <span>{{ service.location }}</span>
          </p>
        }
        <p class="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-2">{{ service.description }}</p>
        <div class="flex items-center justify-between gap-3">
          <div class="flex-1">
            <span class="text-2xl font-bold text-primary-600">{{ service.price }}</span>
            <span class="text-sm text-gray-500 dark:text-gray-400">ر.س</span>
          </div>
          <button
            (click)="$event.stopPropagation(); bookClick.emit(service.id)"
            class="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-sm"
          >
            احجز الآن
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;
  @Output() bookClick = new EventEmitter<string>();
  @Output() detailsClick = new EventEmitter<string>();

  private readonly bookingService = inject(BookingService);

  get typeLabel(): string {
    return SERVICE_TYPE_LABELS[this.service.type] ?? this.service.type;
  }

  isFavorite(): boolean {
    return this.bookingService.isFavorite(this.service.id);
  }

  toggleFavorite(): void {
    this.bookingService.toggleFavorite(this.service.id);
  }
}
