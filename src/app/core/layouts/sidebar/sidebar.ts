import { Component, DestroyRef, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly destroyRef = inject(DestroyRef);

  readonly nbDemandeEmprunt = this.empruntService.nbDemandeEmprunt;
  readonly nbEmpruntActif   = this.empruntService.nbEmpruntActif;
  readonly nbPanneSignalee  = this.materielService.nbMaterielPanneSignalee;

  ngOnInit(): void {
    const onError = (err: unknown) => this.notification.fromHttpError(err);

    this.empruntService.obtenirListeEmpruntsActifs()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.empruntService.obtenirListeDemandesEmprunt()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
    this.materielService.obtenirListeMaterielPanneSignalee()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });
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
