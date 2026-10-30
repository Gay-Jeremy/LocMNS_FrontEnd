import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { StatutEmpruntService, versAction } from './statut-emprunt.service';
import { providersDeTest } from '../../../../testing/providers-de-test';

describe('StatutEmpruntService', () => {
  let service: StatutEmpruntService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: providersDeTest });
    service = TestBed.inject(StatutEmpruntService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('versAction remplace le libellé d\'état par le texte de l\'action', () => {
    expect(versAction({ id: 3, libelle: 'Accepté', code: 'ACCEPTE' }).libelle).toBe('Accepter');
    expect(versAction({ id: 2, libelle: 'Refusé', code: 'REFUSE' }).libelle).toBe('Refuser');
  });

  it('versAction garde le libellé d\'origine pour un code inconnu', () => {
    expect(versAction({ id: 99, libelle: 'Autre', code: 'INCONNU' }).libelle).toBe('Autre');
  });

  it('la liste des décisions contient les libellés d\'action, avec le même code', () => {
    service.obtenirListeStatutEmpruntsDecision().subscribe();

    http.expectOne((req) => req.url.endsWith('statuts_emprunt/liste/decision')).flush([
      { id: 3, libelle: 'Accepté', code: 'ACCEPTE' },
      { id: 2, libelle: 'Refusé', code: 'REFUSE' },
    ]);

    expect(service.listeStatutEmpruntDecision()).toEqual([
      { id: 3, libelle: 'Accepter', code: 'ACCEPTE' },
      { id: 2, libelle: 'Refuser', code: 'REFUSE' },
    ]);
  });
});
