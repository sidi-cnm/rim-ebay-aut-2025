import { PrismaClient } from "@prisma/client";
// Créez une instance de PrismaClient
const prisma = new PrismaClient();

// Exposez cette instance pour pouvoir l'utiliser dans d'autres fichiers
export default prisma;
