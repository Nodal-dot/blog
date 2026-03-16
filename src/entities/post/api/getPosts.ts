import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content/posts");

export async function getPosts(locale: string) {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
        .map((file) => {
            const id = file.replace(/\.mdx$/, "");
            const source = fs.readFileSync(path.join(dir, file), "utf8");
            const { data } = matter(source);
            const post = data;
            return {
                id,
                title: post.title,
                subtitle: post.subtitle,
                image: { src: post.imageSrc, alt: post.imageAlt },
                videoUrl: post.videoUrl ?? undefined,
                tags: post.tags ?? [],
            };
        });
}
