"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, ArrowRight, Search, Tag } from "lucide-react";

interface BlogContentProps {
  text: any;
  locale: string;
}

export default function BlogContent({ text, locale }: BlogContentProps) {
  const categories = text.categories || [];
  const posts = text.posts || [];

  return (
    <div className="min-h-screen bg-background mt-10">
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            {text.badge}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{text.title}</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {text.description}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input placeholder={text.searchPlaceholder} className="pl-10" />
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              {categories.map((category: string, index: number) => (
                <Button key={index} variant="outline" size="sm">
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {posts.map((post: any, index: number) => (
              <Card
                key={index}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <img
                    src={
                      post.image ||
                      `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(post.title)}`
                    }
                    alt={post.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">
                      <Tag className="w-3 h-3 mr-1" />
                      {post.category}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group">
                    {text.readMore}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center mb-12">
            <h3 className="text-xl font-bold mb-2">{text.noPosts.title}</h3>
            <p className="text-muted-foreground">{text.noPosts.description}</p>
          </Card>
        )}

        {/* Newsletter */}
        <Card className="p-8 bg-primary/5 border-primary/20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">{text.newsletter.title}</h2>
            <p className="text-muted-foreground mb-6">
              {text.newsletter.description}
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <Input
                type="email"
                placeholder={text.newsletter.placeholder}
                className="flex-1"
              />
              <Button>{text.newsletter.button}</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
