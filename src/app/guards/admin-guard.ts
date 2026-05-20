import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../core/services/authentification/auth';
import {NotificationService} from '../core/services/notification/notification.service';

export const adminGuard: CanActivateFn = (route, state) => {

  const authService = inject(Auth)

  if(authService.jwtInfo()?.role != 'Administrateur') {
    const router = inject(Router);
    const notification = inject(NotificationService);
    notification.error("Vous n'avez pas accès à cette page");
    return router.parseUrl('/accueil')
  }

  return true;
};
