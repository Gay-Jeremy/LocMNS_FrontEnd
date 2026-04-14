import {CategorieModele} from './categorie-modele';

export interface Modele {
  id : number;
  libelle : string;
  categorieModele: CategorieModele;
}
