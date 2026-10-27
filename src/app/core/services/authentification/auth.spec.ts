import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth.service';
import { providersDeTest } from '../../../../testing/providers-de-test';

/** Fabrique un JWT de test (seule la partie centrale, le contenu, est lue côté front). */
function fabriquerJwt(contenu: object): string {
  const base64Url = btoa(JSON.stringify(contenu))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  return `entete.${base64Url}.signature`;
}

describe('AuthService', () => {
  let httpMock: HttpTestingController;

  const creerService = () => {
    const service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    return service;
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: providersDeTest });
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('sans jeton stocké, aucun utilisateur n\'est connecté', () => {
    const service = creerService();

    expect(service.jwtInfo()).toBeNull();
    expect(service.isAdmin()).toBe(false);
  });

  it('décode le jeton stocké, reconnaît un administrateur et charge son profil', () => {
    localStorage.setItem('jwt', fabriquerJwt({ sub: 'jean.dupont@locmns.fr', id: 1, role: 'Administrateur' }));

    const service = creerService();

    expect(service.jwtInfo()?.sub).toBe('jean.dupont@locmns.fr');
    expect(service.isAdmin()).toBe(true);

    httpMock
      .expectOne((req) => req.url.endsWith('/api/utilisateurs/1'))
      .flush({ id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean.dupont@locmns.fr' });
    expect(service.utilisateurCourant()?.nom).toBe('Dupont');
  });

  it('login enregistre le jeton reçu et met à jour la session', () => {
    const service = creerService();
    const jwt = fabriquerJwt({ sub: 'lucas.bernard@locmns.fr', id: 3, role: 'Étudiant' });

    service.login({ email: 'lucas.bernard@locmns.fr', password: 'motdepasse' }).subscribe();
    httpMock.expectOne((req) => req.url.endsWith('/api/login')).flush(jwt);

    expect(localStorage.getItem('jwt')).toBe(jwt);
    expect(service.jwtInfo()?.role).toBe('Étudiant');
    expect(service.isAdmin()).toBe(false);
    httpMock.expectOne((req) => req.url.endsWith('/api/utilisateurs/3')).flush({});
  });

  it('logout efface le jeton et la session', () => {
    localStorage.setItem('jwt', fabriquerJwt({ sub: 'lucas.bernard@locmns.fr', id: 3, role: 'Étudiant' }));
    const service = creerService();
    httpMock.expectOne((req) => req.url.endsWith('/api/utilisateurs/3')).flush({});

    service.logout();

    expect(localStorage.getItem('jwt')).toBeNull();
    expect(service.jwtInfo()).toBeNull();
    expect(service.utilisateurCourant()).toBeNull();
  });

  it('un jeton corrompu ne bloque pas l\'application : la session est vidée', () => {
    localStorage.setItem('jwt', 'jeton.illisible');

    const service = creerService();

    expect(service.jwtInfo()).toBeNull();
    expect(localStorage.getItem('jwt')).toBeNull();
  });
});
