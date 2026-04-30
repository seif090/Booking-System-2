import { Component, inject } from '@angular/core';
import { BookingService } from '../../services/booking.service';
import { Booking, BookingStatus } from '../../../../shared/models/booking.model';

type FilterTab = '' | BookingStatus;

interface FilterTabItem {
  value: FilterTab;
  label: string;
  count: number;
}

@Component({
  selector: 'app-booking-filter',
  standalone: true,
  template: `
    <div class="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-x-auto">
      @for (tab of tabs; track tab.value) {
        <button
          (click)="setFilter(tab.value)"
          class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all"
          [class.bg-white]="activeFilter === tab.value"
          [class.shadow-sm]="activeFilter === tab.value"
          [class.text-gray-700]="activeFilter === tab.value"
          [class.text-gray-500]="activeFilter !== tab.value"
          [class.dark:bg-gray-600]="activeFilter === tab.value"
          [class.dark:text-white]="activeFilter === tab.value"
          [class.dark:text-gray-300]="activeFilter !== tab.value"
        >
          {{ tab.label }}
          @if (tab.count > 0) {
            <span
              class="mr-1.5 inline-flex items-center justify-center w-5 h-5 rounded-full text-xs"
              [class.bg-gray-200]="activeFilter === tab.value"
              [class.bg-gray-100]="activeFilter !== tab.value"
              [class.dark:bg-gray-500]="activeFilter === tab.value"
              [class.dark:bg-gray-600]="activeFilter !== tab.value"
            >{{ tab.count }}</span>
          }
        </button>
      }
    </div>
  `,
})
export class BookingFilterComponent {
  private readonly bookingService = inject(BookingService);

  get activeFilter(): FilterTab {
    return this.bookingService.bookingsFilter();
  }

  get tabs(): FilterTabItem[] {
    const all: Booking[] = this.bookingService.bookings();
    return [
      { value: '', label: 'الكل', count: all.length },
      { value: 'pending', label: 'قيد الانتظار', count: all.filter((b: Booking) => b.status === 'pending').length },
      { value: 'confirmed', label: 'مؤكد', count: all.filter((b: Booking) => b.status === 'confirmed').length },
      { value: 'cancelled', label: 'ملغى', count: all.filter((b: Booking) => b.status === 'cancelled').length },
    ];
  }

  setFilter(value: FilterTab): void {
    this.bookingService.setBookingsFilter(value);
  }
}
