import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EmpruntDto} from '../../models/empruntDto';
import {Observable, tap} from 'rxjs';
import {Emprunts} from '../../models/emprunt';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private baseApiUrl = 'http://localhost:8080/api';

  readonly listeEmpruntActif = signal<Emprunts[]>([])
  readonly listeEmpruntRecent = signal<Emprunts[]>([])
  readonly listeDemandeEmprunt = signal<Emprunts[]>([])
  readonly listePanneSignalee = signal<Emprunts[]>([])

  httpClient = inject(HttpClient)

  obtenirListeEmpruntsActifs() {
    return this.httpClient.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/actif`)
    .pipe(tap((listeEmpruntActif) => this.listeEmpruntActif.set(listeEmpruntActif)));
  }

  obtenirListeEmpruntsRecents() {
    return this.httpClient.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/recent`)
      .pipe(tap((listeEmpruntRecent) => this.listeEmpruntRecent.set(listeEmpruntRecent)));
  }

  obtenirListeDemandesEmprunt() {
    return this.httpClient.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/demande`)
      .pipe(tap((listeDemandeEmprunt) => this.listeDemandeEmprunt.set(listeDemandeEmprunt)))
  }

  obtenirListePannesSignalees() {
    return this.httpClient.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/panne`)
      .pipe(tap((listePanneSignalee) => this.listePanneSignalee.set(listePanneSignalee)))
  }

  creerEmprunt(empruntDto: EmpruntDto) {
    return this.httpClient.post<EmpruntDto>(`${this.baseApiUrl}/emprunts`, empruntDto)
      .pipe(tap(() => this.obtenirListeEmpruntsActifs().subscribe()))
  }
}
