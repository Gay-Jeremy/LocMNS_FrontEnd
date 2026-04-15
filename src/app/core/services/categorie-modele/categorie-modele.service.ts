import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CategorieModeleService {

  private baseApiUrl = 'http://localhost:8080/api/categorie_modele';

  constructor(private http: HttpClient) {}

  obtenirListeCategorieModele() {
    return this.http.get<any[]>(`${this.baseApiUrl}/liste`);
  }

}
