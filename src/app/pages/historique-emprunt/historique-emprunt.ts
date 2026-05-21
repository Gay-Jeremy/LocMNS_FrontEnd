import {Component, inject, OnInit} from '@angular/core';
import {Table} from '../../shared/components/table/table';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {RouterLink} from '@angular/router';
import {NotificationService} from '../../core/services/notification/notification.service';

@Component({
  selector: 'app-historique-emprunt',
  imports: [
    Table,
    RouterLink
  ],
  templateUrl: './historique-emprunt.html',
  styleUrl: './historique-emprunt.css',
})
export class HistoriqueEmprunt implements OnInit {

  empruntService = inject(EmpruntService);
  notification = inject(NotificationService);

  colonnesHistorique: ColonneConfig[] = [
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

  ngOnInit () {

    this.empruntService.obtenirHistoriqueEmprunt().subscribe({
      error: (err) => this.notification.fromHttpError(err),
    });
  }
}
