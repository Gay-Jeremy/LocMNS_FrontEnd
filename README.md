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
npm install
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
ng test
```

## Déploiement

Le déploiement est automatisé via GitHub Actions : à chaque push sur `main`, l'image
Docker est construite, publiée sur Docker Hub, puis déployée sur le serveur cible.
