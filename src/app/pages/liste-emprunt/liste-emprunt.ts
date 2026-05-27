import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal, viewChild
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {forkJoin, map, switchMap, tap} from 'rxjs';

import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { StatutEmpruntService } from '../../core/services/statut-emprunt/statut-emprunt.service';
import { Auth } from '../../core/services/authentification/auth';

import { Emprunts } from '../../core/models/emprunt';
import { StatutEmprunt } from '../../core/models/statut-emprunt';

import { ColonneConfig } from '../../shared/models/colonne-config.model';
import { DecisionEvent } from '../../shared/models/decision-event.model';

import { Table } from '../../shared/components/table/table';
import { DatePicker } from '../../shared/components/date-picker/date-picker';

@Component({
  selector: 'app-listEmprunt',
  imports: [CommonModule, Table, RouterLink, DatePicker],
  templateUrl: './liste-emprunt.html',
  styleUrl: './liste-emprunt.css',
})
export class ListeEmprunt implements OnInit {

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  readonly authService = inject(Auth);
  readonly empruntService = inject(EmpruntService);
  readonly notificationService = inject(NotificationService);
  readonly statutEmpruntService = inject(StatutEmpruntService);

  readonly filtre = signal<string>('actif');

  readonly listeStatut = signal<StatutEmprunt[]>([]);

  readonly showDateModal = signal(false);

  readonly pendingEvent = signal<DecisionEvent | null>(null);

  readonly erreurs = signal<Record<string, string>>({});

  readonly titre = computed(() =>
    this.filtre() === 'retard'
      ? 'Emprunts en retard'
      : 'Emprunts actifs'
  );

  readonly data = computed(() =>
    this.filtre() === 'retard'
      ? this.empruntService.listeRetardEmprunt()
      : this.empruntService.listeEmpruntActif()
  );

  readonly colonnesEmpruntsRecent = computed<ColonneConfig[]>(() => {

    const data = this.data();

    const hasDateRetourAnticipe = data.some(
      emprunt => !!emprunt.dateRetourAnticipe
    );

    const hasDateProlongation = data.some(
      emprunt => !!emprunt.dateProlongation
    );

    return [
      { key: 'id', label: 'ID' },

      { key: 'dateCreation', label: 'DATE CREATION' },

      { key: 'utilisateur.nom', label: 'NOM' },

      { key: 'utilisateur.prenom', label: 'PRÉNOM' },

      {
        key: 'utilisateur.promotion.libelle',
        label: 'PROMOTION'
      },

      {
        key: 'materiel.modele.categorieModele.libelle',
        label: 'CATEGORIE'
      },

      { key: 'materiel.numSerie', label: 'NUM SÉRIE' },

      { key: 'dateDebut', label: 'DATE DE DÉBUT' },

      { key: 'dateFin', label: 'DATE DE FIN PRÉVUE' },

      ...(hasDateRetourAnticipe
        ? [{
          key: 'dateRetourAnticipe',
          label: 'DATE RETOUR ANTICIPÉ'
        }]
        : []),

      ...(hasDateProlongation
        ? [{
          key: 'dateProlongation',
          label: 'DATE PROLONGATION'
        }]
        : []),

      {
        key: 'statutEmprunt.libelle',
        label: 'STATUT'
      },
    ];
  });

  private readonly tableRef = viewChild.required(Table);

  ngOnInit(): void {

    const onError = (err: unknown) =>
      this.notificationService.fromHttpError(err);

    this.route.queryParams.pipe(
      map(params => (params['filtre'] ?? 'actif') as string),

      tap(filtre => this.filtre.set(filtre)),

      switchMap(filtre =>
        filtre === 'retard'
          ? this.empruntService.obtenirEmpruntEnRetard()
          : this.empruntService.obtenirListeEmpruntsActifs()
      ),

      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      error: onError,
    });

    this.statutEmpruntService
      .obtenirListeStatutEmpruntsAction()
      .pipe(
        map(statuts =>
          this.authService.isAdmin()
            ? statuts
            : statuts.filter(
              statut =>
                statut.code != null &&
                [
                  'DEMANDE_PROLONGATION',
                  'DEMANDE_RETOUR_ANTICIPE'
                ].includes(statut.code)
            )
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: statuts => this.listeStatut.set(statuts),
        error: onError,
      });
  }

  onEdit(row: Emprunts): void {
    this.router.navigate(['/enregistrer/emprunt', row.id]);
  }

  async onDelete(row: Emprunts): Promise<void> {

    const confirmed = await this.notificationService.confirm(
      `Confirmez-vous la suppression de l'emprunt n°${row.id} ?`,
      'Suppression'
    );

    if (!confirmed) {
      return;
    }

    this.empruntService.supprimerEmprunt(row.id)
      .pipe(
        switchMap(() =>
          this.filtre() === 'retard'
            ? this.empruntService.obtenirEmpruntEnRetard()
            : this.empruntService.obtenirListeEmpruntsActifs()
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () =>
          this.notificationService.success('Emprunt supprimé'),

        error: err =>
          this.notificationService.fromHttpError(err),
      });
  }

  async onDecisionChange(event: DecisionEvent): Promise<void> {

    this.erreurs.set({});

    if (
      event.code === 'DEMANDE_PROLONGATION' ||
      event.code === 'DEMANDE_RETOUR_ANTICIPE'
    ) {

      const row = this.data().find(
        emprunt => emprunt.id === event.rowId
      );

      this.pendingEvent.set({
        ...event,
        dateFin: row?.dateFin ?? '',
      });

      this.showDateModal.set(true);

      return;
    }

    const confirmed = await this.notificationService.confirm(
      'Voulez-vous vraiment changer le statut ?'
    );

    if (!confirmed) {
      return;
    }

    this.soumettreMajStatut(event);
  }

  onDateConfirmed(date: string): void {

    const event = this.pendingEvent();

    if (!event) {
      return;
    }

    this.showDateModal.set(false);

    this.pendingEvent.set(null);

    this.soumettreMajStatut({
      ...event,
      date,
    });
  }

  onDateCancelled(): void {
    this.showDateModal.set(false);
    this.pendingEvent.set(null);
  }

  soumettreMajStatut(event: DecisionEvent): void {

    this.empruntService
      .mettreAJourStatut(
        event.rowId,
        event.statutId,
        event.date
      )
      .pipe(
        switchMap(() => forkJoin([
          this.empruntService.obtenirListeEmpruntsActifs(),
          this.empruntService.obtenirListeDemandesEmprunt()
          ])
        ),

        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () =>
          this.notificationService.success('Statut mis à jour'),

        error: err => {
          this.tableRef().resetRow(event.rowId);
          this.notificationService.fromHttpError(err);
        }
      });
  }
}
