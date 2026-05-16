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
import { BASE_SEO } from "../../seo";

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
        openGraphImage: data.imageSrc,
        openGraphType: "article",
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
    const { mtime } = fs.statSync(file);

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

    const postUrl = `${BASE_SEO[locale].url}/${locale}/posts/${slug}`;
    const imageUrl = post.image.src.startsWith("http")
        ? post.image.src
        : `${BASE_SEO[locale].url}${post.image.src}`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.subtitle || post.title,
        image: [imageUrl],
        url: postUrl,
        mainEntityOfPage: postUrl,
        inLanguage: locale,
        dateModified: mtime.toISOString(),
        author: {
            "@type": "Person",
            name: "Vladimir",
            url: `${BASE_SEO[locale].url}/${locale}`,
        },
        publisher: {
            "@type": "Person",
            name: "Vladimir",
            url: `${BASE_SEO[locale].url}/${locale}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PostDetail post={post} content={content} backLabel={t("backToPosts")} />
        </>
    );
}
