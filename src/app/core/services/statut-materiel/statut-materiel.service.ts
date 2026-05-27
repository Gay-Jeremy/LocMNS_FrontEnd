import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {map, tap} from 'rxjs';
import {StatutMateriel} from '../../models/statut-materiel';

@Injectable({
  providedIn: 'root',
})
export class StatutMaterielService {

  readonly listeStatutMateriel = signal<StatutMateriel[]>([])

  apiService = inject(ApiService)

  obtenirListeStatutMateriel() {
    return this.apiService.get<StatutMateriel[]>('statuts_materiel/liste').pipe(
      map(statuts => {
        const disponible: StatutMateriel = { id: null, libelle: 'Disponible', code: null };
        return [disponible, ...statuts];
      }),
      tap(statuts => this.listeStatutMateriel.set(statuts)),
    );
  }
}
