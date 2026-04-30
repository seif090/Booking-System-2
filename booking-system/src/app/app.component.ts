import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-gray-50">
      <header class="bg-white shadow-sm sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <a routerLink="/" class="flex items-center gap-2">
              <span class="text-2xl">🏨</span>
              <span class="font-bold text-xl text-gray-900 hidden sm:inline">نظام الحجز</span>
            </a>
            <nav class="flex items-center gap-1">
              <a
                routerLink="/"
                routerLinkActive="text-primary-600 bg-primary-50"
                [routerLinkActiveOptions]="{ exact: true }"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                الخدمات
              </a>
              <a
                routerLink="/my-bookings"
                routerLinkActive="text-primary-600 bg-primary-50"
                class="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                حجوزاتي
              </a>
            </nav>
          </div>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>

      <footer class="bg-white border-t mt-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-gray-500">
          نظام الحجز - Booking System © 2024
        </div>
      </footer>

      <app-toast></app-toast>
    </div>
  `,
})
export class AppComponent {}
