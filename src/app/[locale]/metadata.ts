import type { Metadata } from "next";
import { BASE_SEO } from "./seo";
import type { Locale } from "@/shared/i18n/types";

interface PageSEOParams {
    title: string;
    description: string;
    keywords?: string;
    openGraphTitle?: string;
    openGraphDescription?: string;
    path: string;
    locale: Locale;
}

export async function createPageMetadata({
    title,
    description,
    keywords = "",
    openGraphTitle,
    openGraphDescription,
    path,
    locale,
}: PageSEOParams): Promise<Metadata> {
    const base = BASE_SEO[locale];
    return {
        title: {
            default: title,
            template: "%s | Your Name",
        },
        manifest: `/api/manifest?locale=${locale}`,
        description,
        metadataBase: new URL(base.url),
        alternates: {
            canonical: path,
            languages: Object.keys(BASE_SEO).reduce<Record<string, string>>((acc, l) => {
                const lang = l as keyof typeof BASE_SEO;
                let localizedPath = path;
                const currentPrefix = `/${locale}`;
                if (path.startsWith(currentPrefix)) {
                    localizedPath = path.replace(new RegExp(`^/${locale}`), `/${lang}`);
                } else {
                    localizedPath = `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
                }
                acc[lang] = localizedPath;
                return acc;
            }, {}),
        },
        keywords: keywords.split(","),
        robots: { index: true, follow: true },
        openGraph: {
            type: "website",
            url: `${base.url}${path}`,
            siteName: base.siteName,
            locale: base.locale,
            title: openGraphTitle || title,
            description: openGraphDescription || description,
            images: [
                {
                    url: base.defaultImage.startsWith("http")
                        ? base.defaultImage
                        : `${base.url}${base.defaultImage}`,
                    width: 1200,
                    height: 630,
                    alt: openGraphTitle || title,
                },
            ],
        },
        other: {
            "msapplication-config": "/browserconfig.xml",
            "msapplication-TileColor": "#ffffff",
            "msapplication-TileImage": "/favicon-144x144.png",
        },
        icons: {
            icon: "/favicon.ico",
            shortcut: "/favicon.ico",
            apple: [
                { url: "/favicon-57x57.png", sizes: "57x57" },
                { url: "/favicon-60x60.png", sizes: "60x60" },
                { url: "/favicon-72x72.png", sizes: "72x72" },
                { url: "/favicon-76x76.png", sizes: "76x76" },
                { url: "/favicon-114x114.png", sizes: "114x114" },
                { url: "/favicon-120x120.png", sizes: "120x120" },
                { url: "/favicon-144x144.png", sizes: "144x144" },
                { url: "/favicon-152x152.png", sizes: "152x152" },
                { url: "/favicon-180x180.png", sizes: "180x180" },
            ],
            other: [
                { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
                { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
                { rel: "icon", url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
                { rel: "icon", url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
                { rel: "mask-icon", url: "/safari-pinned-tab.svg", color: "#5bbad5" },
            ],
        },
    };
}
