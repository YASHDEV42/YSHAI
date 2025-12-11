"use client";

import type { TUser } from "@/types";
import { ModeToggle } from "../../components/toggleTheme";
import { LanguageToggle } from "../../components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Logo } from "./Logo";
import { Link } from "@/app/i18n/navigation";
import { logoutAction } from "../actions";
import { usePathname } from "next/navigation";

export function NavbarClient({
  text,
  user,
}: {
  text: any;
  user: TUser | null;
}) {
  const pathname = usePathname();

  if (pathname.includes("/dashboard")) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center w-[320px]">
          <Logo />
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.features}
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.pricing}
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.about}
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-3 w-[320px]">
          {user ? (
            <>
              <Button asChild>
                <Link href="/dashboard">{text.dashboard}</Link>
              </Button>
              <form action={logoutAction}>
                <Button
                  variant="ghost"
                  type="submit"
                  className="cursor-pointer"
                >
                  {text.logout}
                  <LogOut />
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">{text.login}</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">{text.register}</Link>
              </Button>
            </>
          )}
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
