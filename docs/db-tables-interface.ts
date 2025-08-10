// Interface pour la table Users
export interface User {
  id: number; // Identifiant unique
  email: string; // Adresse email
  password: string; // Mot de passe
  createdAt: Date; // Date de création du compte
  lastLogin?: Date; // Date du dernier accès (optionnel)
  isActive: boolean; // Indicateur si le compte est actif
}

// Interface pour la table UserSession
export interface UserSession {
  id: number; // Identifiant unique
  userId: number; // Identifiant de l'utilisateur (clé étrangère)
  token: string; // Token de session
  isExpired: boolean; // Indicateur si la session est expirée
  createdAt: Date; // Date de création de la session
  lastAccessed?: Date; // Date de dernier accès à la session (optionnel)
}

// Interface pour la table TypeAnnonce
export interface TypeAnnonce {
  id: number; // Identifiant unique
  name: string; // Nom du type d'annonce
  nameAr: string; // Nom du type d'annonce en arabe
  priority: number; // Priorité du type d'annonce
  createdAt: Date; // Date de création du type d'annonce
}

// Interface pour la table Categories
export interface Category {
  id: number; // Identifiant unique
  typeAnnonceId: number; // Identifiant du type d'annonce (clé étrangère)
  name: string; // Nom de la catégorie
  priority: number; // Priorité de la catégorie
  createdAt: Date; // Date de création de la catégorie
}

// Interface pour la table Images
export interface Image {
  id: number; // Identifiant unique
  imagePath: string; // Chemin relatif vers l'image
  createdAt?: Date; // Date de création de l'image (optionnel)
  altText?: string; // Texte alternatif pour l'accessibilité (optionnel)
}

// Interface pour la table Wilaya
export interface Wilaya {
  id: number; // Identifiant unique
  name: string; // Nom de la wilaya
  nameAr: string; // Nom de la wilaya en arabe
  priority: number; // Priorité de la wilaya
}

// Interface pour la table Moughataa
export interface Moughataa {
  id: number; // Identifiant unique
  name: string; // Nom de la moughataa
  nameAr: string; // Nom de la moughataa en arabe
  priority: number; // Priorité de la moughataa
}

// Interface pour la table GPSLocation
export interface GPSLocation {
  id: number; // Identifiant unique
  latitude: number; // Latitude
  longitude: number; // Longitude
}

// Interface pour la table Lieu
export interface Lieu {
  id: number; // Identifiant unique
  wilayaId: number; // Identifiant de la wilaya (obligatoire)
  moughataaId?: number; // Identifiant du moughataa (optionnel)
  gpsLocationId?: number; // Identifiant de la GPSLocation (optionnel)
}

// Interface pour la table Annonces
export interface Annonce {
  id: number; // Identifiant unique
  typeAnnonceId: number; // Identifiant du type d'annonce
  typeAnnonceName?: string; // Nom du type d'annonce (optionnel)
  typeAnnonceNameAr?: string; // Nom du type d'annonce en arabe (optionnel)

  categorieId: number; // Identifiant de la catégorie
  categorieName?: string; // Nom de la catégorie (optionnel)
  categorieNameAr?: string; // Nom de la catégorie en arabe (optionnel)

  lieuId: number; // Identifiant du lieu de l'annonce
  lieuStr: string; // Lieu de l'annonce
  lieuStrAr: string; // Lieu de l'annonce en arabe

  userId: number; // Identifiant de l'utilisateur
  title: string; // Titre de l'annonce
  description: string; // Description de l'annonce
  price: number; // Prix de l'annonce
  contact: string; // Numéro de téléphone

  haveImage: boolean; // Indique si l'annonce a une image
  firstImagePath: string; // Chemin vers la première image liée à cette annonce
  images: Array<{ id: number; imagePath: string }>; // Liste d'objets contenant id et imagePath

  status: string; // Statut de l'annonce (ex. : actif, en attente, archivé)
  updatedAt: Date; // Date de la dernière mise à jour de l'annonce
  createdAt: Date; // Date de création de l'annonce
}
