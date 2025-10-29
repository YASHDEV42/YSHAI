
"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface NotificationsTabProps {
  text: any
}

export function NotificationsTab({ text }: NotificationsTabProps) {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [postReminders, setPostReminders] = useState(true)

  return (
    <>
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
    </>
  )
}
