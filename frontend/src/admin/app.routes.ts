import { Routes } from '@angular/router';
import { adminGuard } from './admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [adminGuard],
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: 'login' }
];
