import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Auth} from '../core/services/authentification/auth';
import {NotificationService} from '../core/services/notification/notification.service';

export const utilisateurGuard: CanActivateFn = (route, state) => {

  const authService = inject(Auth)



  if(authService.jwtInfo() == null) {
    const router = inject(Router);
    return router.parseUrl('/login')
    console.log(authService.jwtInfo())
  }

  if(authService.jwtInfo()?.role != 'Étudiant' && authService.jwtInfo()?.role != 'Enseignant' && authService.jwtInfo()?.role != 'Administrateur') {
   const notification = inject(NotificationService);
   notification.error("Vous n'avez pas accès à cette page")
  }
  return true;
};
