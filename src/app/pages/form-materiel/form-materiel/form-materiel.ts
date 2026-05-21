import {Component, computed, DestroyRef, inject, OnInit, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterielService} from '../../../core/services/materiel/materiel.service';
import {ModeleService} from '../../../core/services/modele/modele-service'
import {CategorieModeleService} from '../../../core/services/categorie-modele/categorie-modele.service';
import {StatutMaterielService} from '../../../core/services/statut-materiel/statut-materiel.service';
import {MaterielDto} from '../../../core/models/materiel-dto';
import {NotificationService} from '../../../core/services/notification/notification.service';
import {forkJoin, map, switchMap} from 'rxjs';

@Component({
  selector: 'app-form-materiel',
  imports: [FormsModule],
  templateUrl: './form-materiel.html',
  styleUrl: './form-materiel.css',
})
export class FormMateriel implements OnInit {

  materielService       = inject(MaterielService);
  modeleService         = inject(ModeleService);
  categorieModeleService = inject(CategorieModeleService);
  statutMaterielService = inject(StatutMaterielService);
  route                 = inject(ActivatedRoute);
  router                = inject(Router);
  notification          = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);

  materielId     = signal<number | null>(null);
  estModification = computed(() => this.materielId() !== null);

  categorieModeleId  = signal<number | null | 'new'>(null);
  modeleId           = signal<number | null | 'new'>(null);
  numSerie           = signal<string>('');
  statutMaterielId   = signal<number | null>(null);
  newCategorieLibelle = signal<string>('');
  newModeleLibelle = signal<string>('');

  erreurs   = signal<Record<string, string>>({});
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    const onError = (err: unknown) => this.notification.fromHttpError(err);

    forkJoin([
      this.categorieModeleService.obtenirListeCategorieModele(),
      this.statutMaterielService.obtenirListeStatutMateriel(),
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: onError });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.materielId.set(+id);
      this.chargerMateriel(+id);
    }
  }

  chargerMateriel(id: number): void {
    this.materielService.obtenirMaterielParId(id).pipe(
      switchMap((materiel) =>
        this.modeleService.obtenirListeModeleParCategorie(
          materiel.modele.categorieModele.id,
        ).pipe(map(() => materiel)),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (materiel) => {
        this.categorieModeleId.set(materiel.modele.categorieModele.id);
        this.modeleId.set(materiel.modele.id);
        this.numSerie.set(materiel.numSerie);
        this.statutMaterielId.set(materiel.statutMateriel?.id ?? null);
      },
      error: (err) => this.notification.fromHttpError(err),
    });
  }

  categorieModeleChange(id: string | number): void {
    if (id === 'new') {
      this.categorieModeleId.set('new');
      this.modeleId.set(null);
      return;
    }

    this.categorieModeleId.set(+id);
    this.modeleId.set(null);
    this.modeleService.obtenirListeModeleParCategorie(+id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ error: (err) => this.notification.fromHttpError(err) });
  }

  creerNouvelleCategorie(): void {
    if (!this.newCategorieLibelle().trim()) {
      this.erreurs.set({ categorieModeleId: 'Le libellé est obligatoire' });
      return;
    }

    this.categorieModeleService.creerCategorieModele({ libelle: this.newCategorieLibelle() })
      .pipe(
        switchMap((created) =>
          this.categorieModeleService.obtenirListeCategorieModele().pipe(
            map(() => created),
          ),
        ),
        switchMap((created) =>
          this.modeleService.obtenirListeModeleParCategorie(created.id).pipe(
            map(() => created),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => {
          this.categorieModeleId.set(created.id);
          this.newCategorieLibelle.set('');
        },
        error: (err) => {
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err, 'Erreur lors de la création');
          }
        },
      });
  }

  modeleChange(id: string | number): void {
    if (id === 'new') {
      this.modeleId.set('new');
      return;
    }
    this.modeleId.set(+id);
  }

  creerNouveauModele(): void {
    const categorieId = this.categorieModeleId();

    if (!this.newModeleLibelle().trim()) {
      this.erreurs.set({ modeleId: 'Le libellé est obligatoire' });
      return;
    }

    if (typeof categorieId !== 'number') return;

    this.modeleService.creerModele({
      libelle: this.newModeleLibelle(),
      categorieModeleId: categorieId
    }).pipe(
      switchMap((created) =>
        this.modeleService.obtenirListeModeleParCategorie(categorieId).pipe(
          map(() => created),
        ),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (created) => {
        this.modeleId.set(created.id);
        this.newModeleLibelle.set('');
      },
      error: (err) => {
        if (!this.notification.applyFieldErrors(err, this.erreurs)) {
          this.notification.fromHttpError(err, 'Erreur lors de la création');
        }
      },
    });
  }

  onSubmit(form: NgForm): void {
    this.erreurs.set({});

    const categorieModeleId = this.categorieModeleId();
    const modeleId          = this.modeleId();
    const numSerie          = this.numSerie();

    if (!categorieModeleId || !modeleId || !numSerie) {
      this.erreurs.set({
        ...(!categorieModeleId && { categorieModeleId: 'La catégorie est obligatoire' }),
        ...(!modeleId          && { modeleId: 'Le modèle est obligatoire' }),
        ...(!numSerie          && { numSerie: 'Le numéro de série est obligatoire' }),
      });
      return;
    }

    this.isLoading.set(true);

    const payload: MaterielDto = {
      numSerie,
      categorieId: this.categorieModeleId(),
      modeleId,
      statutId: this.statutMaterielId(),
      salleId: null
    };

    const requete$ = this.estModification()
      ? this.materielService.modifierMateriel(this.materielId()!, payload)
      : this.materielService.creerMateriel(payload);

    requete$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.isLoading.set(false);
        const msg = this.estModification()
          ? 'Matériel modifié avec succès'
          : 'Matériel enregistré avec succès';
        this.notification.success(msg);
        if (this.estModification()) {
          setTimeout(() => this.router.navigate(['/materiel/liste']), 1500);
        } else {
          form.reset();
          this.modeleService.listeModeleParCategorie.set([]);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (!this.notification.applyFieldErrors(err, this.erreurs)) {
          this.notification.fromHttpError(err);
        }
      },
    });
  }

  onAnnuler(): void {
    this.router.navigate(['/materiel/liste']);
  }
}
