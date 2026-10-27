import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { NotificationService } from './core/services/notification/notification.service';
import { providersDeTest } from '../testing/providers-de-test';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: providersDeTest,
    }).compileComponents();
  });

  it('crée l\'application', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('n\'affiche pas la modale de confirmation par défaut', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('app-modale-confirmation')).toBeNull();
  });

  it('affiche la modale quand une confirmation est demandée, puis la ferme après réponse', async () => {
    const fixture = TestBed.createComponent(App);
    const notification = TestBed.inject(NotificationService);
    const element = fixture.nativeElement as HTMLElement;

    const reponse = notification.confirm('Supprimer ce matériel ?', 'Suppression');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('app-modale-confirmation')).not.toBeNull();

    notification.onConfirmer();
    await expect(reponse).resolves.toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(element.querySelector('app-modale-confirmation')).toBeNull();
  });
});
