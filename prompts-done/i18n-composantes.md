i18n doit etre externaliser pour les composantes enfants donc la location doit passer via les props

template
dans la composante ------------- tous les mots à traduire doit etre passer en props pour que la traduction soit fourni par la composante parente

les composantes dans packages/ui/components sont deja preparer pour l'i18n depuis l'exterieur


tache :
reviser les composantes dans app/[locale] qui ne sont pas dans page.tsx si elles sont preparer pour l'i18n depuis l'exterieur ou non, puis prepare les