"use client";

import { useEffect } from "react";

export default function ScrollToTopOnMount() {
  useEffect(() => {
    // Ensures scroll position resets to 0 on page load
    window.scrollTo(0, 0);
  }, []);

  return null;
}
