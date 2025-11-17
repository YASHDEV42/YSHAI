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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ContentTabProps {
  text: any;
  locale: string;
  posts: any[];
}

export function ContentTab({ text, locale, posts }: ContentTabProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const allTags: string[] = Array.from(
    new Set(posts.flatMap((post) => post.tags?.map((t: any) => t.name) || [])),
  );
  const allCampaigns: string[] = Array.from(
    new Set(posts.map((post) => post.campaign?.name).filter(Boolean)),
  );

  const filteredPosts = posts.filter((post) => {
    const matchesTag =
      selectedTag === "all" ||
      post.tags?.some((t: any) => t.name === selectedTag);
    const matchesCampaign =
      selectedCampaign === "all" || post.campaign?.name === selectedCampaign;
    const matchesStatus =
      selectedStatus === "all" || post.status === selectedStatus;

    return matchesTag && matchesCampaign && matchesStatus;
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

  return (
    <div className="space-y-6">
      {/* Filters Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{text.filters?.title || "Filters"}</CardTitle>
              <CardDescription>
                {text.filters?.description ||
                  "Filter posts by tags, campaigns, and status"}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedTag("all");
                setSelectedCampaign("all");
                setSelectedStatus("all");
              }}
            >
              {text.filters?.clearAll || "Clear All"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {/* Tag Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {text.filters?.tags || "Tags"}
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">
                  {text.filters?.allTags || "All tags"}
                </option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {text.filters?.campaigns || "Campaigns"}
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
      <Card>
        <CardHeader>
          <CardTitle>{text.contentLibrary || "Content Library"}</CardTitle>
          <CardDescription>
            {filteredPosts.length} {text.postsOf || "of"} {posts.length}{" "}
            {text.stats?.posts || "posts"}
            {selectedTag !== "all" &&
              ` • ${text.filters?.tags || "Tag"}: ${selectedTag}`}
            {selectedCampaign !== "all" &&
              ` • ${text.filters?.campaigns?.slice(0, -1) || "Campaign"}: ${selectedCampaign}`}
            {selectedStatus !== "all" &&
              ` • ${text.filters?.status || "Status"}: ${selectedStatus}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="size-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {selectedTag !== "all" ||
                selectedCampaign !== "all" ||
                selectedStatus !== "all"
                  ? text.recentPosts?.noMatchingPosts ||
                    "No posts match your filters"
                  : text.recentPosts?.noPosts || "No posts yet"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {selectedTag !== "all" ||
                selectedCampaign !== "all" ||
                selectedStatus !== "all"
                  ? text.recentPosts?.adjustFilters ||
                    "Try adjusting your filters or clear them to see all posts"
                  : text.recentPosts?.noPostsDescription ||
                    "Start creating content to see it here"}
              </p>
              {selectedTag === "all" &&
              selectedCampaign === "all" &&
              selectedStatus === "all" ? (
                <Button asChild>
                  <Link href={`/${locale}/dashboard/create`}>
                    <Plus className="mr-2 size-4" />
                    {text.createPost || "Create Post"}
                  </Link>
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setSelectedTag("all");
                    setSelectedCampaign("all");
                    setSelectedStatus("all");
                  }}
                >
                  {text.clearFilters || "Clear Filters"}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow"
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
                                  className="object-cover"
                                />
                              </div>
                            </CarouselItem>
                          </CarouselContent>
                          <CarouselPrevious className="left-2" />
                          <CarouselNext className="right-2" />
                        </Carousel>
                      )}
                      <div className="p-4 space-y-3">
                        <p className="text-sm line-clamp-3">{post.caption}</p>
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
                              className="flex-1 bg-transparent"
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
                            className="flex-1 bg-transparent"
                          >
                            {text.repost || "Repost"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer"
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
                            : "cursor-pointer"
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
