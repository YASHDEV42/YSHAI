"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

export function Logo() {
  const theme = useTheme();
  return (
    <Link
      href="/"
      className="text-xl font-bold flex flex-row items-center gap-2"
    >
      {theme.theme === "dark" ? (
        <Image src="/bitmap-dark.svg" alt="Logo" width={35} height={35} />
      ) : (
        <Image src="/bitmap.svg" alt="Logo" width={35} height={35} />
      )}
    </Link>
  );
}
