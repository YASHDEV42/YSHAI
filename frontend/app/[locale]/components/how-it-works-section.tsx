"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, ChevronRight, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HowItWorksSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  steps: {
    step1: { title: string; description: string };
    step2: { title: string; description: string };
    step3: { title: string; description: string };
    step4: { title: string; description: string };
  };
}

const ProgressBar = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth((currentStep / totalSteps) * 100);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep, totalSteps]);

  return (
    <div className="relative mb-12">
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-primary/70"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              i <= currentStep ? "bg-primary" : "bg-border",
            )}
          />
        ))}
      </div>
    </div>
  );
};

const StepCard = ({
  step,
  index,
  isActive,
  isCompleted,
  isNext,
  onClick,
}: {
  step: { title: string; description: string };
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  isNext: boolean;
  onClick: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: isActive ? 1.05 : 1,
      }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className="relative cursor-pointer"
      tabIndex={0}
      role="button"
      aria-pressed={isActive}
      aria-labelledby={`step-${index}-title`}
      aria-describedby={`step-${index}-description`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <Card
        className={cn(
          "p-6 bg-card border-border transition-all duration-300 overflow-hidden relative h-full",
          isActive && "border-primary shadow-lg",
          isHovered && "shadow-xl",
          isCompleted && "border-primary/50",
          isNext && "border-primary/30",
          "before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        )}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/10 text-primary",
                isCompleted && "bg-primary text-primary-foreground",
              )}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
            </motion.div>

            <motion.div
              className="text-primary transition-all duration-300"
              animate={{
                scale: isHovered ? 1.2 : 1,
                rotate: isHovered ? 15 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </motion.div>
          </div>

          <h3
            id={`step-${index}-title`}
            className={cn(
              "text-xl font-bold mb-3 transition-colors duration-300",
              isActive && "text-primary",
            )}
          >
            {step.title}
          </h3>

          <p
            id={`step-${index}-description`}
            className="text-muted-foreground leading-relaxed"
          >
            {step.description}
          </p>
        </div>
      </Card>

      {/* Connection line to next step */}
      {index < 3 && (
        <motion.div
          className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isCompleted ? 1 : 0.5 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.5 }}
          style={{ transformOrigin: "left" }}
        />
      )}
    </motion.div>
  );
};

const AutoPlayController = ({
  isPlaying,
  onToggle,
  currentStep,
  totalSteps,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  currentStep: number;
  totalSteps: number;
}) => {
  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isPlaying ? "Pause" : "Auto-play"}
        </span>
      </button>

      <div className="text-sm text-muted-foreground">
        {currentStep + 1} of {totalSteps}
      </div>
    </div>
  );
};

export const HowItWorksSection = ({
  text,
}: {
  text: HowItWorksSectionText;
}) => {
  const { badge, heading, subHeading, steps } = text;
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setActiveStep((prev) => (prev + 1) % 4);
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsPlaying(false);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <section
      className="container mx-auto px-4 py-20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="secondary"
            className="mb-4 bg-accent/10 text-accent border-accent/20"
          >
            {badge}
          </Badge>
        </motion.div>

        <motion.h2
          id="how-it-works-heading"
          className="text-4xl md:text-5xl font-bold mb-4 text-balance"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subHeading}
        </motion.p>
      </div>

      {/* Progress bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <ProgressBar currentStep={activeStep} totalSteps={4} />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {Object.entries(steps).map(([key, step], index) => (
          <StepCard
            key={key}
            step={step}
            index={index}
            isActive={activeStep === index}
            isCompleted={index < activeStep}
            isNext={index === activeStep + 1}
            onClick={() => handleStepClick(index)}
          />
        ))}
      </div>

      {/* Auto-play controller */}
      <AutoPlayController
        isPlaying={isPlaying}
        onToggle={toggleAutoPlay}
        currentStep={activeStep}
        totalSteps={4}
      />
    </section>
  );
};
