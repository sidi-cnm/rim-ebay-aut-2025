Voici comment installer DeepSeek R1 avec Ollama pour l'utiliser dans VSCode :

1. **Installer Ollama**  
   Rendez-vous sur le site officiel d’Ollama (https://ollama.com) et téléchargez la version compatible avec votre système. Suivez ensuite les instructions d’installation (par exemple, via un package ou une commande dédiée).

2. **Télécharger le modèle DeepSeek R1**  
   Ouvrez un terminal et exécutez la commande suivante pour récupérer le modèle principal :

   ```
   ollama pull deepseek-r1
   ```

   Si vous souhaitez explorer d’autres variantes (par exemple, des versions plus petites), consultez la bibliothèque sur [Ollama Library](https://ollama.com/library/deepseek-r1).

3. **Démarrer le serveur local**  
   Une fois le modèle téléchargé, lancez le serveur en tapant :

   ```
   ollama serve
   ```

   Le serveur démarre alors et est accessible, par exemple, à l’adresse [http://localhost:11434](http://localhost:11434).

4. **Intégrer DeepSeek R1 dans Visual Studio Code**
   - Installez dans VSCode l’extension **CLINE** (ou **ROO CODE**).
   - Ouvrez les paramètres de l’extension et configurez-la en choisissant **Ollama** comme fournisseur d’API.
   - Dans le champ « Base URL », indiquez l’adresse du serveur local (par exemple, `http://localhost:11434`).
   - Si nécessaire, sélectionnez le modèle DeepSeek R1 dans le champ « Model ID ».
   - Sauvegardez la configuration et redémarrez VSCode pour que les changements prennent effet.

Ces étapes vous permettront de faire tourner DeepSeek R1 via Ollama sur votre PC Ubuntu et de bénéficier de l’assistance au codage directement dans VSCode.

Pour plus de détails sur l’intégration et les fonctionnalités, consultez l’article de Douglas Toledo sur DEV Community citeturn0search1.
