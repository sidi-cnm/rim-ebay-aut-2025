corriger les erreur dans le Reponse et statuts dans le text suivant

pour implementer les specification suivante

### Traitement de la demande connexion (mockée) - Phase de conception

1. **Base des données utilisateurs** :  
   En dur, quelques utilisateurs (au moins deux) seront définis avec leur email et mot de passe. Ces utilisateurs serviront de référence pour simuler la vérification de la connexion.

2. **Traitement de la demande d'inscription** :

   - **Cas 1 : Email ou mot de passe manquant ou invalide**  
     Si l'utilisateur soumet une demande sans fournir d'email ou de mot de passe, ou si les informations sont dans un format incorrect, le système retournera une erreur indiquant que l'une des informations est manquante ou invalide, avec un statut d'échec.

   - **Cas 2 : Email n'est pas dans la base de données**  
     Si l'email fourni par l'utilisateur n'est pas dans la base des utilisateurs (définie en dur), le système retournera un message d'erreur indiquant que l'email ou mot de passe est invalide. Cela permet de signaler à l'utilisateur qu'il ne peut pas réutiliser cet email pour s'inscrire.

   - **Cas 3 : Email est dans la base de données**  
     Si l'email fourni est valide (n'est pas déjà présent dans la base de données) et respecte le format attendu, et que le mot de passe est conforme aux critères de sécurité définis, l'inscription sera acceptée. Le système renverra une réponse de succès avec la création de deux éléments : un **token d'accès** et un **refresh token**, indiquant que l'inscription a réussi et que l'utilisateur est authentifié.

3. **Réponses et statuts** :
   - **400 - Bad Request** : Pour les demandes avec des informations manquantes ou invalides (exemple : email ou mot de passe manquant).
   - **409 - Conflict** : Pour les demandes où l'email existe déjà dans la base de données, signalant un conflit.
   - **201 - Created** : Pour les demandes réussies, avec la création d'un nouvel utilisateur et la génération de tokens.
