import {computed, inject, Injectable, signal} from '@angular/core';
import {EmpruntDto} from '../../models/emprunt-dto';
import {Emprunts} from '../../models/emprunt';
import {ApiService} from '../api/api.service';
import {Observable, tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {

  readonly listeEmpruntActif = signal<Emprunts[]>([]);
  readonly listeEmpruntRecent = signal<Emprunts[]>([]);
  readonly listeDemandeEmprunt = signal<Emprunts[]>([]);
  readonly listeRetardEmprunt = signal<Emprunts[]>([]);
  readonly listeHistoriqueEmprunt = signal<Emprunts[]>([]);

  readonly nbEmpruntActif = computed(() => this.listeEmpruntActif().length);
  readonly nbDemandeEmprunt = computed(() => this.listeDemandeEmprunt().length);
  readonly nbRetardEmprunt = computed(() => this.listeRetardEmprunt().length);


  apiService = inject(ApiService)

  obtenirListeEmpruntsActifs() {
    return this.apiService.get<Emprunts[]>('emprunts/liste/actif')
    .pipe(tap((listeEmpruntActif) => this.listeEmpruntActif.set(listeEmpruntActif)));
  }

  obtenirListeEmpruntsRecents() {
    return this.apiService.get<Emprunts[]>('emprunts/liste/recent')
      .pipe(tap((listeEmpruntRecent) => this.listeEmpruntRecent.set(listeEmpruntRecent)));
  }

  obtenirListeDemandesEmprunt() {
    return this.apiService.get<Emprunts[]>('emprunts/liste/demande')
      .pipe(tap((listeDemandeEmprunt) => this.listeDemandeEmprunt.set(listeDemandeEmprunt)))
  }

  obtenirEmpruntEnRetard()  {
    return this.apiService.get<Emprunts[]>('emprunts/liste/retard')
      .pipe(tap((listeRetardEmprunt) => this.listeRetardEmprunt.set(listeRetardEmprunt)))
  }

  obtenirHistoriqueEmprunt()  {
    return this.apiService.get<Emprunts[]>('emprunts/historique')
      .pipe(tap((listeHistoriqueEmprunt) => this.listeHistoriqueEmprunt.set(listeHistoriqueEmprunt)))
  }

  creerEmprunt(empruntDto: EmpruntDto) {
    return this.apiService.post<EmpruntDto>('emprunts', empruntDto)
      .pipe(tap(() => {
        this.obtenirListeEmpruntsActifs().subscribe();
        this.obtenirListeDemandesEmprunt().subscribe();
      })
      );
  }

  supprimerEmprunt(id: number): Observable<void> {
    return this.apiService.delete<void>(`emprunts/${id}`).pipe(
      tap(() => {
        this.listeEmpruntActif.update(liste => liste.filter(e => e.id !== id));
        this.listeRetardEmprunt.update(liste => liste.filter(e => e.id !== id));
      })
    );
  }

  mettreAJourStatut(empruntId: number, statutId: number): Observable<any> {
    return this.apiService.put(`emprunts/${empruntId}/statut`, { statutId })
      .pipe(tap(() =>
        this.obtenirListeEmpruntsActifs().subscribe()
      )
      );
  }
}
