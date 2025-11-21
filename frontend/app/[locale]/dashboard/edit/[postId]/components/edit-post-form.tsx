"use client";

import type React from "react";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, FolderOpen, ArrowLeft } from "lucide-react";
import {
  getPlatformColor,
  getPlatformIcon,
} from "@/components/icons/platforms-icons";
import { updatePostAction } from "../actions";
import type { IUser, ISocialAccount, IPost } from "@/interfaces";
import type { ICampaign } from "@/lib/campaign-helper";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function EditPostForm({
  post,
  text,
  locale,
  user,
  accounts,
  campaigns,
}: {
  post: IPost;
  text: any;
  locale: string;
  user: IUser;
  accounts: ISocialAccount[];
  campaigns: ICampaign[];
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [contentAr, setContentAr] = useState(post.contentAr || "");
  const [contentEn, setContentEn] = useState(post.contentEn || "");
  const [contentTab, setContentTab] = useState<"ar" | "en">("en");

  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(
    post.targets?.map((pt) => pt.provider || "") || [],
  );

  const [scheduleType, setScheduleType] = useState<"now" | "later">(
    post.scheduledAt ? "later" : "now",
  );
  const [scheduleDate, setScheduleDate] = useState(
    post.scheduledAt ? post.scheduledAt.split("T")[0] : "",
  );
  const [scheduleTime, setScheduleTime] = useState(
    post.scheduledAt ? post.scheduledAt.split("T")[1]?.substring(0, 5) : "",
  );

  const [selectedCampaign, setSelectedCampaign] = useState<string>(
    post.campaignId?.toString() || "",
  );

  const platforms = accounts.map((acc) => ({
    id: acc.provider,
    name: text.platforms[acc.provider] || acc.provider,
    socialAccountId: acc.id,
  }));

  const handlePlatformToggle = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await updatePostAction(
        { success: false, enMessage: "", arMessage: "" },
        post.id,
        form,
      );

      if (result.success) {
        toast({
          title: locale === "ar" ? "نجح" : "Success",
          description: locale === "ar" ? result.arMessage : result.enMessage,
        });
        router.push(`/${locale}/dashboard/calendar`);
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          {text.back}
        </Button>

        <h1 className="text-3xl font-bold mb-2">{text.title}</h1>
        <p className="text-muted-foreground mb-6">{text.subtitle}</p>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="status" value={post.status} />

          {scheduleDate && scheduleTime && (
            <input
              type="hidden"
              name="scheduledAt"
              value={`${scheduleDate}T${scheduleTime}:00`}
            />
          )}

          {selectedCampaign && (
            <input type="hidden" name="campaignId" value={selectedCampaign} />
          )}

          {platforms.map((p) =>
            selectedPlatforms.includes(p.id) ? (
              <input
                key={p.id}
                type="hidden"
                name="socialAccountIds"
                value={p.socialAccountId}
              />
            ) : null,
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{text.platforms.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p) => {
                      const Icon = getPlatformIcon(p.id);
                      const isSelected = selectedPlatforms.includes(p.id);
                      return (
                        <Button
                          key={p.id}
                          type="button"
                          onClick={() => handlePlatformToggle(p.id)}
                          variant={isSelected ? "default" : "outline"}
                          className={isSelected ? getPlatformColor(p.id) : ""}
                          size="sm"
                        >
                          <Icon className="w-3 h-3 mr-1" />
                          {p.name}
                        </Button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4" />
                    {text.campaigns.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedCampaign}
                    onValueChange={setSelectedCampaign}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={text.campaigns.placeholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {campaigns.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {text.campaigns.noCampaigns}
                        </div>
                      ) : (
                        campaigns
                          .filter((c) => c.status === "active")
                          .map((campaign) => (
                            <SelectItem
                              key={campaign.id}
                              value={campaign.id.toString()}
                            >
                              {campaign.name}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{text.contentEditor.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={contentTab}
                    onValueChange={(v) => setContentTab(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="en">English</TabsTrigger>
                      <TabsTrigger value="ar">العربية</TabsTrigger>
                    </TabsList>

                    <TabsContent value="en">
                      <Textarea
                        name="contentEn"
                        value={contentEn}
                        onChange={(e) => setContentEn(e.target.value)}
                        placeholder={text.contentEditor.placeholder}
                        rows={6}
                      />
                    </TabsContent>

                    <TabsContent value="ar">
                      <Textarea
                        name="contentAr"
                        dir="rtl"
                        value={contentAr}
                        onChange={(e) => setContentAr(e.target.value)}
                        placeholder="اكتب المحتوى هنا..."
                        rows={6}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{text.schedule.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs
                    value={scheduleType}
                    onValueChange={(v) => setScheduleType(v as any)}
                  >
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="now">
                        {text.schedule.publishNowTab}
                      </TabsTrigger>
                      <TabsTrigger value="later">
                        {text.schedule.scheduleLaterTab}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="now">
                      <p className="text-xs text-muted-foreground">
                        {text.schedule.publishNowDescription}
                      </p>
                    </TabsContent>

                    <TabsContent value="later" className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>{text.schedule.dateLabel}</Label>
                          <Input
                            type="date"
                            required
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>{text.schedule.timeLabel}</Label>
                          <Input
                            type="time"
                            required
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1"
                    >
                      {text.cancel}
                    </Button>
                    <Button
                      type="submit"
                      disabled={isPending || selectedPlatforms.length === 0}
                      className="flex-1"
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          {text.updating}
                        </>
                      ) : (
                        text.saveChanges
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
