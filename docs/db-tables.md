je fais des petits modification qu'en pense tu ?

1. **Users**
   - `id`: Identifiant unique
   - `email`: Adresse email
   - `password`: Mot de passe
   - `createdAt`: Date de création du compte
   - `lastLogin`: Date du dernier accès (optionnel)
   - `isActive`: Indicateur si le compte est actif (boolean)
1. **UserSession**

   - `id`: Identifiant unique (number)
   - `userId`: Identifiant de l'utilisateur (number, clé étrangère)
   - `token`: Token de session (string)
   - `isExpired`: Indicateur si la session est expirée (boolean)
   - `createdAt`: Date de création de la session (Date)
   - `lastAccessed`: Date de dernier accès à la session (Date)

1. **TypeAnnonce**

   - `id`: Identifiant unique
   - `name`: Nom du type d'annonce (vente ou location ou service ou autre)
   - `nameAr`: Nom du type d'annonce en arabe (vente ou location ou service ou autre)
   - `priority`: Priorité du type d'annonce
   - `createdAt`: Date de création du type d'annonce

1. **Categories**

   - `id`: Identifiant unique
   - `typeAnnonceId`: Identifiant du type d'annonce (number, clé étrangère)
   - `name`: Nom de la catégorie (immobilier, vehicule, informatique,..)
   - `priority`: Priorité de la catégorie
   - `createdAt`: Date de création de la catégorie

1. **Images**

   - `id`: Identifiant unique
   - `imagePath`: Chemin relatif vers l'image
   - `createdAt`: Date de création de l'image (optionnel)
   - `altText`: Texte alternatif pour l'accessibilité (optionnel)

1. **Wilaya**

   - `id`: Identifiant unique
   - `name`: Nom de la wilaya
   - `nameAr`: Nom de la wilaya en arabe
   - `priority`: Priorité de la wilaya

1. **Moughataa**

   - `id`: Identifiant unique
   - `name`: Nom de la moughataa
   - `nameAr`: Nom de la wilaya en arabe
   - `priority`: Priorité de la moughataa

1. **GPSLocation**

   - `id`: Identifiant unique
   - `latitude`: Nombre
   - `longitude`: Nombre

1. **Lieu**

   - `id`: Identifiant unique
   - `wilayaId`: Identifiant de la wilaya (obligatoire)
   - `moughataaId`: Identifiant du moughataa (optionnel)
   - `gpsLocationId`: Identifiant de la GPSLocation (optionnel)

1. **Annonces**

   - `id`: Identifiant unique

   - `typeAnnonceId`: Identifiant du type d'annonce
   - `typeAnnonceName`: nom du type d'annonce ( optionnel )
   - `typeAnnonceNameAr`: nom du type d'annonce en arabe ( optionnel )

   - `categorieId`: Identifiant de la catégorie
   - `categorieName`: nom de la catégorie ( optionnel )
   - `categorieNameAr`: nom de la catégorie ( optionnel )

   - `userId`: Identifiant de l'utilisateur
   - `title`: titre de l'annonce( deduis de la desciption (cote serveur) ou generer par IA en fonction de la description)
   - `description`: Description de l'annonce
   - `price`: Prix de l'annonce

   - `lieuId`: Identifiant du lieu de l'annonce
   - `lieuStr`: Lieu de l'annonce
   - `lieuStrAr`: Lieu de l'annonce

   - `haveImage`: Boolean indiquant si l'annonce a une image ou non
   - `images`: Objet JSON de type liste contenant des objets avec `id` et `imagePath`
   - `firstImagePath`: Chemin vers la première image liée à cette annonce
   - `createdAt`: Date de création de l'annonce
   - `status`: Statut de l'annonce (ex. : actif, en attente, archivé)
   - `contact`: numero de telephone
   - `updatedAt`: Date de la dernière mise à jour de l'annonce
