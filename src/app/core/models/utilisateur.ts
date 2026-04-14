import {Promotion} from './promotion';
import {CategorieUtilisateur} from './categorie-utilisateur';

export interface Utilisateur {
  id : number;
  nom : string;
  prenom : string;
  email : string;
  promotion : Promotion;
  categorieUtilisateur : CategorieUtilisateur;
}
