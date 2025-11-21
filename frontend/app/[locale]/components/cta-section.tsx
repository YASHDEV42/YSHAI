"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type CtaText = {
  heading: string;
  subHeading: string;
  primaryButton: string;
  secondaryButton: string;
};

export const CtaSection = ({
  locale,
  text,
}: {
  locale: string;
  text: CtaText;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <section className="container mx-auto px-4 py-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Card
          className="p-12 md:p-16 relative overflow-hidden group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background gradient */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              background: isHovered
                ? "linear-gradient(135deg, rgba(var(--primary)/0.15) 0%, rgba(var(--accent)/0.15) 100%)"
                : "linear-gradient(135deg, rgba(var(--primary)/0.1) 0%, rgba(var(--accent)/0.1) 100%)",
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Subtle animated particles/dots */}
          <div className="absolute inset-0">
            {mounted &&
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/20 rounded-full"
                  initial={{
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    scale: 0,
                  }}
                  animate={{
                    x: [Math.random() * 100, Math.random() * 100],
                    y: [Math.random() * 100, Math.random() * 100],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
              ))}
          </div>

          <div className="relative z-10">
            <motion.h2
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              {text.heading}
            </motion.h2>

            <motion.p
              className="text-xl text-muted-foreground mb-8 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {text.subHeading}
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
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 relative overflow-hidden group/btn shadow-lg hover:shadow-xl transition-shadow"
                >
                  <span className="relative z-10 flex items-center">
                    {text.primaryButton}
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
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border hover:bg-card px-8 bg-transparent backdrop-blur-sm relative overflow-hidden group/btn"
                >
                  <span className="relative z-10">{text.secondaryButton}</span>
                  {/* Subtle background slide effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-border/10 to-transparent -skew-x-12"
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
            className="absolute inset-0 rounded-lg border-2 border-primary/20 pointer-events-none"
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
