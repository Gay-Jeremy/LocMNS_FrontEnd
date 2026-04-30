import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeIncident } from './liste-incident';

describe('ListeIncident', () => {
  let component: ListeIncident;
  let fixture: ComponentFixture<ListeIncident>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeIncident],
    }).compileComponents();

    fixture = TestBed.createComponent(ListeIncident);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
