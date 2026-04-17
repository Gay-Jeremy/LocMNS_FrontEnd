import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {EmpruntDto} from '../../models/empruntDto';
import {Observable} from 'rxjs';
import {Emprunts} from '../../models/emprunt';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  obtenirListeEmpruntsActifs() {
    return this.http.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/actif`);
  }

  obtenirListeEmpruntsRecents() {
    return this.http.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/recent`);
  }

  obtenirListeDemandesEmprunt() {
    return this.http.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/demande`);
  }

  obtenirListePannesSignalees() {
    return this.http.get<Emprunts[]>(`${this.baseApiUrl}/emprunts/liste/panne`);
  }

  creerEmprunt(empruntDto: EmpruntDto): Observable<EmpruntDto> {
    return this.http.post<EmpruntDto>(`${this.baseApiUrl}/emprunts`, empruntDto);
  }
}
