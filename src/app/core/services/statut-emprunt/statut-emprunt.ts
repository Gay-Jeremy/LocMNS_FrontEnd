import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Emprunts} from '../../models/emprunt';
import {tap} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StatutEmprunt {

  readonly listeStatutEmpruntDecision = signal<StatutEmprunt[]>([])

  apiService = inject(ApiService)

  obtenirListeStatutEmpruntsDecision() {
    return this.apiService.get<StatutEmprunt[]>('statuts_emprunt/liste/decision')
      .pipe(tap((listeStatutEmpruntDecision) => this.listeStatutEmpruntDecision.set(listeStatutEmpruntDecision)));
  }
}
