aide moi pour realiser la tache suivant :
dans le context d'un projet Nextjs et postgresql j'ai le workflow dans le fichier
.github/workflows/deploy-nextjs-postgress.yml
dont le contenu est :

```yml
name: Deploy Next.js and PostgreSQL Application
on:
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-22.04 # ou ubuntu-24.04 selon votre préférence
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "22"
      # 5. Installer PostgreSQL, démarrer le service et créer une base de données
      - name: Setup PostgreSQL
        run: |
          sudo apt-get update
          sudo apt-get install -y postgresql postgresql-contrib
          sudo service postgresql start
          # Création d'un utilisateur et d'une base
          sudo -u postgres psql -c "CREATE USER dev WITH PASSWORD 'dev';"
          sudo -u postgres psql -c "CREATE DATABASE mydb WITH OWNER dev;"
      # Injection explicite de la variable d'environnement DATABASE_URL
      - name: Inject DB connection string
        run: echo "DATABASE_URL=postgres://dev:dev@localhost:5432/mydb" >> $GITHUB_ENV
      # Installer Bun en utilisant l'action officielle
      - name: Setup Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: "latest" # Vous pouvez spécifier une version spécifique si nécessaire
      - name: Install dependencies
        run: bun install
      - name: Build project
        run: bun run build
      - name: migrate database
        run: npx prisma migrate deploy
      - name: seed database
        run: bun run seed

      - name: Start application in background
        run: |
          nohup bun run start &
          # On attend quelques secondes pour laisser le temps au serveur de démarrer
          sleep 5

      - name: Check if index page ar is up
        run: |
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ar)
          if [ $HTTP_STATUS -eq 200 ]; then
            echo "✅ Application is running correctly (HTTP 200)"
              exit 0
            else
              echo "❌ Application failed to start properly (HTTP $HTTP_STATUS)"
              exit 1
            fi
```

je veux creer un fichier ou plusieur fichier pour la construction d'un image docker et d'executer ces images pour le dev qui necessite que les changement du code soit directement reflect, de plus je que l'image soit le plus leger possible. N.B j'utilise podman comme alernatif a docker cli
