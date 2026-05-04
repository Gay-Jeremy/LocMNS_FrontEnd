import { TestBed } from '@angular/core/testing';

import { StatutEmprunt } from './statut-emprunt';

describe('StatutEmprunt', () => {
  let service: StatutEmprunt;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutEmprunt);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
