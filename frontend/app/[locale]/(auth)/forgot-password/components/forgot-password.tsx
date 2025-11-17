"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { useActionState } from "react";
import { forgotPasswordAction } from "../actions";

interface ForgotPasswordPageProps {
  text: any;
  locale: string;
}

const initialState = {
  arMessage: "",
  enMessage: "",
  success: false,
};

export default function ForgotPasswordPage({
  text,
  locale,
}: ForgotPasswordPageProps) {
  const [state, formAction, pending] = useActionState(
    forgotPasswordAction,
    initialState,
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 pb-12 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
            <p className="text-muted-foreground">{text.subtitle}</p>
          </div>

          <Card className="p-8 bg-card backdrop-blur-sm border-border">
            <form className="space-y-4" action={formAction}>
              <Field>
                <FieldLabel htmlFor="email">{text.emailLabel}</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={text.emailPlaceholder}
                  disabled={state.success}
                />
              </Field>

              {state &&
                (locale === "ar"
                  ? state.arMessage && (
                      <p
                        className={`text-center text-base ${state.success ? "text-green-600" : "text-red-600"}`}
                      >
                        {state.arMessage}
                      </p>
                    )
                  : state.enMessage && (
                      <p
                        className={`text-center text-base ${state.success ? "text-green-600" : "text-red-600"}`}
                      >
                        {state.enMessage}
                      </p>
                    ))}

              <Button
                type="submit"
                disabled={pending || state.success}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {pending && <Loader className="animate-spin" />}
                {pending ? text.sendingLink : text.sendResetLink}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm pt-2">
                {locale === "ar" ? (
                  <ArrowRight className="w-4 h-4" />
                ) : (
                  <ArrowLeft className="w-4 h-4" />
                )}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  {text.backToLogin}
                </Link>
              </div>
            </form>
          </Card>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {text.needHelp}{" "}
            <Link href="/support" className="text-primary hover:underline">
              {text.contactSupport}
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
