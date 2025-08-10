vescode typescript support

vscode soulifne en rouge typeAnnonce dans annonce.typeAnnonce comme dans la figure, avec le message d'erreur,

```
Property 'typeAnnonce' does not exist on type '{ id: number; categorie: string; user_id: number; title: string | undefined; description: string; lieu_str: string; image_url: string; price: number; created_at: Date; HaveImage: boolean; firstImagePath: string; images: imageObject[]; }'.ts(2339)

```

malgre que l'attribue
typeAnnonce a ete ajoute au type AnnonceUI recement
