import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMateriel } from './liste-materiel';
import { providersDeTest } from '../../../testing/providers-de-test';

describe('ListeMateriel', () => {
  let component: ListeMateriel;
  let fixture: ComponentFixture<ListeMateriel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMateriel],
      providers: providersDeTest,
    }).compileComponents();

    fixture = TestBed.createComponent(ListeMateriel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
