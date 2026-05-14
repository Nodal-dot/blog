import fs from "fs";
import path from "path";
import { routing } from "@/shared/i18n/routing";
import { BASE_SEO } from "@/app/[locale]/seo";

const ROOT = path.join(process.cwd(), "content/posts");
const SITE_URL = BASE_SEO.en.url;
const STATIC_PATHS = ["", "/about", "/posts"];

function escapeXml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

function getStaticEntries() {
    return routing.locales.flatMap((locale) =>
        STATIC_PATHS.map((pagePath) => ({
            url: `${SITE_URL}/${locale}${pagePath}`,
            lastModified: new Date().toISOString(),
        }))
    );
}

function getPostEntries() {
    return routing.locales.flatMap((locale) => {
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
                    lastModified: fs.statSync(filePath).mtime.toISOString(),
                };
            });
    });
}

export function GET() {
    const entries = [...getStaticEntries(), ...getPostEntries()];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
        ({ url, lastModified }) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastModified}</lastmod>
  </url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "text/xml; charset=UTF-8",
        },
    });
}
