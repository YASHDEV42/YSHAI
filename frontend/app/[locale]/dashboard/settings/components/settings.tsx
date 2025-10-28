"use client"

import { useActionState, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { User, Bell, CreditCard, Twitter, Instagram, Linkedin, Music2, Plus, Trash2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { changeNameAction } from "../actions"
const initialState = {
  arMessage: '',
  enMessage: '',
  success: false,
}
type connectedPlatformType = {
  id: number;
  name: string;
  username: string;
  followers: string;
  connected: boolean;
  icon: typeof Twitter | typeof Instagram | typeof Linkedin | typeof Music2;
}
export default function SettingsClient({ text, user, locale }: { text: any, user: any | null, locale: string }) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [postReminders, setPostReminders] = useState(true)
  const [state, formAction, pending] = useActionState(changeNameAction, initialState)
  const [connectedPlatforms, setConnectedPlatforms] = useState<connectedPlatformType[] | []>([]);
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
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

      <Tabs defaultValue="profile" className="space-y-6" dir={dir} >
        <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
          <TabsTrigger value="profile">
            <User className="mr-2 size-4" />
            {text.tabs.profile}
          </TabsTrigger>
          <TabsTrigger value="platforms">
            <Twitter className="mr-2 size-4" />
            {text.tabs.platforms}
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
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.profile.title}</CardTitle>
              <CardDescription>{text.profile.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form action={formAction} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{text.profile.name}</Label>
                  <Input id="name" placeholder={user?.name} name="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">{text.profile.timezone}</Label>
                  <Select defaultValue="riyadh" name="timezone">
                    <SelectTrigger id="timezone" name="timezone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="riyadh">{text.timezones.riyadh}</SelectItem>
                      <SelectItem value="dubai">{text.timezones.dubai}</SelectItem>
                      <SelectItem value="cairo">{text.timezones.cairo}</SelectItem>
                      <SelectItem value="london">{text.timezones.london}</SelectItem>
                      <SelectItem value="newyork">{text.timezones.newyork}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <input type="hidden" name="locale" value={locale} />
                {
                  locale === 'ar' && state?.arMessage && (
                    <p className={`text-base font-bold ${state.success ? "text-primary" : "text-destructive"}`}>{state.arMessage}</p>
                  )}
                {locale === 'en' && state?.enMessage && (
                  <p className={`text-base font-bold ${state.success ? "text-primary" : "text-destructive"}`}>{state.enMessage}</p>)
                }
                <div className="flex justify-end gap-3">
                  <Button variant="outline">{text.profile.cancel}</Button>
                  <Button type="submit" disabled={pending}>{pending && <Spinner />}{text.profile.saveChanges}</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.profile.security.title}</CardTitle>
              <CardDescription>{text.profile.security.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">{text.profile.security.currentPassword}</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">{text.profile.security.newPassword}</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{text.profile.security.confirmPassword}</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>{text.profile.security.updatePassword}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.platforms.title}</CardTitle>
              <CardDescription>{text.platforms.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">

              {connectedPlatforms.length !== 0 ? connectedPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-lg bg-muted">
                      <platform.icon className="size-6 text-foreground" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{platform.name}</p>
                        {platform.connected && (
                          <Badge variant="default" className="bg-green-500/20 text-green-600 dark:text-green-400">
                            <Check className="mr-1 size-3" />
                            {text.platforms.connected}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {platform.username} • {platform.followers} {text.platforms.followers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      {text.platforms.reconnect}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="size-4" />
                      <span className="sr-only">{text.platforms.disconnect}</span>
                    </Button>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">{text.platforms.noConnected}</p>
              )}

              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 size-4" />
                {text.platforms.connectNew}
              </Button>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.notifications.title}</CardTitle>
              <CardDescription>{text.notifications.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.notifications.email.label}</Label>
                  <p className="text-sm text-muted-foreground">{text.notifications.email.description}</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.notifications.push.label}</Label>
                  <p className="text-sm text-muted-foreground">{text.notifications.push.description}</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.notifications.weeklyReport.label}</Label>
                  <p className="text-sm text-muted-foreground">{text.notifications.weeklyReport.description}</p>
                </div>
                <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.notifications.postReminders.label}</Label>
                  <p className="text-sm text-muted-foreground">{text.notifications.postReminders.description}</p>
                </div>
                <Switch checked={postReminders} onCheckedChange={setPostReminders} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.notifications.types.title}</CardTitle>
              <CardDescription>{text.notifications.types.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{text.notifications.types.published}</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>{text.notifications.types.failed}</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>{text.notifications.types.comments}</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>{text.notifications.types.milestones}</Label>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label>{text.notifications.types.connectionIssues}</Label>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.billing.currentPlan}</CardTitle>
              <CardDescription>{text.billing.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-6 rounded-lg border-2 border-primary bg-primary/5">
                <div>
                  <h3 className="font-bold text-xl">{text.billing.proPlan}</h3>
                  <p className="text-muted-foreground">{text.billing.proDescription}</p>
                  <p className="mt-2 font-semibold text-2xl">$29/month</p>
                </div>
                <Badge variant="default" className="bg-primary">
                  {text.billing.active}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{text.billing.nextBilling}</span>
                  <span className="font-medium">January 15, 2025</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{text.billing.paymentMethod}</span>
                  <span className="font-medium">•••• •••• •••• 4242</span>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 bg-transparent">
                  {text.billing.changePlan}
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  {text.billing.updatePayment}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.billing.billingHistory}</CardTitle>
              <CardDescription>{text.billing.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "Dec 15, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Nov 15, 2024", amount: "$29.00", status: "Paid" },
                  { date: "Oct 15, 2024", amount: "$29.00", status: "Paid" },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-medium text-sm">{invoice.date}</p>
                      <p className="text-xs text-muted-foreground">{text.billing.proPlan}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="font-semibold">{invoice.amount}</p>
                      <Badge variant="default" className="bg-green-500/20 text-green-600 dark:text-green-400">
                        {text.billing.paid}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        {text.billing.download}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card ">
            <CardHeader>
              <CardTitle className="text-destructive">{text.billing.dangerZone}</CardTitle>
              <CardDescription>{text.billing.dangerDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 bg-transparent">
                {text.billing.cancelSubscription}
              </Button>
              <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10 bg-transparent">
                {text.billing.deleteAccount}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div >
  )
}
