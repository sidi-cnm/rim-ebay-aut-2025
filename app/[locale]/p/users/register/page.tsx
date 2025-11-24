import RegisterForm from "./RegisterForm";
import RegisterFormNumber from "./RegisterFormPhone";

export default async function RegisterPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const params = await props.params;
  console.log("local cote server");
  console.log("parmas test", params.locale);
  return <RegisterForm lang={params.locale} urlboot={`/${params.locale}/api/telegram`} />;
}
