import ConnexionForm from "./ConnexionForm";

export default async function ConnexionPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  console.log("local cote server");
  console.log("sidi ::", params);
  return <ConnexionForm lang={params.locale} />;
}
