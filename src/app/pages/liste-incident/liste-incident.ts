import {Component, inject, OnInit, signal} from '@angular/core';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {RouterLink} from '@angular/router';
import {StatutMaterielService} from '../../core/services/statut-materiel/statut-materiel.service';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {switchMap} from 'rxjs';

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
    { key: 'modele.libelle', label: 'MODELE' },
    { key: 'numSerie', label: 'NUM SÉRIE' },
    { key: 'statutMateriel.libelle', label: 'STATUT' },
  ];

  empruntService = inject(EmpruntService)
  materielService = inject(MaterielService)
  statutMaterielService = inject(StatutMaterielService)

  erreurs = signal<Record<string, string>>({});
  succes = signal<boolean>(false);

  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
    this.materielService.obtenirListeMaterielPanneSignalee().subscribe();
    this.statutMaterielService.obtenirListeStatutMateriel().subscribe();
  }

  onDecisionChange(event: DecisionEvent): void {
    this.erreurs.set({});
    this.succes.set(false);

    this.materielService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(switchMap(() => this.materielService.obtenirListeMaterielPanneSignalee()))
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
