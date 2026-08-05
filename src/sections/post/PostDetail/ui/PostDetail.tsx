import type { Post } from "@/entities/post";
import Tags from "@/shared/ui/Tags";
import styles from "./PostDetail.module.scss";
import { classNames } from "@/shared/lib/classNames";
import { PostScrollProgress } from "./PostScrollProgress";
import { PostBackLink } from "./PostBackLink";
import { PostDetailMedia } from "./PostDetailMedia";

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
                <PostDetailMedia
                    imageSrc={post.image.src}
                    imageAlt={post.image.alt}
                    videoUrl={post.videoUrl}
                />

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
