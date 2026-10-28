[![Docker Image CI](https://github.com/Gay-Jeremy/LocMNS_FrontEnd/actions/workflows/docker-image.yml/badge.svg)](https://github.com/Gay-Jeremy/LocMNS_FrontEnd/actions/workflows/docker-image.yml)

# LocMns — Frontend

Interface web de gestion du parc de matériel empruntable de Metz Numeric School (LocMns).
Elle permet aux utilisateurs de consulter le matériel et de gérer leurs emprunts, et aux
gestionnaires d'administrer le parc, les utilisateurs et les demandes.

## Stack technique

- **Angular 21** (TypeScript, Standalone Components, Signals)
- **RxJS** (flux HTTP asynchrones)
- **Angular Material** (composants d'interface)
- **ngx-toastr** (notifications)
- **nginx** (service des fichiers statiques en conteneur)
- **Docker** (conteneurisation)

## Prérequis

- Node.js 24+
- npm
- Angular CLI (`npm install -g @angular/cli`)
- Docker (pour un lancement conteneurisé)
- L'API backend (LocMns) démarrée et accessible

## Configuration

L'URL de l'API est définie par environnement dans `src/environments/` :

| Fichier                        | `serverUrl`                            | Usage                |
|--------------------------------|----------------------------------------|----------------------|
| `environment.development.ts`   | `http://localhost:8080`                | Développement local  |
| `environment.production.ts`    | *(URL de l'API déployée)*              | Production           |

Assurez-vous que l'API pointée par `serverUrl` est bien démarrée.

## Lancer le projet

### En développement

```bash
npm ci
ng serve
```

L'application est disponible sur http://localhost:4200 et se recharge automatiquement
à chaque modification.

### Build de production

```bash
ng build
```

Les fichiers optimisés sont générés dans `dist/locmns-frontend/`.

### Avec Docker

L'image est construite en deux étapes (build Angular puis service via nginx) :

```bash
docker build -t locmns-front .
docker run -p 80:80 locmns-front
```

Le conteneur sert l'application sur le port **80** et redirige les appels `/api/`
vers le backend (voir `nginx-custom.conf`).

## Structure

- `core/services/` — services métier et techniques (API, authentification, notifications)
- `core/services/jwt-interceptor/` — ajout automatique du jeton JWT aux requêtes
- `guards/` — protection des routes selon le rôle (utilisateur / administrateur)
- `pages/` — écrans de l'application

## Tests

```bash
ng test                 # mode surveillance
ng test --watch=false   # exécution unique (utilisée par la CI)
```

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

## Déploiement

L'intégration continue est assurée par GitHub Actions :

- à chaque push et pull request, les tests unitaires sont exécutés ;
- après un push sur `main` (tests réussis), l'image Docker est construite et publiée sur Docker Hub.

Le déploiement sur le serveur est déclenché par la pipeline du backend, qui récupère cette image.
