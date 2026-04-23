import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormsModule, NgForm} from '@angular/forms';
import {EmpruntService} from '../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../core/services/materiel/materiel.service';
import {UtilisateurService} from '../../core/services/utilisateur/utilisateur.service'
import {CategorieModeleService} from '../../core/services/categorie-modele/categorie-modele.service';
import {Table} from '../../shared/components/table/table';


@Component({
  selector: 'app-form-emprunt',
  imports: [
    FormsModule
  ],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})

export class FormEmprunt implements OnInit{


  materielService = inject(MaterielService);
  utilisateurService = inject(UtilisateurService);
  categorieModeleService = inject(CategorieModeleService);
  empruntService = inject(EmpruntService);


  utilisateurId = signal<number | null>(null);
  categorieModeleId = signal<number | null>(null);
  materielId  = signal<number | null>(null);

  dateDebut = signal<string>('');
  dateFin = signal<string>('');

  dureejours = computed(() => {
    if (!this.dateDebut() || !this.dateFin()) return null;

    const debut = new Date(this.dateDebut());
    const fin = new Date(this.dateFin());
    const diff = fin.getTime() - debut.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  });

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
    const utilisateurId = this.utilisateurId();
    const materielId    = this.materielId();

    if (!utilisateurId || !materielId || !this.dateDebut || !this.dateFin) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    this.empruntService.creerEmprunt({
      utilisateurId,
      materielId,
      dateDebut: this.dateDebut(),
      dateFin:   this.dateFin()
    }).subscribe({
      next: () => {alert('Emprunt enregistré');form.reset()},

      error: (err) => alert(`Erreur : ${err}`)
    });
  }

  // Annuler
  onAnnuler(): void {
    console.log('Annulé');
  }
}
