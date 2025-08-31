// PageAnnonceImages.tsx
"use client";

import React, { useEffect, useState } from "react";
import MyAnnonceImages from "./MyannonceImages"; // 👈 chemin direct vers le bon fichier

type PageProps = {                      // 👈 renommez pour éviter la collision
  lang: string;
  annonceId: string;
};

export default function PageAnnonceImages({ lang, annonceId }: PageProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/${lang}/api/images/${annonceId}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();

        const urls = Array.isArray(data.images)
          ? data.images.map((img: { imagePath: string }) => img.imagePath)
          : [];

        setImages(urls);
      } catch (err) {
        console.error("Erreur récupération images:", err);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [lang, annonceId]);

  if (loading) return <p>Chargement des images…</p>;

  return (
    <div className="p-4">
      <MyAnnonceImages imagesUrl={images} editable={false} />
    </div>
  );
}
