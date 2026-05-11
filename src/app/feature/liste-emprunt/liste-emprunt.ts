import {Component, computed, inject, OnInit, signal} from '@angular/core';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import {CommonModule, DatePipe} from '@angular/common';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {Table} from '../../shared/components/table/table';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'app-listEmprunt',
  imports: [CommonModule, Table, RouterLink],
  templateUrl: './liste-emprunt.html',
  styleUrl: './liste-emprunt.css',
})

export class ListeEmprunt implements OnInit {

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

  empruntService = inject(EmpruntService)
  route = inject(ActivatedRoute);

  filtre = signal<string>('actif');

  titre = computed(() =>
    this.filtre() === 'retard' ? 'Emprunts en retard' : 'Emprunts actif'
  );

  data = computed(() =>
    this.filtre() === 'retard'
      ? this.empruntService.listeRetardEmprunt()
      : this.empruntService.listeEmpruntActif()
  );

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const filtre = params['filtre'] ?? 'actif';
      this.filtre.set(filtre);

      if (filtre === 'retard') {
        this.empruntService.obtenirEmpruntEnRetard().subscribe();
      } else {
        this.empruntService.obtenirListeEmpruntsActifs().subscribe();
      }
    });
  }
}
