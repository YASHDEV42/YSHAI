"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
} from "lucide-react";

interface IntegrationsSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  platforms: {
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    youtube: string;
    tiktok: string;
  };
}

export const IntegrationsSection = ({
  text,
}: {
  text: IntegrationsSectionText;
}) => {
  const { badge, heading, subHeading, platforms } = text;

  const platformsData = [
    { name: platforms.facebook, icon: Facebook, color: "bg-blue-500" },
    { name: platforms.twitter, icon: Twitter, color: "bg-sky-500" },
    { name: platforms.instagram, icon: Instagram, color: "bg-pink-500" },
    { name: platforms.linkedin, icon: Linkedin, color: "bg-blue-600" },
    { name: platforms.youtube, icon: Youtube, color: "bg-red-500" },
    { name: platforms.tiktok, icon: MessageCircle, color: "bg-slate-800" },
  ];

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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
        {platformsData.map((platform, index) => {
          const Icon = platform.icon;
          return (
            <Card
              key={index}
              className="p-6 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer"
            >
              <div
                className={`w-12 h-12 ${platform.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-center text-sm font-medium">{platform.name}</p>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground">
          And many more platforms coming soon...
        </p>
      </div>
    </section>
  );
};
