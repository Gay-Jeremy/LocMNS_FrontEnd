import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {tap} from 'rxjs';
import {StatutEmprunt} from '../../models/statut-emprunt';

@Injectable({
  providedIn: 'root',
})
export class StatutEmpruntService {

  readonly listeStatutEmpruntDecision = signal<StatutEmprunt[]>([])
  readonly listeStatutEmpruntAction = signal<StatutEmprunt[]>([])

  apiService = inject(ApiService)

  obtenirListeStatutEmpruntsDecision() {
    return this.apiService.get<StatutEmprunt[]>('statuts_emprunt/liste/decision')
      .pipe(tap((listeStatutEmpruntDecision) => this.listeStatutEmpruntDecision.set(listeStatutEmpruntDecision)));
  }

  obtenirListeStatutEmpruntsAction() {
    return this.apiService.get<StatutEmprunt[]>('statuts_emprunt/liste')
      .pipe(tap((listeStatutEmpruntDecision) => this.listeStatutEmpruntAction.set(listeStatutEmpruntDecision)));
  }
}
