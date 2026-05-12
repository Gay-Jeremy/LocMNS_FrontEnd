import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MaterielService} from '../../../core/services/materiel/materiel.service';
import {ModeleService} from '../../../core/services/modele/modele-service'
import {CategorieModeleService} from '../../../core/services/categorie-modele/categorie-modele.service';
import {StatutMaterielService} from '../../../core/services/statut-materiel/statut-materiel.service';
import {MaterielDto} from '../../../core/models/materiel-dto';

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

  // Mode
  materielId     = signal<number | null>(null);
  estModification = computed(() => this.materielId() !== null);

  // Champs
  categorieModeleId  = signal<number | null>(null);
  modeleId           = signal<number | null>(null);
  numSerie           = signal<string>('');
  statutMaterielId   = signal<number | null>(null);

  erreurs   = signal<Record<string, string>>({});
  succes    = signal<boolean>(false);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.categorieModeleService.obtenirListeCategorieModele().subscribe();
    this.statutMaterielService.obtenirListeStatutMateriel().subscribe();

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

  categorieModeleChange(id: number): void {
    this.categorieModeleId.set(id);
    this.modeleId.set(null); // reset le modèle quand la catégorie change
    this.modeleService.obtenirListeModeleParCategorie(id).subscribe();
  }

  onSubmit(form: NgForm): void {
    this.erreurs.set({});
    this.succes.set(false);

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
        this.succes.set(true);
        if (this.estModification()) {
          setTimeout(() => this.router.navigate(['/materiel/liste']), 1500);
        } else {
          form.reset();
          this.modeleService.listeModeleParCategorie.set([]);
          setTimeout(() => this.succes.set(false), 4000);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const erreurBack = err.error;
        if (typeof erreurBack === 'object' && erreurBack !== null) {
          this.erreurs.set(erreurBack);
        } else {
          this.erreurs.set({ erreur: err.message });
        }
      }
    });
  }

  onAnnuler(): void {
    this.router.navigate(['/materiel/liste']);
  }
}
