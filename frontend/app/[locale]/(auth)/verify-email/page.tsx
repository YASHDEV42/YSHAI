import VerifyEmailPage from "./components/verify-email";

interface PageProps {
  searchParams: { token?: string };
}

// If you already have i18n text loader, use that here.
// For now I’ll assume `text` is coming from somewhere like `getVerifyEmailText(locale)`.
const dummyText = {
  verifying: "Verifying your email...",
  success: "Email verified successfully!",
  successMessage: "Your email has been verified. You can now log in.",
  error: "Verification failed",
  errorMessage: "The link is invalid or expired.",
  goToLogin: "Go to Login",
  resendVerification: "Resend verification email",
};

export default function Page({ searchParams }: PageProps) {
  const token = searchParams.token ?? null;

  const text = dummyText;

  return <VerifyEmailPage text={text} token={token} />;
}
