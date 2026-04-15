import {Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Utilisateur} from '../../../core/models/utilisateur';
import {EmpruntService} from '../../../core/services/emprunt/emprunt.service';
import {MaterielService} from '../../../core/services/materiel/materiel.service';
import {UtilisateurService} from '../../../core/services/utilisateur/utilisateur.service'
import {CategorieModele} from '../../../core/models/categorieModele';
import {CategorieModeleService} from '../../../core/services/categorie-modele/categorie-modele.service';
import {Materiel} from '../../../core/models/materiel';

@Component({
  selector: 'app-form-emprunt',
  imports: [
    FormsModule
  ],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})

export class FormEmprunt {

  listeUtilisateurs = signal<Utilisateur[]>([])
  listeCategorieModele = signal<CategorieModele[]>([])
  listeMateriel = signal<Materiel[]>([])

  nbMateriel = computed(() => this.listeMateriel().length);

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

  constructor(
    private empruntService : EmpruntService,
    private materielService : MaterielService,
    private utilisateurService : UtilisateurService,
    private categorieModeleService : CategorieModeleService
  ) {}

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
    this.utilisateurService.obtenirListeUtilisateur().subscribe(data => {
      this.listeUtilisateurs.set(data);
    });

    this.categorieModeleService.obtenirListeCategorieModele().subscribe(data => {
      this.listeCategorieModele.set(data)
    })

  }

  onRechercherMateriels(): void {
    if (!this.dateDebut() || !this.dateFin() || !this.categorieModeleId()) return;
    console.log(this.categorieModeleId())
    this.materielService.obtenirListeMaterielsDisponiblePourPeridodeParIDCategorieModele(
      this.dateDebut(),
      this.dateFin(),
      this.categorieModeleId()!
    ).subscribe(data => {
      this.listeMateriel.set(data);
      console.log(this.listeMateriel())
    });
  }

  onSubmit(): void {
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
      next: () => console.log('Emprunt enregistré !'),
      error: (err) => console.error('Erreur :', err)
    });
  }

  // Annuler
  onAnnuler(): void {
    console.log('Annulé');
  }
}
