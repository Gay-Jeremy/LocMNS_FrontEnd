import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class EmpruntService {
  private baseApiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getEmpruntsActif() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/actif`);
  }

  getEmpruntsRecent() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/recent`);
  }

  getDemandeEmprunt() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/demande`);
  }

  getEmpruntPanne() {
    return this.http.get<any[]>(`${this.baseApiUrl}/emprunts/liste/panne`);
  }
}
