"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialsSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  testimonials: {
    testimonial1: {
      name: string;
      role: string;
      company: string;
      content: string;
      rating: number;
    };
    testimonial2: {
      name: string;
      role: string;
      company: string;
      content: string;
      rating: number;
    };
    testimonial3: {
      name: string;
      role: string;
      company: string;
      content: string;
      rating: number;
    };
  };
}

export const TestimonialsSection = ({
  text,
}: {
  text: TestimonialsSectionText;
}) => {
  const { badge, heading, subHeading, testimonials } = text;

  return (
    <section className="container mx-auto px-4 py-20 bg-muted/30">
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

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {Object.entries(testimonials).map(([key, testimonial]) => (
          <Card
            key={key}
            className="p-6 bg-card border-border hover:border-primary/50 transition-colors"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(testimonial.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-primary text-primary" />
              ))}
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              "{testimonial.content}"
            </p>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage
                  src={`/.jpg?height=40&width=40&query=${testimonial.name}`}
                />
                <AvatarFallback>
                  {testimonial.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonial.role} at {testimonial.company}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
