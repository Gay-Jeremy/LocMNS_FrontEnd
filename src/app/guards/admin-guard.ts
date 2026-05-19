import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../core/services/authentification/auth';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(Auth)

  if(authService.jwtInfo()?.role != 'Administrateur') {
    const router = inject(Router);
    return router.parseUrl('/login')
  }

  return true;
};
