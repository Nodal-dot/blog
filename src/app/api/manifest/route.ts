import { NextResponse } from "next/server";

interface ManifestIcon {
    src: string;
    type: string;
    sizes: string;
    purpose: string;
}

interface WebManifest {
    name: string;
    short_name: string;
    description: string;
    icons: ManifestIcon[];
    scope: string;
    start_url: string;
    display: "standalone" | "fullscreen" | "minimal-ui" | "browser";
    theme_color: string;
    background_color: string;
}

const manifests: Record<"ru" | "en", WebManifest> = {
    ru: {
        name: "Nodal-dot — Портфолио фронтенд разработчика",
        short_name: "Nodal-dot",
        description: "Портфолио фронтенд разработчика. React, Next.js, TypeScript.",
        icons: [
            {
                src: "/favicon-72x72.png",
                type: "image/png",
                sizes: "72x72",
                purpose: "any maskable",
            },
            {
                src: "/favicon-96x96.png",
                type: "image/png",
                sizes: "96x96",
                purpose: "any maskable",
            },
            {
                src: "/favicon-128x128.png",
                type: "image/png",
                sizes: "128x128",
                purpose: "any maskable",
            },
            {
                src: "/favicon-144x144.png",
                type: "image/png",
                sizes: "144x144",
                purpose: "any maskable",
            },
            {
                src: "/favicon-152x152.png",
                type: "image/png",
                sizes: "152x152",
                purpose: "any maskable",
            },
            {
                src: "/favicon-192x192.png",
                type: "image/png",
                sizes: "192x192",
                purpose: "any maskable",
            },
            {
                src: "/favicon-384x384.png",
                type: "image/png",
                sizes: "384x384",
                purpose: "any maskable",
            },
            {
                src: "/favicon-512x512.png",
                type: "image/png",
                sizes: "512x512",
                purpose: "any maskable",
            },
        ],
        scope: "/",
        start_url: "/ru",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
    },
    en: {
        name: "Nodal-dot — Frontend Developer Portfolio",
        short_name: "Nodal-dot",
        description: "Frontend developer portfolio. React, Next.js, TypeScript.",
        icons: [
            {
                src: "/favicon-72x72.png",
                type: "image/png",
                sizes: "72x72",
                purpose: "any maskable",
            },
            {
                src: "/favicon-96x96.png",
                type: "image/png",
                sizes: "96x96",
                purpose: "any maskable",
            },
            {
                src: "/favicon-128x128.png",
                type: "image/png",
                sizes: "128x128",
                purpose: "any maskable",
            },
            {
                src: "/favicon-144x144.png",
                type: "image/png",
                sizes: "144x144",
                purpose: "any maskable",
            },
            {
                src: "/favicon-152x152.png",
                type: "image/png",
                sizes: "152x152",
                purpose: "any maskable",
            },
            {
                src: "/favicon-192x192.png",
                type: "image/png",
                sizes: "192x192",
                purpose: "any maskable",
            },
            {
                src: "/favicon-384x384.png",
                type: "image/png",
                sizes: "384x384",
                purpose: "any maskable",
            },
            {
                src: "/favicon-512x512.png",
                type: "image/png",
                sizes: "512x512",
                purpose: "any maskable",
            },
        ],
        scope: "/",
        start_url: "/en",
        display: "standalone",
        theme_color: "#ffffff",
        background_color: "#ffffff",
    },
};

export function GET(request: Request) {
    const url = new URL(request.url);
    const locale = (url.searchParams.get("locale") as "ru" | "en") || "en";

    const manifest: WebManifest = manifests[locale] || manifests.en;
    return NextResponse.json(manifest);
}
