import {Component, inject, OnInit} from '@angular/core';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {RouterLink} from '@angular/router';

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
    { key: 'numSerie', label: 'NUM SÉRIE' },
    { key: 'statutMateriel.libelle', label: 'STATUT' },
  ];

  empruntService = inject(EmpruntService)
  materielService = inject(MaterielService)

  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
    this.materielService.obtenirListeMaterielPanneSignalee().subscribe();
  }
}
