"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Sparkles,
  Target,
  Heart,
  TrendingUp,
  Users,
  Globe,
  Award,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  easeInOut,
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { CtaSection } from "../../components/cta-section";

interface AboutContentProps {
  text: {
    badge: string;
    heading: string;
    subHeading: string;
    missionTitle: string;
    missionDescription: string;
    storyTitle: string;
    storyDescription: string;
    statsTitle: string;
    stats: {
      users: { value: string; label: string };
      posts: { value: string; label: string };
      countries: { value: string; label: string };
      satisfaction: { value: string; label: string };
    };
    valuesTitle: string;
    teamDescription: string;
    values: {
      innovation: { title: string; description: string };
      simplicity: { title: string; description: string };
      quality: { title: string; description: string };
      support: { title: string; description: string };
    };
    ctaTitle: string;
    ctaDescription: string;
    ctaButton: string;
  };
  locale: string;
}

export default function AboutContent({ text, locale }: AboutContentProps) {
  const [counters, setCounters] = useState({
    users: 0,
    posts: 0,
    countries: 0,
    satisfaction: 0,
  });

  const [activeValue, setActiveValue] = useState<number | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const storyInView = useInView(storyRef, { once: true, amount: 0.3 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const statsY = useTransform(scrollYProgress, [0, 0.5], [0, -30]);

  useEffect(() => {
    if (statsInView) {
      const duration = 2000;
      const steps = 60;
      const usersStep =
        Number.parseInt(text.stats.users.value.replace(/[^0-9]/g, "")) / steps;
      const postsStep =
        Number.parseInt(text.stats.posts.value.replace(/[^0-9]/g, "")) / steps;
      const countriesStep =
        Number.parseInt(text.stats.countries.value.replace(/[^0-9]/g, "")) /
        steps;
      const satisfactionStep =
        Number.parseInt(text.stats.satisfaction.value.replace(/[^0-9]/g, "")) /
        steps;

      let currentStep = 0;
      const interval = setInterval(() => {
        currentStep++;
        setCounters({
          users: Math.floor(usersStep * currentStep),
          posts: Math.floor(postsStep * currentStep),
          countries: Math.floor(countriesStep * currentStep),
          satisfaction: Math.floor(satisfactionStep * currentStep),
        });

        if (currentStep >= steps) {
          clearInterval(interval);
          setCounters({
            users: Number.parseInt(
              text.stats.users.value.replace(/[^0-9]/g, ""),
            ),
            posts: Number.parseInt(
              text.stats.posts.value.replace(/[^0-9]/g, ""),
            ),
            countries: Number.parseInt(
              text.stats.countries.value.replace(/[^0-9]/g, ""),
            ),
            satisfaction: Number.parseInt(
              text.stats.satisfaction.value.replace(/[^0-9]/g, ""),
            ),
          });
        }
      }, duration / steps);

      return () => clearInterval(interval);
    }
  }, [statsInView, text.stats]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      </div>

      <motion.section
        ref={heroRef}
        className="container mx-auto px-4 py-24 md:py-32"
        style={{ y: heroY }}
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={itemVariants}>
            <Badge
              variant="secondary"
              className="mb-6 bg-accent/10 text-accent border-accent/20 px-4 py-2 text-sm"
            >
              {text.badge}
            </Badge>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 text-balance bg-gradient-to-r from-foreground to-primary/70 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            {text.heading}
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto"
            variants={itemVariants}
          >
            {text.subHeading}
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        ref={missionRef}
        className="container mx-auto px-4 py-16 bg-muted/30 relative"
        initial="hidden"
        animate={missionInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <motion.div
              className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0"
              variants={itemVariants}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Target className="w-8 h-8 text-primary" />
            </motion.div>
            <div>
              <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                variants={itemVariants}
              >
                {text.missionTitle}
              </motion.h2>
              <motion.p
                className="text-lg text-muted-foreground leading-relaxed"
                variants={itemVariants}
              >
                {text.missionDescription}
              </motion.p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={storyRef}
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate={storyInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
            variants={itemVariants}
          >
            {text.storyTitle}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground leading-relaxed text-center"
            variants={itemVariants}
          >
            {text.storyDescription}
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        ref={statsRef}
        className="container mx-auto px-4 py-16 bg-muted/30 relative"
        style={{ y: statsY }}
        initial="hidden"
        animate={statsInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-12 text-center"
            variants={itemVariants}
          >
            {text.statsTitle}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-8 text-center border-0 shadow-md bg-gradient-to-br from-background to-muted/20 h-full">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {counters.users.toLocaleString()}
                  {text.stats.users.value.includes("+") && "+"}
                </div>
                <div className="text-muted-foreground">
                  {text.stats.users.label}
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-8 text-center border-0 shadow-md bg-gradient-to-br from-background to-muted/20 h-full">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {counters.posts.toLocaleString()}
                  {text.stats.posts.value.includes("+") && "+"}
                </div>
                <div className="text-muted-foreground">
                  {text.stats.posts.label}
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-8 text-center border-0 shadow-md bg-gradient-to-br from-background to-muted/20 h-full">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {counters.countries.toLocaleString()}
                  {text.stats.countries.value.includes("+") && "+"}
                </div>
                <div className="text-muted-foreground">
                  {text.stats.countries.label}
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-8 text-center border-0 shadow-md bg-gradient-to-br from-background to-muted/20 h-full">
                <div className="mb-4 flex justify-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {counters.satisfaction}%
                  {text.stats.satisfaction.value.includes("+") && "+"}
                </div>
                <div className="text-muted-foreground">
                  {text.stats.satisfaction.label}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        ref={valuesRef}
        className="container mx-auto px-4 py-16"
        initial="hidden"
        animate={valuesInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-center"
            variants={itemVariants}
          >
            {text.valuesTitle}
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground text-center mb-12"
            variants={itemVariants}
          >
            {text.teamDescription}
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setActiveValue(0)}
              onHoverEnd={() => setActiveValue(null)}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "p-8 h-full border-0 shadow-md transition-all duration-150",
                  activeValue === 0
                    ? "bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg"
                    : "bg-gradient-to-br from-background to-muted/20",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      {text.values.innovation.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {text.values.innovation.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setActiveValue(1)}
              onHoverEnd={() => setActiveValue(null)}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "p-8 h-full border-0 shadow-md transition-all duration-150",
                  activeValue === 1
                    ? "bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg"
                    : "bg-gradient-to-br from-background to-muted/20",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      {text.values.simplicity.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {text.values.simplicity.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setActiveValue(2)}
              onHoverEnd={() => setActiveValue(null)}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "p-8 h-full border-0 shadow-md transition-all duration-150",
                  activeValue === 2
                    ? "bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg"
                    : "bg-gradient-to-br from-background to-muted/20",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      {text.values.quality.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {text.values.quality.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              whileHover={{ scale: 1.02 }}
              onHoverStart={() => setActiveValue(3)}
              onHoverEnd={() => setActiveValue(null)}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card
                className={cn(
                  "p-8 h-full border-0 shadow-md transition-all duration-150",
                  activeValue === 3
                    ? "bg-gradient-to-br from-primary/5 to-accent/5 shadow-lg"
                    : "bg-gradient-to-br from-background to-muted/20",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-3">
                      {text.values.support.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {text.values.support.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <CtaSection
        locale={locale}
        text={{
          ctaTitle: text.ctaTitle,
          ctaDescription: text.ctaDescription,
          ctaButton: text.ctaButton,
        }}
      />
    </div>
  );
}
