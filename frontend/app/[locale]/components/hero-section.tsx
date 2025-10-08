
"use client";
import { Navbar } from "./Navbar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";

export function HeroSection({ locale, text }: { locale: string, text: { heading: string, subHeading: string, primaryButton: string, secondaryButton: string, highlight: string } }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-20">
      <Navbar params={Promise.resolve({ locale })} />
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[linear-gradient(to_right,#00000018_1px,transparent_1px),linear-gradient(to_bottom,#00000018_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>{text.highlight}</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold">
          {text.heading}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          {text.subHeading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <Button size="lg" className="text-base px-8 group flex items-center justify-center">
            {locale === "ar" ? (
              <>
                <ArrowLeft className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                {text.primaryButton}
              </>
            ) : (
              <>
                {text.primaryButton}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          <Button size="lg" variant="outline" className="text-base px-8 bg-transparent">
            {text.secondaryButton}
          </Button>
        </div>
      </div>
    </section>
  );
}

