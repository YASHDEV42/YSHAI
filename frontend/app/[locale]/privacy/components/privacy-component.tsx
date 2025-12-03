"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Shield,
  Lock,
  Eye,
  Database,
  Users,
  AlertCircle,
  Globe2,
  FileText,
} from "lucide-react";

interface PrivacyContentProps {
  text: any;
  locale: string;
}

export default function PrivacyContent({ text, locale }: PrivacyContentProps) {
  const sections = [
    {
      icon: Database,
      title: text.sections.dataCollection.title,
      content: text.sections.dataCollection.content,
    },
    {
      icon: FileText,
      title: text.sections.legalBasis.title,
      content: text.sections.legalBasis.content,
    },
    {
      icon: Lock,
      title: text.sections.dataUsage.title,
      content: text.sections.dataUsage.content,
    },
    {
      icon: Shield,
      title: text.sections.dataRetention.title,
      content: text.sections.dataRetention.content,
    },
    {
      icon: Shield,
      title: text.sections.dataSecurity.title,
      content: text.sections.dataSecurity.content,
    },
    {
      icon: Users,
      title: text.sections.dataSharing.title,
      content: text.sections.dataSharing.content,
    },
    {
      icon: Globe2,
      title: text.sections.internationalTransfers.title,
      content: text.sections.internationalTransfers.content,
    },
    {
      icon: Eye,
      title: text.sections.userRights.title,
      content: text.sections.userRights.content,
    },
    {
      icon: Eye,
      title: text.sections.dataDeletionProcess.title,
      content: text.sections.dataDeletionProcess.content,
    },
    {
      icon: AlertCircle,
      title: text.sections.cookies.title,
      content: text.sections.cookies.content,
    },
    {
      icon: AlertCircle,
      title: text.sections.children.title,
      content: text.sections.children.content,
    },
    {
      icon: FileText,
      title: text.sections.changesToPolicy.title,
      content: text.sections.changesToPolicy.content,
    },
  ];

  return (
    <div className="min-h-screen bg-background mt-10">
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
