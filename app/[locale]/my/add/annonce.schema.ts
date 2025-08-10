import { z } from "zod";

const annonceSchema = z.object({
  categorie_id: z.number(),
  //.string().transform((v) => parseInt(v)),
  sub_categorie_id: z.number(),
  //.string().transform((v) => parseInt(v)),
  description: z.string(),
  lieu_str: z.string(),
  image_url: z.string(),
  price: z.number(),
  //z.string().transform((v) => parseInt(v))
});

export type AnnonceSchema = z.infer<typeof annonceSchema>;

export default annonceSchema;
