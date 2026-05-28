import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { FormEmprunt } from './pages/form-emprunt/form-emprunt';
import { ListeEmprunt } from './pages/liste-emprunt/liste-emprunt';
import { ListeMateriel } from './pages/liste-materiel/liste-materiel';
import { ListeDemande } from './pages/liste-demande/liste-demande';
import { HistoriqueEmprunt } from './pages/historique-emprunt/historique-emprunt';
import { ListeIncident } from './pages/liste-incident/liste-incident';
import { FormMateriel } from './pages/form-materiel/form-materiel/form-materiel';
import { LoginComponent } from './pages/login/login';
import { LayoutComponent } from './shared/components/layout/layout-component';
import {adminGuard} from './guards/admin-guard';
import {utilisateurGuard} from './guards/utilisateur-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'accueil', component: Dashboard, canActivate: [utilisateurGuard] },
      { path: 'enregistrer/emprunt', component: FormEmprunt, canActivate: [utilisateurGuard] },
      { path: 'enregistrer/emprunt/:id', component: FormEmprunt, canActivate: [utilisateurGuard] },
      { path: 'emprunt/liste', component: ListeEmprunt, canActivate: [utilisateurGuard] },
      { path: 'materiel/liste', component: ListeMateriel, canActivate: [utilisateurGuard] },
      { path: 'materiel/creer', component: FormMateriel, canActivate: [adminGuard] },
      { path: 'materiel/modifier/:id', component: FormMateriel, canActivate: [adminGuard] },
      { path: 'demande/liste', component: ListeDemande, canActivate: [utilisateurGuard]},
      { path: 'historique/emprunt', component: HistoriqueEmprunt, canActivate: [utilisateurGuard]},
      { path: 'materiel/incident', component: ListeIncident, canActivate: [utilisateurGuard]},
      { path: '**', redirectTo: 'accueil' },
    ]
  },

  { path: '**', redirectTo: 'login' },
];
