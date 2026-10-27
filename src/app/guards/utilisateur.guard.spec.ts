import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';

import { utilisateurGuard } from './utilisateur.guard';
import { AuthService } from '../core/services/authentification/auth.service';
import { providersDeTest } from '../../testing/providers-de-test';

describe('utilisateurGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => utilisateurGuard(...guardParameters));

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

  it.each(['Étudiant', 'Enseignant', 'Administrateur'])('laisse passer le rôle %s', (role) => {
    auth.jwtInfo.set({ sub: 'test@locmns.fr', id: '1', role });

    expect(lancer()).toBe(true);
  });

  it('redirige un rôle inconnu vers /accueil', () => {
    auth.jwtInfo.set({ sub: 'test@locmns.fr', id: '1', role: 'Inconnu' });

    expect(lancer().toString()).toBe('/accueil');
  });
});
