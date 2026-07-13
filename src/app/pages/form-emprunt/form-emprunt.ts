import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpruntService } from '../../core/services/emprunt/emprunt.service';
import { MaterielService } from '../../core/services/materiel/materiel.service';
import { UtilisateurService } from '../../core/services/utilisateur/utilisateur.service';
import { CategorieModeleService } from '../../core/services/categorie-modele/categorie-modele.service';
import { EmpruntDto } from '../../core/models/emprunt-dto';
import { AuthService } from '../../core/services/authentification/auth.service';
import { NotificationService } from '../../core/services/notification/notification.service';
import { forkJoin, map, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-form-emprunt',
  imports: [FormsModule],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})
export class FormEmprunt implements OnInit {
  materielService = inject(MaterielService);
  utilisateurService = inject(UtilisateurService);
  categorieModeleService = inject(CategorieModeleService);
  empruntService = inject(EmpruntService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthService);
  notification = inject(NotificationService);

  private readonly destroyRef = inject(DestroyRef);

  private readonly rechercheMateriel$ = new Subject<{
    dateDebut: string;
    dateFin: string;
    categorieModeleId: number;
  }>();

  empruntId = signal<number | null>(null);
  estModification = computed(() => this.empruntId() !== null);

  utilisateurId = signal<number | null>(null);
  categorieModeleId = signal<number | null>(null);
  materielId = signal<number | null>(null);
  dateDebut = signal<string>('');
  dateFin = signal<string>('');
  note = signal<string>('');
  erreurDates = signal<string[]>([]);

  erreurs = signal<Record<string, string>>({});
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    const onError = (err: unknown) => this.notification.fromHttpError(err);

    forkJoin([
      this.utilisateurService.obtenirListeUtilisateur(),
      this.categorieModeleService.obtenirListeCategorieModele(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });

    this.rechercheMateriel$
      .pipe(
        switchMap(({ dateDebut, dateFin, categorieModeleId }) =>
          this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
            dateDebut,
            dateFin,
            categorieModeleId,
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({ error: onError });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empruntId.set(+id);
      this.chargerEmprunt(+id);
    } else if (!this.authService.isAdmin()) {
      const idJwt = this.authService.jwtInfo()?.id;
      if (idJwt) this.utilisateurId.set(+idJwt);
    }
  }

  chargerEmprunt(id: number): void {
    this.empruntService
      .obtenirEmpruntParId(id)
      .pipe(
        switchMap((emprunt) => {
          this.utilisateurId.set(emprunt.utilisateur.id);
          this.dateDebut.set(emprunt.dateDebut);
          this.dateFin.set(emprunt.dateFin);
          this.categorieModeleId.set(emprunt.materiel.modele.categorieModele.id);
          this.note.set(emprunt.note);

          return this.materielService
            .obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
              emprunt.dateDebut,
              emprunt.dateFin,
              emprunt.materiel.modele.categorieModele.id,
            )
            .pipe(map((listeMateriel) => ({ emprunt, listeMateriel })));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: ({ emprunt, listeMateriel }) => {
          const dejaDansListe = listeMateriel.some(
            (materiel) => materiel.id === emprunt.materiel.id,
          );
          if (!dejaDansListe) {
            this.materielService.listeMaterielDisponiblePourPeriodeParIdCategorie.update(
              (liste) => [emprunt.materiel, ...liste],
            );
          }
          this.materielId.set(emprunt.materiel.id);
        },
        error: (err) => this.notification.fromHttpError(err),
      });
  }

  dateDebutChange(date: string): void {
    this.dateDebut.set(date);
    this.validerDates();
    this.onRechercherMateriels();
  }

  dateFinChange(date: string): void {
    this.dateFin.set(date);
    this.validerDates();
    this.onRechercherMateriels();
  }

  validerDates(): void {
    const debut = this.dateDebut();
    const fin = this.dateFin();
    const dateActuelle = new Date().toISOString().split('T')[0];
    const erreurs: string[] = [];

    if (debut && debut < dateActuelle) {
      erreurs.push('La date de début ne peut pas être dans le passé');
    }

    if (fin && fin < dateActuelle) {
      erreurs.push('La date de fin ne peut pas être dans le passé');
    }

    if (debut && fin && fin <= debut) {
      erreurs.push('La date de fin doit être supérieure à la date de début');
    }

    this.erreurDates.set(erreurs);
  }

  categorieModeleChange(id: number): void {
    this.categorieModeleId.set(id);
    this.onRechercherMateriels();
  }

  onRechercherMateriels(): void {
    const dateDebut = this.dateDebut();
    const dateFin = this.dateFin();
    const categorieModeleId = this.categorieModeleId();
    if (!dateDebut || !dateFin || !categorieModeleId) return;

    this.rechercheMateriel$.next({ dateDebut, dateFin, categorieModeleId });
  }

  async onSubmit(form: NgForm): Promise<void> {
    this.erreurs.set({});

    const utilisateurId = this.utilisateurId();
    const materielId = this.materielId();
    const categorieModeleId = this.categorieModeleId();

    if (
      !utilisateurId ||
      !materielId ||
      !categorieModeleId ||
      !this.dateDebut() ||
      !this.dateFin()
    ) {
      this.erreurs.set({
        ...(!utilisateurId && { utilisateurId: "L'utilisateur est obligatoire" }),
        ...(!categorieModeleId && { categorieModeleId: 'La catégorie matériel est obligatoire' }),
        ...(!materielId && { materielId: 'Le matériel est obligatoire' }),
        ...(!this.dateDebut() && { dateDebut: 'La date de début est obligatoire' }),
        ...(!this.dateFin() && { dateFin: 'La date de fin est obligatoire' }),
      });
      return;
    }

    const dataEmprunt: EmpruntDto = {
      utilisateurId,
      materielId,
      dateDebut: this.dateDebut(),
      dateFin: this.dateFin(),
      note: this.note(),
    };

    const confirmed = await this.notification.confirm(
      this.estModification()
        ? 'Voulez-vous vraiment modifier cet emprunt ?'
        : 'Voulez-vous vraiment enregistrer cet emprunt ?',
      this.estModification() ? 'Modification' : 'Confirmation',
    );
    if (!confirmed) return;

    this.isLoading.set(true);

    const handleError = (err: unknown) => {
      this.isLoading.set(false);
      if (!this.notification.applyFieldErrors(err, this.erreurs)) {
        this.notification.fromHttpError(err);
      }
    };

    if (this.estModification()) {
      this.empruntService
        .modifierEmprunt(this.empruntId()!, dataEmprunt)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.isLoading.set(false);
            this.notification.success('Emprunt modifié avec succès');
            setTimeout(() => this.router.navigate(['/emprunt/liste']), 1500);
          },
          error: handleError,
        });
      return;
    }

    this.empruntService
      .creerEmprunt(dataEmprunt)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.erreurs.set({});
          this.notification.success('Emprunt enregistré avec succès');
          form.reset();
        },
        error: handleError,
      });
  }

  onAnnuler(): void {
    this.router.navigate(['/emprunt/liste']);
  }
}
