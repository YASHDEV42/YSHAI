"use client"
import { Earth, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Link } from "../i18n/navigation"
import { useParams, usePathname } from "next/navigation"

const languages = [
  { code: "ar", label: "العربية", shortLabel: "AR" },
  { code: "en", label: "English", shortLabel: "EN" },
]

export function LanguageToggle() {
  const params = useParams()
  const pathname = usePathname()
  const currentLocale = (params?.locale as string) || "en"

  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "") || "/"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Toggle language">
          <Earth className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((language) => (
          <DropdownMenuItem key={language.code} asChild>
            <Link
              href={pathnameWithoutLocale} // ✅ Now locale-free
              locale={language.code}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{language.shortLabel}</span>
                <span className="text-muted-foreground text-sm">{language.label}</span>
              </span>
              {currentLocale === language.code && <Check className="h-4 w-4 text-primary" />}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
