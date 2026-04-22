import { Routes } from '@angular/router';
import { Dashboard } from './feature/dashboard/dashboard';
import {FormEmprunt} from './feature/form-emprunt/form-emprunt';
import {Table} from './shared/components/table/table';
import {ListEmprunt} from './feature/list-emprunt/list-emprunt';

export const routes: Routes = [
  { path: '', component: Dashboard},
  { path : 'enregistrer/emprunt' , component : FormEmprunt},
  { path : 'emprunt/liste', component : ListEmprunt}
];
