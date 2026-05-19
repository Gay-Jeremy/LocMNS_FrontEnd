import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { utilisateurGuard } from './utilisateur-guard';

describe('utilisateurGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => utilisateurGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
