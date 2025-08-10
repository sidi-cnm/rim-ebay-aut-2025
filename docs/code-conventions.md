j'ai change de stategie un peu, je n'utilise plus mockoon, au lieu de ca je suis les regles suivantes

# rule 1

folder page.hadlers should be something like this :
x.interface.ts
x.mocked.ts
x.real.ts
x.ts
data.json // pour simuler les donnees dans une base des donnees

exmple

handleGetAnnonces.interface.ts
handleGetAnnonces.mocked.ts
handleGetAnnonces.real.ts
handleGetAnnonces.ts
data.json // pour simuler les donnees dans une base des donnees

in page.hadlers

# rule 2

page.tsx // allserver side components
ui.tsx // all client side component (when possible)

# rule 3

read data in pages from data for better performance
write data using routes (route.ts) for more security

# rule 4

complete mocked version before production version

Notez bien
il faut prendre en consideration ces regles pour les futures discussion
