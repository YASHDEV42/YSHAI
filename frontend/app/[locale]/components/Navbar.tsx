import { ModeToggle } from "../../components/toggleTheme"
import { LanguageToggle } from "../../components/LanguageToggle"

export function Navbar() {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold">AI Social Manager</h1>
        </div>

        <div className="flex items-center gap-4">
          <LanguageToggle />
          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
