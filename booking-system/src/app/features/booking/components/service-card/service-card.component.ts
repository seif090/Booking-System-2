import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Service, SERVICE_TYPE_LABELS } from '../../../../shared/models/service.model';

@Component({
  selector: 'app-service-card',
  standalone: true,
  template: `
    <div class="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full">
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
      </div>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="text-lg font-bold text-gray-900 mb-2 leading-tight">{{ service.title }}</h3>
        <p class="text-sm text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-2">{{ service.description }}</p>
        <button
          (click)="bookClick.emit(service.id)"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors duration-200 text-sm"
        >
          احجز الآن
        </button>
      </div>
    </div>
  `,
})
export class ServiceCardComponent {
  @Input({ required: true }) service!: Service;
  @Output() bookClick = new EventEmitter<string>();

  get typeLabel(): string {
    return SERVICE_TYPE_LABELS[this.service.type] ?? this.service.type;
  }
}
