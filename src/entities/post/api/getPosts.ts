import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/i18n/types";

const ROOT = path.join(process.cwd(), "content/posts");

export async function getPosts(locale: Locale) {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const id = file.replace(/\.mdx$/, "");
            const source = fs.readFileSync(path.join(dir, file), "utf8");
            const { data } = matter(source);

            return {
                id,
                title: data.title,
                excerpt: data.excerpt,
                image: { src: data.imageSrc, alt: data.imageAlt ?? data.title },
                videoUrl: data.videoUrl ?? undefined,
                tags: data.tags ?? [],
            };
        });
}
