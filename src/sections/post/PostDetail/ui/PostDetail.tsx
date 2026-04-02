"use client";

import Image from "next/image";
import type { Post } from "@/entities/post";
import Tags from "@/shared/ui/Tags";
import styles from "./PostDetail.module.scss";
import { classNames } from "@/shared/lib/classNames";

interface PostDetailProps {
    post: Post;
    content: React.ReactElement;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, content }) => {
    return (
        <div className={classNames(styles["post-detail"], "section")}>
            <header className={styles["post-detail__hero"]}>
                <div className={styles["post-detail__hero-media-wrapper"]}>
                    <Image
                        className={styles["post-detail__hero-media"]}
                        src={post.image.src}
                        alt={post.image.alt}
                        width={1600}
                        height={800}
                        priority
                    />
                </div>

                <div className={styles["post-detail__hero-content"]}>
                    <h1 className={styles["post-detail__title"]}>{post.title}</h1>

                    <Tags tags={post.tags} />
                </div>
            </header>

            <article className={styles["post-detail__content"]}>{content}</article>
        </div>
    );
};
