import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'markets', pathMatch: 'full' },
  {
    path: 'markets',
    loadComponent: () => import('./components/market-list.component').then(m => m.MarketListComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'my-orders',
    loadComponent: () => import('./components/my-orders.component').then(m => m.MyOrdersComponent)
  },
  { path: '**', redirectTo: 'markets' }
];
