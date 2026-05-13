import {inject, Injectable, signal} from '@angular/core';
import {CategorieModele} from '../../models/categorie-modele';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs';
import {EmpruntDto} from '../../models/emprunt-dto';
import {CategorieModeleDto} from '../../models/categorie-modele-dto';

@Injectable({
  providedIn: 'root',
})
export class CategorieModeleService {

  apiService = inject(ApiService);

  readonly listeCategorieModele = signal<CategorieModele[]>([])

  obtenirListeCategorieModele() {
    return this.apiService.get<CategorieModele[]>('categories_modele/liste')
      .pipe(tap(
        (listeCategorieModele) =>
          this.listeCategorieModele
            .set(listeCategorieModele)));
  }

  creerCategorieModele(data: CategorieModeleDto) {
    return this.apiService.post<CategorieModele>('categories_modele', data);
  }


}
