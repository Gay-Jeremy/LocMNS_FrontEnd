import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {UtilisateurService} from '../../core/services/utilisateur/utilisateur.service';
import {CategorieModeleService} from '../../core/services/categorie-modele/categorie-modele.service';

@Component({
  selector: 'app-form-emprunt',
  imports: [FormsModule],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})
export class FormEmprunt implements OnInit {

  materielService       = inject(MaterielService);
  utilisateurService    = inject(UtilisateurService);
  categorieModeleService = inject(CategorieModeleService);
  empruntService        = inject(EmpruntService);
  route                 = inject(ActivatedRoute);
  router                = inject(Router);

  // Mode
  empruntId = signal<number | null>(null);
  estModification = computed(() => this.empruntId() !== null);

  // Champs
  utilisateurId    = signal<number | null>(null);
  categorieModeleId = signal<number | null>(null);
  materielId       = signal<number | null>(null);
  dateDebut        = signal<string>('');
  dateFin          = signal<string>('');

  erreurs = signal<Record<string, string>>({});
  succes  = signal<boolean>(false);

  ngOnInit() {
    this.utilisateurService.obtenirListeUtilisateur().subscribe();
    this.categorieModeleService.obtenirListeCategorieModele().subscribe();

    // Détecter si on est en mode modification
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.empruntId.set(+id);
      this.chargerEmprunt(+id);
    }
  }

  chargerEmprunt(id: number): void {
    this.empruntService.obtenirEmpruntParId(id).subscribe(emprunt => {
      this.utilisateurId.set(emprunt.utilisateur.id);
      this.dateDebut.set(emprunt.dateDebut);
      this.dateFin.set(emprunt.dateFin);
      this.categorieModeleId.set(emprunt.materiel.modele.categorieModele.id);

      this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
        emprunt.dateDebut,
        emprunt.dateFin,
        emprunt.materiel.modele.categorieModele.id
      ).subscribe((listeMateriel) => {
        const dejaDansListe = listeMateriel.some(m => m.id === emprunt.materiel.id);
        if (!dejaDansListe) {
          this.materielService.listeMaterielDisponiblePourPeriodeParIdCategorie
            .update(l => [emprunt.materiel, ...l]);
        }
        this.materielId.set(emprunt.materiel.id);
      });
    });
  }

  dateDebutChange(date: string): void {
    this.dateDebut.set(date);
    this.onRechercherMateriels();
  }

  dateFinChange(date: string): void {
    this.dateFin.set(date);
    this.onRechercherMateriels();
  }

  categorieModeleChange(id: number): void {
    this.categorieModeleId.set(id);
    this.onRechercherMateriels();
  }

  onRechercherMateriels(): void {
    if (!this.dateDebut() || !this.dateFin() || !this.categorieModeleId()) return;
    this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
      this.dateDebut(),
      this.dateFin(),
      this.categorieModeleId()!
    ).subscribe();
  }

  onSubmit(form: NgForm): void {
    this.erreurs.set({});
    this.succes.set(false);

    const utilisateurId     = this.utilisateurId();
    const materielId        = this.materielId();
    const categorieModeleId = this.categorieModeleId();

    if (!utilisateurId || !materielId || !categorieModeleId || !this.dateDebut() || !this.dateFin()) {
      this.erreurs.set({
        ...(!utilisateurId      && { utilisateurId: "L'utilisateur est obligatoire" }),
        ...(!categorieModeleId  && { categorieModeleId: "La catégorie matériel est obligatoire" }),
        ...(!materielId         && { materielId: "Le matériel est obligatoire" }),
        ...(!this.dateDebut()   && { dateDebut: "La date de début est obligatoire" }),
        ...(!this.dateFin()     && { dateFin: "La date de fin est obligatoire" }),
      });
      return;
    }

    const payload = {
      utilisateurId,
      materielId,
      dateDebut: this.dateDebut(),
      dateFin:   this.dateFin()
    };

    // ── Modification ──
    if (this.estModification()) {
      this.empruntService.modifierEmprunt(this.empruntId()!, payload).subscribe({
        next: () => {
          this.succes.set(true);
          setTimeout(() => this.router.navigate(['/emprunt/liste']), 1500);
        },
        error: (err) => this.erreurs.set(err.error ?? { erreur: err.message })
      });
      return;
    }

    // ── Création ──
    this.empruntService.creerEmprunt(payload).subscribe({
      next: () => {
        this.erreurs.set({});
        this.succes.set(true);
        form.reset();
        setTimeout(() => this.succes.set(false), 4000);
      },
      error: (err) => {
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
    this.router.navigate(['/emprunt/liste']);
  }
}
