import { Routes } from '@angular/router';
import { Dashboard } from './feature/dashboard/composant/dashboard';
import {FormEmprunt} from './feature/form-emprunt/composant/form-emprunt';
import {Table} from './feature/table/composant/table/table';

export const routes: Routes = [
  { path: '', component: Dashboard},
  { path : 'enregistrer/emprunt' , component : FormEmprunt},
  { path : 'emprunt/liste', component : Table}
];
