import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMateriel } from './liste-materiel';

describe('ListeMateriel', () => {
  let component: ListeMateriel;
  let fixture: ComponentFixture<ListeMateriel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMateriel],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeMateriel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
