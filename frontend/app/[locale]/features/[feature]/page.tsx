import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Globe,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { extractFeatureDetailText } from "@/app/i18n/extractTexts";
import LenisProvider from "@/components/LenisProvider";
import { routing } from "@/app/i18n/routing";

const featureDetails = {
  ai: {
    icon: Sparkles,
    imageQuery:
      "AI content generation dashboard with text editor and suggestions",
  },
  schedule: {
    icon: Calendar,
    imageQuery: "Social media calendar scheduling interface with timeline",
  },
  analytics: {
    icon: BarChart3,
    imageQuery:
      "Analytics dashboard with charts graphs and social media metrics",
  },
  team: {
    icon: Users,
    imageQuery:
      "Team collaboration interface showing user roles and approval workflows",
  },
  publish: {
    icon: Zap,
    imageQuery: "Multi-platform publishing interface with social media logos",
  },
  rtl: {
    icon: Globe,
    imageQuery: "RTL interface showing Arabic text in social media dashboard",
  },
};

export function generateStaticParams() {
  return Object.keys(featureDetails).flatMap((feature) =>
    routing.locales.map((locale) => ({ feature, locale })),
  );
}

export default async function FeatureDetailPage({
  params,
}: {
  params: Promise<{ feature: string; locale: string }>;
}) {
  const { feature, locale } = await params;

  if (!featureDetails[feature as keyof typeof featureDetails]) {
    notFound();
  }

  const detail = featureDetails[feature as keyof typeof featureDetails];
  const Icon = detail.icon;
  const text = await extractFeatureDetailText(locale, feature);

  return (
    <LenisProvider>
      {" "}
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Icon className="w-10 h-10 text-primary" />
              </div>
            </div>

            <Badge
              variant="secondary"
              className="mb-4 bg-accent/10 text-accent border-accent/20"
            >
              {text.badge}
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
              {text.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {text.description}
            </p>
          </div>
        </section>

        {/* Feature Image */}
        <section className="container mx-auto px-4 pb-16">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-2">
              <Image
                src="/bitmap.svg"
                alt={text.title}
                width={1200}
                height={600}
                className="w-full"
              />
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              {text.benefitsHeading}
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              {text.benefitsSubheading}
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {text.benefits &&
                text.benefits.map((benefit: string, index: number) => (
                  <Card
                    key={index}
                    className="p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <p className="text-lg">{benefit}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              {text.howItWorksHeading}
            </h2>
            <p className="text-lg text-muted-foreground text-center mb-12">
              {text.howItWorksSubheading}
            </p>

            <div className="space-y-8">
              {text.steps &&
                text.steps.map(
                  (
                    step: { title: string; description: string },
                    index: number,
                  ) => (
                    <Card
                      key={index}
                      className="p-8 hover:border-primary/50 transition-colors"
                    >
                      <div className="flex items-start gap-6">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-xl font-bold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            {step.title}
                          </h3>
                          <p className="text-muted-foreground text-lg leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ),
                )}
            </div>
          </div>
        </section>

        {/* Additional Feature Image */}
        <section className="container mx-auto px-4 py-16 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <Card className="overflow-hidden border-2">
              <Image
                src="/bitmap.svg"
                alt={`${text.title} detailed view`}
                width={1200}
                height={500}
                className="w-full"
              />
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {text.ctaHeading}
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                {text.ctaSubheading}
              </p>
              <div className="flex justify-center gap-2">
                <Link href="/signup">
                  <Button size="lg" className="gap-2">
                    {text.cta}
                    <Sparkles className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/#features">
                  <Button size="lg" variant="outline">
                    {text.viewAllFeatures}
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </LenisProvider>
  );
}
