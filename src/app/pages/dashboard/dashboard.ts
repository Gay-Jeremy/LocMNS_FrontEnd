import {Component, computed, DestroyRef, inject, OnInit} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import { MaterielService } from '../../core/services/materiel/materiel.service';
import {CommonModule} from '@angular/common';
import {StatCard} from '../../shared/components/stat-card/stat-card';
import {StatCardData} from '../../shared/models/stat-card.model';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';
import {RouterLink} from '@angular/router';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCard, Table, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  empruntService = inject(EmpruntService);
  materielService = inject(MaterielService);
  notification = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  titre: string = "Emprunts récents"

  colonnesEmpruntsRecent: ColonneConfig[] = [
    { key: 'utilisateur.nom', label: 'NOM' },
    { key: 'utilisateur.prenom', label: 'PRÉNOM' },
    { key: 'utilisateur.promotion.libelle', label: 'PROMOTION' },
    { key: 'materiel.modele.categorieModele.libelle', label: 'CATÉGORIE' },
    { key: 'materiel.numSerie', label: 'NUM SÉRIE' },
    { key: 'dateDebut', label: 'DATE DE DÉBUT' },
    { key: 'dateFin', label: 'DATE DE FIN PRÉVUE' },
    { key: 'statutEmprunt.libelle', label: 'STATUT' },
  ];

  dateJour = new Date();



  listStatsCard = computed<StatCardData[]>(() => [
    { nomLabel: 'MATÉRIEL', cptValeur: this.materielService.nbMateriel(), btnLabel: 'Voir le matériel', route: '/materiel/liste'},
    { nomLabel: 'EMPRUNT ACTIF', cptValeur: this.empruntService.nbEmpruntActif(), btnLabel: 'Voir les emprunts', route: '/emprunt/liste' },
    { nomLabel: 'DEMANDE EN COURS', cptValeur: this.empruntService.nbDemandeEmprunt(), btnLabel: 'Voir les demandes', route: '/demande/liste' },
    { nomLabel: 'INCIDENT SIGNALÉ', cptValeur: this.materielService.nbMaterielPanneSignalee(), btnLabel: 'Voir les incidents', route: '/materiel/incident' },
    { nomLabel: 'RETARD EMPRUNT', cptValeur: this.empruntService.nbRetardEmprunt(), btnLabel: 'Voir les retards', route: '/emprunt/liste', queryParams: { filtre: 'retard' } },
  ])

  ngOnInit(): void {
    const onError = (err: unknown) => this.notification.fromHttpError(err);

    this.empruntService.obtenirListeEmpruntsRecents()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.materielService.obtenirListeMateriel()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.empruntService.obtenirEmpruntEnRetard()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
  }
}
