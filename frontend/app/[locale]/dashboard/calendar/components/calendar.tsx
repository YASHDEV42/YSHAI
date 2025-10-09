"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Twitter,
  Instagram,
  Linkedin,
  Music2,
  Clock,
  Edit,
  Trash2,
  Copy,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "../../../../components/toggleTheme";
import { format, isSameDay } from "date-fns";

// Define text interface
export interface CalendarPageText {
  title: string;
  subtitle: string;
  filterButton: string;
  newPostButton: string;
  views: {
    month: string;
    week: string;
    list: string;
  };
  platforms: {
    twitter: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
  };
  selectedDate: {
    title: string;
    noPosts: string;
    schedulePost: string;
  };
  postActions: {
    edit: string;
    duplicate: string;
    delete: string;
  };
  status: {
    scheduled: string;
  };
  weekDays: string[];
  allScheduledPosts: string;
}

interface CalendarPageProps {
  text: CalendarPageText;
  locale: string;
}

// Mock scheduled posts data (in real app, this would come from API)
const scheduledPosts = [
  {
    id: 1,
    date: new Date(2025, 4, 15, 10, 0),
    platform: "twitter" as const,
    content: "Exciting product launch announcement! 🚀",
    status: "scheduled" as const,
  },
  {
    id: 2,
    date: new Date(2025, 4, 15, 14, 30),
    platform: "instagram" as const,
    content: "Behind the scenes of our latest project",
    status: "scheduled" as const,
  },
  {
    id: 3,
    date: new Date(2025, 4, 18, 9, 0),
    platform: "linkedin" as const,
    content: "Industry insights and market trends",
    status: "scheduled" as const,
  },
  {
    id: 4,
    date: new Date(2025, 4, 20, 16, 0),
    platform: "tiktok" as const,
    content: "Fun video content for our audience",
    status: "scheduled" as const,
  },
  {
    id: 5,
    date: new Date(2025, 4, 22, 11, 0),
    platform: "twitter" as const,
    content: "Weekly tips and tricks thread",
    status: "scheduled" as const,
  },
  {
    id: 6,
    date: new Date(2025, 4, 25, 13, 0),
    platform: "instagram" as const,
    content: "Customer success story showcase",
    status: "scheduled" as const,
  },
];

