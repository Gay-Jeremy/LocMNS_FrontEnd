import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CategorieModele} from '../../models/categorie-modele';
import {ApiService} from '../api/api.service';
import {Materiel} from '../../models/materiel';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategorieModeleService {

  apiService = inject(ApiService);

  readonly listeCategorieModele = signal<CategorieModele[]>([])

  obtenirListeCategorieModele() {
    return this.apiService.get<CategorieModele[]>('categorie_modele/liste')
      .pipe(tap(
        (listeCategorieModele) =>
          this.listeCategorieModele
            .set(listeCategorieModele)));
  }

}
