import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TokenService } from '../token/token.service';

export const connectedGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService); 
  const router = inject(Router); 

  if (tokenService.isAuthenticated()) {
    return true; 
  } else {
    router.navigate(['/login']); 
    return false; 
  }
};