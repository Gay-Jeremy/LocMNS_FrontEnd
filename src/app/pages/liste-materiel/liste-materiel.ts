import {Component, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/authentification/auth.service';
import {StatutMaterielService} from '../../core/services/statut-materiel/statut-materiel.service';
import {StatutMateriel} from '../../core/models/statut-materiel';
import {forkJoin, map, switchMap} from 'rxjs';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {NotificationService} from '../../core/services/notification/notification.service';
import {Emprunts} from '../../core/models/emprunt';

@Component({
  selector: 'app-liste-materiel',
  imports: [
    Table,
    RouterLink
  ],
  templateUrl: './liste-materiel.html',
  styleUrl: './liste-materiel.css',
})
export class ListeMateriel implements OnInit {

  colonnesMateriel: ColonneConfig[] = [
    { key: 'modele.categorieModele.libelle', label: 'CATÉGORIE' },
    { key: 'modele.libelle', label: 'MODÈLE' },
    { key: 'numSerie', label: 'NUM SÉRIE' },
    { key: 'statutMateriel.libelle', label: 'STATUT' },

  ];

  authService = inject(AuthService)
  materielService = inject(MaterielService)
  statutMaterielService = inject(StatutMaterielService)
  notification = inject(NotificationService);
  router = inject(Router)

  private readonly destroyRef = inject(DestroyRef);

  listeStatut = signal<StatutMateriel[]>([]);
  erreurs = signal<Record<string, string>>({});

  ngOnInit() {

    const onError = (err: unknown) => this.notification.fromHttpError(err);

    this.materielService.obtenirListeMateriel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });

    this.statutMaterielService.obtenirListeStatutMateriel().pipe(
      map(statuts =>
        this.authService.isAdmin()
          ? statuts
          : statuts.filter(s => s.code != null && ['INCIDENT', 'PANNE'].includes(s.code))
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (statuts) => this.listeStatut.set(statuts),
      error: onError,
    });

  }

  async onDecisionChange(event: DecisionEvent): Promise<void> {
    this.erreurs.set({});
    const confirmed = await this.notification.confirm('Voulez-vous vraiment changer le statut ?');

    if (!confirmed) return;

    this.materielService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(
        switchMap(() => forkJoin([
          this.materielService.obtenirListeMateriel(),
          this.materielService.obtenirListeMaterielPanneSignalee()
        ])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notification.success('Statut mis à jour'),
        error: (err) => this.notification.fromHttpError(err)
      });
  }

  onEdit(row: Emprunts): void {
    this.router.navigate(['materiel/modifier', row.id]);
  }

  async onDelete(row: Emprunts): Promise<void> {
    const confirmed = await this.notification.confirm(
      `Confirmez-vous la suppression du materiel n°${row.id} ?`,
      'Suppression'
    );
    if (!confirmed) return;

    this.materielService.supprimerMateriel(row.id)
      .pipe(
        switchMap(() =>
            this.materielService.obtenirListeMateriel()

        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notification.success('Materiel supprimé'),
        error: (err) => this.notification.fromHttpError(err),
      });
  }
}
