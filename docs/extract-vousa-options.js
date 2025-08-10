/*
Oui, c'est tout à fait possible avec un script JavaScript. 
Vous pouvez l'exécuter directement dans la console de développement de votre navigateur sur la page https://www.voursa.com/. 
// Voici un exemple de script qui recherche le formulaire,
//  identifie tous les menus déroulants (<select>) qu'il contient et affiche pour chacun les options disponibles :
*/
(function() {
    // On récupère le formulaire de recherche (ici, le premier formulaire trouvé)
    const form = document.querySelector("form");
    if (!form) {
      console.log("Formulaire non trouvé sur cette page.");
      return;
    }
    
    // Récupérer tous les éléments <select> dans le formulaire
    const selectElements = form.querySelectorAll("select");
    if (selectElements.length === 0) {
      console.log("Aucun menu déroulant (<select>) n'a été trouvé dans le formulaire.");
      return;
    }
    
    // Pour chaque <select>, afficher les options disponibles
    selectElements.forEach(select => {
      const identifier = select.getAttribute("name") || select.getAttribute("id") || "sans identifiant";
      console.log(`Options pour le select (${identifier}) :`);
      
      // Parcourir et afficher chaque option
      select.querySelectorAll("option").forEach(option => {
        console.log(`  Valeur: ${option.value} - Texte: ${option.text}`);
      });
      
      console.log("-----------");
    });
  })();
  