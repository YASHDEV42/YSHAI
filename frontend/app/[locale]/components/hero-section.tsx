"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { Link } from "@/app/i18n/navigation";

interface HeroSectionText {
  heading: string;
  subHeading: string;
  primaryButton: string;
  secondaryButton: string;
  highlight: string;
}

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid pattern background */}
      <div className="absolute inset-0 dark:bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-50" />

      {/* Floating shapes */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </div>
  );
};

const HighlightBadge = ({ text }: { text: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20 text-sm text-primary shadow-lg"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <Sparkles className="w-4 h-4 text-primary" />
      </motion.div>
      <span className="font-medium">{text}</span>
    </motion.div>
  );
};

const GradientHeading = ({ text }: { text: string }) => {
  const words = text.split(" ");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          className={cn(
            "inline-block mr-2",
            index === 8 && "block md:inline",
            index >= 8 &&
              index <= 10 &&
              "text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70",
          )}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
};

const TypewriterSubheading = ({ text }: { text: string }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isTyping && displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timer);
    } else if (displayedText.length === text.length) {
      setIsTyping(false);
    }
  }, [displayedText, isTyping, text]);

  return (
    <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </p>
  );
};

const ActionButtons = ({
  locale,
  primaryButton,
  secondaryButton,
}: {
  locale: string;
  primaryButton: string;
  secondaryButton: string;
}) => {
  const [primaryHovered, setPrimaryHovered] = useState(false);
  const [secondaryHovered, setSecondaryHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="flex flex-col sm:flex-row gap-4 pt-8 justify-center"
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setPrimaryHovered(true)}
        onHoverEnd={() => setPrimaryHovered(false)}
      >
        <Link href="/signup">
          <Button
            size="lg"
            className="text-base pr-8 pl-8 h-12 group flex items-center justify-center relative overflow-hidden shadow-lg hover:shadow-xl transition-all"
            aria-label={primaryButton}
          >
            <span className="relative z-10 flex items-center  gap-5 w-full justify-between">
              {locale === "ar" ? (
                <>
                  {primaryButton}
                  <motion.div
                    animate={{ x: primaryHovered ? -3 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="ml-2"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </motion.div>
                </>
              ) : (
                <>
                  {primaryButton}
                  <motion.div
                    animate={{ x: primaryHovered ? 3 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="ml-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </>
              )}
            </span>

            {/* Animated background effect */}
            <motion.div
              className="absolute inset-0  from-primary/20 to-primary/10"
              initial={{ x: "-100%" }}
              animate={{ x: primaryHovered ? "0%" : "-100%" }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </Link>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onHoverStart={() => setSecondaryHovered(true)}
        onHoverEnd={() => setSecondaryHovered(false)}
      >
        <a
          href="https://www.youtube.com/watch?v=LKWbRl00IUA"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 h-12 bg-transparent hover:bg-accent/50 relative overflow-hidden group transition-all"
            aria-label={secondaryButton}
          >
            <span className="relative z-10">{secondaryButton}</span>

            {/* Animated border effect */}
            <motion.div
              className="absolute inset-0 border-2 border-primary rounded-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: secondaryHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </Button>
        </a>
      </motion.div>
    </motion.div>
  );
};

const ScrollIndicator = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: 1.2 }}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        className="flex flex-col items-end  text-muted-foreground"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </motion.div>
  );
};

export function HeroSection({
  locale,
  text,
}: {
  locale: string;
  text: HeroSectionText;
}) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <motion.section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background px-4 py-20"
      style={{ y }}
    >
      {/* Animated background */}
      <AnimatedBackground />

      <div className="relative z-10 max-w-6xl mx-auto text-center space-y-8">
        {/* Highlight badge */}
        <HighlightBadge text={text.highlight} />

        {/* Enhanced heading with gradient text */}
        <GradientHeading text={text.heading} />

        {/* Typewriter effect subheading */}
        <TypewriterSubheading text={text.subHeading} />

        {/* Enhanced action buttons */}
        <ActionButtons
          locale={locale}
          primaryButton={text.primaryButton}
          secondaryButton={text.secondaryButton}
        />
      </div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </motion.section>
  );
}
