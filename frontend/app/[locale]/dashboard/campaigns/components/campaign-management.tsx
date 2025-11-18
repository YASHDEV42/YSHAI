"use client";

import { useState, useTransition } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FolderOpen, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { ICampaign } from "@/lib/campaign-helper";
import { useToast } from "@/hooks/use-toast";
import {
  createCampaignAction,
  updateCampaignAction,
  deleteCampaignAction,
} from "../actions";
import { Switch } from "@/components/ui/switch";

export default function CampaignsManagement({
  text,
  locale,
  campaigns: initialCampaigns,
}: {
  text: any;
  locale: string;
  campaigns: ICampaign[];
}) {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ICampaign | null>(
    null,
  );

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
        toast({
          title: locale === "ar" ? "نجح" : "Success",
          description: locale === "ar" ? result.arMessage : result.enMessage,
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
      const result = await deleteCampaignAction(
        { success: false, enMessage: "", arMessage: "" },
        id,
      );

      if (result.success) {
        toast({
          title: locale === "ar" ? "نجح" : "Success",
          description: locale === "ar" ? result.arMessage : result.enMessage,
        });
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
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
      {/* TITLE + CREATE BUTTON */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{text.title}</h1>
          <p className="text-muted-foreground">{text.subtitle}</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {text.createCampaign}
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? text.edit : text.createCampaign}
              </DialogTitle>
              <DialogDescription>
                {editingCampaign
                  ? text.editDescription
                  : text.createDescription}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label>{text.campaignName}</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
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
                >
                  {text.cancel}
                </Button>
                <Button type="submit" disabled={isPending}>
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
      </div>

      {/* CAMPAIGN CARDS */}
      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{text.noCampaigns}</h3>
            <p className="text-muted-foreground text-center mb-4">
              {text.noCampaignsDescription}
            </p>
            <Button onClick={handleCreate}>
              <Plus className="w-4 h-4 mr-2" />
              {text.createCampaign}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5" />
                      {campaign.name}
                    </CardTitle>
                    {campaign.description && (
                      <CardDescription className="mt-2">
                        {campaign.description}
                      </CardDescription>
                    )}
                  </div>

                  <Badge
                    variant={
                      campaign.status === "active" ? "default" : "secondary"
                    }
                  >
                    {campaign.status === "active" ? text.active : text.inactive}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {(campaign.startsAt || campaign.endsAt) && (
                  <div className="text-sm text-muted-foreground mb-4">
                    {campaign.startsAt && (
                      <p>
                        {text.startDate}:{" "}
                        {new Date(campaign.startsAt).toLocaleDateString(locale)}
                      </p>
                    )}
                    {campaign.endsAt && (
                      <p>
                        {text.endDate}:{" "}
                        {new Date(campaign.endsAt).toLocaleDateString(locale)}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(campaign)}
                    className="flex-1"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    {text.edit}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(campaign.id)}
                    className="flex-1"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    {text.delete}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
