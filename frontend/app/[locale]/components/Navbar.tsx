import type { TUser } from "@/types";
import { me } from "@/lib/user-helper";
import { ModeToggle } from "../../components/toggleTheme";
import { LanguageToggle } from "../../components/LanguageToggle";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Suspense } from "react";
import { Logo } from "./Logo";
import { Link } from "@/app/i18n/navigation";
import { logoutAction } from "../actions";

async function UserMenu({ text }: { text: any }) {
  let user: TUser | null = null;
  const response = await me();
  user = response.success ? response.data : null;

  return (
    <>
      {user ? (
        <>
          <Button asChild>
            <Link href="/dashboard">{text.dashboard}</Link>
          </Button>
          <form action={logoutAction}>
            <Button variant="ghost" type="submit" className="cursor-pointer">
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
    </>
  );
}
export function Navbar({ text }: { text: any }) {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  console.log("Current pathname:", pathname);
  if (
    pathname.startsWith("/en/dashboard") ||
    pathname.startsWith("/ar/dashboard")
  ) {
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
          <Suspense
            fallback={
              <div className="flex items-center gap-3">
                <div className="h-9 w-20 bg-accent animate-pulse rounded-md" />
                <div className="h-9 w-20 bg-accent animate-pulse rounded-md" />
              </div>
            }
          >
            <UserMenu text={text} />
          </Suspense>
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
}
