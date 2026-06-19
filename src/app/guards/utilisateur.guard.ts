import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../core/services/authentification/auth.service';
import {NotificationService} from '../core/services/notification/notification.service';

export const utilisateurGuard: CanActivateFn = () => {

  const authService = inject(AuthService)

  if(authService.jwtInfo() == null) {
    const router = inject(Router);
    const notification = inject(NotificationService);
    notification.warning('Veuillez vous connecter pour accéder à cette page');
    return router.parseUrl('/login')
  }
  if(authService.jwtInfo()?.role != 'Étudiant'
    && authService.jwtInfo()?.role != 'Enseignant'
    && authService.jwtInfo()?.role != 'Administrateur') {
    const router = inject(Router);
    const notification = inject(NotificationService);
    notification.error("Vous n'avez pas accès à cette page");
    return router.parseUrl('/accueil')
  }
  return true;
};
