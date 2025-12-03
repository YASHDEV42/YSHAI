"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  MapPin,
  Clock,
  Users,
  Heart,
  Rocket,
  Globe2,
  GraduationCap,
  TrendingUp,
} from "lucide-react";

interface CareersContentProps {
  text: any;
  locale: string;
}

export default function CareersContent({ text, locale }: CareersContentProps) {
  const benefits = [
    {
      icon: Heart,
      title: text.benefits.health.title,
      description: text.benefits.health.description,
    },
    {
      icon: Globe2,
      title: text.benefits.remote.title,
      description: text.benefits.remote.description,
    },
    {
      icon: GraduationCap,
      title: text.benefits.learning.title,
      description: text.benefits.learning.description,
    },
    {
      icon: TrendingUp,
      title: text.benefits.growth.title,
      description: text.benefits.growth.description,
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {text.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{text.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {text.description}
          </p>
        </div>

        {/* Culture */}
        <Card className="p-8 mb-12 bg-muted/50">
          <h2 className="text-2xl font-bold mb-4">{text.culture.title}</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            {text.culture.description}
          </p>
        </Card>

        {/* Benefits */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {text.benefitsTitle}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <benefit.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {text.positionsTitle}
          </h2>
          {text.positions.length > 0 ? (
            <div className="space-y-4">
              {text.positions.map((position: any, index: number) => (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h3 className="text-xl font-bold">{position.title}</h3>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{position.department}</span>
                        </div>
                      </div>
                      <p className="mt-3 text-muted-foreground">
                        {position.description}
                      </p>
                    </div>
                    <Button className="md:w-auto w-full">
                      {text.applyButton}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Rocket className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">
                {text.noPositions.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {text.noPositions.description}
              </p>
              <Button variant="outline">{text.noPositions.button}</Button>
            </Card>
          )}
        </div>

        {/* Contact */}
        <Card className="p-8 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">{text.contact.title}</h2>
          <p className="text-muted-foreground mb-4">
            {text.contact.description}
          </p>
          <p className="font-medium">
            {text.contact.emailLabel}:{" "}
            <a
              href="mailto:careers@yshai.cloud"
              className="text-primary hover:underline"
            >
              careers@yshai.cloud
            </a>
          </p>
        </Card>
      </div>
    </div>
  );
}
