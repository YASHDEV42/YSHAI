"use client";

import type React from "react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  Zap,
  Globe,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
  learnMore: string;
}

const FeatureCard = ({
  feature,
  icon: Icon,
  index,
  featureKey,
  learnMore,
}: {
  feature: { title: string; description: string };
  icon: React.ElementType;
  index: number;
  featureKey: string;
  learnMore: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const gradients = [
    "from-primary/15 to-primary/5",
    "from-primary/10 to-accent/5",
    "from-accent/15 to-primary/10",
    "from-primary/20 to-accent/10",
    "from-accent/10 to-primary/15",
    "from-primary/12 to-accent/8",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      tabIndex={0}
      role="article"
      aria-labelledby={`feature-${index}-title`}
      aria-describedby={`feature-${index}-description`}
      className={cn(
        "group focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 rounded-xl h-full",
      )}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsHovered(!isHovered);
        }
      }}
    >
      <Card
        className={cn(
          "h-full flex flex-col p-8 bg-card border-border transition-all duration-300 overflow-hidden relative",
          "hover:border-primary/50 hover:shadow-xl",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
          gradients[index % gradients.length],
        )}
      >
        <div className="relative z-10 flex-1 flex flex-col">
          <motion.div
            className={cn(
              "w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300",
              "group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20",
            )}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            animate={isHovered ? { rotate: 5 } : { rotate: 0 }}
          >
            <Icon className="w-7 h-7 text-primary transition-all duration-300 group-hover:scale-110" />
          </motion.div>

          <h3
            id={`feature-${index}-title`}
            className="text-xl font-bold mb-3 transition-colors duration-300 group-hover:text-primary"
          >
            {feature.title}
          </h3>

          <p
            id={`feature-${index}-description`}
            className="text-muted-foreground leading-relaxed flex-1 mb-6"
          >
            {feature.description}
          </p>

          <Link href={`/features/${featureKey}`} className="w-full">
            <Button
              variant="ghost"
              className="w-full group/btn hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              {learnMore}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  );
};

export const FeatureSection = ({ text }: { text: FeatureSectionText }) => {
  const { badge, heading, subHeading, features } = text;
  return (
    <section
      id="features"
      className="container mx-auto px-4 py-20 dir"
      aria-labelledby="features-heading"
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
          id="features-heading"
          className="text-4xl md:text-5xl font-bold mb-4 text-balance"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subHeading}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto auto-rows-fr">
        {Object.entries(features).map(([key, value], index) => {
          const Icon =
            key === "ai"
              ? Sparkles
              : key === "schedule"
                ? Calendar
                : key === "analytics"
                  ? BarChart3
                  : key === "team"
                    ? Users
                    : key === "publish"
                      ? Zap
                      : Globe;

          return (
            <FeatureCard
              learnMore={text.learnMore}
              key={key}
              feature={value}
              icon={Icon}
              index={index}
              featureKey={key}
            />
          );
        })}
      </div>
    </section>
  );
};
