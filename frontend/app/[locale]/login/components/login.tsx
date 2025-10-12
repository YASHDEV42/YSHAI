"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define the text interface
export interface LoginPageText {
  title: string;
  subtitle: string;
  googleButton: string;
  githubButton: string;
  orDivider: string;
  emailLabel: string;
  emailPlaceholder: string;
  emailRequired: string;
  emailInvalid: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  passwordRequired: string;
  forgotPassword: string;
  noAccount: string;
  signUpLink: string;
  signInButton: string;
  signingInButton: string;
  termsAgreement: string;
  termsOfService: string;
  privacyPolicy: string;
  needHelp: string;
  contactSupport: string;
}

interface LoginPageProps {
  text: LoginPageText;
  locale: string;
}

export default function LoginPage({ text, locale }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = text.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = text.emailInvalid;
    }
    if (!formData.password) {
      newErrors.password = text.passwordRequired;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    console.log("[v0] Login form submitted:", formData);
    try {
      const response = await fetch(`${process.env.Backend || "http://localhost:5000"}/auth/login`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        setErrors({ form: errorData.message || "An error occurred. Please try again." })
        console.log("Signup failed:", errorData)
      } else {
        const data = await response.json()
        console.log("Signup successful:", data)
        router.push(`/dashboard`)
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error)
    } finally {
      setIsLoading(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4 pb-12 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
            <p className="text-muted-foreground">{text.subtitle}</p>
          </div>

          <Card className="p-8 bg-card backdrop-blur-sm border-border">
            <div className="space-y-3 mb-2">
              <Button variant="outline" className="w-full bg-transparent" type="button">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {text.googleButton}
              </Button>
            </div>

            <div className="relative mb-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                {text.orDivider}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">{text.emailLabel}</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={text.emailPlaceholder}
                  value={formData.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                  disabled={isLoading}
                />
                {errors.email && <FieldError>{errors.email}</FieldError>}
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">{text.passwordLabel}</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder={text.passwordPlaceholder}
                  value={formData.password}
                  onChange={handleChange}
                  aria-invalid={!!errors.password}
                  disabled={isLoading}
                />
                {errors.password && <FieldError>{errors.password}</FieldError>}
              </Field>

              <div className="flex items-center justify-end">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  {text.forgotPassword}
                </Link>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm pt-2">
                <span className="text-muted-foreground">{text.noAccount}</span>
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  {text.signUpLink}
                </Link>
              </div>

              {errors.form && (<p className="text-base text-red-600 text-center font-bold">{errors.form}</p>)}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>

                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {text.signingInButton}
                  </>
                ) : (
                  <>
                    {text.signInButton}
                    {locale === "ar" ? (<ArrowLeft className="mr-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />) : (<ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />)}
                  </>
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground text-center">
              {text.termsAgreement}{" "}
              <Link href="/terms" className="text-primary hover:underline">
                {text.termsOfService}
              </Link>{" "}
              و{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                {text.privacyPolicy}
              </Link>
            </p>
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

