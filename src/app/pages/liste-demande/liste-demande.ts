import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {KeyValuePipe} from '@angular/common';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {Table} from '../../shared/components/table/table';
import {RouterLink} from '@angular/router';
import {StatutEmpruntService} from '../../core/services/statut-emprunt/statut-emprunt.service';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {Observable} from 'rxjs';
import {AuthService} from '../../core/services/authentification/auth.service';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-liste-demande',
  imports: [Table, RouterLink, KeyValuePipe],
  templateUrl: './liste-demande.html',
  styleUrl: './liste-demande.css',
})
export class ListeDemande implements OnInit {

  colonnesDemande: ColonneConfig[] = [
    { key: 'id',                                      label: 'ID' },
    { key: 'dateCreation',                            label: 'DATE CREATION' },
    { key: 'utilisateur.nom',                         label: 'NOM' },
    { key: 'utilisateur.prenom',                      label: 'PRÉNOM' },
    { key: 'utilisateur.promotion.libelle',           label: 'PROMOTION' },
    { key: 'materiel.modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'materiel.numSerie',                       label: 'NUM SÉRIE' },
    { key: 'dateDebut',                               label: 'DATE DE DÉBUT' },
    { key: 'dateFin',                                 label: 'DATE DE FIN PRÉVUE' },
    { key: 'dateRetourAnticipe',                      label: 'DATE RETOUR ANTICIPÉ' },
    { key: 'dateProlongation',                        label: 'DATE PROLONGATION' },
    { key: 'statutEmprunt.libelle',                   label: 'STATUT' },
  ];

  empruntService      = inject(EmpruntService);
  statutEmpruntService = inject(StatutEmpruntService);
  authService         = inject(AuthService);
  notification        = inject(NotificationService);
  private destroyRef  = inject(DestroyRef);

  erreurs = signal<Record<string, string>>({});

  private readonly actionParStatut: Record<string, string[]> = {
    DEMANDE_EN_COURS: [
      'ACCEPTE',
      'REFUSE'
    ],

    DEMANDE_PROLONGATION: [
      'PROLONGATION_ACCEPTE',
      'PROLONGATION_REFUSE'
    ],

    DEMANDE_RETOUR_ANTICIPE: [
      'DEMANDE_RETOUR_ANTICIPE_ACCEPTE',
      'DEMANDE_RETOUR_ANTICIPE_REFUSE'
    ]
  };

  resolveActionsForRow = (row: any) => {
    const codeStatut = row?.statutEmprunt?.code;

    const codesAutorises =
      this.actionParStatut[codeStatut] ?? [];

    return this.statutEmpruntService
      .listeStatutEmpruntDecision()
      .filter(s => codesAutorises.includes(s.code));
  };

  ngOnInit(): void {
    this.empruntService.obtenirListeDemandesEmprunt()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: err => this.notification.fromHttpError(err) });

    this.statutEmpruntService.obtenirListeStatutEmpruntsDecision()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: err => this.notification.fromHttpError(err) });
  }

  onDecisionChange(event: DecisionEvent): void {
    this.erreurs.set({});

    const action$ = this.resolveAction(event);
    if (!action$) return;

    action$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.notification.success('Décision enregistrée'),
        error: err => {
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err);
          }
        },
      });
  }

  private resolveAction(event: DecisionEvent): Observable<void> | null {
    const { rowId, code, date } = event;

    switch (code) {

      case 'PROLONGATION_ACCEPTE':
        return this.empruntService.accepterProlongation(rowId);

      case 'PROLONGATION_REFUSE':
        return this.empruntService.mettreAJourStatut(rowId, 'PROLONGATION_REFUSE');

      case 'DEMANDE_RETOUR_ANTICIPE_ACCEPTE':
        return this.empruntService.accepterRetourAnticipe(rowId);

      case 'DEMANDE_RETOUR_ANTICIPE_REFUSE':
        return this.empruntService.mettreAJourStatut(rowId, 'DEMANDE_RETOUR_ANTICIPE_REFUSE');

      case 'ACCEPTE':
      case 'REFUSE':
      case 'TERMINE':
        return this.empruntService.mettreAJourStatut(rowId, code);

      default:
        this.notification.fromHttpError({ status: 400, message: `Code statut inconnu : ${code}` });
        return null;
    }
  }
}
