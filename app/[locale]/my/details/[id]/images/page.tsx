import PageAnnonceImages from "./ui";


type PageParams = { locale: string; id: string };

export default async function page({params}:{
  params: Promise<PageParams>;
}) {
  const { locale, id } = await params; ;  // <-- on "await" les params

  return <div>
    <PageAnnonceImages lang={locale} annonceId={id}  />
  </div>;
}
