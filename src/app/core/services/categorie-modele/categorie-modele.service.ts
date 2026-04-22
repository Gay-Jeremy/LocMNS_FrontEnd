import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategorieModele} from '../../models/categorie-modele';
import {ApiService} from '../api/api.service';

@Injectable({
  providedIn: 'root',
})
export class CategorieModeleService {

  apiService = inject(ApiService)

  obtenirListeCategorieModele() {
    return this.apiService.get<CategorieModele[]>('categorie_modele/liste');
  }

}
