import {Component, inject, OnInit} from '@angular/core';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {RouterLink} from '@angular/router';
import {Auth} from '../../core/services/authentification/auth';

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
    { key: 'modele.categorieModele.libelle', label: 'CATEGORIE' },
    { key: 'modele.libelle', label: 'MODELE' },
    { key: 'numSerie', label: 'NUMERO SERIE' },
    { key: 'statutMateriel.libelle', label: 'STATUT' },

  ];

  authService = inject(Auth)

  materielService = inject(MaterielService)

  ngOnInit() {

    this.materielService.obtenirListeMateriel().subscribe();
  }
}
