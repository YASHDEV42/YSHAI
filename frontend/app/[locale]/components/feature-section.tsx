"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, BarChart3, Users, Zap, Globe } from "lucide-react";

interface FeatureSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  features: {
    ai: { title: string; description: string };
    schedule: { title: string; description: string };
    analytics: { title: string; description: string };
    team: { title: string; description: string };
    publish: { title: string; description: string };
    rtl: { title: string; description: string };
  };
}

export const FeatureSection = ({
  locale,
  text,
}: {
  locale: string;
  text: FeatureSectionText;
}) => {
  const { badge, heading, subHeading, features } = text;

  return (
    <section id="features" className="container mx-auto px-4 py-20 dir">
      <div className="text-center mb-16">
        <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent border-accent/20">
          {badge}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subHeading}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(features).map(([key, value]) => {
          const Icon =
            key === "ai" ? Sparkles :
              key === "schedule" ? Calendar :
                key === "analytics" ? BarChart3 :
                  key === "team" ? Users :
                    key === "publish" ? Zap :
                      Globe;

          return (
            <Card key={key} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{value.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
