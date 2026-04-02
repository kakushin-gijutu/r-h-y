import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/estimate/", "/api/", "/login"],
      },
    ],
    sitemap: "https://r-h-y.jp/sitemap.xml",
  };
}
