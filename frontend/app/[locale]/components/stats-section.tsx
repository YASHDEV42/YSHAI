"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Clock, BarChart } from "lucide-react";

interface StatsSectionText {
  badge: string;
  heading: string;
  subHeading: string;
  stats: {
    users: { value: string; label: string };
    posts: { value: string; label: string };
    time: { value: string; label: string };
    engagement: { value: string; label: string };
  };
}

export const StatsSection = ({ text }: { text: StatsSectionText }) => {
  const { badge, heading, subHeading, stats } = text;

  const statsData = [
    { ...stats.users, icon: Users, color: "text-blue-500" },
    { ...stats.posts, icon: TrendingUp, color: "text-green-500" },
    { ...stats.time, icon: Clock, color: "text-orange-500" },
    { ...stats.engagement, icon: BarChart, color: "text-primary" },
  ];

  return (
    <section className="container mx-auto px-4 py-20 bg-muted/30">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
          <span className="font-medium">{badge}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
          {heading}
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {subHeading}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={index}
              className="p-8 bg-card border-border hover:border-primary/50 transition-all hover:shadow-lg text-center"
            >
              <Icon className={`w-10 h-10 ${stat.color} mx-auto mb-4`} />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
};
