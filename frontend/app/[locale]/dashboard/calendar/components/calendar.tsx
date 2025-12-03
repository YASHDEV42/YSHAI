"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Clock,
  Edit,
  Trash2,
  Copy,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  format,
  isSameDay,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
} from "date-fns";
import { EmptyState } from "@/components/empty-state";
import type { IPost } from "@/interfaces";
import { useToast } from "@/hooks/use-toast";
import {
  remove as deletePost,
  reschedule,
  publishNow,
} from "@/lib/post-helper";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";

interface CalendarPageProps {
  text: any;
  locale: string;
  posts: IPost[];
}

export default function CalendarPage({
  text,
  locale,
  posts,
}: CalendarPageProps) {
  const isRTL = locale === "ar";
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 0 }),
  );
  const [view, setView] = useState<"month" | "week" | "list">("month");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "x",
    "instagram",
    "linkedin",
    "tiktok",
  ]);
  const { toast } = useToast();

  const platforms = [
    {
      id: "twitter",
      name: text.platforms.twitter,
      icon: getPlatformIcon("twitter"),
      color: getPlatformColor("twitter"),
    },
    {
      id: "instagram",
      name: text.platforms.instagram,
      icon: getPlatformIcon("instagram"),
      color: getPlatformColor("instagram"),
    },
    {
      id: "linkedin",
      name: text.platforms.linkedin,
      icon: getPlatformIcon("linkedin"),
      color: getPlatformColor("linkedin"),
    },
    {
      id: "tiktok",
      name: text.platforms.tiktok,
      icon: getPlatformIcon("tiktok"),
      color: getPlatformColor("tiktok"),
    },
  ];

  const getPlatformIconToDisplay = (platform: string) => {
    return <>{getPlatformIcon(platform)}</>;
  };

  const scheduledPosts = useMemo(() => {
    return posts.filter((post) => {
      // Only show scheduled posts
      if (post.status !== "scheduled") return false;

      // Filter by selected platforms
      const postPlatforms = post.targets.map((t) => t.provider);
      return postPlatforms.some((provider) =>
        selectedPlatforms.includes(provider),
      );
    });
  }, [posts, selectedPlatforms]);

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledAt);
      return isSameDay(postDate, date);
    });
  };

  const handleEdit = (postId: number) => {
    // Navigate to edit page
    window.location.href = `/dashboard/create?edit=${postId}`;
  };

  const handleDuplicate = async (postId: number) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (!post) return;

    try {
      // Create a duplicate by navigating to create page with post data
      const params = new URLSearchParams({
        duplicate: postId.toString(),
        content: post.contentAr || "",
      });
      window.location.href = `/dashboard/create?${params.toString()}`;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate post",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (postId: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const result = await deletePost(postId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Post deleted successfully",
        });
        // Refresh the page
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to delete post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 0 }));
    setSelectedDate(today);
  };

  const weekDays = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) =>
      addDays(currentWeekStart, i),
    );
    return isRTL ? days.reverse() : days;
  }, [currentWeekStart, isRTL, currentWeekStart]);

  const handleReschedule = async (postId: number, newDate: string) => {
    try {
      const result = await reschedule(postId, newDate);
      if (result.success) {
        toast({
          title: "Success",
          description: "Post rescheduled successfully",
        });
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to reschedule post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to reschedule post",
        variant: "destructive",
      });
    }
  };

  const handlePublishNow = async (postId: number) => {
    if (!confirm("Are you sure you want to publish this post now?")) return;

    try {
      const result = await publishNow(postId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Post published successfully",
        });
        window.location.reload();
      } else {
        throw new Error(result.error || "Failed to publish post");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to publish post",
        variant: "destructive",
      });
    }
  };

  const formatters = {
    formatWeekdayName: (date: Date) => {
      const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
      return (
        text.weekDays?.[dayIndex] ||
        date.toLocaleDateString("default", { weekday: "short" })
      );
    },
  };

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">{text.title}</h1>
          <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <SidebarTrigger className="lg:hidden" />
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/dashboard/create">
              <Plus className="mr-2 size-4" />
              {text.newPostButton}
            </Link>
          </Button>
        </div>
      </div>

      {/* View Tabs */}
      <Tabs
        value={view}
        onValueChange={(v) => setView(v as "month" | "week" | "list")}
        className="mb-6"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <TabsList className="bg-card" dir={locale === "ar" ? "rtl" : "ltr"}>
          <TabsTrigger value="month">{text.views.month}</TabsTrigger>
          <TabsTrigger value="week">{text.views.week}</TabsTrigger>
          <TabsTrigger value="list">{text.views.list}</TabsTrigger>
        </TabsList>

        {/* Month View */}
        <TabsContent value="month" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            <Card className="border-border bg-card">
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                  formatters={formatters}
                  modifiers={{
                    hasPost: (date) => getPostsForDate(date).length > 0,
                  }}
                  modifiersClassNames={{
                    hasPost:
                      "relative after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-primary",
                  }}
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-foreground">
                  {selectedDate
                    ? format(selectedDate, "MMMM d, yyyy")
                    : text.selectedDate.title}
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
                          <div className="flex gap-1">
                            {post.targets.map((target, idx) => (
                              <div
                                key={idx}
                                className={`flex size-8 items-center justify-center rounded-lg ${getPlatformColor(target.provider)}`}
                              >
                                {getPlatformIconToDisplay(target.provider)}
                              </div>
                            ))}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {format(new Date(post.scheduledAt), "h:mm a")}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/20 text-primary"
                        >
                          {text.status.scheduled}
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-muted-foreground line-clamp-2">
                        {post.contentAr}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleEdit(post.id)}
                        >
                          <Edit className="mr-1 size-3" />
                          {text.postActions.edit}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleDuplicate(post.id)}
                        >
                          <Copy className="mr-1 size-3" />
                          {text.postActions.duplicate}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs text-destructive hover:text-destructive/80"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="mr-1 size-3" />
                          {text.postActions.delete}
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    icon={Clock}
                    title={text.selectedDate.noPosts}
                    description={text.selectedDate.noPostsDescription}
                    actionLabel={text.selectedDate.schedulePost}
                    actionHref="/dashboard/create"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Week View */}
        <TabsContent
          value="week"
          className="mt-6"
          dir={locale === "ar" ? "rtl" : "ltr"}
        >
          <Card className="border-border bg-card">
            <CardHeader>
              <div
                className={`flex items-center justify-between ${
                  isRTL ? "flex-row-reverse" : ""
                }`}
              >
                <CardTitle className="text-foreground"></CardTitle>
                <div
                  className={`flex items-center gap-2 ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <Button variant="outline" size="sm" onClick={handleToday}>
                    {isRTL ? "اليوم" : "Today"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    // in RTL, left arrow still means "backward", but backward is "nextWeek" visually
                    onClick={isRTL ? handleNextWeek : handlePreviousWeek}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={isRTL ? handlePreviousWeek : handleNextWeek}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {(isRTL ? [...weekDays].reverse() : weekDays).map(
                  (day, index) => {
                    const dayPosts = getPostsForDate(day);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <div
                        key={index}
                        className={`min-h-[200px] rounded-lg border border-border p-3 ${
                          isToday ? "bg-primary/10 border-primary" : "bg-card"
                        }`}
                      >
                        <div className="mb-3 text-center">
                          <p className="text-xs font-medium text-muted-foreground">
                            {text.weekDays?.[day.getDay()] ||
                              format(day, "EEE")}
                          </p>
                          <p
                            className={`text-lg font-bold ${isToday ? "text-primary" : "text-foreground"}`}
                          >
                            {format(day, "d")}
                          </p>
                        </div>
                        <div className="space-y-2">
                          {dayPosts.length > 0 ? (
                            dayPosts.map((post) => (
                              <div
                                key={post.id}
                                className="group relative rounded-md border border-border bg-background p-2 transition-all hover:shadow-md"
                              >
                                <div className="mb-1 flex items-center gap-1">
                                  {post.targets
                                    .slice(0, 2)
                                    .map((target, idx) => (
                                      <div
                                        key={idx}
                                        className={`flex size-5 items-center justify-center rounded ${getPlatformColor(target.provider)}`}
                                      >
                                        {getPlatformIconToDisplay(
                                          target.provider,
                                        )}
                                      </div>
                                    ))}
                                  {post.targets.length > 2 && (
                                    <span className="text-xs text-muted-foreground">
                                      +{post.targets.length - 2}
                                    </span>
                                  )}
                                </div>
                                <p className="mb-1 text-xs font-medium text-foreground">
                                  {format(new Date(post.scheduledAt), "h:mm a")}
                                </p>
                                <p className="text-xs text-muted-foreground line-clamp-2">
                                  {post.contentAr}
                                </p>

                                {/* Action buttons on hover */}
                                <div className="absolute inset-0 flex items-center justify-center gap-1 rounded-md bg-background/95 opacity-0 transition-opacity group-hover:opacity-100">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-7"
                                    onClick={() => handleEdit(post.id)}
                                  >
                                    <Edit className="size-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-7"
                                    onClick={() => handleDuplicate(post.id)}
                                  >
                                    <Copy className="size-3" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="size-7 text-destructive"
                                    onClick={() => handleDelete(post.id)}
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-xs text-muted-foreground">
                              {text.selectedDate.noPosts}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* List View */}
        <TabsContent value="list" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="text-foreground">
                {text.allScheduledPosts}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledPosts.length === 0 ? (
                <EmptyState
                  icon={CalendarIcon}
                  title={text.selectedDate.noPosts}
                  description={text.selectedDate.noPostsDescription}
                  actionHref="/dashboard/create"
                />
              ) : (
                <div className="space-y-2">
                  {scheduledPosts
                    .sort(
                      (a, b) =>
                        new Date(a.scheduledAt).getTime() -
                        new Date(b.scheduledAt).getTime(),
                    )
                    .map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1">
                            {post.targets.map((target, idx) => (
                              <div
                                key={idx}
                                className={`flex size-10 items-center justify-center rounded-lg ${getPlatformColor(target.provider)}`}
                              >
                                {getPlatformIconToDisplay(target.provider)}
                              </div>
                            ))}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {format(
                                new Date(post.scheduledAt),
                                "MMM d, yyyy",
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(post.scheduledAt), "h:mm a")}
                            </p>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {post.contentAr}
                          </p>
                        </div>
                        <Badge
                          variant="secondary"
                          className="bg-primary/20 text-primary"
                        >
                          {text.status.scheduled}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={() => handleEdit(post.id)}
                          >
                            <Edit className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={() => handleDuplicate(post.id)}
                          >
                            <Copy className="size-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-destructive hover:text-destructive/80"
                            onClick={() => handleDelete(post.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
