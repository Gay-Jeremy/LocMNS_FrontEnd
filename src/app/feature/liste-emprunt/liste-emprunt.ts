import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import { MaterielService } from '../../core/services/materiel/materiel.service';
import {CommonModule, DatePipe} from '@angular/common';
import {StatCardData} from '../../shared/models/stat-card.model';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, Table],
  templateUrl: './liste-emprunt.html',
  styleUrl: './liste-emprunt.css',
})

export class ListeEmprunt implements OnInit {

  titre: string = "Liste des emprunts";

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

  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe(data => {
      this.empruntService.listeEmpruntActif.set(data)
    });
  }
}
