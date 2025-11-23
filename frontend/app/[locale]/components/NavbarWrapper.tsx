"use client";
import { usePathname } from "next/navigation";

export function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path.startsWith("/en/dashboard") || path.startsWith("/ar/dashboard")) {
    return null;
  }
  return <>{children}</>;
}
