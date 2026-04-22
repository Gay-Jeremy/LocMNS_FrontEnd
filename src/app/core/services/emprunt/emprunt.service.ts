import { inject, Injectable, signal } from '@angular/core';
import {EmpruntDto} from '../../models/empruntDto';
import {Emprunts} from '../../models/emprunt';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {

  readonly listeEmpruntActif = signal<Emprunts[]>([])
  readonly listeEmpruntRecent = signal<Emprunts[]>([])
  readonly listeDemandeEmprunt = signal<Emprunts[]>([])
  readonly listePanneSignalee = signal<Emprunts[]>([])

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

  obtenirListePannesSignalees() {
    return this.apiService.get<Emprunts[]>('emprunts/liste/panne')
      .pipe(tap((listePanneSignalee) => this.listePanneSignalee.set(listePanneSignalee)))
  }

  creerEmprunt(empruntDto: EmpruntDto) {
    return this.apiService.post<EmpruntDto>('emprunts', empruntDto)
      .pipe(tap(() => this.obtenirListeEmpruntsActifs().subscribe()))
  }
}
