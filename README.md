# Rim-eBay

Projet Next.js avec base de données MongoDB pour une marketplace inspirée d'eBay.

## Prérequis

- Node.js v22.13.0
- Docker + Docker Compose
- pnpm
- MongoDB (via Docker)

## Configuration initiale

### 1. Variables d'environnement

```bash
cp .env.example .env
# Modifier les valeurs dans .env selon votre configuration
```

````

### 2. Démarrage de MongoDB avec Docker

```bash
# Activer Docker au démarrage (Ubuntu)
sudo systemctl enable docker
# Lancer le conteneur MongoDB
docker compose -f docker-compose.mongo.yml up -d

# Vérifier le conteneur
docker ps -a | grep mongodb-dev

# Initialiser le replica set (première fois seulement)
docker exec -it mongodb-dev mongosh
rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: 'localhost:27017' }] })
```

### 3. Configuration de la base de données

```bash
pnpm install
pnpm approve-builds
```

## Scripts utiles

### Développement

```bash
bun run dev  # Serveur Next.js avec hot-reloading
```

### Mise en cache

```bash
bun run cache  # Génère des fichiers JSON de cache pour les catégories/annonces
```

## Débogage

Configuration VS Code prête dans `.vscode/launch.json` :

- Breakpoints natifs
- Inspection des variables
- Debug console intégré

## Déploiement

Voir le workflow GitHub `.github/workflows/deploy-nextjs-postgress.yml` pour :

- Configuration cloud
- Intégration continue
- Déploiement automatisé
````

5. Utiliser MailHog (via Docker)
MailHog est un “fake” SMTP server : il capte tous les mails que tu lui envoies et les expose dans une interface web.

Lance MailHog

bash
Copy
Edit
docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog
SMTP écoute sur localhost:1025

UI web sur http://localhost:8025