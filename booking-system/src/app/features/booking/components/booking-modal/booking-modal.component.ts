import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service, SERVICE_TYPE_LABELS } from '../../../../shared/models/service.model';
import { BookingService } from '../../services/booking.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    @if (service) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        (click)="closeClick.emit()"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in"
          (click)="$event.stopPropagation()"
        >
          <div class="relative h-40">
            <img [src]="service.image" class="w-full h-full object-cover" [alt]="service.title" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div class="absolute bottom-3 right-4 text-white">
              <h3 class="text-lg font-bold">{{ service.title }}</h3>
              <p class="text-xs opacity-90">{{ typeLabel }}</p>
            </div>
            <button
              (click)="closeClick.emit()"
              class="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/40 flex items-center justify-center text-lg leading-none transition-colors"
            >
              &times;
            </button>
          </div>

          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">الاسم الكامل <span class="text-red-500">*</span></label>
              <input
                formControlName="userName"
                type="text"
                placeholder="أدخل اسمك"
                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
              @if (f.userName.invalid && f.userName.touched) {
                <p class="text-xs text-red-500 mt-1">الاسم مطلوب (حرفين على الأقل)</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف <span class="text-red-500">*</span></label>
              <input
                formControlName="phone"
                type="tel"
                placeholder="05xxxxxxxx"
                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
              />
              @if (f.phone.invalid && f.phone.touched) {
                <p class="text-xs text-red-500 mt-1">أدخل رقم هاتف سعودي صحيح (05xxxxxxxx)</p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">ملاحظات (اختياري)</label>
              <textarea
                formControlName="notes"
                rows="3"
                placeholder="أي ملاحظات إضافية..."
                class="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
              ></textarea>
            </div>

            <button
              type="submit"
              [disabled]="form.invalid || isLoading"
              class="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              @if (isLoading) {
                <span class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                جاري التأكيد...
              } @else {
                تأكيد الحجز
              }
            </button>
          </form>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .animate-scale-in {
        animation: scaleIn 0.3s ease-out;
      }
      @keyframes scaleIn {
        from {
          opacity: 0;
          transform: scale(0.95);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }
    `,
  ],
})
export class BookingModalComponent {
  @Input({ required: true }) service!: Service;
  @Output() closeClick = new EventEmitter<void>();
  @Output() booked = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingService);
  private readonly toast = inject(ToastService);

  isLoading = false;

  form = this.fb.group({
    userName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^05[0-9]{8}$/)]],
    notes: [''],
  });

  get f() {
    return this.form.controls;
  }

  get typeLabel(): string {
    return SERVICE_TYPE_LABELS[this.service.type] ?? this.service.type;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.bookingService.createBooking({
        serviceId: this.service.id,
        userName: this.form.value.userName!,
        phone: this.form.value.phone!,
        notes: this.form.value.notes ?? '',
      });
      this.toast.show('تم إنشاء الحجز بنجاح!', 'success');
      this.isLoading = false;
      this.booked.emit();
    }, 600);
  }
}
