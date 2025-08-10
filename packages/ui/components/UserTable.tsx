"use client";

import { useState, useEffect } from "react";

type User = {
  id: number;
  username: string;
  telephone: string;
  etat: string;
  derniereConnexion: string;
};

type UserTableProps = {
  users: User[];
};

const UserTable = ({ users }: UserTableProps) => {
  const [userList, setUserList] = useState<User[]>([]); // Initialisation avec un tableau vide

  useEffect(() => {
    if (users) {
      setUserList(users); // Met à jour le state avec les utilisateurs récupérés
    }
  }, [users]); // Le useEffect se déclenche à chaque fois que 'users' change

  const toggleEtat = (id: number) => {
    setUserList((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? { ...user, etat: user.etat === "Actif" ? "Inactif" : "Actif" }
          : user,
      ),
    );
  };

  const resetPassword = (id: number) => {
    alert(`Password reset for user ${id}`);
  };

  // Vérification que userList n'est pas vide avant de rendre le tableau
  if (!userList || userList.length === 0) {
    return <div>Loading...</div>; // Afficher un message de chargement si les utilisateurs ne sont pas encore disponibles
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-md">
      <table className="min-w-full table-auto">
        <thead>
          <tr className="border-b">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Username
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Telephone
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Etat
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Dernière Connexion
            </th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {userList.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="px-6 py-3 text-sm text-gray-700">
                {user.username}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {user.telephone}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">{user.etat}</td>
              <td className="px-6 py-3 text-sm text-gray-700">
                {user.derniereConnexion}
              </td>
              <td className="px-6 py-3 text-sm text-gray-700">
                <button
                  onClick={() => toggleEtat(user.id)}
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 mr-2"
                >
                  {user.etat === "Actif" ? "Désactiver" : "Activer"}
                </button>
                <button
                  onClick={() => resetPassword(user.id)}
                  className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600"
                >
                  Réinitialiser le mot de passe
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
