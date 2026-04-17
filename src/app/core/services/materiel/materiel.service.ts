import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Materiel} from '../../models/materiel';

@Injectable({
  providedIn: 'root',
})

export class MaterielService {
  private baseApiUrl = 'http://localhost:8080/api/materiels';

  constructor(private http: HttpClient) {}

  obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele( dateDebut: string,
                                                                   dateFin: string,
                                                                   id: number) {
    return this.http.get<Materiel[]>(`${this.baseApiUrl}/liste/disponible/${dateDebut}/${dateFin}/${id}`);
  }

  obtenirListeMateriel() {
    return this.http.get<Materiel[]>(`${this.baseApiUrl}/liste`)
  }
}
