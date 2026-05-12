import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMateriel } from './form-materiel';

describe('FormMateriel', () => {
  let component: FormMateriel;
  let fixture: ComponentFixture<FormMateriel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMateriel],
    }).compileComponents();

    fixture = TestBed.createComponent(FormMateriel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
