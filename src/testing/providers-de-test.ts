import { EnvironmentProviders, Provider } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

/**
 * Dépendances communes aux tests de composants :
 * routeur vide, client HTTP simulé (aucune requête réelle) et notifications.
 */
export const providersDeTest: (Provider | EnvironmentProviders)[] = [
  provideRouter([]),
  provideHttpClient(),
  provideHttpClientTesting(),
  provideToastr(),
];
