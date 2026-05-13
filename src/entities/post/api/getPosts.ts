import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content/posts");

export async function getPosts(locale: string) {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    const posts = [];

    for (const file of fs.readdirSync(dir)) {
        if (!file.endsWith(".mdx")) continue;

            const id = file.replace(/\.mdx$/, "");
            const source = fs.readFileSync(path.join(dir, file), "utf8");
            const { data } = matter(source);
            const post = data;

            posts.push({
                id,
                title: post.title,
                subtitle: post.subtitle,
                image: { src: post.imageSrc, alt: post.imageAlt },
                videoUrl: post.videoUrl,
                tags: post.tags,
            });
    }

    return posts;
}
