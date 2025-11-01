"use client";

import { useEffect } from "react";
import { connectInstagram } from "@/app/[locale]/dashboard/settings/actions";

export default function MetaCallbackClient() {
  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");

    if (!token) {
      alert("Missing access token from Meta");
      return;
    }

    console.log("🔑 Meta access token:", token);

    // Call the server action
    connectInstagram(token)
      .then(() => {
        console.log("✅ Instagram connected successfully!");
      })
      .catch((err) => {
        console.error("❌ Failed to connect Instagram:", err);
      });
  }, []);

  return (
    <div className="h-screen flex items-center justify-center">
      <p>Connecting your Instagram account...</p>
    </div>
  );
}
