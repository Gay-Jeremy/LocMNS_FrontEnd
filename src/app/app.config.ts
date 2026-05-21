import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/services/jwt-interceptor/jwt-interceptor';
import { httpErrorInterceptor } from './core/services/notification/http-error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor, httpErrorInterceptor])),
    provideToastr({
      timeOut: 4000,
      extendedTimeOut: 1000,
      closeButton: true,
      progressBar: true,
      preventDuplicates: true,
      positionClass: 'toast-top-right',
      newestOnTop: true,
    }),
  ],
};
