import {Component, inject, OnInit, signal} from '@angular/core';
import {Table} from '../../shared/components/table/table';
import {ColonneConfig} from '../../shared/models/colonne-config.model';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {RouterLink} from '@angular/router';
import {Auth} from '../../core/services/authentification/auth';
import {StatutMaterielService} from '../../core/services/statut-materiel/statut-materiel.service';
import {StatutMateriel} from '../../core/models/statut-materiel';
import {map, Observable, switchMap, tap} from 'rxjs';
import {DecisionEvent} from '../../shared/models/decision-event.model';
import {NotificationService} from '../../core/services/notification/notification.service';

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
  statutMaterielService = inject(StatutMaterielService)
  notification = inject(NotificationService);

  listeStatut = signal<StatutMateriel[]>([]);
  erreurs = signal<Record<string, string>>({});
  succes = signal<boolean>(false);

  ngOnInit() {

    this.materielService.obtenirListeMateriel().subscribe();


    this.statutMaterielService.obtenirListeStatutMateriel().pipe(
      map(statuts =>
        this.authService.isAdmin()
          ? statuts
          : statuts.filter(s => s.code != null && ['INCIDENT', 'PANNE'].includes(s.code))
      ),
    ).subscribe(statuts => this.listeStatut.set(statuts));
  }

  async onDecisionChange(event: DecisionEvent): Promise<void> {
    this.erreurs.set({});
    this.succes.set(false);
    const confirmed = await this.notification.confirm('Voulez-vous vraiment changer le statut ?');

    if (!confirmed) return;

    this.materielService.mettreAJourStatut(event.rowId, event.statutId)
      .pipe(switchMap(() => this.materielService.obtenirListeMateriel()))
      .subscribe({
        next: () => this.notification.success('Statut mis à jour'),
        error: (err) => this.notification.fromHttpError(err)
      });
  }
}
