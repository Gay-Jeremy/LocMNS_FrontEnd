import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';

import { adminGuard } from './admin.guard';
import { AuthService } from '../core/services/authentification/auth.service';
import { providersDeTest } from '../../testing/providers-de-test';

describe('adminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => adminGuard(...guardParameters));

  const lancer = () => executeGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot);

  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: providersDeTest });
    auth = TestBed.inject(AuthService);
  });

  it('redirige vers /login si personne n\'est connecté', () => {
    auth.jwtInfo.set(null);

    const resultat = lancer();

    expect(resultat).toBeInstanceOf(UrlTree);
    expect(resultat.toString()).toBe('/login');
  });

  it('redirige un étudiant vers /accueil', () => {
    auth.jwtInfo.set({ sub: 'lucas.bernard@locmns.fr', id: '3', role: 'Étudiant' });

    expect(lancer().toString()).toBe('/accueil');
  });

  it('laisse passer un administrateur', () => {
    auth.jwtInfo.set({ sub: 'jean.dupont@locmns.fr', id: '1', role: 'Administrateur' });

    expect(lancer()).toBe(true);
  });
});
