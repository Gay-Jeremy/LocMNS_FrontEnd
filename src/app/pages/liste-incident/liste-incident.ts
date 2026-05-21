import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {RouterLink} from '@angular/router';
import {StatutMaterielService} from '../../core/services/statut-materiel/statut-materiel.service';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {switchMap} from 'rxjs';
import {Auth} from '../../core/services/authentification/auth';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-liste-incident',
  imports: [
    Table,
    RouterLink
  ],
  templateUrl: './liste-incident.html',
  styleUrl: './liste-incident.css',
})
export class ListeIncident implements OnInit{

  colonnesIncident: ColonneConfig[] = [
    { key: 'modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'modele.libelle', label: 'MODELE' },
    { key: 'numSerie', label: 'NUM SÉRIE' },
    { key: 'statutMateriel.libelle', label: 'STATUT' },
  ];

  empruntService = inject(EmpruntService)
  materielService = inject(MaterielService)
  statutMaterielService = inject(StatutMaterielService)
  authService = inject(Auth)
  notification = inject(NotificationService)
  private readonly destroyRef = inject(DestroyRef);

  erreurs = signal<Record<string, string>>({});

  ngOnInit() {

    const onError = (err: unknown) => this.notification.fromHttpError(err);
    this.empruntService.obtenirListeEmpruntsActifs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.materielService.obtenirListeMaterielPanneSignalee()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.statutMaterielService.obtenirListeStatutMateriel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
  }

  onDecisionChange(event: DecisionEvent): void {
    this.erreurs.set({});

    this.materielService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(
        switchMap(() => this.materielService.obtenirListeMaterielPanneSignalee()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notification.success('Statut mis à jour'),
        error: (err) => {
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err);
          }
        },
      });
  }
}
