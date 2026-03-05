import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://care.xyz";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/(dashboard)/",
          "/(auth)/",
          "/(protected)/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
