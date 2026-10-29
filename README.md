[![Docker Image CI](https://github.com/Gay-Jeremy/LocMNS_FrontEnd/actions/workflows/docker-image.yml/badge.svg)](https://github.com/Gay-Jeremy/LocMNS_FrontEnd/actions/workflows/docker-image.yml)

# LocMns - Frontend

Application web de gestion du prêt de matériel de Metz Numeric School : les étudiants et
enseignants consultent le matériel et demandent des emprunts, les administrateurs gèrent le parc
et traitent les demandes.

Projet réalisé par **Jérémy Gay** dans le cadre du titre professionnel **Concepteur Développeur
d'Applications** (RNCP niveau 6), de la conception au déploiement.

- API REST (Spring Boot) : [LocMNS_BackEnd](https://github.com/Gay-Jeremy/LocMNS_BackEnd)

## Fonctionnalités

| Écran | Contenu |
|---|---|
| Connexion | Authentification par e-mail et mot de passe, jeton JWT conservé pour la session |
| Tableau de bord | Compteurs (matériel, emprunts actifs, demandes en cours, incidents, retards), emprunts récents |
| Matériel | Liste du parc ; création et modification réservées aux administrateurs |
| Demande d'emprunt | Choix des dates et de la catégorie, puis du matériel disponible sur la période |
| Emprunts | Suivi des emprunts (filtre des retards), demandes de prolongation et de retour anticipé |
| Demandes | Acceptation ou refus des demandes d'emprunt, de prolongation et de retour anticipé |
| Historique | Historique des emprunts (tous pour l'administrateur, les siens pour un utilisateur) |
| Incidents | Matériel signalé en panne |

## Points techniques

- **Angular 21** en composants *standalone* et **Signals** (`signal`, `computed`) pour l'état
  des écrans et des services.
- **Chargement différé** (*lazy loading*) de chaque écran (`loadComponent`).
- **Gardes de route** selon le rôle (`utilisateurGuard`, `adminGuard`).
- **Intercepteurs HTTP** : ajout automatique du jeton JWT à chaque requête, et affichage
  des erreurs de l'API sous forme de notifications.
- **Composants réutilisables** : tableau générique, modale de confirmation, cartes d'indicateurs,
  sélecteur de dates.
- **Limite connue** : le jeton JWT est stocké dans le `localStorage`, simple à mettre en place mais
  exposé en cas de faille XSS. Une évolution possible serait un cookie `HttpOnly` posé par l'API.

## Stack technique

- **Angular 21** (TypeScript 5.9, composants standalone, Signals)
- **Angular Material** (composants d'interface)
- **RxJS** (appels HTTP asynchrones)
- **ngx-toastr** (notifications)
- **Vitest** (tests unitaires)
- **nginx** (service des fichiers en conteneur)
- **Docker**, **GitHub Actions** (intégration continue)

## Structure

```
src/app/
├── core/
│   ├── layouts/      # En-tête et barre latérale
│   ├── models/       # Interfaces TypeScript des données de l'API
│   └── services/     # Accès à l'API, authentification, intercepteurs, notifications
├── guards/           # Protection des routes selon le rôle
├── pages/            # Un dossier par écran
└── shared/
    ├── components/   # Tableau, modale, cartes, sélecteur de dates, mise en page
    └── models/       # Types partagés entre composants
```

## Lancer le projet en local

### Prérequis

- Node.js 24 (LTS) et npm
- L'API [LocMNS_BackEnd](https://github.com/Gay-Jeremy/LocMNS_BackEnd) démarrée sur http://localhost:8080

### Étapes

```bash
npm ci        # installe exactement les versions du package-lock.json
npm start     # lance ng serve sur http://localhost:4200
```

L'application se recharge automatiquement à chaque modification.

### Configuration

L'URL de l'API est définie par environnement dans `src/environments/` :

| Fichier | `serverUrl` | Usage |
|---|---|---|
| `environment.development.ts` | `http://localhost:8080` | Développement local (`npm start`) |
| `environment.production.ts` | URL du serveur de production | Build de production et image Docker |

## Tests

44 tests unitaires (Vitest, 30 fichiers) : service d'authentification, gardes de route,
intercepteur JWT, modale de confirmation, et création des composants et services.

```bash
npm test                    # mode surveillance
npm test -- --watch=false   # exécution unique (utilisée par la CI)
```

## Build et Docker

```bash
npm run build   # build de production dans dist/locmns-frontend/
```

Le `Dockerfile` construit l'image en deux étapes : build Angular de production avec Node 24,
puis service des fichiers par nginx. La configuration nginx (`nginx-custom.conf`) relaie les appels
`/api/` vers le conteneur de l'API dans la pile de déploiement (voir le `compose.yml` du backend).
L'image est donc prévue pour la production, pas pour le développement local.

## Intégration continue

Pipeline GitHub Actions (`.github/workflows/docker-image.yml`) :

| Job | Quand | Ce qu'il fait |
|---|---|---|
| `test` | Chaque push et pull request sur `main` et `dev` | Installation (`npm ci`), tests, audit de sécurité des dépendances |
| `build` | Après un push sur `main` | Construction de l'image Docker et publication sur Docker Hub |

Le déploiement sur le serveur est déclenché par la pipeline du backend, qui récupère cette image.
Chaque évolution passe par une branche dédiée et une pull request vers `dev` ; la branche `main`
est protégée (pull request et CI verte obligatoires).

## Sécurité des dépendances

### Mises à jour automatiques (Dependabot)

Dependabot (`.github/dependabot.yml`) ouvre chaque lundi une pull request vers `dev` :

- les paquets `@angular/*` sont regroupés, car ils doivent toujours évoluer ensemble ;
- seules les versions **mineures et correctives** sont proposées ; les versions majeures
  (ex. Angular 22) se font à la main, avec les guides de migration ;
- la CI exécute les tests sur chaque pull request avant toute fusion.

Les correctifs de sécurité urgents de Dependabot (*security updates*) ne suivent pas ce réglage :
ils visent toujours la branche par défaut du dépôt, ici `dev`, et passent donc par la même CI.

### Contrôle dans la CI

La CI exécute `npm audit --omit=dev --audit-level=high` : elle échoue si une vulnérabilité
grave touche le code livré aux utilisateurs. Les outils de développement (compilateur, serveur
de dev, tests) ne bloquent pas la CI, mais doivent être suivis avec `npm audit`.

### Correctif forcé : `undici`

`package.json` contient un `overrides` sur `undici` (`^7.30.1`). `@angular/build` 21 impose une
version vulnérable de cette dépendance, utilisée uniquement par les outils de développement,
et la correction officielle n'existe qu'à partir d'Angular 22.

**À supprimer lors du passage à Angular 22**, puis relancer `npm install` et `npm audit`.

### Bonnes pratiques

- Installer avec `npm ci`, qui respecte exactement `package-lock.json` (utilisé par la CI et Docker).
- Corriger les vulnérabilités sur une branche dédiée, puis vérifier tests et build avant fusion :
  ne jamais lancer `npm audit fix --force` sans contrôle (il peut changer de version majeure).
- npm 11 bloque les scripts d'installation non approuvés : n'approuver que des paquets connus
  (`npm install-scripts approve <paquet>`).
