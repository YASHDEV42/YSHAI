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
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 pb-12 pt-20">
        <div className="w-full max-w-md">
          <Card className="p-8 bg-card backdrop-blur-sm border-border text-center">
            {status === "loading" && (
              <>
                <Loader className="w-16 h-16 mx-auto mb-4 text-primary animate-spin" />
                <h2 className="text-2xl font-bold mb-2">{text.verifying}</h2>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h2 className="text-2xl font-bold mb-2 text-green-600">
                  {text.success}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {text.successMessage}
                </p>
                <Link href="/login">
                  <Button className="w-full">{text.goToLogin}</Button>
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold mb-2 text-red-600">
                  {text.error}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {text.errorMessage}
                </p>
                <div className="space-y-3">
                  <Link href="/login">
                    <Button className="w-full">{text.goToLogin}</Button>
                  </Link>
                  <Link href="/forgot-password">
                    <Button variant="outline" className="w-full">
                      {text.resendVerification}
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}
