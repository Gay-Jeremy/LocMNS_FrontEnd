import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEmprunt } from './list-emprunt';

describe('ListEmprunt', () => {
  let component: ListEmprunt;
  let fixture: ComponentFixture<ListEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListEmprunt],
    }).compileComponents();

    fixture = TestBed.createComponent(ListEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
