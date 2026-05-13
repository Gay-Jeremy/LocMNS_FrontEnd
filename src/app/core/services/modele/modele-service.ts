import {inject, Injectable, signal} from '@angular/core';
import {Modele} from '../../models/modele';
import {ModeleDto} from '../../models/modele-dto';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ModeleService {

  apiService = inject(ApiService);

  readonly listeModele = signal<Modele[]>([]);
  readonly listeModeleParCategorie = signal<Modele[]>([]);

  obtenirListeModele() {
    return this.apiService.get<Modele[]>('modeles/liste')
      .pipe(tap(liste => this.listeModele.set(liste)));
  }

  obtenirListeModeleParCategorie(categorieModeleId: number) {
    return this.apiService.get<Modele[]>(`modeles/liste/categorie/${categorieModeleId}`)
      .pipe(tap(liste => this.listeModeleParCategorie.set(liste)));
  }

  creerModele(data: ModeleDto) {
    return this.apiService.post<Modele>('modeles', data);
  }
}
