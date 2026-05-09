import Image from "next/image";
import type { Post } from "@/entities/post";
import Tags from "@/shared/ui/Tags";
import styles from "./PostDetail.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { PostScrollProgress } from "./PostScrollProgress";
import { PostBackLink } from "./PostBackLink";

interface PostDetailProps {
    post: Post;
    content: React.ReactElement;
    backLabel: string;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, content, backLabel }) => {
    return (
        <div className={classNames(styles["post-detail"], "section")}>
            <PostScrollProgress />

            <header className={styles["post-detail__hero"]}>
                <div className={styles["post-detail__hero-media-wrapper"]}>
                    <Image
                        className={styles["post-detail__hero-media"]}
                        src={post.image.src}
                        alt={post.image.alt}
                        width={1600}
                        height={800}
                        priority
                        sizes="(max-width: 786px) 100vw, (max-width: 1200px) 60vw, 800px"
                    />
                </div>

                <div className={styles["post-detail__hero-content"]}>
                    <PostBackLink label={backLabel} />

                    <h1 className={styles["post-detail__title"]}>{post.title}</h1>

                    {post.subtitle && (
                        <p className={styles["post-detail__subtitle"]}>{post.subtitle}</p>
                    )}

                    <div className={styles["post-detail__hero-tags"]}>
                        <Tags tags={post.tags} />
                    </div>
                </div>
            </header>

            <article className={styles["post-detail__content"]}>{content}</article>
        </div>
    );
};
