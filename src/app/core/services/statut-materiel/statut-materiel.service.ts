import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs';
import {StatutMateriel} from '../../models/statut-materiel';

@Injectable({
  providedIn: 'root',
})
export class StatutMaterielService {

  readonly listeStatutMateriel = signal<StatutMateriel[]>([])

  apiService = inject(ApiService)

  obtenirListeStatutMateriel() {
    return this.apiService.get<StatutMateriel[]>('statuts_materiel/liste')
      .pipe(tap((listeStatutMateriel) => {
        const statutDisponible: StatutMateriel = { id: null, libelle: 'Disponible' };
        this.listeStatutMateriel.set([statutDisponible, ...listeStatutMateriel]);
      }));
  }
}
