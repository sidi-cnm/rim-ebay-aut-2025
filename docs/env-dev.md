#### 1. **Choix Technologiques**

- **Framework principal** : Next.js pour le frontend et backend.
- **Stack complet** :
  - Next.js + TypeScript pour le frontend.
  - Mockoon application de bureau pour similer le backend pendant la premiere phase du dev

#### 2. **Architecture**

- **Séparation Frontend et Backend** :
  - Objectif : Améliorer l'expérience de développement (Dev UX) en séparant les deux parties.
  - Avantages :
    - Tirer parti d'outils de mock d'API comme **Mockoon** pour accélérer le développement côté frontend.
    - Fusionner les étapes de conception et d'implémentation pour un workflow plus fluide.

#### 5. **Conventions de Développement**

- Chaque page (ex. `/x`) utilise l’API correspondante dans `/api/x` pour les requêtes GET/POST des données.
- Après avoir terminé le site avec des API simulées (mockées), le développement de la véritable API connectée à la base de données commence.
