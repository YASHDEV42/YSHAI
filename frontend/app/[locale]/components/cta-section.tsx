'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"

type CtaText = {
  heading: string
  subHeading: string
  primaryButton: string
  secondaryButton: string
}

export const CtaSection = ({ locale, text }: { locale: string, text: CtaText }) => {
  return (
    <section className="container mx-auto px-4 py-20">
      <Card className="p-12 md:p-16 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">{text.heading}</h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          {text.subHeading}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {
            locale === "ar" ? (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                {text.primaryButton}
                <ArrowLeft className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8">
                {text.primaryButton}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            )
          }
          <Button size="lg" variant="outline" className="border-border hover:bg-card px-8 bg-transparent">
            {text.secondaryButton}
          </Button>
        </div>
      </Card>
    </section>
  )
}
