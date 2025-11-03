"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { connectInstagram } from "@/app/[locale]/dashboard/settings/actions";

export default function MetaCallbackClient() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (!token) {
      alert("Missing access token from Meta");
      router.push("/dashboard/settings");
      return;
    }

    console.log("🔑 Meta access token:", token);

    connectInstagram(token)
      .then(() => {
        console.log("✅ Instagram connected successfully!");
        // ✅ redirect user to the dashboard
        router.push("/dashboard");
      })
      .catch((err) => {
        console.error("❌ Failed to connect Instagram:", err);
        // optional: show error and still return to settings
        alert("Failed to connect Instagram account.");
        router.push("/dashboard/settings");
      });
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Connecting your Instagram account...</p>
    </div>
  );
}
