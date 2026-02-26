import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AdminAuthService } from './admin-auth.service';

export const adminGuard = () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree(['/login']);
};
