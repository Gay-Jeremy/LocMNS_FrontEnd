import {Component, computed, OnInit, signal} from '@angular/core';
import {Emprunts} from '../../../models/emprunt';
import {EmpruntService} from '../../../../feature/emprunts/services/emprunt.service';
import {MaterielService} from '../../../../feature/materiels/services/materiel.service';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{

  empruntsDemande = signal<Emprunts[]>([]);
  nbEmpruntsDemande = computed(() => this.empruntsDemande().length);
  empruntsPanne  = signal<Emprunts[]>([]);
  nbPanneSignalee = computed(() => this.empruntsPanne().length);

  constructor(
    private empruntService: EmpruntService,
  ) {};

  ngOnInit() {

    this.empruntService.obtenirListeDemandesEmprunt().subscribe(data => {
      this.empruntsDemande.set(data);
    });

    this.empruntService.obtenirListePannesSignalees().subscribe(data => {
      this.empruntsPanne.set(data);
    });
  }
}
