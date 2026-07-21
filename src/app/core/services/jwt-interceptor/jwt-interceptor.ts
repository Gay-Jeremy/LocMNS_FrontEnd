import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {catchError, EMPTY, throwError} from 'rxjs';
import {AuthService} from '../authentification/auth.service';
import {NotificationService} from '../notification/notification.service';


export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const notifications = inject(NotificationService);

  const jwt = localStorage.getItem('jwt');
  if (jwt) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${jwt}` }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const estRequeteLogin = req.url.includes('/api/login');

      if (error.status === 401 && !estRequeteLogin) {
        authService.logout();
        router.navigate(['/login']);
        notifications.info('Session expirée, veuillez vous reconnecter');
        return EMPTY; // erreur traitée ici : on ne la propage pas plus loin
      }

      return throwError(() => error);
    })
  );
};
