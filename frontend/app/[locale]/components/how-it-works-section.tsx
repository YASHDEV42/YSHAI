"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface HowItWorksSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  steps: {
    step1: { title: string; description: string };
    step2: { title: string; description: string };
    step3: { title: string; description: string };
    step4: { title: string; description: string };
  };
}

export const HowItWorksSection = ({
  text,
}: {
  text: HowItWorksSectionText;
}) => {
  const { badge, heading, subHeading, steps } = text;

  return (
    <section className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge
          variant="secondary"
          className="mb-4 bg-accent/10 text-accent border-accent/20"
        >
          {badge}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
          {heading}
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subHeading}
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {Object.entries(steps).map(([key, step], index) => (
          <div key={key} className="relative">
            <Card className="p-6 bg-card border-border hover:border-primary/50 transition-colors h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                  {index + 1}
                </div>
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </Card>
            {index < 3 && (
              <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
