import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import type { TocItem } from "../types";

export function createPostHeadingComponent(tag: "h2" | "h3", slugCounts: Map<string, number>) {
    return function Heading({ children, ...props }: ComponentPropsWithoutRef<typeof tag>) {
        const id = createUniqueSlug(extractText(children), slugCounts);

        if (tag === "h2") {
            return (
                <h2 id={id} {...props}>
                    {children}
                </h2>
            );
        }

        return (
            <h3 id={id} {...props}>
                {children}
            </h3>
        );
    };
}

export function buildPostToc(markdown: string): TocItem[] {
    const slugCounts = new Map<string, number>();
    const toc: TocItem[] = [];
    let currentSection: TocItem | null = null;

    for (const match of markdown.matchAll(/^(#{2,3})\s+(.+?)\s*#*\s*$/gm)) {
        const level = match[1].length;
        const title = stripMarkdown(match[2]);

        if (!title) continue;

        const item: TocItem = {
            id: createUniqueSlug(title, slugCounts),
            title,
            children: [],
        };

        if (level === 2) {
            toc.push(item);
            currentSection = item;
            continue;
        }

        if (currentSection) {
            currentSection.children.push(item);
            continue;
        }

        toc.push(item);
    }

    return toc;
}

function createUniqueSlug(value: string, slugCounts: Map<string, number>) {
    const baseSlug = slugify(value) || "section";
    const currentCount = slugCounts.get(baseSlug) ?? 0;

    slugCounts.set(baseSlug, currentCount + 1);

    return currentCount === 0 ? baseSlug : `${baseSlug}-${currentCount + 1}`;
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .trim()
        .replace(/\s+/g, "-");
}

function stripMarkdown(value: string) {
    return value
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/[~*_]/g, "")
        .trim();
}

function extractText(node: ReactNode): string {
    if (typeof node === "string" || typeof node === "number") {
        return String(node);
    }

    if (Array.isArray(node)) {
        return node.map(extractText).join("");
    }

    if (isValidElement<{ children?: ReactNode }>(node)) {
        return extractText(node.props.children);
    }

    return "";
}
