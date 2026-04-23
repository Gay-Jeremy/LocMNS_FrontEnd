import {Component, inject} from '@angular/core';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {Table} from '../../shared/components/table/table';

@Component({
  selector: 'app-liste-demande',
  imports: [
    Table
  ],
  templateUrl: './liste-demande.html',
  styleUrl: './liste-demande.css',
})
export class ListeDemande {

  colonnesDemande: ColonneConfig[] = [
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

  ngOnInit() {

    this.empruntService.obtenirListeDemandesEmprunt().subscribe();
  }
}
