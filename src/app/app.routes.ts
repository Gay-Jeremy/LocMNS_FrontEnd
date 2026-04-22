import { Routes } from '@angular/router';
import { Dashboard } from './feature/dashboard/dashboard';
import {FormEmprunt} from './feature/form-emprunt/form-emprunt';
import {Table} from './shared/components/table/table';
import {ListeEmprunt} from './feature/liste-emprunt/liste-emprunt';
import {ListeMateriel} from './feature/liste-materiel/liste-materiel/liste-materiel';

export const routes: Routes = [
  { path: '', component: Dashboard},
  { path : 'enregistrer/emprunt' , component : FormEmprunt},
  { path : 'emprunt/liste', component : ListeEmprunt},
  { path : 'materiel/liste', component : ListeMateriel}

];
