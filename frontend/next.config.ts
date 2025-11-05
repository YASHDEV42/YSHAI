import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "images.unsplash.com",
      "cdn.sanity.io",
      "lh3.googleusercontent.com",
      "scontent.cdninstagram.com",
    ],
  },
};

const withNextIntl = createNextIntlPlugin("./app/i18n/request.ts");
export default withNextIntl(nextConfig);
