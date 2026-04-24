import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {UtilisateurService} from '../../core/services/utilisateur/utilisateur.service'
import {CategorieModeleService} from '../../core/services/categorie-modele/categorie-modele.service';


@Component({
  selector: 'app-form-emprunt',
  imports: [
    FormsModule
  ],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})

export class FormEmprunt implements OnInit{

  erreurs = signal<Record<string, string>>({});

  materielService = inject(MaterielService);
  utilisateurService = inject(UtilisateurService);
  categorieModeleService = inject(CategorieModeleService);
  empruntService = inject(EmpruntService);


  utilisateurId = signal<number | null>(null);
  categorieModeleId = signal<number | null>(null);
  materielId  = signal<number | null>(null);

  dateDebut = signal<string>('');
  dateFin = signal<string>('');

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


  ngOnInit() {

    this.utilisateurService.obtenirListeUtilisateur().subscribe();

    this.categorieModeleService.obtenirListeCategorieModele().subscribe();
  }

  onRechercherMateriels(): void {
    if (!this.dateDebut() || !this.dateFin() || !this.categorieModeleId()) return;
    console.log(this.categorieModeleId())
    this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
      this.dateDebut(),
      this.dateFin(),
      this.categorieModeleId()!
    ).subscribe();
  }

  onSubmit(form: NgForm): void {

    this.erreurs.set({});

    const utilisateurId = this.utilisateurId();
    const materielId    = this.materielId();
    const categorieModeleId = this.categorieModeleId();

    if (!utilisateurId || !materielId || !categorieModeleId || !this.dateDebut() || !this.dateFin()) {
      this.erreurs.set({
        ...((!utilisateurId) && { utilisateurId: "L'utilisateur est obligatoire" }),
        ...((!categorieModeleId) && { categorieModeleId: "La catégorie matériel est obligatoire" }),
        ...((!materielId) && { materielId: "Le matériel est obligatoire" }),
        ...((!this.dateDebut()) && { dateDebut: "La date de début est obligatoire" }),
        ...((!this.dateFin()) && { dateFin: "La date de fin est obligatoire" }),
      });
      return;
    }

    this.empruntService.creerEmprunt({
      utilisateurId,
      materielId,
      dateDebut: this.dateDebut(),
      dateFin:   this.dateFin()
    }).subscribe({
      next: () => {
        this.erreurs.set({});
        alert('Emprunt enregistré');
        form.reset();
      },
      error: (err) => {
        const erreurBack = err.error;
        if (typeof erreurBack === 'object' && erreurBack !== null) {
          this.erreurs.set(erreurBack);
        } else {
          this.erreurs.set({ global: err.message });
        }
      }
    });
  }

  // Annuler
  onAnnuler(): void {
    console.log('Annulé');
  }
}
