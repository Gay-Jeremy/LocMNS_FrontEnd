import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpruntService } from '../../services/emprunt/emprunt.service';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Output() closeMenu = new EventEmitter<void>();

  private readonly empruntService = inject(EmpruntService);

  readonly nbDemandeEmprunt = this.empruntService.nbDemandeEmprunt;
  readonly nbEmpruntActif   = this.empruntService.nbEmpruntActif;
  readonly nbPanneSignalee  = this.empruntService.nbPanneSignalee;

  ngOnInit() {
    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
    this.empruntService.obtenirListeDemandesEmprunt().subscribe();
    this.empruntService.obtenirListePannesSignalees().subscribe();
  }

  onNavClick() {
    this.closeMenu.emit();
  }
}
