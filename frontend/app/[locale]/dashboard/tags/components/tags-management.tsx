"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tag, Plus, Trash2, Loader2 } from "lucide-react";
import { ITag } from "@/interfaces";
import { useToast } from "@/hooks/use-toast";
import { createTagAction, deleteTagAction } from "../actions";

export default function TagsManagement({
  text,
  locale,
  tags: initialTags,
}: {
  text: any;
  locale: string;
  tags: ITag[];
}) {
  const { toast } = useToast();
  const [tags, setTags] = useState(initialTags);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tagName, setTagName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await createTagAction(
        { success: false, enMessage: "", arMessage: "" },
        { name: tagName },
      );

      if (result.success && result.data) {
        toast({
          title: locale === "ar" ? "نجح" : "Success",
          description: locale === "ar" ? result.arMessage : result.enMessage,
        });
        setTags((prev) => [...prev, result.data!]);
        setDialogOpen(false);
        setTagName("");
      } else {
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description: locale === "ar" ? result.arMessage : result.enMessage,
          variant: "destructive",
        });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm(locale === "ar" ? "هل أنت متأكد؟" : "Are you sure?")) return;

    startTransition(async () => {
      const result = await deleteTagAction(
        { success: false, enMessage: "", arMessage: "" },
        id,
      );

      if (result.success) {
        toast({
          title: locale === "ar" ? "نجح" : "Success",
          description: locale === "ar" ? result.arMessage : result.enMessage,
        });
        setTags((prev) => prev.filter((t) => t.id !== id));
      } else {
        toast({
          title: locale === "ar" ? "خطأ" : "Error",
          description: locale === "ar" ? result.arMessage : result.enMessage,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {text.createTag}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{text.createTag}</DialogTitle>
              <DialogDescription>{text.createDescription}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <Label>{text.tagName}</Label>
                  <Input
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder={text.tagPlaceholder}
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  {text.cancel}
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      {text.creating}
                    </>
                  ) : (
                    text.create
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {tags.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Tag className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{text.noTags}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {text.noTagsDescription}
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {text.createTag}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              {text.allTags}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="text-base py-2 px-4"
                >
                  {tag.name}
                  <button
                    onClick={() => handleDelete(tag.id)}
                    className="ml-2 hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
