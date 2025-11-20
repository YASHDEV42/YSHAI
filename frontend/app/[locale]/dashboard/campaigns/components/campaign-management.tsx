"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  FolderOpen,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Activity,
  Zap,
  TrendingUp,
  Clock,
} from "lucide-react";
import { ICampaign } from "@/lib/campaign-helper";
import { toast } from "sonner";
import {
  createCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
} from "../actions";
import { cn } from "@/lib/utils";

export default function CampaignsManagement({
  text,
  locale,
  campaigns: initialCampaigns,
}: {
  text: any;
  locale: string;
  campaigns: ICampaign[];
}) {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ICampaign | null>(
    null,
  );
  const [deleteProgress, setDeleteProgress] = useState<number | null>(null);
  const [animateItems, setAnimateItems] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "draft">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const campaignsRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateItems(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Filter campaigns based on status and search query
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesStatus =
      filterStatus === "all" || campaign.status === filterStatus;
    const matchesSearch =
      searchQuery === "" ||
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (campaign.description &&
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: campaigns.length,
    active: campaigns.filter((c) => c.status === "active").length,
    draft: campaigns.filter((c) => c.status === "draft").length,
    thisMonth: campaigns.filter((c) => {
      const now = new Date();
      const campaignMonth = new Date(c.startsAt).getMonth();
      const campaignYear = new Date(c.startsAt).getFullYear();
      return (
        campaignMonth === now.getMonth() && campaignYear === now.getFullYear()
      );
    }).length,
  };

  /**
   * Correct campaign form model matching backend
   */
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startsAt: "",
    endsAt: "",
    status: "active" as "active" | "draft",
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      startsAt: "",
      endsAt: "",
      status: "active",
    });
    setEditingCampaign(null);
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    resetForm();
    setDialogOpen(true);

    toast.info("Opening campaign creator...", {
      icon: <Plus className="h-4 w-4" />,
      duration: 1500,
    });
  };

  const handleEdit = (campaign: ICampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      description: campaign.description || "",
      startsAt: campaign.startsAt ? campaign.startsAt.split("T")[0] : "",
      endsAt: campaign.endsAt ? campaign.endsAt.split("T")[0] : "",
      status: campaign.status,
    });
    setDialogOpen(true);

    toast.info(`Editing ${campaign.name}...`, {
      icon: <Pencil className="h-4 w-4" />,
      duration: 1500,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      description: formData.description || null,
      startsAt: formData.startsAt || null,
      endsAt: formData.endsAt || null,
      status: formData.status,
    };

    startTransition(async () => {
      toast.loading(
        editingCampaign ? "Updating campaign..." : "Creating campaign...",
        {
          id: "campaign-action",
        },
      );

      const result = editingCampaign
        ? await updateCampaignAction(
            { success: false, enMessage: "", arMessage: "" },
            editingCampaign.id,
            payload,
          )
        : await createCampaignAction(
            { success: false, enMessage: "", arMessage: "" },
            payload,
          );

      if (result.success && result.data) {
        toast.success(locale === "ar" ? result.arMessage : result.enMessage, {
          id: "campaign-action",
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 2000,
        });

        if (editingCampaign) {
          setCampaigns((prev) =>
            prev.map((c) => (c.id === result.data!.id ? result.data! : c)),
          );
        } else {
          setCampaigns((prev) => [...prev, result.data!]);
        }

        setDialogOpen(false);
        resetForm();
      } else {
        toast.error(locale === "ar" ? result.arMessage : result.enMessage, {
          id: "campaign-action",
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 3000,
        });
      }
    });
  };

  const handleDelete = (id: number, name: string) => {
    if (
      !confirm(
        locale === "ar"
          ? `هل أنت متأكد من حذف ${name}؟`
          : `Are you sure you want to delete ${name}?`,
      )
    )
      return;

    setDeleteProgress(0);

    toast.loading(`Deleting ${name}...`, {
      id: "delete-campaign",
    });

    // Simulate progress
    const progressInterval = setInterval(() => {
      setDeleteProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    startTransition(async () => {
      const result = await deleteCampaignAction(
        { success: false, enMessage: "", arMessage: "" },
        id,
      );

      clearInterval(progressInterval);
      setDeleteProgress(100);

      if (result.success) {
        toast.success(locale === "ar" ? result.arMessage : result.enMessage, {
          id: "delete-campaign",
          icon: <CheckCircle2 className="h-4 w-4" />,
          duration: 2000,
        });

        setCampaigns((prev) => prev.filter((c) => c.id !== id));

        // Reset progress after a delay
        setTimeout(() => {
          setDeleteProgress(null);
        }, 1000);
      } else {
        toast.error(locale === "ar" ? result.arMessage : result.enMessage, {
          id: "delete-campaign",
          icon: <AlertCircle className="h-4 w-4" />,
          duration: 3000,
        });

        setDeleteProgress(null);
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getCampaignStatus = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {text.active || "Active"}
          </Badge>
        );
      case "draft":
        return (
          <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400">
            <Clock className="w-3 h-3 mr-1" />
            {text.draft || "Draft"}
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <>
      {/* Delete Progress */}
      {deleteProgress !== null && (
        <div className="fixed top-4 right-4 z-50 w-80 bg-background border rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Deleting campaign...</span>
            <span className="text-sm text-muted-foreground">
              {deleteProgress}%
            </span>
          </div>
          <Progress value={deleteProgress} className="h-2" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* TITLE + CREATE BUTTON */}
        <div
          ref={campaignsRef}
          className={cn(
            "flex justify-between items-center mb-6 transition-all duration-500",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4",
          )}
        >
          <div>
            <h1 className="text-3xl font-bold">{text.title}</h1>
            <p className="text-muted-foreground">{text.subtitle}</p>
          </div>
          <Button
            onClick={handleCreate}
            className="transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            {text.createCampaign}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card
            className={cn(
              "border-l-4 border-l-primary transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "100ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {text.totalCampaigns || "Total"}
                  </p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <FolderOpen className="size-6 text-primary" />
                </div>
              </div>
              <div className="mt-2">
                <Progress value={100} className="h-1" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-l-4 border-l-green-500 transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "200ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {text.activeCampaigns || "Active"}
                  </p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-green-500/10">
                  <CheckCircle2 className="size-6 text-green-500" />
                </div>
              </div>
              <div className="mt-2">
                <Progress
                  value={
                    stats.total > 0 ? (stats.active / stats.total) * 100 : 0
                  }
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-l-4 border-l-blue-500 transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "300ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {text.draftCampaigns || "Draft"}
                  </p>
                  <p className="text-2xl font-bold">{stats.draft}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-blue-500/10">
                  <Clock className="size-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-2">
                <Progress
                  value={
                    stats.total > 0 ? (stats.draft / stats.total) * 100 : 0
                  }
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "border-l-4 border-l-amber-500 transition-all duration-300 hover:shadow-md hover:scale-[1.02]",
              animateItems
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4",
            )}
            style={{ animationDelay: "400ms" }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {text.thisMonth || "This Month"}
                  </p>
                  <p className="text-2xl font-bold">{stats.thisMonth}</p>
                </div>
                <div className="flex size-12 items-center justify-center rounded-lg bg-amber-500/10">
                  <Calendar className="size-6 text-amber-500" />
                </div>
              </div>
              <div className="mt-2">
                <Progress
                  value={
                    stats.total > 0 ? (stats.thisMonth / stats.total) * 100 : 0
                  }
                  className="h-1"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div
          className={cn(
            "flex gap-4 mb-6 transition-all duration-300",
            animateItems
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4",
          )}
          style={{ animationDelay: "500ms" }}
        >
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Activity className="size-4" />
            </div>
            <Input
              placeholder={text.searchPlaceholder || "Search campaigns..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
              className="transition-all duration-300 hover:scale-105"
            >
              {text.all || "All"}
            </Button>
            <Button
              variant={filterStatus === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("active")}
              className="transition-all duration-300 hover:scale-105"
            >
              {text.active || "Active"}
            </Button>
            <Button
              variant={filterStatus === "draft" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("draft")}
              className="transition-all duration-300 hover:scale-105"
            >
              {text.draft || "Draft"}
            </Button>
          </div>
        </div>

        {/* CAMPAIGN CARDS */}
        {filteredCampaigns.length === 0 ? (
          <Card
            className={cn(
              "border-dashed transition-all duration-300",
              animateItems ? "opacity-100 scale-100" : "opacity-0 scale-95",
            )}
            style={{ animationDelay: "600ms" }}
          >
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery || filterStatus !== "all"
                  ? text.noMatchingCampaigns ||
                    "No campaigns match your filters"
                  : text.noCampaigns || "No campaigns yet"}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || filterStatus !== "all"
                  ? text.noMatchingDescription ||
                    "Try adjusting your filters or search terms"
                  : text.noCampaignsDescription ||
                    "Create your first campaign to get started"}
              </p>
              <Button
                onClick={handleCreate}
                className="transition-all duration-300 hover:scale-105"
              >
                <Plus className="w-4 h-4 mr-2" />
                {text.createCampaign}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCampaigns.map((campaign, index) => (
              <Card
                key={campaign.id}
                className={cn(
                  "transition-all duration-300 hover:shadow-md hover:scale-[1.02] group overflow-hidden",
                  animateItems
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4",
                )}
                style={{ animationDelay: `${600 + index * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2 text-lg group-hover:text-primary transition-colors">
                        <FolderOpen className="w-5 h-5 text-primary" />
                        {campaign.name}
                      </CardTitle>
                      {campaign.description && (
                        <CardDescription className="mt-1">
                          {campaign.description}
                        </CardDescription>
                      )}
                    </div>
                    {getCampaignStatus(campaign.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  {(campaign.startsAt || campaign.endsAt) && (
                    <div className="text-sm text-muted-foreground mb-4">
                      {campaign.startsAt && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {text.startDate}: {formatDate(campaign.startsAt)}
                          </span>
                        </p>
                      )}
                      {campaign.endsAt && (
                        <p className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {text.endDate}: {formatDate(campaign.endsAt)}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(campaign)}
                      className="flex-1 transition-all duration-300 hover:scale-105 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      {text.edit}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(campaign.id, campaign.name)}
                      className="flex-1 transition-all duration-300 hover:scale-105 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-300"
                    >
                      {deleteProgress !== null ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      {text.delete}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* DIALOG */}
      <Dialog ref={dialogRef} open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] transition-all duration-300">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              {editingCampaign ? text.edit : text.createCampaign}
            </DialogTitle>
            <DialogDescription>
              {editingCampaign ? text.editDescription : text.createDescription}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div>
                <Label>{text.campaignName}</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <Label>{text.description}</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                />
              </div>

              {/* FIXED DATES */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{text.startDate}</Label>
                  <Input
                    type="date"
                    value={formData.startsAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        startsAt: e.target.value,
                      }))
                    }
                    required
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
                <div>
                  <Label>{text.endDate}</Label>
                  <Input
                    type="date"
                    value={formData.endsAt}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        endsAt: e.target.value,
                      }))
                    }
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {/* FIXED STATUS TOGGLE */}
              <div className="flex items-center justify-between">
                <Label>{text.active}</Label>
                <Switch
                  checked={formData.status === "active"}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: checked ? "active" : "draft",
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                className="transition-all duration-300 hover:scale-105"
              >
                {text.cancel}
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="transition-all duration-300 hover:scale-105"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    {text.saving}
                  </>
                ) : editingCampaign ? (
                  text.save
                ) : (
                  text.create
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
