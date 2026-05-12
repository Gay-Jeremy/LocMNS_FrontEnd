import { TestBed } from '@angular/core/testing';

import { StatutMaterielService } from './statut-materiel.service';

describe('StatutMaterielService', () => {
  let service: StatutMaterielService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatutMaterielService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
