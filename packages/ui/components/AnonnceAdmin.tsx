"use client";
import { AiOutlineDelete, AiOutlineStop } from "react-icons/ai";

export default function AnnonceAdmin({
  annonces,
}: {
  annonces: {
    id: number;
    title: string;
    description: string;
    price: number;
    name: string;
    contact: string;
  }[];
}) {
  const handleDelete = (id: number) => {
    console.log(`Supprimer l'annonce ${id}`);
    // Implémenter la logique de suppression ici (ex: API call)
  };

  const handleDisable = (id: number) => {
    console.log(`Désactiver l'annonce ${id}`);
    // Implémenter la logique de désactivation ici (ex: API call)
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {annonces.map((annonce) => (
        <div
          key={annonce.id}
          className="w-full max-w-md bg-white border border-gray-200 rounded-md p-4 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-gray-500 font-semibold text-sm">Titre</p>
              <p className="text-gray-800 font-bold text-lg">{annonce.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-gray-500 font-semibold text-sm">Prix</p>
              <p className="text-gray-800 font-bold">{annonce.price} €</p>
            </div>
            <div>
              <p className="text-gray-500 font-semibold text-sm">Contact</p>
              <p className="text-gray-800 font-bold">{annonce.contact}</p>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-gray-500 font-semibold text-sm">Description</p>
            <p className="text-gray-800">{annonce.description}</p>
          </div>
          <div className="mb-4">
            <p className="text-gray-500 font-semibold text-sm">Nom</p>
            <p className="text-gray-800">{annonce.name}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={() => handleDisable(annonce.id)}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
            >
              <AiOutlineStop size={16} />
              Désactiver
            </button>
            <button
              onClick={() => handleDelete(annonce.id)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              <AiOutlineDelete size={16} />
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
