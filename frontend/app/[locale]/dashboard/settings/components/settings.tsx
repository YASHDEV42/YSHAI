"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Bell, CreditCard, Twitter, Instagram, Linkedin, Music2, Plus, Trash2, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function SettingsClient({ text }: { text: any }) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [postReminders, setPostReminders] = useState(true)

  const connectedPlatforms = [
    {
      id: "twitter",
      name: text.platformsNames.twitter,
      icon: Twitter,
      connected: true,
      username: "@yshai_official",
      followers: "12.5K",
    },
    {
      id: "instagram",
      name: text.platformsNames.instagram,
      icon: Instagram,
      connected: true,
      username: "@yshai.official",
      followers: "24.8K",
    },
    {
      id: "linkedin",
      name: text.platformsNames.linkedin,
      icon: Linkedin,
      connected: true,
      username: "YSHAI",
      followers: "8.2K",
    },
    {
      id: "tiktok",
      name: text.platformsNames.tiktok,
      icon: Music2,
      connected: true,
      username: "@yshai",
      followers: "45.3K",
    },
  ]

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

      <Tabs defaultValue="profile" className="space-y-6">
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
              <div className="flex items-center gap-6">
                <Avatar className="size-20">
                  <AvatarImage src="/placeholder.svg?height=80&width=80" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button size="sm">{text.profile.changePhoto}</Button>
                  <p className="text-xs text-muted-foreground">{text.profile.photoHelp}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{text.profile.firstName}</Label>
                  <Input id="firstName" placeholder="John" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{text.profile.lastName}</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{text.profile.email}</Label>
                <Input id="email" type="email" placeholder="john@example.com" defaultValue="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{text.profile.bio}</Label>
                <Input
                  id="bio"
                  placeholder="Tell us about yourself"
                  defaultValue="Social media manager and content creator"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">{text.profile.timezone}</Label>
                <Select defaultValue="riyadh">
                  <SelectTrigger id="timezone">
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

              <div className="flex justify-end gap-3">
                <Button variant="outline">{text.profile.cancel}</Button>
                <Button>{text.profile.saveChanges}</Button>
              </div>
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
              {connectedPlatforms.map((platform) => (
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
              ))}

              <Button variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 size-4" />
                {text.platforms.connectNew}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle>{text.platforms.postingPreferences.title}</CardTitle>
              <CardDescription>{text.platforms.postingPreferences.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.platforms.postingPreferences.autoPublish.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {text.platforms.postingPreferences.autoPublish.description}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.platforms.postingPreferences.watermark.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {text.platforms.postingPreferences.watermark.description}
                  </p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{text.platforms.postingPreferences.crossPost.label}</Label>
                  <p className="text-sm text-muted-foreground">
                    {text.platforms.postingPreferences.crossPost.description}
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
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
    </div>
  )
}
