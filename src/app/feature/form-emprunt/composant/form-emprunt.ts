import {Component, computed, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Utilisateur} from '../../../core/models/utilisateur';
import {EmpruntService} from '../../emprunts/services/emprunt.service';
import {MaterielService} from '../../materiels/services/materiel.service';
import {UtilisateurService} from '../services/utilisateur/utilisateur.service'

@Component({
  selector: 'app-form-emprunt',
  imports: [
    FormsModule
  ],
  templateUrl: './form-emprunt.html',
  styleUrl: './form-emprunt.css',
})

export class FormEmprunt {

  utilisateurs = signal<Utilisateur[]>([])
  utilisateurId = signal<number | null>(null);
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
    private utilisateurService : UtilisateurService
  ) {}

  ngOnInit() {
    this.utilisateurService.obtenirListeUtilisateur().subscribe(data => {
      this.utilisateurs.set(data);
    });
  }

  onSubmit(): void {
    console.log('ID utilisateur :', this.utilisateurId())
    console.log('Début :', this.dateDebut());
    console.log('Fin :', this.dateFin());
    console.log('Emprunt à enregistrer :');
  }

  // Annuler
  onAnnuler(): void {
    console.log('Annulé');
  }
}
