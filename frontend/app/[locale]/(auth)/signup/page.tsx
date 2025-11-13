import { extractSignUpPageText } from "@/app/i18n/extractTexts";
import SignUpPage from "./components/signup";
import { setRequestLocale, getTranslations } from "next-intl/server";

const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);

  const text = await extractSignUpPageText(locale);
  return <SignUpPage text={text} locale={locale} />;
};

export default page;
