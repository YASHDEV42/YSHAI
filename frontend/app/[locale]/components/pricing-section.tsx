"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
interface PricingPlan {
  title: string;
  price: string;
  period: string;
  features: string[];
  button: string;
  badge?: string;
}
interface PricingSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  plans: {
    free: PricingPlan;
    pro: PricingPlan;
    business: PricingPlan;
  };
}
export const PricingSection = ({
  locale,
  text,
}: {
  locale: string;
  text: PricingSectionText;
}) => {
  const { badge, heading, subHeading, plans } = text;

  return (
    <section id="pricing" className="container mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <Badge
          variant="secondary"
          className="mb-4 bg-accent/10 text-accent border-accent/20"
        >
          {badge}
        </Badge>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {subHeading}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {Object.entries(plans).map(([key, plan]) => (
          <Card
            key={key}
            className={`p-8 bg-card flex justify-between items-start flex-col ${key === "pro" ? "border-primary relative" : "border-border"
              }`}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                {plan.badge}
              </Badge>
            )}
            <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              variant={key === "pro" ? "default" : "outline"}
              className={`w-full ${key === "pro" ? "bg-primary hover:bg-primary/90" : "bg-transparent"
                }`}
            >
              {plan.button}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
};
