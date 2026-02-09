"use server";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Project } from "../model/types";

const ROOT = path.join(process.cwd(), "content/projects");

export async function getProjects(locale: string): Promise<Project[]> {
    const dir = path.join(ROOT, locale);
    if (!fs.existsSync(dir)) return [];

    return fs
        .readdirSync(dir)
        .filter((file) => file.endsWith(".mdx"))
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
                    alt: data.imageAlt ?? "Project image",
                },
                buttonText: data.buttonText,
                tags: data.tags ?? [],
            };
        });
}
