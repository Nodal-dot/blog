import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import type { Locale } from "@/shared/i18n/types";
import Image from "next/image";
import { notFound } from "next/navigation";
import styles from "./post.module.scss";

import { compileMDX } from "next-mdx-remote/rsc";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return { title: "Post" };

    const source = fs.readFileSync(file, "utf8");
    const { data } = matter(source);

    return {
        title: data.title,
        description: data.excerpt,
    };
}

export interface PostPageProps {
    params: Promise<{ locale: Locale; slug: string }>;
}

export default async function PostPage(props: PostPageProps) {
    const { params } = props;
    const { locale, slug } = await params;

    const file = path.join(process.cwd(), "content/posts", locale, `${slug}.mdx`);
    if (!fs.existsSync(file)) return notFound();

    const source = fs.readFileSync(file, "utf8");

    const { content, frontmatter } = await compileMDX({
        source,
        options: {
            parseFrontmatter: true,
        },
    });

    const data = frontmatter;

    return (
        <main className={styles.page}>
            <header className={styles.hero}>
                {data.imageSrc ? (
                    <div className={styles.heroMedia}>
                        <Image
                            src={data.imageSrc}
                            alt={data.imageAlt ?? data.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 1200px"
                            style={{ objectFit: "cover" }}
                        />
                    </div>
                ) : data.videoUrl ? (
                    <div className={styles.heroMedia}>
                        <video src={data.videoUrl} controls className={styles.video} />
                    </div>
                ) : null}

                <div className={styles.heroContent}>
                    <h1 className={styles.title}>{data.title}</h1>
                    {data.excerpt && <p className={styles.excerpt}>{data.excerpt}</p>}

                    {data.tags && (
                        <div className={styles.tags}>
                            {data.tags.map((t: string) => (
                                <span key={t} className={styles.tag}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            <article className={styles.content}>{content}</article>
        </main>
    );
}
