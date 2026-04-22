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
  imports: [CommonModule, Table],
  templateUrl: './list-emprunt.html',
  styleUrl: './list-emprunt.css',
})

export class ListEmprunt implements OnInit {

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

  empruntService = inject(EmpruntService)
  materielService = inject(MaterielService)


  empruntsActif = signal<Emprunts[]>([]);
  empruntsRecent = signal<Emprunts[]>([]);
  materiels = signal<Materiel[]>([]);
  empruntsDemande = signal<Emprunts[]>([]);
  incidents = signal<Emprunts[]>([]);

  nbMateriels = computed(() => this.materiels().length);
  nbEmpruntsActif = computed(() => this.empruntsActif().length);
  nbEmpruntsDemande = computed(() => this.empruntsDemande().length);
  nbIncidents = computed(() => this.incidents().length);

  listStatsCard = computed<StatCardData[]>(() => [
    { nomLabel: 'MATÉRIEL', cptValeur: this.nbMateriels(), btnLabel: 'Voir le matériel' },
    { nomLabel: 'EMPRUNT ACTIF', cptValeur: this.nbEmpruntsActif(), btnLabel: 'Voir les emprunts' },
    { nomLabel: 'DEMANDE EN COURS', cptValeur: this.nbEmpruntsDemande(), btnLabel: 'Voir les demandes' },
    { nomLabel: 'INCIDENT SIGNALÉ', cptValeur: this.nbIncidents(), btnLabel: 'Voir les incidents' },
  ])


  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe(data => {
      this.empruntService.listeEmpruntActif.set(data)
    });

    this.empruntService.obtenirListeEmpruntsRecents().subscribe(data => {
      this.empruntService.listeEmpruntRecent.set(data);
      console.log(this.empruntsRecent())
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
