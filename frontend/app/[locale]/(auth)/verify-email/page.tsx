import { setRequestLocale } from "next-intl/server";
import VerifyEmailPage from "./components/verify-email";
import { extractVerifyEmailPageText } from "@/app/i18n/extractTexts";
import { routing } from "@/app/i18n/routing";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Page({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<VerifyEmailSkeleton />}>
      <VerifyEmailServerPage locale={locale} searchParams={searchParams} />
    </Suspense>
  );
}

async function VerifyEmailServerPage({
  locale,
  searchParams,
}: {
  locale: string;
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const text = await extractVerifyEmailPageText(locale);
  return <VerifyEmailPage text={text} token={token ?? null} />;
}

function VerifyEmailSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-background p-4">
      <Card className="w-full max-w-md p-8 shadow-xl backdrop-blur-sm bg-card/95 border-2">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted animate-pulse" />
          <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          <div className="h-4 w-full bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
        </div>
      </Card>
    </div>
  );
}
