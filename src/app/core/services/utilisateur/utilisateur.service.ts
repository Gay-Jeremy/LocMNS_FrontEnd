import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {Emprunts} from '../../models/emprunt';
import {Utilisateur} from '../../models/utilisateur';

@Injectable({
  providedIn: 'root',
})

export class UtilisateurService {

  apiService = inject(ApiService)

  readonly listeUtilisateur = signal<Utilisateur[]>([])

  obtenirListeUtilisateur() {
    return this.apiService.get<Utilisateur[]>('utilisateurs/liste');
  }
}
