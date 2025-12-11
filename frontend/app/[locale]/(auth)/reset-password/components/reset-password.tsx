"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Loader, Eye, EyeOff } from "lucide-react";
import { useActionState, useState } from "react";
import { resetPasswordAction } from "../actions";

interface ResetPasswordPageProps {
  text: any;
  locale: string;
  token: string;
}

const initialState = {
  arMessage: "",
  enMessage: "",
  success: false,
};

export default function ResetPasswordPage({
  text,
  locale,
  token,
}: ResetPasswordPageProps) {
  const [state, formAction, pending] = useActionState(
    resetPasswordAction.bind(null, token),
    initialState,
  );
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 pb-12 pt-20">
          <div className="w-full max-w-md">
            <Card className="p-8 bg-card backdrop-blur-sm border-border text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                {text.invalidToken}
              </h2>
              <Link href="/forgot-password">
                <Button className="w-full">{text.backToLogin}</Button>
              </Link>
            </Card>
          </div>
        </main>
      </div>
    );
  }

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
                <FieldLabel htmlFor="newPassword">
                  {text.newPasswordLabel}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder={text.newPasswordPlaceholder}
                    disabled={state.success}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={state.success}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Field>
                <FieldLabel htmlFor="confirmPassword">
                  {text.confirmPasswordLabel}
                </FieldLabel>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={text.confirmPasswordPlaceholder}
                    disabled={state.success}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={state.success}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
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
                {pending ? text.resettingPassword : text.resetPassword}
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
        </div>
      </main>
    </div>
  );
}
