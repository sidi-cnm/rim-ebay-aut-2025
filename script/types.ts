import { ObjectId } from "mongodb";

export interface OldAnnonce {
  _id: ObjectId;
  typeAnnonceId: string;
  categorieId: string;
  subcategorieId: string;
  userId: string;
  classificationFr: string;
  classificationAr: string;
  title: string;
  description: string;
  price: number;
  status: string;
  isPublished: boolean;
  issmar: boolean;
  lieuId: string;
  contact: string;
  moughataaId: string;
  haveImage: boolean;
  directNegotiation: boolean;
  isSponsored: boolean;
  firstImagePath: string;
  createdAt: Date;
  updatedAt: Date;
  isIndexed?: boolean;
}

export interface NewAnnonce extends OldAnnonce {
  rentalPeriod: string;
  rentalPeriodAr: string;
  typeAnnonceName: string;
  categorieName: string;
  typeAnnonceNameAr: string;
  categorieNameAr: string;
  lieuStr: string;
  lieuStrAr: string;
  moughataaStr: string;
  moughataaStrAr: string;
  isPriceHidden: boolean;
  privateDescription: string;
}

export interface TypeAnnonce {
  id: number;
  name: string;
  nameAr: string;
}

export interface Categorie {
  id: number;
  name: string;
  nameAr: string;
}

export interface Lieu {
  id: number;
  name: string;
  nameAr: string;
}

export interface Moughataa {
  id: number;
  name: string;
  nameAr: string;
}

export interface MigrationUpdate {
  rentalPeriod: string;
  rentalPeriodAr: string;
  typeAnnonceName: string;
  categorieName: string;
  typeAnnonceNameAr: string;
  categorieNameAr: string;
  lieuStr: string;
  lieuStrAr: string;
  moughataaStr: string;
  moughataaStrAr: string;
  isPriceHidden: boolean;
  privateDescription: string;
}
