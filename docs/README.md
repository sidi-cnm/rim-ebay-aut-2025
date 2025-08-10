### **Documentation du Site d'Annonces**

#### 1. **Choix Technologiques**

- **Framework principal** : Next.js pour le frontend et backend.
- **Base de données** : PostgreSQL pour la gestion des données.
- **Stack complet** :
  - Next.js + TypeScript pour le frontend.
  - PostgreSQL pour la base de données.

#### 2. **Architecture**

- **Séparation Frontend et Backend** :
  - Objectif : Améliorer l'expérience de développement (Dev UX) en séparant les deux parties.
  - Avantages :
    - Tirer parti d'outils de mock d'API comme **Mockoon** pour accélérer le développement côté frontend.
    - Fusionner les étapes de conception et d'implémentation pour un workflow plus fluide.

#### 3. **Déploiement**

- **Modes de Déploiement** :

  1. **Mode Visualisation/Preview** :
     - Utilisation de **ngrok** pour partager un aperçu local de l'application.
  2. **Mode Staging** : (environnements de test avant la mise en production)
     - **Netlify**
     - **Firebase App Hosting**
     - **Fly.io**
     - **Render.com**
  3. **Mode Production** :
     - Hébergement sur VPS avec **Coulifly Service**.
     - Options de VPS :
       - **Contabo**
       - **Hostinger**

#### 4. **Stratégie d'Authentification**

- **JWT + Cookies** pour les opérations d'écriture dans la base de données.
- **Cookies** pour les opérations de lecture (accès aux données possédées par l'utilisateur).

#### 5. **Conventions de Développement**

- Chaque page (ex. `/x`) utilise l’API correspondante dans `/api/X` pour les requêtes GET/POST des données.
- Après avoir terminé le site avec des API simulées (mockées), le développement de la véritable API connectée à la base de données commence.

#### 6. **Gestion du Typage des Données**

- Assainissement du typage des données pendant la phase de développement avec des API mockées, afin de garantir la cohérence lors de la transition vers l'API réelle.
