import {Component, computed, OnInit, signal} from '@angular/core';
import {Emprunts} from '../../models/emprunt';
import {EmpruntService} from '../../services/emprunt/emprunt.service';
import {MaterielService} from '../../services/materiel/materiel.service';
import {RouterLink, RouterLinkActive} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit{

  empruntsDemande = signal<Emprunts[]>([]);
  empruntsPanne  = signal<Emprunts[]>([]);
  empruntActif = signal<Emprunts[]>([])

  constructor(
    protected empruntService: EmpruntService,
  ) {};

  ngOnInit() {

    this.empruntService.obtenirListeDemandesEmprunt().subscribe();


    this.empruntService.obtenirListePannesSignalees().subscribe();

    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
  }
}
