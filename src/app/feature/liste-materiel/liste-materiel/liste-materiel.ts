import {Component, inject, OnInit} from '@angular/core';
import {Table} from '../../../shared/components/table/table';
import {ColonneConfig} from '../../../shared/models/colonne-config.model';
import {MaterielService} from '../../../core/services/materiel/materiel.service';

@Component({
  selector: 'app-liste-materiel',
  imports: [
    Table
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

  titre: string = 'Materiel'

  dateJour = new Date();

  materielService = inject(MaterielService)

  ngOnInit() {

    this.materielService.obtenirListeMateriel().subscribe(data => {
      this.materielService.listeMateriel.set(data)
    });
  }
}
