import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-40 transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-2">
              <span class="text-2xl">🏨</span>
              <span class="font-bold text-xl text-gray-900 dark:text-white hidden sm:inline">نظام الحجز</span>
            </a>
            <nav class="flex items-center gap-1">
              <a
                routerLink="/"
                routerLinkActive="text-primary-600 bg-primary-50 dark:bg-primary-900/30"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                الخدمات
              </a>
              <a
                routerLink="/dashboard"
                routerLinkActive="text-primary-600 bg-primary-50 dark:bg-primary-900/30"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                الإحصائيات
              </a>
              <a
                routerLink="/my-bookings"
                routerLinkActive="text-primary-600 bg-primary-50 dark:bg-primary-900/30"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                حجوزاتي
              </a>
              <button
                (click)="themeService.toggle()"
                class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="تبديل الوضع الليلي"
              >
                @if (themeService.isDark()) {
                  <span class="text-xl">☀️</span>
                } @else {
                  <span class="text-xl">🌙</span>
                }
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-white dark:bg-gray-800 border-t dark:border-gray-700 mt-auto transition-colors duration-300">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          نظام الحجز - Booking System © 2024
        </div>
      </footer>

      <app-toast></app-toast>
    </div>
  `,
})
export class AppComponent {
  readonly themeService = inject(ThemeService);
}
