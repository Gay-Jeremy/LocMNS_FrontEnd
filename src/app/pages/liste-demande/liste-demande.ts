import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {KeyValuePipe} from '@angular/common';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {Table} from '../../shared/components/table/table';
import {RouterLink} from '@angular/router';
import {StatutEmpruntService} from '../../core/services/statut-emprunt/statut-emprunt.service';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {forkJoin, switchMap} from 'rxjs';
import {Auth} from '../../core/services/authentification/auth';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-liste-demande',
  imports: [
    Table,
    RouterLink,
    KeyValuePipe,
  ],
  templateUrl: './liste-demande.html',
  styleUrl: './liste-demande.css',
})
export class ListeDemande implements OnInit {

  colonnesDemande: ColonneConfig[] = [
    { key: 'id', label: 'ID' },
    { key: 'dateCreation', label: 'DATE CREATION' },
    { key: 'utilisateur.nom', label: 'NOM' },
    { key: 'utilisateur.prenom', label: 'PRÉNOM' },
    { key: 'utilisateur.promotion.libelle', label: 'PROMOTION' },
    { key: 'materiel.modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'materiel.numSerie', label: 'NUM SÉRIE' },
    { key: 'dateDebut', label: 'DATE DE DÉBUT' },
    { key: 'dateFin', label: 'DATE DE FIN PRÉVUE' },
    { key: 'statutEmprunt.libelle', label: 'STATUT' },
  ];

  empruntService = inject(EmpruntService)
  statutEmpruntService = inject(StatutEmpruntService)
  authService = inject(Auth)
  notification = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef);

  erreurs = signal<Record<string, string>>({});

  ngOnInit() {

    this.empruntService.obtenirListeDemandesEmprunt()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => this.notification.fromHttpError(err),
      });

    this.statutEmpruntService.obtenirListeStatutEmpruntsDecision()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => this.notification.fromHttpError(err),
      });
  }

  onDecisionChange(event: DecisionEvent): void {
    this.erreurs.set({});

    this.empruntService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(
        switchMap(() => forkJoin([
          this.empruntService.obtenirListeDemandesEmprunt(),
          this.empruntService.obtenirListeEmpruntsActifs(),
        ])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notification.success('Décision enregistrée'),
        error: (err) => {
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err);
          }
        },
      });
  }
}
