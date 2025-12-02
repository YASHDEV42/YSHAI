"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Scale,
  Ban,
  DollarSign,
  AlertTriangle,
  RefreshCw,
  Shield,
  Users,
  Link2,
} from "lucide-react";

interface TermsContentProps {
  text: any;
  locale: string;
}

export default function TermsContent({ text, locale }: TermsContentProps) {
  const sections = [
    {
      icon: FileText,
      title: text.sections.acceptance.title,
      content: text.sections.acceptance.content,
    },
    {
      icon: Shield,
      title: text.sections.eligibility.title,
      content: text.sections.eligibility.content,
    },
    {
      icon: Users,
      title: text.sections.accountRegistration.title,
      content: text.sections.accountRegistration.content,
    },
    {
      icon: Scale,
      title: text.sections.services.title,
      content: text.sections.services.content,
    },
    {
      icon: DollarSign,
      title: text.sections.subscription.title,
      content: text.sections.subscription.content,
    },
    {
      icon: Users,
      title: text.sections.userResponsibilities.title,
      content: text.sections.userResponsibilities.content,
    },
    {
      icon: Ban,
      title: text.sections.prohibitedUse.title,
      content: text.sections.prohibitedUse.content,
    },
    {
      icon: Link2,
      title: text.sections.thirdPartyServices.title,
      content: text.sections.thirdPartyServices.content,
    },
    {
      icon: FileText,
      title: text.sections.intellectualProperty.title,
      content: text.sections.intellectualProperty.content,
    },
    {
      icon: AlertTriangle,
      title: text.sections.limitation.title,
      content: text.sections.limitation.content,
    },
    {
      icon: AlertTriangle,
      title: text.sections.disclaimer.title,
      content: text.sections.disclaimer.content,
    },
    {
      icon: Shield,
      title: text.sections.indemnification.title,
      content: text.sections.indemnification.content,
    },
    {
      icon: Scale,
      title: text.sections.governingLaw.title,
      content: text.sections.governingLaw.content,
    },
    {
      icon: RefreshCw,
      title: text.sections.changesToTerms.title,
      content: text.sections.changesToTerms.content,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {text.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{text.title}</h1>
          <p className="text-muted-foreground text-lg">
            {text.lastUpdated}: {text.date}
          </p>
        </div>

        {/* Intro */}
        <Card className="p-8 mb-8 bg-muted/50">
          <p className="text-lg leading-relaxed">{text.introduction}</p>
        </Card>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index} className="p-8">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <section.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item: string, i: number) => (
                          <li key={i} className="text-muted-foreground">
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed">
                        {section.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact */}
        <Card className="p-8 mt-8 bg-primary/5 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">{text.contact.title}</h2>
          <p className="text-muted-foreground mb-4">
            {text.contact.description}
          </p>
          <p className="font-medium mb-2">
            {text.contact.email}:{" "}
            <a
              href={`mailto:${text.contact.email}`}
              className="text-primary hover:underline"
            >
              {text.contact.email}
            </a>
          </p>
          {text.contact.address && (
            <p className="text-muted-foreground">{text.contact.address}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
