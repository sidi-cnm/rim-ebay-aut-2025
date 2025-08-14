les composantes qui fetch des donnees via http request doit avoir cette url
en props comme ca la composantes soit facilement testable.

attribut props selon le context

 
une seule url dans le site ou site extens
baseUrl = "" ?
relavieUrl = ""

plusieur relaves url
relavieUrlModelOptions = ""

relavieUrlAnnonces = ""



easy api ?

refactor component 
contexte :
there are some components in packages/ui/components fetching data (sending or requesting, Get or POST) form some endpoint but the endpont url is hard coded in the component
task :
for each component in packages/ui/components where url or urls for fetching data is hard coded, refactor his code in a way that the url or urls are passed in the compoenent props props and seached in our code where this compenent is used and fix the code broken but befor doing it creating new branch for this task
