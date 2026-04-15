import {Component, computed, OnInit, signal} from '@angular/core';
import { EmpruntService } from '../../../core/services/emprunt/emprunt.service';
import { MaterielService } from '../../../core/services/materiel/materiel.service';
import {CommonModule, DatePipe} from '@angular/common';
import {Emprunts} from '../../../core/models/emprunt';
import {Materiel} from '../../../core/models/materiel';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],  // ← CommonModule manquait
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})

export class Dashboard implements OnInit {

  dateJour = new Date();

  empruntsActif = signal<Emprunts[]>([]);
  empruntsRecent = signal<Emprunts[]>([]);
  materiels = signal<Materiel[]>([]);
  empruntsDemande = signal<Emprunts[]>([]);
  incidents = signal<Emprunts[]>([]);

  nbMateriels = computed(() => this.materiels().length);
  nbEmpruntsActif = computed(() => this.empruntsActif().length);
  nbEmpruntsDemande = computed(() => this.empruntsDemande().length);
  nbIncidents = computed(() => this.incidents().length);

  constructor(
    private empruntService: EmpruntService,
    private materielService: MaterielService
  ) {}; // ← type corrigé


  ngOnInit() {

    this.empruntService.obtenirListeEmpruntsActifs().subscribe(data => {
      this.empruntsActif.set(data);
    });

    this.empruntService.obtenirListeEmpruntsRecents().subscribe(data => {
      this.empruntsRecent.set(data);
      console.log(this.empruntsRecent())
    });

    this.materielService.obtenirListeMateriel().subscribe(data => {
      this.materiels.set(data);
    });

    this.empruntService.obtenirListeDemandesEmprunt().subscribe(data => {
      this.empruntsDemande.set(data);
    })

    this.empruntService.obtenirListePannesSignalees().subscribe(data => {
      this.incidents.set(data);
    })
  }
}
