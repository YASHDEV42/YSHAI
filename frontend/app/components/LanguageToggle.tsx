"use client";

import { Earth, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const languages = [
  { code: "ar", label: "العربية", shortLabel: "AR" },
  { code: "en", label: "English", shortLabel: "EN" },
];

export function LanguageToggle() {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = (params?.locale as string) || "en";
  const [open, setOpen] = useState(false);

  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Earth className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            // Very important fix:
            onSelect={(e) => {
              e.preventDefault();
              setOpen(false);

              setTimeout(() => {
                router.push(`/${language.code}${pathnameWithoutLocale}`);
              }, 100); // allows Radix to close BEFORE navigation
            }}
            className="flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="font-medium">{language.shortLabel}</span>
              <span className="text-sm text-muted-foreground">
                {language.label}
              </span>
            </span>
            {currentLocale === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
