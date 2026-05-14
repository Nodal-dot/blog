import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import { routing } from "@/shared/i18n/routing";
import { BASE_SEO } from "./[locale]/seo";

const ROOT = path.join(process.cwd(), "content/posts");
const SITE_URL = BASE_SEO.en.url;
const STATIC_PATHS = ["", "/about", "/posts"];

function getPostEntries(locale: string): MetadataRoute.Sitemap {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const filePath = path.join(dir, file);

            return {
                url: `${SITE_URL}/${locale}/posts/${slug}`,
                lastModified: fs.statSync(filePath).mtime,
                changeFrequency: "monthly" as const,
                priority: 0.7,
            };
        });
}

export default function sitemap(): MetadataRoute.Sitemap {
    const staticEntries = routing.locales.flatMap((locale) =>
        STATIC_PATHS.map((pagePath, index) => ({
            url: `${SITE_URL}/${locale}${pagePath}`,
            lastModified: new Date(),
            changeFrequency: index === 0 ? ("weekly" as const) : ("monthly" as const),
            priority: index === 0 ? 1 : 0.8,
        }))
    );

    const postEntries = routing.locales.flatMap((locale) => getPostEntries(locale));

    return [...staticEntries, ...postEntries];
}
