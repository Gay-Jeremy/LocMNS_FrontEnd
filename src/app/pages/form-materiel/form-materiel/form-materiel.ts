import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterielService} from '../../../core/services/materiel/materiel.service';
import {ModeleService} from '../../../core/services/modele/modele-service'
import {CategorieModeleService} from '../../../core/services/categorie-modele/categorie-modele.service';
import {StatutMaterielService} from '../../../core/services/statut-materiel/statut-materiel.service';
import {MaterielDto} from '../../../core/models/materiel-dto';
import {NotificationService} from '../../../core/services/notification/notification.service';

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

  // Mode
  materielId     = signal<number | null>(null);
  estModification = computed(() => this.materielId() !== null);

  // Champs
  categorieModeleId  = signal<number | null | 'new'>(null);
  modeleId           = signal<number | null | 'new'>(null);
  numSerie           = signal<string>('');
  statutMaterielId   = signal<number | null>(null);
  newCategorieLibelle = signal<string>('');
  newModeleLibelle = signal<string>('');

  erreurs   = signal<Record<string, string>>({});
  isLoading = signal<boolean>(false);

  ngOnInit() {
    const onError = (err: unknown) => this.notification.fromHttpError(err);
    this.categorieModeleService.obtenirListeCategorieModele().subscribe({ error: onError });
    this.statutMaterielService.obtenirListeStatutMateriel().subscribe({ error: onError });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.materielId.set(+id);
      this.chargerMateriel(+id);
    }
  }

  chargerMateriel(id: number): void {
    this.materielService.obtenirMaterielParId(id).subscribe(materiel => {
      this.categorieModeleId.set(materiel.modele.categorieModele.id);

      // Charger les modèles de la catégorie PUIS sélectionner le bon
      this.modeleService.obtenirListeModeleParCategorie(
        materiel.modele.categorieModele.id
      ).subscribe(() => {
        this.modeleId.set(materiel.modele.id);
      });

      this.numSerie.set(materiel.numSerie);
      this.statutMaterielId.set(materiel.statutMateriel?.id ?? null);
    });
  }




  categorieModeleChange(id: any): void {
    if (id === 'new') {
      this.categorieModeleId.set('new'); // ← affiche le champ immédiatement
      this.modeleId.set(null);
      return; // ← on s'arrête là, pas de validation ici
    }

    this.categorieModeleId.set(+id);
    this.modeleId.set(null);
    this.modeleService.obtenirListeModeleParCategorie(+id).subscribe();
  }

// Nouvelle méthode appelée par un bouton dédié
  creerNouvelleCategorie(): void {
    if (!this.newCategorieLibelle().trim()) {
      this.erreurs.set({ categorieModeleId: 'Le libellé est obligatoire' });
      return;
    }

    this.categorieModeleService.creerCategorieModele({ libelle: this.newCategorieLibelle() })
      .subscribe({
        next: (created) => {
          this.categorieModeleService.obtenirListeCategorieModele().subscribe();
          this.categorieModeleId.set(created.id); // ← sélectionne la nouvelle catégorie
          this.newCategorieLibelle.set('');
          this.modeleService.obtenirListeModeleParCategorie(created.id).subscribe();
        },
        error: (err) => {
          if (!this.notification.applyFieldErrors(err, this.erreurs)) {
            this.notification.fromHttpError(err, 'Erreur lors de la création');
          }
        },
      });
  }

  modeleChange(id: any): void {
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
    }).subscribe({
      next: (created) => {
        this.modeleService.obtenirListeModeleParCategorie(categorieId).subscribe();
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

    requete$.subscribe({
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
