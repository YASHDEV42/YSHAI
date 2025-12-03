"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User, Bell, CreditCard } from "lucide-react";
import { BillingTab } from "./billing-tab";
import { NotificationsTab } from "./notifications-tab";
import { ProfileTab } from "./profile-tab";
import { TConnectedAccount, TUser } from "@/types";
import type { IPlan, IInvoice, SubscriptionWithPlan } from "@/interfaces";

export default function SettingsClient({
  text,
  locale,
  user,
  accounts,
  subscription,
  plans,
  invoices,
}: {
  text: any;
  locale: string;
  user: TUser | undefined;
  accounts: TConnectedAccount[];
  subscription?: SubscriptionWithPlan;
  plans: IPlan[];
  invoices: IInvoice[];
}) {
  console.log("accounts in SettingsClient:", accounts);
  const dir = locale === "ar" ? "rtl" : "ltr";
  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">{text.title}</h1>
          <p className="mt-1 text-muted-foreground">{text.subtitle}</p>
        </div>
        <SidebarTrigger className="lg:hidden" />
      </div>

      <Tabs defaultValue="profile" className="space-y-6" dir={dir}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="profile">
            <User className="mr-2 size-4" />
            {text.tabs.profile}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 size-4" />
            {text.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="mr-2 size-4" />
            {text.tabs.billing}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab text={text} user={user} locale={locale} />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab text={text} />
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <BillingTab
            text={text}
            subscription={subscription}
            plans={plans}
            invoices={invoices}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
