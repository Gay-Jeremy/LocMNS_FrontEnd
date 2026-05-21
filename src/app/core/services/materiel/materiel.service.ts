import {computed, inject, Injectable, signal} from '@angular/core';
import {Materiel} from '../../models/materiel';
import {ApiService} from '../api/api.service';
import {Emprunts} from '../../models/emprunt';
import {Observable, tap} from 'rxjs';
import {MaterielDto} from '../../models/materiel-dto';

@Injectable({
  providedIn: 'root',
})

export class MaterielService {

  apiService = inject(ApiService);

  readonly listeMaterielDisponiblePourPeriodeParIdCategorie = signal<Materiel[]>([]);
  readonly listeMateriel = signal<Materiel[]>([]);
  readonly listeMaterielPanneSignalee = signal<Materiel[]>([]);

  readonly nbMateriel = computed(() => this.listeMateriel().length);

  readonly nbMaterielDisponible = computed(() =>
    this.listeMaterielDisponiblePourPeriodeParIdCategorie().length);

  readonly nbMaterielPanneSignalee = computed(() =>
    this.listeMaterielPanneSignalee().length)



  obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele( dateDebut: string,
                                                                   dateFin: string,
                                                                   id: number) {
    return this.apiService.get<Materiel[]>(`materiels/liste/disponible/categorie?dateDebut=${dateDebut}&dateFin=${dateFin}&categorieModeleId=${id}`)
      .pipe(tap(
        (listeMaterielDisponiblePourPeriodeParIdCategorie) =>
          this.listeMaterielDisponiblePourPeriodeParIdCategorie
            .set(listeMaterielDisponiblePourPeriodeParIdCategorie)));
  }

  obtenirListeMateriel() {
    return this.apiService.get<Materiel[]>('materiels/liste')
      .pipe(tap((listeMateriel) => this.listeMateriel.set(listeMateriel)));
  }

  obtenirListeMaterielPanneSignalee() {
    return this.apiService.get<Materiel[]>('materiels/liste/panne_signalee')
      .pipe(tap((listeMaterielPanneSignalee) => this.listeMaterielPanneSignalee.set(listeMaterielPanneSignalee)))
  }

  mettreAJourStatut(materielId: number, statutId: number): Observable<unknown> {
    return this.apiService.put(`materiels/${materielId}/statut`, { statutId });
  }

  obtenirMaterielParId(id: number): Observable<Materiel> {
    return this.apiService.get<Materiel>(`materiels/${id}`);
  }

  creerMateriel(dataMateriel: MaterielDto): Observable<MaterielDto> {
    return this.apiService.post<MaterielDto>('materiels', dataMateriel);
  }

  modifierMateriel(id: number, dataMateriel: MaterielDto): Observable<MaterielDto> {
    return this.apiService.put(`materiels/${id}`, dataMateriel);
  }
}
