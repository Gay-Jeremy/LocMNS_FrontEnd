import {Modele} from './modele';
import {StatutMateriel} from './statut-materiel';

export interface Materiel {
  id : number;
  numSerie : string;
  statutMateriel : StatutMateriel;
  modele : Modele;
}
