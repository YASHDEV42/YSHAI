"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { connectInstagram } from "@/app/[locale]/dashboard/settings/actions";

export default function MetaCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Meta redirects with access_token in URL hash
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (!token) {
      alert("Missing access token from Meta");
      return;
    }

    connectInstagram(token)
      .then((res) => {
        console.log("✅ Connected Instagram:", res);
        alert("Instagram connected successfully!");
        router.push("/dashboard/settings");
      })
      .catch((err) => {
        console.error("❌ Meta connect failed:", err);
        alert("Failed to connect account");
      });
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Connecting your Instagram account...</p>
    </div>
  );
}
