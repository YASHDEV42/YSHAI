"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Filter,
  Share2,
  Bookmark,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface Testimonial {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  category?: string;
  featured?: boolean;
}

interface TestimonialsSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  testimonials: {
    testimonial1: Testimonial;
    testimonial2: Testimonial;
    testimonial3: Testimonial;
  };
  filters?: string[];
  showLoadMore?: boolean;
}

// Skeleton loading component for better UX
const TestimonialCardSkeleton = () => (
  <Card className="p-6 bg-card border-border animate-pulse h-full flex flex-col">
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 bg-muted rounded" />
      ))}
    </div>
    <div className="space-y-2 mb-6 flex-grow">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-5/6"></div>
      <div className="h-4 bg-muted rounded w-4/5"></div>
    </div>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-muted rounded-full"></div>
      <div className="space-y-1">
        <div className="h-4 bg-muted rounded w-24"></div>
        <div className="h-3 bg-muted rounded w-32"></div>
      </div>
    </div>
  </Card>
);

// Enhanced rating component with hover effects
const RatingDisplay = ({
  rating,
  interactive = false,
}: {
  rating: number;
  interactive?: boolean;
}) => {
  const [hoveredRating, setHoveredRating] = useState(0);

  return (
    <div className="flex gap-1 mb-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          whileHover={interactive ? { scale: 1.2 } : {}}
          onMouseEnter={interactive ? () => setHoveredRating(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          className="relative"
        >
          <Star
            className={cn(
              "w-5 h-5 transition-colors",
              i < (hoveredRating || rating)
                ? "fill-primary text-primary"
                : "text-muted-foreground",
            )}
          />
          {interactive && (
            <motion.div
              className="absolute inset-0 bg-primary/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: hoveredRating === i + 1 ? 1 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// Enhanced avatar component with loading states
const TestimonialAvatar = ({
  name,
  avatar,
  isLoading,
}: {
  name: string;
  avatar?: string;
  isLoading: boolean;
}) => {
  const [imageError, setImageError] = useState(false);

  if (isLoading) {
    return <div className="w-12 h-12 bg-muted rounded-full animate-pulse" />;
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Avatar className="w-12 h-12 border-2 border-primary/20">
        {avatar && !imageError ? (
          <AvatarImage
            src={avatar}
            alt={name}
            onError={() => setImageError(true)}
          />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>
    </motion.div>
  );
};

// Enhanced testimonial card with animations and interactions
const TestimonialCard = ({
  testimonial,
  index,
  isLoading,
  isActive,
  onShare,
  onBookmark,
}: {
  testimonial: Testimonial;
  index: number;
  isLoading: boolean;
  isActive?: boolean;
  onShare?: () => void;
  onBookmark?: () => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (isLoading) return <TestimonialCardSkeleton />;

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark?.();
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn("relative h-full", isActive && "md:scale-105")}
    >
      <Card
        className={cn(
          "p-6 bg-card border-border transition-all duration-300 overflow-hidden relative h-full flex flex-col",
          isActive && "border-primary shadow-lg",
          isHovered && "shadow-xl",
        )}
      >
        {/* Quote icon */}
        <motion.div
          className="absolute top-4 right-4 text-primary/10"
          initial={{ opacity: 0, rotate: -15 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
        >
          <Quote className="w-12 h-12" />
        </motion.div>

        {/* Action buttons */}
        <motion.div
          className="absolute top-4 right-4 flex gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onShare}
            className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label="Share testimonial"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            aria-label={
              isBookmarked ? "Remove bookmark" : "Bookmark testimonial"
            }
          >
            <Bookmark
              className={cn(
                "w-4 h-4",
                isBookmarked && "fill-current text-primary",
              )}
            />
          </button>
        </motion.div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Rating */}
          <RatingDisplay rating={testimonial.rating} />

          {/* Content */}
          <blockquote className="text-muted-foreground mb-6 leading-relaxed flex-grow relative">
            <span className="text-2xl text-primary/20 absolute -top-2 -left-2">
              "
            </span>
            <p className="relative z-10">{testimonial.content}</p>
            <span className="text-2xl text-primary/20 absolute -bottom-2 -right-2">
              "
            </span>
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-3 mt-auto">
            <TestimonialAvatar
              name={testimonial.name}
              avatar={testimonial.avatar}
              isLoading={isLoading}
            />
            <div>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-muted-foreground">
                {testimonial.role} at {testimonial.company}
              </div>
            </div>
          </div>
        </div>

        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
};

// Filter tabs component
const FilterTabs = ({
  filters,
  activeFilter,
  setActiveFilter,
}: {
  filters: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}) => {
  if (!filters || filters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap justify-center gap-2 mb-8"
    >
      {filters.map((filter, index) => (
        <motion.button
          key={filter}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveFilter(filter)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-colors",
            activeFilter === filter
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          )}
        >
          {filter}
        </motion.button>
      ))}
    </motion.div>
  );
};

// Carousel navigation component
const CarouselNavigation = ({
  currentIndex,
  totalItems,
  setCurrentIndex,
  showDots = true,
}: {
  currentIndex: number;
  totalItems: number;
  setCurrentIndex: (index: number) => void;
  showDots?: boolean;
}) => {
  const handlePrevious = () => {
    setCurrentIndex((currentIndex - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % totalItems);
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-8">
      <button
        onClick={handlePrevious}
        className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {showDots && (
        <div className="flex gap-2">
          {[...Array(totalItems)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                i === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50",
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      )}

      <button
        onClick={handleNext}
        className="p-2 rounded-full bg-background border border-border hover:bg-muted transition-colors"
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export const TestimonialsSection = ({
  text,
}: {
  text: TestimonialsSectionText;
}) => {
  const { badge, heading, subHeading, testimonials, filters, showLoadMore } =
    text;
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Convert testimonials object to array
  const testimonialsArray = Object.values(testimonials);

  // Filter testimonials based on active filter
  const filteredTestimonials =
    activeFilter === "all"
      ? testimonialsArray
      : testimonialsArray.filter((t) => t.category === activeFilter);

  // Determine which testimonials to display
  const displayTestimonials =
    showAll || !showLoadMore
      ? filteredTestimonials
      : filteredTestimonials.slice(0, 3);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    if (displayTestimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [displayTestimonials.length]);

  // Handle testimonial actions
  const handleShare = (testimonial: Testimonial) => {
    // In a real app, this would open a share dialog
    console.log("Sharing testimonial:", testimonial.name);
  };

  const handleBookmark = (testimonial: Testimonial) => {
    // In a real app, this would save the testimonial
    console.log("Bookmarking testimonial:", testimonial.name);
  };

  return (
    <section
      className="container mx-auto px-4 py-20 bg-muted/30"
      aria-labelledby="testimonials-heading"
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
          id="testimonials-heading"
          className="text-4xl md:text-5xl font-bold mb-4 text-balance"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {heading}
        </motion.h2>

        <motion.p
          className="text-xl text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subHeading}
        </motion.p>
      </div>

      {/* Filter tabs */}
      <FilterTabs
        filters={filters || ["all"]}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* Testimonials carousel */}
      <div className="relative max-w-6xl mx-auto">
        <div className="overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: -currentIndex * 100 + "%" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {displayTestimonials.map((testimonial, index) => (
              <div key={index} className="w-full flex-shrink-0 px-2">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Display current testimonial in center, others on sides */}
                  {displayTestimonials.map((t, i) => (
                    <div
                      key={i}
                      className={cn(i === index ? "block" : "hidden md:block")}
                    >
                      <TestimonialCard
                        testimonial={t}
                        index={i}
                        isLoading={isLoading}
                        isActive={i === index}
                        onShare={() => handleShare(t)}
                        onBookmark={() => handleBookmark(t)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Carousel navigation */}
        <CarouselNavigation
          currentIndex={currentIndex}
          totalItems={displayTestimonials.length}
          setCurrentIndex={setCurrentIndex}
        />
      </div>

      {/* Load more button */}
      {showLoadMore && !showAll && filteredTestimonials.length > 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <button
            onClick={() => setShowAll(true)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Load More Testimonials
          </button>
        </motion.div>
      )}
    </section>
  );
};
