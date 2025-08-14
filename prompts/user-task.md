- verifier l'email de l'utilisateur
inviter l'utilisateur a consulter son email pour la verification => ok
- permetrre à l'utilisateur de reinitialiser son mot de pass => ok
   - oeil dans le champ form mot de passe
   - i18n 

- enrigsiter le contact lors du register => ok
- recuperer le contact dans les details => ok
- tester le cas actuel login/register/ add annonce ... => ok
 

 
- l'annoce ne doit etre visible par le public avant la verification du numero de telephone.
- pour que son numero soit verifier il doit nous contacter (version MVP plus on va automatiser cette tache)
 
details technique : 
check l'etat du contact de l'utilisateur en cours isVerified isActive si = false alors Annonce.isPublish = false

Annonce :
 isAllowedToBePublished : defalaut false

AnnoncePublicationChechList
id
isContactVerified
isAnnonceVerifiedByIA
isAnnonceVerifiedByAdmin
isAnnonceVerifiedByAssistant
isAllowedToBePublished


- aller vers les taches admin