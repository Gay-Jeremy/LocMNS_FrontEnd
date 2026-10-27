import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEmprunt } from './liste-emprunt';
import { providersDeTest } from '../../../testing/providers-de-test';

describe('ListeEmprunt', () => {
  let component: ListeEmprunt;
  let fixture: ComponentFixture<ListeEmprunt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeEmprunt],
      providers: providersDeTest,
    }).compileComponents();

    fixture = TestBed.createComponent(ListeEmprunt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
