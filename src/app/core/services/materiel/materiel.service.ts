import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class MaterielService {
  private baseApiUrl = 'http://localhost:8080/api/materiels';

  constructor(private http: HttpClient) {}

  obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele() {
    return this.http.get<any[]>(`${this.baseApiUrl}/liste/disponible/{dateDebut}/{dateFin}/{id}`);
  }

  obtenirListeMateriel() {
    return this.http.get<any[]>(`${this.baseApiUrl}/liste`)
  }
}
