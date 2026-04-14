import { TestBed } from '@angular/core/testing';

import { CategorieModeleService } from './categorie-modele.service';

describe('CategorieModeleService', () => {
  let service: CategorieModeleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategorieModeleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
