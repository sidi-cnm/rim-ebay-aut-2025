

export interface OptionsModel {
  id :string ;
  nameAr    :string;
  name      :string;
  priority  :number;
  depth     :number;
  tag      : string;
  createdAt : Date;
  // parentID   String? @db.ObjectId
  parentID : string;

}


// Interface pour la table Users
export interface User {
  id: string; // Identifiant unique
  email: string; // Adresse email
  password: string; // Mot de passe
  createdAt: Date; // Date de création du compte
  lastLogin?: Date; // Date du dernier accès (optionnel)
  isActive: boolean; // Indicateur si le compte est actif
}

// Interface pour la table UserSession
export interface UserSession {
  id: string; // Identifiant unique
  userid: string; // Identifiant de l'utilisateur (clé étrangère)
  token: string; // Token de session
  isExpired: boolean; // Indicateur si la session est expirée
  createdAt: Date; // Date de création de la session
  lastAccessed?: Date; // Date de dernier accès à la session (optionnel)
}

// Interface pour la table TypeAnnonce
export interface TypeAnnonce {
  id: string; // Identifiant unique
  name: string; // Nom du type d'annonce
  nameAr: string; // Nom du type d'annonce en arabe
  priority: number; // Priorité du type d'annonce
  createdAt: Date; // Date de création du type d'annonce
}

export interface SubCategory {
  id: number;
  name: string;
  nameAr: string;
  priority?: number;
  createdAt: Date;
}

// Interface pour la table Categories
export interface Category {
  id: string; // Identifiant unique
  typeAnnonceid: string; // Identifiant du type d'annonce (clé étrangère)
  name: string;
  nameAr: string; // Nom de la catégorie
  priority: number; // Priorité de la catégorie
  createdAt: Date; // Date de création de la catégorie
}

// Interface pour la table Images
export interface Image {
  id: string; // Identifiant unique
  imagePath: string; // Chemin relatif vers l'image
  createdAt?: Date; // Date de création de l'image (optionnel)
  altText?: string; // Texte alternatif pour l'accessibilité (optionnel)
}

// Interface pour la table Wilaya
export interface Wilaya {
  id: string; // Identifiant unique
  name: string; // Nom de la wilaya
  nameAr: string; // Nom de la wilaya en arabe
  priority: number; // Priorité de la wilaya
}

// Interface pour la table Moughataa
export interface Moughataa {
  id: string; // Identifiant unique
  name: string; // Nom de la moughataa
  nameAr: string; // Nom de la moughataa en arabe
  priority: number; // Priorité de la moughataa
}

// Interface pour la table GPSLocation
export interface GPSLocation {
  id: string; // Identifiant unique
  latitude: number; // Latitude
  longitude: number; // Longitude
}

// Interface pour la table Lieu
export interface Lieu {
  id: string; // Identifiant unique
  wilayaid: string; // Identifiant de la wilaya (obligatoire)
  moughataaId?: string; // Identifiant du moughataa (optionnel)
  gpsLocationId?: string; // Identifiant de la GPSLocation (optionnel)
}

// Interface pour la table Annonces
export interface Annonce {
  id: string; // Identifiant unique
  typeAnnonceId: string; // Identifiant du type d'annonce
  typeAnnonceName?: string; // Nom du type d'annonce (optionnel)
  typeAnnonceNameAr?: string; // Nom du type d'annonce en arabe (optionnel)

  directNegotiation?: boolean; // Négociation directe (optionnel)
  issmar?: boolean; // Indique si l'annonce est publiée par un samsar (optionnel)

  categorieId: string; // Identifiant de la catégorie
  categorie?: OptionsModel;
  subcategorie?: OptionsModel;
  typeAnnonce?: OptionsModel;
  categorieName?: string; // Nom de la catégorie (optionnel)
  categorieNameAr?: string; // Nom de la catégorie en arabe (optionnel)
  subcategorieId?: string; // Identifiant de la sous-catégorie (optionnel)
  isFavorite?: boolean;
  isSponsored?: boolean;

  classificationFr?: string; // Classification en français (optionnel)
  classificationAr?: string; // Classification en arabe (optionnel)
  
  // lieuId: string; // Identifiant du lieu de l'annonce
  lieuStr?: string; // Lieu de l'annonce
  lieuStrAr?: string; // Lieu de l'annonce en arabe

  lieuId?: string | null;        // wilaya
  moughataaId?: string | null;

  userId: string; // Identifiant de l'utilisateur
  title: string; // Titre de l'annonce
  description: string; // Description de l'annonce
  price?: number; // Prix de l'annonce
  contact: string; // Numéro de téléphone

  haveImage?: boolean; // Indique si l'annonce a une image
  firstImagePath?: string; // Chemin vers la première image liée à cette annonce
  images?: Array<{ id: string; imagePath: string }>; // Liste d'objets contenant id et imagePath

  status: string; // Statut de l'annonce (ex. : actif, en attente, archivé)
  updatedAt?: Date | string; // Date de la dernière mise à jour de l'annonce
  createdAt?: Date | string | null; // Date de création de l'annonce,
  rentalPeriod?: string | null; // Période de location (daily, weekly, monthly)
  rentalPeriodAr?: string | null; 
}
