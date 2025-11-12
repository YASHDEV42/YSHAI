"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { connectInstagram } from "@/app/[locale]/dashboard/settings/actions";

export default function MetaCallbackClient() {
  const router = useRouter();

  const connectInstagramHandler = async (
    token: string,
    expiry: string | null,
  ) => {
    try {
      const result = await connectInstagram(token, expiry);

      if (result?.success) {
        console.log("✅ Instagram connected successfully:", result.data);
        router.replace("/dashboard/settings?connected=instagram");
      } else {
        console.error("❌ Failed to connect Instagram:", result?.error);
        router.replace("/dashboard/settings?error=connection_failed");
      }
    } catch (err) {
      console.error("⚠️ Error connecting Instagram:", err);
      router.replace("/dashboard/settings?error=unexpected");
    }
  };

  useEffect(() => {
    (async () => {
      // Extract hash parameters from redirect
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get("access_token");
      const expiry = params.get("expires_in");

      if (!token) {
        console.warn("⚠️ Missing access token from Meta redirect.");
        router.replace("/dashboard/settings?error=missing_token");
        return;
      }

      console.log("🔑 Meta short-lived access token:", token);
      console.log("⏳ Token expiry (seconds):", expiry);

      await connectInstagramHandler(token, expiry);
    })();
  }, [router]);

  return (
    <div className="h-screen flex items-center justify-center bg-background">
      <p className="text-lg text-muted-foreground animate-pulse">
        Connecting your Instagram account…
      </p>
    </div>
  );
}
