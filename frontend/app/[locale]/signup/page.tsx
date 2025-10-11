import SignUpPage from "./components/signup"
import { setRequestLocale, getTranslations } from "next-intl/server";

const page = async ({ params: { locale } }: { params: { locale: string } }) => {
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "SignUpPage" });

  const text = {
    title: t("title"),
    subtitle: t("subtitle"),
    googleButton: t("googleButton"),
    orDivider: t("orDivider"),
    nameLabel: t("nameLabel"),
    namePlaceholder: t("namePlaceholder"),
    nameRequired: t("nameRequired"),
    emailLabel: t("emailLabel"),
    emailPlaceholder: t("emailPlaceholder"),
    emailRequired: t("emailRequired"),
    emailInvalid: t("emailInvalid"),
    passwordLabel: t("passwordLabel"),
    passwordPlaceholder: t("passwordPlaceholder"),
    passwordRequired: t("passwordRequired"),
    passwordTooShort: t("passwordTooShort"),
    passwordHint: t("passwordHint"),
    haveAccount: t("haveAccount"),
    signInLink: t("signInLink"),
    createAccountButton: t("createAccountButton"),
    creatingAccountButton: t("creatingAccountButton"),
    termsAgreement: t("termsAgreement"),
    termsOfService: t("termsOfService"),
    privacyPolicy: t("privacyPolicy"),
    needHelp: t("needHelp"),
    contactSupport: t("contactSupport"),
    verificationTitle: t("verificationTitle"),
    verificationMessage: t("verificationMessage"),
    verificationButton: t("verificationButton"),
  };
  return (
    <SignUpPage text={text} locale={locale} />
  )
}

export default page
