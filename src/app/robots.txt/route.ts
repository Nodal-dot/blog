import { BASE_SEO } from "@/app/[locale]/seo";

export function GET() {
    const robots = `User-agent: *
Allow: /

Sitemap: ${BASE_SEO.en.url}/sitemap.xml
`;

    return new Response(robots, {
        headers: {
            "Content-Type": "text/plain; charset=UTF-8",
        },
    });
}
