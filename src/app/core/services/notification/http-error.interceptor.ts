import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { Auth } from '../authentification/auth';
import { NotificationService } from './notification.service';

function isLoginRequest(url: string): boolean {
  return url.includes('/login');
}

function shouldNotifyGlobally(error: HttpErrorResponse, url: string): boolean {
  if (isLoginRequest(url)) {
    return false;
  }
  if (error.status === 400) {
    return false;
  }
  return error.status === 0 || error.status === 401 || error.status === 403 || error.status >= 500;
}

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const router = inject(Router);
  const auth = inject(Auth);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error instanceof HttpErrorResponse && shouldNotifyGlobally(error, req.url)) {
        notification.fromHttpError(error);

        if (error.status === 401) {
          localStorage.removeItem('jwt');
          auth.jwtInfo.set(null);
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    }),
  );
};
