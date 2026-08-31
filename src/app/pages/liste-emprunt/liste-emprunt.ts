import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import {CommonModule} from '@angular/common';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '../../core/services/authentification/auth.service';
import {NotificationService} from '../../core/services/notification/notification.service';
import {Emprunts} from '../../core/models/emprunt';
import { map, switchMap, tap} from 'rxjs';
import {StatutEmpruntService} from '../../core/services/statut-emprunt/statut-emprunt.service';
import {StatutEmprunt} from '../../core/models/statut-emprunt';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {DatePicker} from '../../shared/components/date-picker/date-picker';

@Component({
  selector: 'app-listEmprunt',
  imports: [CommonModule, Table, RouterLink, DatePicker],
  templateUrl: './liste-emprunt.html',
  styleUrl: './liste-emprunt.css',
})

export class ListeEmprunt implements OnInit {

  router = inject(Router)
  authService =inject(AuthService)
  private readonly destroyRef = inject(DestroyRef);

  colonnesEmpruntsRecent: ColonneConfig[] = [
    { key: 'dateCreation', label: 'DATE CREATION' },
    { key: 'utilisateur.nom', label: 'NOM' },
    { key: 'utilisateur.prenom', label: 'PRÉNOM' },
    { key: 'utilisateur.promotion.libelle', label: 'PROMOTION' },
    { key: 'materiel.modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'materiel.numSerie', label: 'NUM SÉRIE' },
    { key: 'dateDebut', label: 'DATE DE DÉBUT' },
    { key: 'dateFin', label: 'DATE DE FIN PRÉVUE' },
    { key: 'dateRetourAnticipe', label: 'DATE RETOUR ANTICIPÉ' },
    { key: 'dateProlongation', label: 'DATE PROLONGATION' },
    { key: 'statutEmprunt.libelle', label: 'STATUT' },
  ];

  empruntService = inject(EmpruntService)
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);
  statutEmpruntService = inject(StatutEmpruntService);


  filtre = signal<string>('actif');
  listeStatut = signal<StatutEmprunt[]>([]);
  showDateModal = signal(false);
  pendingEvent = signal<DecisionEvent | null>(null);

  titre = computed(() =>
    this.filtre() === 'retard' ? 'Emprunts en retard' : 'Emprunts actif'
  );

  data = computed(() =>
    this.filtre() === 'retard'
      ? this.empruntService.listeRetardEmprunt()
      : this.empruntService.listeEmpruntActif()
  );

  erreurs = signal<Record<string, string>>({});

  ngOnInit(): void {

    const onError = (err: unknown) => this.notificationService.fromHttpError(err);

    this.route.queryParams.pipe(
      map((params) => (params['filtre'] ?? 'actif') as string),
      tap((filtre) => this.filtre.set(filtre)),
      switchMap((filtre) =>
        filtre === 'retard'
          ? this.empruntService.obtenirEmpruntEnRetard()
          : this.empruntService.obtenirListeEmpruntsActifs(),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      error: (err) => this.notificationService.fromHttpError(err),
    });

    this.statutEmpruntService.obtenirListeStatutEmpruntsAction().pipe(
      map(statuts =>
        this.authService.isAdmin()
          ? statuts
          : statuts.filter(s => s.code != null && ['DEMANDE_PROLONGATION', 'DEMANDE_RETOUR_ANTICIPE'].includes(s.code))
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (statuts) => this.listeStatut.set(statuts),
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
    if (!confirmed) return;

    this.empruntService.supprimerEmprunt(row.id)
      .pipe(
        switchMap(() =>
          this.filtre() === 'retard'
            ? this.empruntService.obtenirEmpruntEnRetard()
            : this.empruntService.obtenirListeEmpruntsActifs(),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notificationService.success('Emprunt supprimé'),
        error: (err) => this.notificationService.fromHttpError(err),
      });
  }

  async onDecisionChange(event: DecisionEvent): Promise<void> {
    this.erreurs.set({});

    if (event.code === 'DEMANDE_PROLONGATION' || event.code === 'DEMANDE_RETOUR_ANTICIPE') {
      const row = this.data().find(r => r.id === event.rowId);
      this.pendingEvent.set({ ...event, dateFin: row?.dateFin ?? '' });
      this.showDateModal.set(true);
      return;
    }

    const confirmed = await this.notificationService.confirm('Voulez-vous vraiment changer le statut ?');
    if (!confirmed) return;
    this.soumettreMajStatut(event);
  }

  onDateConfirmed(date: string): void {
    const event = this.pendingEvent();
    if (!event) return;
    this.showDateModal.set(false);
    this.pendingEvent.set(null);

    const appel$ = event.code === 'DEMANDE_PROLONGATION'
      ? this.empruntService.demanderProlongation(event.rowId, date)
      : this.empruntService.demanderRetourAnticipe(event.rowId, date);

    appel$.pipe(
      switchMap(() => this.filtre() === 'retard'
        ? this.empruntService.obtenirEmpruntEnRetard()
        : this.empruntService.obtenirListeEmpruntsActifs()
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => this.notificationService.success('Demande envoyée'),
      error: (err) => this.notificationService.fromHttpError(err),
    });
  }

  onDateCancelled(): void {
    this.showDateModal.set(false);
    this.pendingEvent.set(null);
  }

  soumettreMajStatut(event: DecisionEvent): void {
    this.empruntService.mettreAJourStatut(event.rowId, event.code!)
      .pipe(
        switchMap(() => this.empruntService.obtenirListeEmpruntsActifs()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.notificationService.success('Statut mis à jour'),
        error: (err) => this.notificationService.fromHttpError(err),
      });
  }
}
