import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormEmprunt } from './form-emprunt';
import { providersDeTest } from '../../../testing/providers-de-test';

describe('FormEmprunt', () => {
  let component: FormEmprunt;
  let fixture: ComponentFixture<FormEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormEmprunt],
      providers: providersDeTest,
    }).compileComponents();

    fixture = TestBed.createComponent(FormEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
