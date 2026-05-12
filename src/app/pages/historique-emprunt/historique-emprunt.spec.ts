import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueEmprunt } from './historique-emprunt';

describe('HistoriqueEmprunt', () => {
  let component: HistoriqueEmprunt;
  let fixture: ComponentFixture<HistoriqueEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueEmprunt],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoriqueEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
