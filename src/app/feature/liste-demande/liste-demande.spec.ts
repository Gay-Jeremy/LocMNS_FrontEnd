import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDemande } from './liste-demande';

describe('ListeDemande', () => {
  let component: ListeDemande;
  let fixture: ComponentFixture<ListeDemande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeDemande],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeDemande);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
