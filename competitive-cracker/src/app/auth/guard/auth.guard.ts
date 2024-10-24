import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log('is logged??', authService.isAuthenticated());
  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/auth/login']);
  return false;
  return true;
};
