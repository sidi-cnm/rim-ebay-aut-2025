// PageAnnonceImages.tsx
"use client";

import React, { useEffect, useState } from "react";
import MyAnnonceImages from "./MyannonceImages";
import toast, { Toaster } from "react-hot-toast";
import { useI18n } from "../../../../../../locales/client";

type PageProps = {                      // 👈 renommez pour éviter la collision
  lang: string;
  annonceId: string;
};

export default function PageAnnonceImages({ lang, annonceId }: PageProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const t = useI18n();
  console.log("PageAnnonceImages props:", { lang, annonceId });

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`/${lang}/api/images/${annonceId}`, { cache: "no-store" });
        console.log("Fetch response:", res);
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

  


  const handleAddFiles = async (files: File[]) => {
    if (!files?.length) return;

    const loadingId = toast.loading("L`ajout en cours...");
    
    try {
      const fd = new FormData();
      files.forEach((f) => fd.append("files", f));
      // mainIndex optionnel — ici on met la 1ère des nouvelles en principale
      fd.append("mainIndex", "0");

      const res = await fetch(`/${lang}/api/images/${annonceId}`, {
        method: "POST",
        body: fd,
        // credentials: "include", // si besoin de cookies
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data?.ok !== true) {
        throw new Error(data?.error || "upload failed");
      }

      // L’API renvoie { images: [{ url, isMain }], firstImagePath }
      const newUrls: string[] = Array.isArray(data?.images)
        ? data.images.map((x: { url: string }) => x.url)
        : [];

      // Ajoute les nouvelles au début (ou à la fin selon ton choix)
      setImages((prev) => [...newUrls, ...prev]);

      toast.success(t("editForm.uploaded"), { id: loadingId });
    } catch (e: any) {
      toast.error(e?.message || t("editForm.uploadError"));
    }
  };


  const handleRemove = async (idx: number) => {
    const url = images[idx];
    if (!url) return;

    const loadingId = toast.loading("Suppression...");
    try {
      const res = await fetch(`/${lang}/api/images/${annonceId}?url=${encodeURIComponent(url)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur API DELETE");

      // Mettre à jour la liste locale
      setImages((prev) => prev.filter((_, i) => i !== idx));
      toast.success("Image supprimée", { id: loadingId });
    } catch (err: any) {
      toast.error(err?.message || "Suppression échouée", { id: loadingId });
    }
  };


 
  if (loading) {
    return (
      <div className="p-6">
        {t("editForm.loading")}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4">
    <Toaster position="bottom-right" reverseOrder={false} />
     
      <MyAnnonceImages
        imagesUrl={images}
        title={t("editForm.title")}
        onAddFiles={handleAddFiles}
        onRemove={handleRemove}
      />
    </div>
  );
}
