
import {Utilisateur} from './utilisateur';
import {StatutEmprunt} from './statut-emprunt';
import {Materiel} from './materiel';

export interface Emprunts  {
  id : number;
  dateCreation : string;
  dateDebut : string;
  dateFin : string;
  dateRetourReel : string;
  dateProlongation : string;
  dateRetourAnticipe : string;
  utilisateur : Utilisateur;
  statutEmprunt : StatutEmprunt;
  materiel : Materiel;
}
