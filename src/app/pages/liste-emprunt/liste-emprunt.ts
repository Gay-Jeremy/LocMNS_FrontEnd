import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import {CommonModule} from '@angular/common';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {Auth} from '../../core/services/authentification/auth';
import {NotificationService} from '../../core/services/notification/notification.service';
import {Emprunts} from '../../core/models/emprunt';
import {map, switchMap, tap} from 'rxjs';

@Component({
  selector: 'app-listEmprunt',
  imports: [CommonModule, Table, RouterLink],
  templateUrl: './liste-emprunt.html',
  styleUrl: './liste-emprunt.css',
})

export class ListeEmprunt implements OnInit {

  router = inject(Router)
  authService =inject(Auth)
  private readonly destroyRef = inject(DestroyRef);

  colonnesEmpruntsRecent: ColonneConfig[] = [
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
  route = inject(ActivatedRoute);
  notificationService = inject(NotificationService);

  filtre = signal<string>('actif');

  titre = computed(() =>
    this.filtre() === 'retard' ? 'Emprunts en retard' : 'Emprunts actif'
  );

  data = computed(() =>
    this.filtre() === 'retard'
      ? this.empruntService.listeRetardEmprunt()
      : this.empruntService.listeEmpruntActif()
  );

  ngOnInit(): void {
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
}