export default function CalendarPage({ text, locale }: CalendarPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "twitter",
    "instagram",
    "linkedin",
    "tiktok",
  ]);

  // Platform config with localized names
  const platforms = [
    { id: "twitter", name: text.platforms.twitter, icon: Twitter, color: "bg-primary" },
    { id: "instagram", name: text.platforms.instagram, icon: Instagram, color: "bg-pink-500" },
    { id: "linkedin", name: text.platforms.linkedin, icon: Linkedin, color: "bg-blue-600" },
    { id: "tiktok", name: text.platforms.tiktok, icon: Music2, color: "bg-gray-400" },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId) ? prev.filter((id) => id !== platformId) : [...prev, platformId],
    );
  };

  const filteredPosts = scheduledPosts.filter((post) => selectedPlatforms.includes(post.platform));
  const getPostsForDate = (date: Date) => {
    return filteredPosts.filter((post) => isSameDay(post.date, date));
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    if (!platform) return null;
    const Icon = platform.icon;
    return <Icon className="size-3" />;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find((p) => p.id === platformId);
    return platform?.color || "bg-muted";
  };

  // Determine if RTL
  const isRTL = locale === 'ar';

  return (
    <SidebarProvider>
      <div
        className={`flex min-h-screen w-full bg-background ${isRTL ? 'flex-row-reverse' : ''}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Sidebar */}
        <Sidebar
          className={`border-${isRTL ? 'l' : 'r'} border-border`}
          side={isRTL ? 'right' : 'left'}
        >
          <SidebarHeader className="border-b border-border p-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="size-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-foreground">YSHAI</span>
            </Link>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">
                    <CalendarIcon className="size-4" />
                    <span>{text.views.month}</span> {/* or use "Overview" if preferred */}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/create">
                    <Sparkles className="size-4" />
                    <span>{text.newPostButton}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link href="/calendar">
                    <CalendarIcon className="size-4" />
                    <span>{text.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">John Doe</span>
                  <span className="text-xs text-muted-foreground">john@example.com</span>
                </div>
              </div>
              <ModeToggle />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h1 className="font-bold text-3xl text-foreground">{text.title}</h1>
                <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
              </div>
              <div className="flex items-center gap-3">
                <SidebarTrigger className="lg:hidden" />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="border-border bg-card text-foreground">
                      <Filter className="mr-2 size-4" />
                      {text.filterButton}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 border-border bg-background">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-sm text-foreground">{text.filterButton}</h4>
                      {platforms.map((platform) => (
                        <div key={platform.id} className="flex items-center gap-2">
                          <Checkbox
                            id={platform.id}
                            checked={selectedPlatforms.includes(platform.id)}
                            onCheckedChange={() => togglePlatform(platform.id)}
                          />
                          <Label
                            htmlFor={platform.id}
                            className="flex items-center gap-2 text-sm text-foreground cursor-pointer"
                          >
                            <platform.icon className="size-4" />
                            {platform.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                  <Link href="/create">
                    <Plus className="mr-2 size-4" />
                    {text.newPostButton}
                  </Link>
                </Button>
              </div>
            </div>

            {/* View Tabs */}
            <Tabs value={view} onValueChange={(v) => setView(v as "month" | "week" | "list")} className="mb-6">
              <TabsList className="bg-card">
                <TabsTrigger value="month">{text.views.month}</TabsTrigger>
                <TabsTrigger value="week">{text.views.week}</TabsTrigger>
                <TabsTrigger value="list">{text.views.list}</TabsTrigger>
              </TabsList>

              {/* Month View */}
              <TabsContent value="month" className="mt-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
                  {/* Calendar */}
                  <Card className="border-border bg-card">
                    <CardContent className="p-6">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="w-full"
                        components={{
                          DayButton: ({ day, ...props }) => {
                            const postsForDay = getPostsForDate(day.date);
                            return (
                              <button
                                {...props}
                                className="relative flex size-full min-w-[60px] flex-col items-center justify-start gap-1 rounded-md p-2 hover:bg-muted"
                              >
                                <span className="text-sm">{format(day.date, "d")}</span>
                                {postsForDay.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {postsForDay.slice(0, 3).map((post) => (
                                      <div
                                        key={post.id}
                                        className={`size-1.5 rounded-full ${getPlatformColor(post.platform)}`}
                                      />
                                    ))}
                                    {postsForDay.length > 3 && (
                                      <span className="text-[10px] text-muted-foreground">
                                        +{postsForDay.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          },
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Selected Date Posts */}
                  <Card className="border-border bg-card">
                    <CardHeader>
                      <CardTitle className="text-foreground">
                        {selectedDate ? format(selectedDate, "MMMM d, yyyy") : text.selectedDate.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedDate && getPostsForDate(selectedDate).length > 0 ? (
                        getPostsForDate(selectedDate).map((post) => (
                          <div
                            key={post.id}
                            className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex size-8 items-center justify-center rounded-lg ${getPlatformColor(post.platform)}`}
                                >
                                  {getPlatformIcon(post.platform)}
                                </div>
                                <span className="text-sm font-medium text-foreground">
                                  {format(post.date, "h:mm a")}
                                </span>
                              </div>
                              <Badge variant="secondary" className="bg-primary/20 text-primary">
                                {text.status.scheduled}
                              </Badge>
                            </div>
                            <p className="mb-3 text-sm text-muted-foreground">{post.content}</p>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="ghost" className="h-7 text-xs">
                                <Edit className="mr-1 size-3" />
                                {text.postActions.edit}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs">
                                <Copy className="mr-1 size-3" />
                                {text.postActions.duplicate}
                              </Button>
                              <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:text-destructive/80">
                                <Trash2 className="mr-1 size-3" />
                                {text.postActions.delete}
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-12 text-center">
                          <Clock className="mx-auto mb-3 size-12 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{text.selectedDate.noPosts}</p>
                          <Button size="sm" variant="ghost" className="mt-3 text-primary hover:text-primary/80" asChild>
                            <Link href="/create">{text.selectedDate.schedulePost}</Link>
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Week View */}
              <TabsContent value="week" className="mt-6">
                <Card className="border-border bg-card">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-semibold text-lg text-foreground">
                        {selectedDate && format(selectedDate, "MMMM yyyy")}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="size-8">
                          <ChevronLeft className="size-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="size-8">
                          <ChevronRight className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {text.weekDays.map((day) => (
                        <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                          {day}
                        </div>
                      ))}
                      {/* Week view implementation would go here */}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* List View */}
              <TabsContent value="list" className="mt-6">
                <Card className="border-border bg-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">{text.allScheduledPosts}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {filteredPosts
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((post) => (
                          <div
                            key={post.id}
                            className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex size-10 items-center justify-center rounded-lg ${getPlatformColor(post.platform)}`}
                              >
                                {getPlatformIcon(post.platform)}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {format(post.date, "MMM d, yyyy")}
                                </p>
                                <p className="text-xs text-muted-foreground">{format(post.date, "h:mm a")}</p>
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{post.content}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                              {text.status.scheduled}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Button size="icon" variant="ghost" className="size-8">
                                <Edit className="size-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="size-8">
                                <Copy className="size-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive/80">
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
