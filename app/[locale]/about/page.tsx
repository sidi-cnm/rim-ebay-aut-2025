import AboutPage from "./ui";

type PageParams = { locale: string };


export default async function Page({ params }: { params: Promise<PageParams>;  }) {

    const { locale } = await params;           // <-- await

  return (
    <div>
      <AboutPage locale={locale} />
    </div>
  );
}
