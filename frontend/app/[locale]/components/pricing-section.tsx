"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Star, TrendingUp } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface PricingPlan {
  title: string;
  price: string;
  yearlyPrice?: string;
  period: string;
  features: string[];
  button: string;
  badge?: string;
  description?: string;
  highlighted?: boolean;
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
  toggle?: {
    monthly: string;
    yearly: string;
    discount: string;
  };
}

const PricingSelector = ({
  isYearly,
  setIsYearly,
  monthlyLabel,
  yearlyLabel,
  discountLabel,
  isRTL,
}: {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
  monthlyLabel: string;
  yearlyLabel: string;
  discountLabel: string;
  isRTL: boolean;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center gap-3 mb-12"
    >
      <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-lg">
        <button
          type="button"
          onClick={() => setIsYearly(false)}
          className={cn(
            "px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
            !isYearly
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {monthlyLabel}
        </button>
        <button
          type="button"
          onClick={() => setIsYearly(true)}
          className={cn(
            "px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
            isYearly
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {yearlyLabel}
          <Badge
            variant="secondary"
            className="text-xs bg-primary/10 text-primary rounded-t-none"
          >
            {discountLabel}
          </Badge>
        </button>
      </div>
    </motion.div>
  );
};

const PricingCard = ({
  plan,
  index,
  isYearly,
}: {
  plan: PricingPlan;
  index: number;
  isYearly: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const displayPrice =
    isYearly && plan.yearlyPrice ? plan.yearlyPrice : plan.price;
  const isPopular =
    plan.badge === "Most Popular" ||
    plan.badge === "الأكثر شيوعاً" ||
    plan.highlighted;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("relative h-full", isPopular && "md:scale-105")}
    >
      <Card
        className={cn(
          "p-8 bg-card flex flex-col h-full transition-all duration-300 overflow-hidden relative",
          isPopular ? "border-primary shadow-lg" : "border-border",
          isHovered && "shadow-xl",
        )}
      >
        {/* Popular badge */}
        {plan.badge && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
            className="absolute -top-1 left-1/2 -translate-x-1/2 z-10"
          >
            <Badge
              className={cn(
                "px-3 py-1 text-xs font-semibold",
                isPopular
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary",
              )}
            >
              {plan.badge}
            </Badge>
          </motion.div>
        )}

        {/* Card content */}
        <div className="relative z-10 w-full flex flex-col h-full">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-2xl font-bold">{plan.title}</h3>
            {isPopular && (
              <Star className="w-5 h-5 text-primary fill-current" />
            )}
          </div>

          {plan.description && (
            <p className="text-sm text-muted-foreground mb-4">
              {plan.description}
            </p>
          )}

          <div className="mb-6 flex items-baseline">
            <span className="text-4xl font-bold">{displayPrice}</span>
            <span className="text-muted-foreground ml-1">{plan.period}</span>

            {/* Discount indicator for yearly pricing */}
            {isYearly && plan.yearlyPrice && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-2 flex items-center gap-1 text-primary text-sm font-medium"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Save 20%</span>
              </motion.div>
            )}
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {plan.features.map((feature, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 + i * 0.05 }}
                className="flex items-start gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">{feature}</span>
              </motion.li>
            ))}
          </ul>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-auto"
          >
            <Button
              variant={isPopular ? "default" : "outline"}
              className={cn(
                "w-full transition-all duration-300",
                isPopular ? "bg-primary hover:bg-primary/90" : "bg-transparent",
                isHovered && isPopular && "shadow-lg",
              )}
              aria-label={`Select ${plan.title} plan`}
            >
              {plan.button}
            </Button>
          </motion.div>
        </div>

        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
};

export const PricingSection = ({
  locale,
  text,
}: {
  locale: string;
  text: PricingSectionText;
}) => {
  const [isYearly, setIsYearly] = useState(false);
  const isRTL = locale === "ar";

  // Safety check for text object
  const { badge, heading, subHeading, plans, toggle } = text || {};

  if (!text || !text.plans) {
    console.error("[v0] PricingSection: Missing required text data", { text });
    return null;
  }

  return (
    <section
      id="pricing"
      className="container mx-auto px-4 py-20"
      aria-labelledby="pricing-heading"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent border-accent/20"
          >
            {badge}
          </Badge>
        </motion.div>

        <motion.h2
          id="pricing-heading"
          className="text-4xl md:text-5xl font-bold mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subHeading}
        </motion.p>
      </div>

      {toggle && (
        <PricingSelector
          isYearly={isYearly}
          setIsYearly={setIsYearly}
          monthlyLabel={toggle.monthly}
          yearlyLabel={toggle.yearly}
          discountLabel={toggle.discount}
          isRTL={isRTL}
        />
      )}

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.free && (
          <PricingCard plan={plans.free} index={0} isYearly={isYearly} />
        )}
        {plans.pro && (
          <PricingCard plan={plans.pro} index={1} isYearly={isYearly} />
        )}
        {plans.business && (
          <PricingCard plan={plans.business} index={2} isYearly={isYearly} />
        )}
      </div>
    </section>
  );
};
