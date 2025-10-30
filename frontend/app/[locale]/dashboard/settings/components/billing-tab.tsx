
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface BillingTabProps {
  text: any
}

export function BillingTab({ text }: BillingTabProps) {
  return (
    <>
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

      <Card className="border-border bg-card">
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
    </>
  )
}
