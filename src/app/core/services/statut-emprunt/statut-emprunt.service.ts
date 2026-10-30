import {inject, Injectable, signal} from '@angular/core';
import {ApiService} from '../api/api.service';
import {map, tap} from 'rxjs';
import {StatutEmprunt} from '../../models/statut-emprunt';

/**
 * Texte de l'action proposée dans les listes déroulantes, pour chaque code de statut.
 * La base décrit l'état d'un emprunt (« Accepté ») : c'est ce qu'affichent les tableaux.
 * Les listes déroulantes proposent une action (« Accepter ») : son texte est défini ici.
 */
const LIBELLES_ACTION: Record<string, string> = {
  DEMANDE_EN_COURS: 'Remettre en attente',
  ACCEPTE: 'Accepter',
  REFUSE: 'Refuser',
  DEMANDE_PROLONGATION: 'Demander une prolongation',
  DEMANDE_RETOUR_ANTICIPE: 'Demander un retour anticipé',
  PROLONGATION_ACCEPTE: 'Accepter la prolongation',
  PROLONGATION_REFUSE: 'Refuser la prolongation',
  DEMANDE_RETOUR_ANTICIPE_ACCEPTE: 'Accepter le retour anticipé',
  DEMANDE_RETOUR_ANTICIPE_REFUSE: 'Refuser le retour anticipé',
};

/** Remplace le libellé d'état par le texte de l'action (code inconnu : libellé d'origine conservé). */
export function versAction(statut: StatutEmprunt): StatutEmprunt {
  return { ...statut, libelle: LIBELLES_ACTION[statut.code] ?? statut.libelle };
}

@Injectable({
  providedIn: 'root',
})
export class StatutEmpruntService {

  // Listes destinées aux listes déroulantes : libellés d'action
  readonly listeStatutEmpruntDecision = signal<StatutEmprunt[]>([])
  readonly listeStatutEmpruntAction = signal<StatutEmprunt[]>([])

  apiService = inject(ApiService)

  obtenirListeStatutEmpruntsDecision() {
    return this.apiService.get<StatutEmprunt[]>('statuts_emprunt/liste/decision')
      .pipe(
        map((statuts) => statuts.map(versAction)),
        tap((listeStatutEmpruntDecision) => this.listeStatutEmpruntDecision.set(listeStatutEmpruntDecision)));
  }

  obtenirListeStatutEmpruntsAction() {
    return this.apiService.get<StatutEmprunt[]>('statuts_emprunt/liste')
      .pipe(
        map((statuts) => statuts.map(versAction)),
        tap((listeStatutEmpruntAction) => this.listeStatutEmpruntAction.set(listeStatutEmpruntAction)));
  }
}
