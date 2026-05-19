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

export const routes: Routes = [
  { path: 'login', component: LoginComponent },  // ✅ hors layout

  {
    path: '',
    component: LayoutComponent,  // header + sidebar + footer ici
    children: [
      { path: '', component: Dashboard },
      { path: 'enregistrer/emprunt', component: FormEmprunt },
      { path: 'enregistrer/emprunt/:id', component: FormEmprunt },
      { path: 'emprunt/liste', component: ListeEmprunt },
      { path: 'materiel/liste', component: ListeMateriel },
      { path: 'materiel/creer', component: FormMateriel },
      { path: 'materiel/modifier/:id', component: FormMateriel },
      { path: 'demande/liste', component: ListeDemande },
      { path: 'historique/emprunt', component: HistoriqueEmprunt },
      { path: 'materiel/incident', component: ListeIncident },
    ]
  }
];
