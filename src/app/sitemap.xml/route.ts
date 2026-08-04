import { routing } from "@/shared/i18n/routing";
import { BASE_SEO } from "@/app/[locale]/seo";
import { readPostFrontmatters } from "@/entities/post/api/readPostFrontmatters";

const SITE_URL = BASE_SEO.en.url;
const STATIC_PATHS = ["", "/about", "/posts"];

type SitemapEntry = {
    url: string;
    lastModified?: string;
};

function formatLastModified(date: Date) {
    return date.toISOString().split("T")[0];
}

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
        STATIC_PATHS.map(
            (pagePath) =>
                ({
                    url: `${SITE_URL}/${locale}${pagePath}`,
                }) satisfies SitemapEntry
        )
    );
}

function getPostEntries() {
    return routing.locales.flatMap((locale) => {
        return readPostFrontmatters(locale).map((post) => ({
            url: `${SITE_URL}/${locale}/posts/${post.id}`,
            lastModified: formatLastModified(new Date(post.date)),
        }));
    });
}

export function GET() {
    const entries: SitemapEntry[] = [...getStaticEntries(), ...getPostEntries()];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
    .map(
        ({ url, lastModified }) => `  <url>
    <loc>${escapeXml(url)}</loc>
${
    lastModified
        ? `    <lastmod>${lastModified}</lastmod>
`
        : ""
}   </url>`
    )
    .join("\n")}
</urlset>`;

    return new Response(xml, {
        headers: {
            "Content-Type": "text/xml; charset=UTF-8",
        },
    });
}
