"use client";
import { ModeToggle } from "../../components/toggleTheme";
import { LanguageToggle } from "../../components/LanguageToggle";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useUser } from "@/hooks/useUser";
export function Navbar({ text }: { text: any }) {
  const { user, loading, error } = useUser();
  if (error) {
    console.log(error);
  }
  const pathname = usePathname();
  if (
    pathname?.startsWith("/ar/dashboard") ||
    pathname?.startsWith("/en/dashboard")
  ) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center w-[320px]">
          <Link href="/" className="text-xl font-bold">
            {text.logo}
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.features}
          </Link>
          <Link
            href="#pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.pricing}
          </Link>
          <Link
            href="#about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {text.about}
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-3 w-[320px]">
          {loading && <p>Loading...</p>}
          {user ? (
            <>
              <Button asChild>
                <Link href="/dashboard">{text.dashboard}</Link>
              </Button>
              <form>
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
