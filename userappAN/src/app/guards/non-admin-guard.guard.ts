import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../token/token.service';

export const nonAdminGuardGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);

  if (!tokenService.isAuthenticated()) {
    console.warn('🚫 No token found! Redirecting to login...');
    router.navigate(['/login']);
    return false;
  }

  const userRoles = tokenService.getUserRoles();
  console.log('🔍 Extracted Roles:', userRoles);

  if (!userRoles.includes('ADMIN')) {
    console.log('✅ Non-admin access granted');
    return true;
  } else {
    console.warn('🚷 Admins cannot access this page! Redirecting...');
    router.navigate(['/profile', tokenService.getUserId()]);
    return false;
  }
};
