import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/booking/pages/marketplace-page/marketplace-page.component').then(
        (m) => m.MarketplacePageComponent
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/booking/pages/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
  },
  {
    path: 'service/:id',
    loadComponent: () =>
      import('./features/booking/pages/service-details-page/service-details-page.component').then(
        (m) => m.ServiceDetailsPageComponent
      ),
  },
  {
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/booking/pages/my-bookings-page/my-bookings-page.component').then(
        (m) => m.MyBookingsPageComponent
      ),
  },
  {
    path: 'my-bookings/:id',
    loadComponent: () =>
      import('./features/booking/pages/booking-details-page/booking-details-page.component').then(
        (m) => m.BookingDetailsPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
