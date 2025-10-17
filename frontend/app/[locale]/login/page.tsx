import { setRequestLocale, getTranslations } from "next-intl/server";
import LoginPage from "./components/login";

export default async function LoginPageRoute({
  params: { locale }
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "LoginPage" });

  const text: any = {
    title: t("title"),
    subtitle: t("subtitle"),
    googleButton: t("googleButton"),
    githubButton: t("githubButton"),
    orDivider: t("orDivider"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    emailRequired: t("emailRequired"),
    emailInvalid: t("emailInvalid"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    passwordRequired: t("passwordRequired"),
    forgotPassword: t("forgotPassword"),
    noAccount: t("noAccount"),
    signUpLink: t("signUpLink"),
    signInButton: t("signInButton"),
    signingInButton: t("signingInButton"),
    termsAgreement: t("termsAgreement"),
    termsOfService: t("termsOfService"),
    privacyPolicy: t("privacyPolicy"),
    needHelp: t("needHelp"),
    contactSupport: t("contactSupport"),
  };

  return <LoginPage text={text} locale={locale} />;
}
