import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" (click)="cancelClick.emit()">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-in" (click)="$event.stopPropagation()">
        <div class="p-6 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
            <span class="text-3xl">⚠️</span>
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ title }}</h3>
          <p class="text-gray-500 mb-6">{{ message }}</p>
          <div class="flex gap-3">
            <button
              (click)="cancelClick.emit()"
              class="flex-1 py-2.5 px-4 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              إلغاء
            </button>
            <button
              (click)="confirmClick.emit()"
              class="flex-1 py-2.5 px-4 rounded-xl font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
            >
              تأكيد
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .animate-fade-in {
        animation: fadeIn 0.2s ease-out;
      }
      .animate-scale-in {
        animation: scaleIn 0.2s ease-out;
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
    `,
  ],
})
export class ConfirmModalComponent {
  @Input() title = 'تأكيد الإجراء';
  @Input() message = 'هل أنت متأكد من هذا الإجراء؟';
  @Output() confirmClick = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();
}
