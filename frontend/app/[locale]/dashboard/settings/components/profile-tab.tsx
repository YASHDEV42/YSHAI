"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useActionState } from "react";

import { changeNameAction } from "../actions";
interface ProfileTabProps {
  text: any;
  user: any;
  locale: string;
}

const initialState = {
  arMessage: "",
  enMessage: "",
  success: false,
};

export function ProfileTab({ text, user, locale }: ProfileTabProps) {
  const [state, formAction, pending] = useActionState(
    changeNameAction,
    initialState,
  );
  return (
    <>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>{text.profile.title}</CardTitle>
          <CardDescription>{text.profile.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{text.profile.name}</Label>
              <Input
                id="name"
                placeholder={user?.name}
                name="name"
                defaultValue={user?.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">{text.profile.timezone}</Label>
              <Select defaultValue="riyadh" name="timezone">
                <SelectTrigger id="timezone" name="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="riyadh">
                    {text.timezones.riyadh}
                  </SelectItem>
                  <SelectItem value="dubai">{text.timezones.dubai}</SelectItem>
                  <SelectItem value="cairo">{text.timezones.cairo}</SelectItem>
                  <SelectItem value="london">
                    {text.timezones.london}
                  </SelectItem>
                  <SelectItem value="newyork">
                    {text.timezones.newyork}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <input type="hidden" name="locale" value={locale} />
            {locale === "ar" && state?.arMessage && (
              <p
                className={`text-base font-bold ${state.success ? "text-primary" : "text-destructive"}`}
              >
                {state.arMessage}
              </p>
            )}
            {locale === "en" && state?.enMessage && (
              <p
                className={`text-base font-bold ${state.success ? "text-primary" : "text-destructive"}`}
              >
                {state.enMessage}
              </p>
            )}
            <div className="flex justify-end gap-3">
              <Button variant="outline">{text.profile.cancel}</Button>
              <Button type="submit" disabled={pending}>
                {pending && <Spinner />}
                {text.profile.saveChanges}
              </Button>
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
            <Label htmlFor="currentPassword">
              {text.profile.security.currentPassword}
            </Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            {text.profile.security.newPassword}
            <Label htmlFor="newPassword"></Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {text.profile.security.confirmPassword}
            </Label>
            <Input id="confirmPassword" type="password" />
          </div>
          <div className="flex justify-end">
            <Button>{text.profile.security.updatePassword}</Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
