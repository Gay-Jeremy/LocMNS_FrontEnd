import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategorieModele} from '../../models/categorie-modele';

@Injectable({
  providedIn: 'root',
})
export class CategorieModeleService {

  private baseApiUrl = 'http://localhost:8080/api/categorie_modele';

  httpClient = inject(HttpClient)

  obtenirListeCategorieModele() {
    return this.httpClient.get<CategorieModele[]>(`${this.baseApiUrl}/liste`);
  }

}
