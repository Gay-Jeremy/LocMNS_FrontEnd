import { computed, inject, Injectable, signal } from '@angular/core';
import { EmpruntDto } from '../../models/emprunt-dto';
import { Emprunts } from '../../models/emprunt';
import { ApiService } from '../api/api.service';
import { forkJoin, Observable, tap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {

  private readonly apiService = inject(ApiService);

  readonly listeEmpruntActif    = signal<Emprunts[]>([]);
  readonly listeEmpruntRecent   = signal<Emprunts[]>([]);
  readonly listeDemandeEmprunt  = signal<Emprunts[]>([]);
  readonly listeRetardEmprunt   = signal<Emprunts[]>([]);
  readonly listeHistoriqueEmprunt = signal<Emprunts[]>([]);

  // =====================
  // COMPUTED
  // =====================

  readonly nbEmpruntActif    = computed(() => this.listeEmpruntActif().length);
  readonly nbDemandeEmprunt  = computed(() => this.listeDemandeEmprunt().length);
  readonly nbRetardEmprunt   = computed(() => this.listeRetardEmprunt().length);

  // =====================
  // ENDPOINTS
  // =====================

  private readonly endpoints = {
    base:       'emprunts',
    actif:      'emprunts/liste/actif',
    recent:     'emprunts/liste/recent',
    demande:    'emprunts/liste/demande',
    retard:     'emprunts/liste/retard',
    historique: 'emprunts/historique',
  };

  // =====================
  // UTIL PRIVÉ
  // =====================

  private loadList<T>(url: string, setter: (data: T[]) => void): Observable<T[]> {
    return this.apiService.get<T[]>(url).pipe(tap(setter));
  }

  private refreshDemandes(): Observable<any> {
    return forkJoin({
      actifs:   this.obtenirListeEmpruntsActifs(),
      demandes: this.obtenirListeDemandesEmprunt(),
    });
  }

  // =====================
  // READ
  // =====================

  obtenirEmpruntParId(id: number): Observable<Emprunts> {
    return this.apiService.get<Emprunts>(`${this.endpoints.base}/${id}`);
  }

  obtenirListeEmpruntsActifs(): Observable<Emprunts[]> {
    return this.loadList<Emprunts>(
      this.endpoints.actif,
        data => this.listeEmpruntActif.set(data));
  }

  obtenirListeEmpruntsRecents(): Observable<Emprunts[]> {
    return this.loadList<Emprunts>(
      this.endpoints.recent,
        data => this.listeEmpruntRecent.set(data));
  }

  obtenirListeDemandesEmprunt(): Observable<Emprunts[]> {
    return this.loadList<Emprunts>(this.endpoints.demande, data => this.listeDemandeEmprunt.set(data));
  }

  obtenirEmpruntEnRetard(): Observable<Emprunts[]> {
    return this.loadList<Emprunts>(this.endpoints.retard, data => this.listeRetardEmprunt.set(data));
  }

  obtenirHistoriqueEmprunt(): Observable<Emprunts[]> {
    return this.loadList<Emprunts>(this.endpoints.historique, data => this.listeHistoriqueEmprunt.set(data));
  }

  // =====================
  // CREATE
  // =====================

  creerEmprunt(dto: EmpruntDto): Observable<Emprunts> {
    return this.apiService.post(this.endpoints.base, dto).pipe(
      switchMap(() => this.refreshDemandes())
    );
  }

  // =====================
  // UPDATE
  // =====================

  modifierEmprunt(id: number, dto: EmpruntDto): Observable<void> {
    return this.apiService.put<void>(`${this.endpoints.base}/${id}`, dto);
  }

  // =====================
  // DELETE
  // =====================

  supprimerEmprunt(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoints.base}/${id}`).pipe(
      tap(() => this.removeFromAllLists(id))
    );
  }

  private removeFromAllLists(id: number): void {
    this.listeEmpruntActif.update(l => l.filter(e => e.id !== id));
    this.listeRetardEmprunt.update(l => l.filter(e => e.id !== id));
    this.listeDemandeEmprunt.update(l => l.filter(e => e.id !== id));
    this.listeHistoriqueEmprunt.update(l => l.filter(e => e.id !== id));
  }

  // =====================
  // STATUT SIMPLE (ACCEPTE, REFUSE, TERMINE...)
  // =====================

  mettreAJourStatut(id: number, code: string): Observable<void> {
    return this.apiService.patch<void>(
      `${this.endpoints.base}/${id}/statut`,
      { code }
    ).pipe(switchMap(() => this.refreshDemandes()));
  }

  // =====================
  // PROLONGATION
  // =====================

  demanderProlongation(id: number, dateProlongation: string): Observable<void> {
    return this.apiService.patch<void>(
      `${this.endpoints.base}/${id}/prolongation/demande`,
      { dateProlongation }
    ).pipe(switchMap(() => this.refreshDemandes()));
  }

  accepterProlongation(id: number): Observable<void> {
    return this.apiService.patch<void>(
      `${this.endpoints.base}/${id}/prolongation/accepter`,
      {}
    ).pipe(switchMap(() => this.refreshDemandes()));
  }

  // =====================
  // RETOUR ANTICIPÉ
  // =====================

  demanderRetourAnticipe(id: number, dateRetourAnticipe: string): Observable<void> {
    return this.apiService.patch<void>(
      `${this.endpoints.base}/${id}/retour-anticipe/demande`,
      { dateRetourAnticipe }
    ).pipe(switchMap(() => this.refreshDemandes()));
  }

  accepterRetourAnticipe(id: number): Observable<void> {
    return this.apiService.patch<void>(
      `${this.endpoints.base}/${id}/retour-anticipe/accepter`,
      {}
    ).pipe(switchMap(() => this.refreshDemandes()));
  }

  // =====================
  // FULL REFRESH
  // =====================

  refreshAll(): Observable<any> {
    return forkJoin({
      actifs:     this.obtenirListeEmpruntsActifs(),
      recents:    this.obtenirListeEmpruntsRecents(),
      demandes:   this.obtenirListeDemandesEmprunt(),
      retard:     this.obtenirEmpruntEnRetard(),
      historique: this.obtenirHistoriqueEmprunt(),
    });
  }
}
