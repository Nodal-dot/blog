import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Project } from "./types";

const ROOT = path.join(process.cwd(), "content/projects");

export function getProjects(locale: string): Project[] {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".mdx"))
        .map((file) => {
            const slug = file.replace(/\.mdx$/, "");
            const source = fs.readFileSync(path.join(dir, file), "utf8");
            const { data } = matter(source);
            return {
                slug,
                title: data.title,
                subtitle: data.subtitle,
                image: {
                    src: data.imageSrc,
                    alt: data.imageAlt,
                },
                buttonText: data.buttonText,
            };
        });
}
