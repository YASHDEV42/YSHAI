"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

type CtaText = {
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
};

export const CtaSection = ({
  locale,
  text,
}: {
  locale: string;
  text: CtaText;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="container mx-auto px-4 py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card
          className="p-12 md:p-16 relative overflow-hidden group bg-primary"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative z-10 text-center">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 text-primary-foreground"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {text.ctaTitle}
            </motion.h2>

            <motion.p
              className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {text.ctaDescription}
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  size="lg"
                  className="bg-background hover:bg-background/90 text-accent-foreground px-8 relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="relative z-10 flex items-center">
                    {text.ctaButton}
                    {locale === "ar" ? (
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: -3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowLeft className="mr-2 w-4 h-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ x: 0 }}
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </motion.div>
                    )}
                  </span>
                  {/* Button shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Border animation */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-primary-foreground/10 pointer-events-none"
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          />
        </Card>
      </motion.div>
    </section>
  );
};
