"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MessageCircle,
  UserCircle,
  CreditCard,
  Zap,
  Mail,
  BookOpen,
} from "lucide-react";

type SupportText = Record<string, any>;

export function SupportContent({
  locale,
  text,
}: {
  locale: string;
  text: SupportText;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const faqsArray = text.faqs ? Object.values(text.faqs) : [];

  const filteredFAQs = faqsArray.filter((faq: any) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? faq.category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    {
      key: "gettingStarted",
      icon: BookOpen,
      title: text.categories?.gettingStarted?.title || "",
      description: text.categories?.gettingStarted?.description || "",
    },
    {
      key: "account",
      icon: UserCircle,
      title: text.categories?.account?.title || "",
      description: text.categories?.account?.description || "",
    },
    {
      key: "billing",
      icon: CreditCard,
      title: text.categories?.billing?.title || "",
      description: text.categories?.billing?.description || "",
    },
    {
      key: "features",
      icon: Zap,
      title: text.categories?.features?.title || "",
      description: text.categories?.features?.description || "",
    },
  ];

  return (
    <div
      className="min-h-screen bg-background"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-primary/10 to-background py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">{text.title}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              {text.subtitle}
            </p>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={text.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Categories */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.title;
            return (
              <Card
                key={category.key}
                className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-primary" : ""}`}
                onClick={() =>
                  setSelectedCategory(isSelected ? null : category.title)
                }
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-sm">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {filteredFAQs.map((faq: any, index: number) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-start gap-3">
                        <MessageCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pl-8 text-muted-foreground whitespace-pre-line">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {filteredFAQs.length === 0 && (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No results found. Try different keywords.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="mt-8 bg-primary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                {text.stillNeedHelp}
              </h3>
              <p className="text-muted-foreground mb-6">
                Our support team is here to help you 24/7
              </p>
              <Button size="lg">
                <Mail className="mr-2 h-4 w-4" />
                {text.contactSupport}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
