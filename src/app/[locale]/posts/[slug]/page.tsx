import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import PostDetail from "@/sections/post/PostDetail";
import type { Post } from "@/entities/post";
import { createPageMetadata } from "../../metadata";
import remarkGfm from "remark-gfm";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return { title: "Post not found" };

    const source = fs.readFileSync(file, "utf8");
    const { data } = matter(source);

    const tags: string[] = Array.isArray(data.tags) ? data.tags : [];

    return createPageMetadata({
        title: data.title,
        description: data.subtitle || data.title,
        keywords: tags.join(","),
        openGraphTitle: data.title,
        openGraphDescription: data.subtitle || data.title,
        path: `/${locale}/posts/${slug}`,
        locale,
    });
}

export interface PostPageProps {
    params: Promise<{ locale: Locale; slug: string }>;
}

type PostFrontmatter = Omit<Post, "image"> & {
    imageSrc: string;
    imageAlt: string;
};

export default async function PostPage({ params }: PostPageProps) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "PostDetail" });

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return notFound();

    const source = fs.readFileSync(file, "utf8");

    const { content, frontmatter } = await compileMDX<PostFrontmatter>({
        source,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
            },
        },
    });

    const post: Post = {
        ...frontmatter,
        image: {
            src: frontmatter.imageSrc,
            alt: frontmatter.imageAlt,
        },
    };

    return <PostDetail post={post} content={content} backLabel={t("backToPosts")} />;
}
