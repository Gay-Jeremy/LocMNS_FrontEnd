import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { utilisateurGuard } from './guards/utilisateur.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').
      then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/components/layout/layout-component')
        .then(m => m.LayoutComponent),
    children: [

      {
        path: 'enregistrer/emprunt',
        loadComponent: () =>
          import('./pages/form-emprunt/form-emprunt')
            .then(m => m.FormEmprunt),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'accueil',
        loadComponent: () =>
          import('./pages/dashboard/dashboard')
            .then(m => m.Dashboard),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'materiel/creer',
        loadComponent: () =>
          import('./pages/form-materiel/form-materiel/form-materiel')
            .then(m => m.FormMateriel),
        canActivate: [adminGuard],
      },

      {
        path: 'enregistrer/emprunt/:id',
        loadComponent: () => import('./pages/form-emprunt/form-emprunt').then(m => m.FormEmprunt),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'emprunt/liste',
        loadComponent: () => import('./pages/liste-emprunt/liste-emprunt').then(m => m.ListeEmprunt),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'materiel/liste',
        loadComponent: () => import('./pages/liste-materiel/liste-materiel').then(m => m.ListeMateriel),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'materiel/modifier/:id',
        loadComponent: () => import('./pages/form-materiel/form-materiel/form-materiel').then(m => m.FormMateriel),
        canActivate: [adminGuard],
      },
      {
        path: 'demande/liste',
        loadComponent: () => import('./pages/liste-demande/liste-demande').then(m => m.ListeDemande),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'historique/emprunt',
        loadComponent: () => import('./pages/historique-emprunt/historique-emprunt').then(m => m.HistoriqueEmprunt),
        canActivate: [utilisateurGuard],
      },
      {
        path: 'materiel/incident',
        loadComponent: () => import('./pages/liste-incident/liste-incident').then(m => m.ListeIncident),
        canActivate: [utilisateurGuard],
      },
      { path: '**', redirectTo: 'accueil' },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
