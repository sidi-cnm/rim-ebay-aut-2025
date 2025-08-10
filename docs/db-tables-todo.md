1. **UserSession**
   - `id`: Identifiant unique (number)
   - `userId`: Identifiant de l'utilisateur (number, clé étrangère)
   - `token`: Token de session (string)
   - `isExpired`: Indicateur si la session est expirée (boolean)
   - `createdAt`: Date de création de la session (Date)
   - `lastAccessed`: Date de dernier accès à la session (Date)
