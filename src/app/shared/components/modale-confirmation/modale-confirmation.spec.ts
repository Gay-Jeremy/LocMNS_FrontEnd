import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModaleConfirmation } from './modale-confirmation';

describe('ModaleConfirmation', () => {
  let component: ModaleConfirmation;
  let fixture: ComponentFixture<ModaleConfirmation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModaleConfirmation],
    }).compileComponents();

    fixture = TestBed.createComponent(ModaleConfirmation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
