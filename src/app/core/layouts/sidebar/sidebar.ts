import {Component, inject, OnInit} from '@angular/core';
import {EmpruntService} from '../../services/emprunt/emprunt.service';
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
export class Sidebar implements OnInit {

  empruntService = inject(EmpruntService)

  ngOnInit() {
    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
    this.empruntService.obtenirListeDemandesEmprunt().subscribe();
    this.empruntService.obtenirListePannesSignalees().subscribe();
  }

}
