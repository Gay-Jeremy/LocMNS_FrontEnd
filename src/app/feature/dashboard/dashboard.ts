import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import { MaterielService } from '../../core/services/materiel/materiel.service';
import {CommonModule, DatePipe} from '@angular/common';
import {Emprunts} from '../../core/models/emprunt';
import {Materiel} from '../../core/models/materiel';
import {StatCard} from '../../shared/components/stat-card/stat-card';
import {StatCardData} from '../../shared/models/stat-card.model';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StatCard, Table],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  empruntService = inject(EmpruntService);
  materielService = inject(MaterielService);

  colonnesEmpruntsRecent: ColonneConfig[] = [
    { key: 'utilisateur.nom', label: 'NOM' },
    { key: 'utilisateur.prenom', label: 'PRÉNOM' },
    { key: 'utilisateur.promotion.libelle', label: 'PROMOTION' },
    { key: 'materiel.modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'materiel.numSerie', label: 'NUM SÉRIE' },
    { key: 'dateDebut', label: 'DATE DE DÉBUT' },
    { key: 'dateFin', label: 'DATE DE FIN PRÉVUE' },
    { key: 'statutEmprunt.libelle', label: 'STATUT' },
  ];

  dateJour = new Date();



  listStatsCard = computed<StatCardData[]>(() => [
    { nomLabel: 'MATÉRIEL', cptValeur: this.materielService.nbMateriel(), btnLabel: 'Voir le matériel' },
    { nomLabel: 'EMPRUNT ACTIF', cptValeur: this.empruntService.nbEmpruntActif(), btnLabel: 'Voir les emprunts' },
    { nomLabel: 'DEMANDE EN COURS', cptValeur: this.empruntService.nbDemandeEmprunt(), btnLabel: 'Voir les demandes' },
    { nomLabel: 'INCIDENT SIGNALÉ', cptValeur: this.empruntService.nbPanneSignalee(), btnLabel: 'Voir les incidents' },
  ])

  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe(data => {
      this.empruntService.listeEmpruntActif.set(data);
    });

    this.empruntService.obtenirListeEmpruntsRecents().subscribe(data => {
      this.empruntService.listeEmpruntRecent.set(data);
    });

    this.materielService.obtenirListeMateriel().subscribe(data => {
      this.materielService.listeMateriel.set(data);
    });

    this.empruntService.obtenirListeDemandesEmprunt().subscribe(data => {
      this.empruntService.listeDemandeEmprunt.set(data);
    })

    this.empruntService.obtenirListePannesSignalees().subscribe(data => {
      this.empruntService.listePanneSignalee.set(data);
    })
  }
}
