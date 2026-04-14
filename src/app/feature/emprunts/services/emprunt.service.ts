import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  obtenirListeEmpruntsActifs() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/actif`);
  }

  obtenirListeEmpruntsRecents() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/recent`);
  }

  obtenirListeDemandesEmprunt() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/demande`);
  }

  obtenirListePannesSignalees() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/panne`);
  }
}
