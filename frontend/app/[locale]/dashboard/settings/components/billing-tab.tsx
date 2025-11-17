"use client";

import { useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Check, Download, Loader2 } from "lucide-react";
import {
  changePlan as changePlanAction,
  cancelSubscription as cancelSubscriptionAction,
} from "../actions";
import type { IPlan, IInvoice, SubscriptionWithPlan } from "@/interfaces";

interface BillingTabProps {
  text: any;
  subscription?: SubscriptionWithPlan;
  plans: IPlan[];
  invoices: IInvoice[];
}

export function BillingTab({
  text,
  subscription,
  plans,
  invoices,
}: BillingTabProps) {
  const [isPending, startTransition] = useTransition();
  const [showPlansDialog, setShowPlansDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const { toast } = useToast();

  const handleChangePlan = (newPlanId: number) => {
    if (!subscription) return;

    startTransition(async () => {
      const result = await changePlanAction(subscription.id, newPlanId);
      if (result.success) {
        toast({
          title: "Success",
          description: "Your plan has been updated successfully.",
        });
        setShowPlansDialog(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to change plan.",
          variant: "destructive",
        });
      }
    });
  };

  const handleCancelSubscription = () => {
    if (!subscription) return;

    startTransition(async () => {
      const result = await cancelSubscriptionAction(subscription.id);
      if (result.success) {
        toast({
          title: "Subscription Canceled",
          description: "Your subscription has been canceled successfully.",
        });
        setShowCancelDialog(false);
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to cancel subscription.",
          variant: "destructive",
        });
      }
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      active: {
        label: text.billing.status.active,
        color: "bg-green-500/20 text-green-600 dark:text-green-400",
      },
      canceled: {
        label: text.billing.status.canceled,
        color: "bg-red-500/20 text-red-600 dark:text-red-400",
      },
      past_due: {
        label: text.billing.status.past_due,
        color: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
      },
      trialing: {
        label: text.billing.status.trialing,
        color: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      },
      incomplete: {
        label: text.billing.status.incomplete,
        color: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.incomplete;
  };

  const getInvoiceStatusBadge = (status: string) => {
    const statusMap = {
      paid: {
        label: text.billing.invoiceStatus.paid,
        color: "bg-green-500/20 text-green-600 dark:text-green-400",
      },
      unpaid: {
        label: text.billing.invoiceStatus.unpaid,
        color: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
      },
      refunded: {
        label: text.billing.invoiceStatus.refunded,
        color: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      },
      failed: {
        label: text.billing.invoiceStatus.failed,
        color: "bg-red-500/20 text-red-600 dark:text-red-400",
      },
    };
    return statusMap[status as keyof typeof statusMap] || statusMap.unpaid;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
    }).format(amount);
  };

  return (
    <>
      {/* Current Plan */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>{text.billing.currentPlan}</CardTitle>
          <CardDescription>{text.billing.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription ? (
            <>
              <div className="flex items-center justify-between p-6 rounded-lg border-2 border-primary bg-primary/5">
                <div>
                  <h3 className="font-bold text-xl">
                    {subscription.plan.name} {text.billing.currentPlanBadge}
                  </h3>
                  <p className="text-muted-foreground">
                    {subscription.plan.description || ""}
                  </p>
                  <p className="mt-2 font-semibold text-2xl">
                    {formatCurrency(subscription.plan.priceMonthly, "USD")}
                    {text.billing.perMonth}
                  </p>
                </div>
                <Badge
                  variant="default"
                  className={getStatusBadge(subscription.status).color}
                >
                  {getStatusBadge(subscription.status).label}
                </Badge>
              </div>

              {/* Plan Features */}
              <div className="space-y-3">
                <h4 className="font-semibold">{text.billing.planFeatures}</h4>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>{subscription.plan.maxAccounts} social accounts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>
                      {subscription.plan.maxPostsPerMonth} posts per month
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="size-4 text-primary" />
                    <span>
                      {subscription.plan.aiCreditsUnlimited
                        ? "Unlimited AI credits"
                        : `${subscription.plan.aiCreditsLimit} AI credits`}
                    </span>
                  </div>
                  {subscription.plan.teamCollaboration && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" />
                      <span>Team collaboration</span>
                    </div>
                  )}
                  {subscription.plan.analyticsExport && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" />
                      <span>Analytics export</span>
                    </div>
                  )}
                  {subscription.plan.prioritySupport && (
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="size-4 text-primary" />
                      <span>Priority support</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {text.billing.periodStarts}
                  </span>
                  <span className="font-medium">
                    {formatDate(subscription.periodStartsAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {text.billing.periodEnds}
                  </span>
                  <span className="font-medium">
                    {formatDate(subscription.periodEndsAt)}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => setShowPlansDialog(true)}
                  disabled={isPending}
                >
                  {text.billing.changePlan}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent"
                  disabled
                >
                  {text.billing.updatePayment}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                {text.billing.noPlan}
              </p>
              <Button onClick={() => setShowPlansDialog(true)}>
                {text.billing.choosePlan}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>{text.billing.billingHistory}</CardTitle>
          <CardDescription>{text.billing.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length > 0 ? (
            <div className="space-y-3">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-sm">
                      {formatDate(invoice.issuedAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {text.billing.invoice} #{invoice.id}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-semibold">
                      {formatCurrency(invoice.amount, invoice.currency)}
                    </p>
                    <Badge
                      variant="default"
                      className={getInvoiceStatusBadge(invoice.status).color}
                    >
                      {getInvoiceStatusBadge(invoice.status).label}
                    </Badge>
                    {invoice.pdfUrl && (
                      <Button variant="ghost" size="sm" asChild>
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="size-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              {text.billing.noInvoices}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {subscription && (
        <Card className="border-destructive/50 bg-card">
          <CardHeader>
            <CardTitle className="text-destructive">
              {text.billing.dangerZone}
            </CardTitle>
            <CardDescription>{text.billing.dangerDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
              <div>
                <p className="font-medium">{text.billing.cancelSubscription}</p>
                <p className="text-sm text-muted-foreground">
                  {text.billing.cancelSubscriptionDescription}
                </p>
              </div>
              <Button
                variant="outline"
                className="text-destructive hover:bg-destructive/10 bg-transparent"
                onClick={() => setShowCancelDialog(true)}
                disabled={isPending}
              >
                {text.billing.cancelPlan}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Change Plan Dialog */}
      <Dialog open={showPlansDialog} onOpenChange={setShowPlansDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{text.billing.availablePlans}</DialogTitle>
            <DialogDescription>{text.billing.choosePlan}</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-3 gap-4 py-4">
            {plans.map((plan) => {
              const isCurrentPlan = subscription?.planId === plan.id;
              return (
                <Card
                  key={plan.id}
                  className={`relative ${
                    isCurrentPlan ? "border-primary border-2" : ""
                  }`}
                >
                  {isCurrentPlan && (
                    <Badge className="absolute top-2 right-2">
                      {text.billing.currentPlanBadge}
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="font-bold text-4xl">
                        {formatCurrency(plan.priceMonthly, "USD")}
                      </span>
                      <span className="text-muted-foreground">
                        {text.billing.perMonth}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-primary" />
                        <span>{plan.maxAccounts} social accounts</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-primary" />
                        <span>{plan.maxPostsPerMonth} posts/month</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-primary" />
                        <span>
                          {plan.aiCreditsUnlimited
                            ? "Unlimited AI"
                            : `${plan.aiCreditsLimit} AI credits`}
                        </span>
                      </div>
                      {plan.teamCollaboration && (
                        <div className="flex items-center gap-2 text-sm">
                          <Check className="size-4 text-primary" />
                          <span>Team collaboration</span>
                        </div>
                      )}
                    </div>
                    <Button
                      className="w-full"
                      disabled={isCurrentPlan || isPending}
                      onClick={() => handleChangePlan(plan.id)}
                    >
                      {isPending ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : isCurrentPlan ? (
                        text.billing.currentPlanBadge
                      ) : (
                        text.billing.selectPlan
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{text.billing.cancelSubscription}</DialogTitle>
            <DialogDescription>{text.billing.confirmCancel}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={isPending}
            >
              {text.billing.keep}
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelSubscription}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                text.billing.cancelConfirm
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
