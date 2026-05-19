import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';

export const userGuard: CanActivateFn = (route, state) => {

  if(localStorage.getItem('jwt')==null) {
    const router = inject(Router)
    return router.parseUrl(('/login'))
  }

  return true;
};
