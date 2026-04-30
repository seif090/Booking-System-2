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
    path: 'my-bookings',
    loadComponent: () =>
      import('./features/booking/pages/my-bookings-page/my-bookings-page.component').then(
        (m) => m.MyBookingsPageComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
