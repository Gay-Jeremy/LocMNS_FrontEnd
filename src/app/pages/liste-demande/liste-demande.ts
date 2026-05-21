import {Component, inject, OnInit, signal} from '@angular/core';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {Table} from '../../shared/components/table/table';
import {RouterLink} from '@angular/router';
import {StatutEmprunt} from '../../core/services/statut-emprunt/statut-emprunt';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {switchMap} from 'rxjs';
import {Auth} from '../../core/services/authentification/auth';

@Component({
  selector: 'app-liste-demande',
  imports: [
    Table,
    RouterLink
  ],
  templateUrl: './liste-demande.html',
  styleUrl: './liste-demande.css',
})
export class ListeDemande implements OnInit {

  colonnesDemande: ColonneConfig[] = [
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

  empruntService = inject(EmpruntService)
  statutEmpruntService = inject(StatutEmprunt)
  authService = inject(Auth)

  erreurs = signal<Record<string, string>>({});
  succes = signal<boolean>(false);

  ngOnInit() {

    this.empruntService.obtenirListeDemandesEmprunt().subscribe();

  }

  onDecisionChange(event: DecisionEvent): void {
    this.erreurs.set({});
    this.succes.set(false);

    this.empruntService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(switchMap(() => this.empruntService.obtenirListeDemandesEmprunt()))
      .subscribe({
        next: () => {
          this.succes.set(true);
          setTimeout(() => this.succes.set(false), 4000);
        },
        error: (err) => {
          const erreurBack = err.error;
          if (typeof erreurBack === 'object' && erreurBack !== null) {
            this.erreurs.set(erreurBack);
          } else {
            this.erreurs.set({ global: err.message });
          }
        }
      });
  }
}
