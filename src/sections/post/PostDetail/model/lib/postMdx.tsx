import type { ComponentPropsWithoutRef } from "react";
import type { TocItem } from "../types";

interface MdastNode {
    type: string;
    depth?: number;
    value?: string;
    alt?: string;
    children?: MdastNode[];
    data?: {
        hProperties?: Record<string, string>;
    };
}

export function createPostHeadingComponent(tag: "h2" | "h3") {
    return function Heading(props: ComponentPropsWithoutRef<typeof tag>) {
        if (tag === "h2") {
            return <h2 {...props} />;
        }

        return <h3 {...props} />;
    };
}

export function createPostTocRemarkPlugin(toc: TocItem[]) {
    return function postTocRemarkPlugin() {
        return function transform(tree: MdastNode) {
            const slugCounts = new Map<string, number>();
            const nextToc: TocItem[] = [];
            let currentSection: TocItem | null = null;

            visitTree(tree, (node) => {
                if (node.type !== "heading" || (node.depth !== 2 && node.depth !== 3)) {
                    return;
                }

                const title = extractNodeText(node).trim();
                const id = createUniqueSlug(title, slugCounts);

                node.data ??= {};
                node.data.hProperties = {
                    ...node.data.hProperties,
                    id,
                };

                if (!title) {
                    return;
                }

                const item: TocItem = {
                    id,
                    title,
                    children: [],
                };

                if (node.depth === 2) {
                    nextToc.push(item);
                    currentSection = item;
                    return;
                }

                if (currentSection) {
                    currentSection.children.push(item);
                    return;
                }

                nextToc.push(item);
            });

            toc.splice(0, toc.length, ...nextToc);
        };
    };
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

function visitTree(node: MdastNode, visitor: (node: MdastNode) => void) {
    visitor(node);

    for (const child of node.children ?? []) {
        visitTree(child, visitor);
    }
}

function extractNodeText(node: MdastNode): string {
    if (node.type === "text" || node.type === "inlineCode") {
        return node.value ?? "";
    }

    if (node.type === "image") {
        return node.alt ?? "";
    }

    if (node.type === "break") {
        return " ";
    }

    return (node.children ?? []).map(extractNodeText).join("");
}
