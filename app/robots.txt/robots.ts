// app/robots.txt/robots.ts
const BASE_URL = process.env.SITE_BASE_URL || 'http://localhost:3000';

export const robotsTxt = `
User-agent: *
# Bloquer pages privées ou API
Disallow: /fr/my/
Disallow: /ar/my/
Disallow: /fr/api/
Disallow: /ar/api/

# Autoriser pages publiques (optionnel)
Allow: /fr/
Allow: /ar/
Allow: /fr/about
Allow: /ar/about
Allow: /fr/p
Allow: /ar/p

# Lien vers le sitemap
Sitemap: ${BASE_URL}/sitemap.xml
`;
