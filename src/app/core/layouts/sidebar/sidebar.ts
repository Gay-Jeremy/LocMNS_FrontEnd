import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { EmpruntService } from '../../services/emprunt/emprunt.service';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MaterielService} from '../../services/materiel/materiel.service';
import {Auth} from '../../services/authentification/auth';
import {NotificationService} from '../../services/notification/notification.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {

  authService = inject(Auth)
  router = inject(Router)
  notification = inject(NotificationService)

  @Output() closeMenu = new EventEmitter<void>();


  private readonly empruntService = inject(EmpruntService);
  private readonly materielService = inject(MaterielService);

  readonly nbDemandeEmprunt = this.empruntService.nbDemandeEmprunt;
  readonly nbEmpruntActif   = this.empruntService.nbEmpruntActif;
  readonly nbPanneSignalee  = this.materielService.nbMaterielPanneSignalee;

  ngOnInit() {
    this.empruntService.obtenirListeEmpruntsActifs().subscribe();
    this.empruntService.obtenirListeDemandesEmprunt().subscribe();
    this.materielService.obtenirListeMaterielPanneSignalee().subscribe();
  }

  onNavClick() {
    this.closeMenu.emit();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.authService.jwtInfo.set(null);
    this.notification.info('Vous êtes déconnecté'); // optionnel
    this.router.navigate(['/login']);
  }
}
