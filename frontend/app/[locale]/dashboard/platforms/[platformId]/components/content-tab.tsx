"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  FileText,
  Plus,
  Heart,
  MessageCircle,
  ExternalLink,
  Filter,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ContentTabProps {
  text: any;
  locale: string;
  posts: any[];
  animateItems?: boolean;
}

export function ContentTab({
  text,
  locale,
  posts,
  animateItems = false,
}: ContentTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null);
  const [repostingPostId, setRepostingPostId] = useState<number | null>(null);

  const allCampaigns: string[] = Array.from(
    new Set(posts.map((post) => post.campaign?.name).filter(Boolean)),
  );

  const filteredPosts = posts.filter((post) => {
    const matchesCampaign =
      selectedCampaign === "all" || post.campaign?.name === selectedCampaign;
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;

    return matchesCampaign && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts =
    filteredPosts.length > 0 ? filteredPosts.slice(startIndex, endIndex) : [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleRepost = async (postId: number) => {
    setRepostingPostId(postId);

    toast.loading(text.reposting || "Reposting content...", {
      id: "repost-post",
    });

    // Simulate API call
    setTimeout(() => {
      setRepostingPostId(null);

      toast.success(text.repostSuccess || "Content reposted successfully", {
        id: "repost-post",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });
    }, 1500);
  };

  const handleDelete = async (postId: number) => {
    if (
      !confirm(
        text.deleteConfirm || "Are you sure you want to delete this post?",
      )
    )
      return;

    setDeletingPostId(postId);

    toast.loading(text.deleting || "Deleting post...", {
      id: "delete-post",
    });

    // Simulate API call
    setTimeout(() => {
      setDeletingPostId(null);

      toast.success(text.deleteSuccess || "Post deleted successfully", {
        id: "delete-post",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 2000,
      });
    }, 1500);
  };

  const handleFilterChange = () => {
    setIsLoading(true);

    toast.loading(text.applyingFilters || "Applying filters...", {
      id: "filter-posts",
    });

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);

      toast.success(text.filtersApplied || "Filters applied successfully", {
        id: "filter-posts",
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 1500,
      });
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "100ms" }}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Filter className="size-5" />
                {text.filters?.title || "Filters"}
              </CardTitle>
              <CardDescription>
                {text.filters?.description ||
                  "Filter posts by campaigns and status"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCampaign("all");
                setSelectedStatus("all");
                handleFilterChange();
              }}
              className="transition-all duration-300 hover:scale-105"
            >
              {text.filters?.clearAll || "Clear All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Campaign Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {text.filters?.campaigns || "Campaigns"}
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => {
                  setSelectedCampaign(e.target.value);
                  handleFilterChange();
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 focus:ring-primary/20"
              >
                <option value="all">
                  {text.filters?.allCampaigns || "All campaigns"}
                </option>
                {allCampaigns.map((campaign) => (
                  <option key={campaign} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {text.filters?.status || "Status"}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  handleFilterChange();
                }}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all duration-300 focus:ring-primary/20"
              >
                <option value="all">
                  {text.filters?.allStatuses || "All statuses"}
                </option>
                <option value="published">
                  {text.filters?.published || "Published"}
                </option>
                <option value="scheduled">
                  {text.filters?.scheduled || "Scheduled"}
                </option>
                <option value="draft">{text.filters?.draft || "Draft"}</option>
                <option value="failed">
                  {text.filters?.failed || "Failed"}
                </option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card
        className={cn(
          "transition-all duration-300 hover:shadow-md",
          animateItems
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4",
        )}
        style={{ animationDelay: "200ms" }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            {text.contentLibrary || "Content Library"}
          </CardTitle>
          <CardDescription>
            {filteredPosts.length} {text.postsOf || "of"} {posts.length}{" "}
            {text.stats?.posts || "posts"}
            {selectedCampaign !== "all" &&
              ` • ${text.filters?.campaigns?.slice(0, -1) || "Campaign"}: ${selectedCampaign}`}
            {selectedStatus !== "all" &&
              ` • ${text.filters?.status || "Status"}: ${selectedStatus}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {selectedCampaign !== "all" || selectedStatus !== "all"
                  ? text.recentPosts?.noMatchingPosts ||
                    "No posts match your filters"
                  : text.recentPosts?.noPosts || "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedCampaign !== "all" || selectedStatus !== "all"
                  ? text.recentPosts?.adjustFilters ||
                    "Try adjusting your filters or clear them to see all posts"
                  : text.recentPosts?.noPostsDescription ||
                    "Start creating content to see it here"}
              </p>
              {selectedCampaign === "all" && selectedStatus === "all" ? (
                <Button asChild>
                  <Link href={`/${locale}/dashboard/create`}>
                    <Plus className="mr-2 size-4" />
                    {text.createPost || "Create Post"}
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedCampaign("all");
                    setSelectedStatus("all");
                    handleFilterChange();
                  }}
                >
                  {text.clearFilters || "Clear Filters"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post, index) => (
                  <Card
                    key={post.id}
                    className={cn(
                      "overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02] group",
                      animateItems
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4",
                    )}
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <CardContent className="p-0">
                      {post.mediaUrl && (
                        <Carousel className="w-full">
                          <CarouselContent>
                            <CarouselItem>
                              <div className="relative aspect-square w-full">
                                <Image
                                  src={post.mediaUrl || "/placeholder.svg"}
                                  alt={post.caption || "Post image"}
                                  fill
                                  className="object-cover transition-all duration-300 group-hover:scale-105"
                                />
                              </div>
                            </CarouselItem>
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      )}
                      <div className="p-4 space-y-3">
                        <p className="text-sm line-clamp-3 transition-colors group-hover:text-foreground">
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Heart className="size-4" />
                            {post.likeCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="size-4" />
                            {post.commentsCount || 0}
                          </span>
                          <span className="ml-auto">
                            {formatDate(post.timestamp)}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {post.permalink && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-primary/10"
                              asChild
                            >
                              <a
                                href={post.permalink}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <ExternalLink className="mr-2 size-3" />
                                {text.view || "View"}
                              </a>
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                            onClick={() => handleRepost(post.id)}
                            disabled={repostingPostId === post.id}
                          >
                            {repostingPostId === post.id ? (
                              <Loader2 className="mr-2 size-3 animate-spin" />
                            ) : (
                              <>
                                <ExternalLink className="mr-2 size-3" />
                                {text.repost || "Repost"}
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="transition-all duration-300 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300 bg-transparent"
                            onClick={() => handleDelete(post.id)}
                            disabled={deletingPostId === post.id}
                          >
                            {deletingPostId === post.id ? (
                              <Loader2 className="size-3 animate-spin" />
                            ) : (
                              <AlertCircle className="size-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination className="transition-all duration-300">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer transition-all duration-300 hover:scale-105"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer transition-all duration-300 hover:scale-105"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1),
                          )
                        }
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer transition-all duration-300 hover:scale-105"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
