// app/sitemap.ts
import { MetadataRoute } from 'next';
import { getDb } from '../lib/mongodb';

const BASE_URL = process.env.SITE_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['fr', 'ar'];
  const staticPages = ['', '/about', '/p'];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Pages statiques
  for (const locale of locales) {
    for (const page of staticPages) {
      sitemapEntries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    }
  }

  // Pages dynamiques (annonces)
  try {
    const db = await getDb();
    const annonces = await db
      .collection('annonces')
      .find({ status: 'published' }, { projection: { _id: 1, updatedAt: 1, createdAt: 1 } })
      .toArray();

    for (const annonce of annonces) {
      const lastMod = annonce.updatedAt ?? annonce.createdAt ?? new Date();
      for (const locale of locales) {
        sitemapEntries.push({
          url: `${BASE_URL}/${locale}/p/annonces/details/${annonce._id}`,
          lastModified: new Date(lastMod),
          changeFrequency: 'daily',
          priority: 0.6,
        });
      }
    }
  } catch (err) {
    console.error('Erreur génération sitemap:', err);
  }

  return sitemapEntries;
}
