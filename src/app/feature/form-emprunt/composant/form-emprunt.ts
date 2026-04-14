import {Component, signal} from '@angular/core';
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
    console.log('Emprunt à enregistrer :');
  }

  // Annuler
  onAnnuler(): void {
    console.log('Annulé');
  }
}
