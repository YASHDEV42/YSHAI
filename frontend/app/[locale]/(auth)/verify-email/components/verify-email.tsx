"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader } from "lucide-react";
import { verifyEmail } from "@/lib/auth-helper";

interface VerifyEmailPageProps {
  text: any;
  token: string | null;
}

export default function VerifyEmailPage({ text, token }: VerifyEmailPageProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      const result = await verifyEmail(token);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen  from-background via-background to-muted/20 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Card className="p-8 sm:p-10 bg-card/95 backdrop-blur-sm border-border shadow-2xl text-center transition-all duration-300">
            {status === "loading" && (
              <div className="animate-in fade-in-0 zoom-in-95 duration-300">
                <div className="relative inline-block mb-6">
                  <Loader className="w-20 h-20 text-primary animate-spin" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-primary/10 animate-ping" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-foreground">
                  {text.verifying}
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {text.verifyingMessage}
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="animate-in fade-in-0 zoom-in-95 duration-500">
                <div className="relative inline-block mb-6">
                  <CheckCircle2 className="w-20 h-20 text-green-500 animate-in zoom-in-50 duration-700" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-green-500/20 animate-ping" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-green-600 dark:text-green-500">
                  {text.success}
                </h2>
                <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
                  {text.successMessage}
                </p>
                <Link href="/login" className="block">
                  <Button className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                    {text.goToLogin}
                  </Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="animate-in fade-in-0 zoom-in-95 duration-500">
                <div className="relative inline-block mb-6">
                  <XCircle className="w-20 h-20 text-red-500 animate-in zoom-in-50 duration-700" />
                  <div className="absolute inset-0 w-20 h-20 rounded-full bg-red-500/20 animate-ping" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-red-600 dark:text-red-500">
                  {text.error}
                </h2>
                <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
                  {!token ? text.missingToken : text.errorMessage}
                </p>
                <div className="space-y-3">
                  <Link href="/login" className="block">
                    <Button className="w-full h-11 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200">
                      {text.goToLogin}
                    </Button>
                  </Link>
                  <Link href="/signup" className="block">
                    <Button
                      variant="outline"
                      className="w-full h-11 text-base font-medium hover:bg-muted/50 transition-all duration-200 bg-transparent"
                    >
                      {text.resendVerification}
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
