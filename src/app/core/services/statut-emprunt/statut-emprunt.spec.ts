import { TestBed } from '@angular/core/testing';

import { StatutEmpruntService } from './statut-emprunt.service';

describe('StatutEmpruntService', () => {
  let service: StatutEmpruntService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutEmpruntService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
