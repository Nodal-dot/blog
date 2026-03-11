import React, { type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/i18n/navigation";
import Tags from "@/shared/ui/Tags";

export type ViewMode = "compact" | "image" | "video";

export interface PostCardProps {
    id: string;
    title: string;
    excerpt: string;
    image: { src: string; alt: string };
    videoUrl?: string;
    tags?: string[];
    viewMode: ViewMode;
    onHoverPlay?: (id: string, videoUrl?: string) => void;
}

export const PostCard: FC<PostCardProps> = ({
    id,
    title,
    excerpt,
    image,
    videoUrl,
    tags = [],
    viewMode,
    onHoverPlay,
}) => {
    const handleMouseEnter = () => {
        if ((viewMode === "image" || viewMode === "video") && onHoverPlay)
            onHoverPlay(id, videoUrl);
    };

    const handleMouseLeave = () => {
        if (onHoverPlay) onHoverPlay("");
    };

    return (
        <article
            className={`${styles["post-card"]} ${styles[`mode-${viewMode}`]}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/posts/${id}`} className={styles["post-card__link"]}>
                <h3 className={styles["post-card__title"]}>{title}</h3>
            </Link>

            {excerpt && <p className={styles["post-card__excerpt"]}>{excerpt}</p>}

            <div className={styles["post-card__media"]}>
                <Image
                    src={image.src}
                    alt={image.alt ?? title}
                    width={1200}
                    height={675}
                    className={styles.image}
                />
            </div>

            {/* TODO Плейхолдер для видео тоже должен уметь скрываться/показываться */}
            {/* {viewMode === "video" && <div className={styles.mediaPlaceholder}></div>} */}

            <div className={styles["post-card__tags-wrapper"]}>
                <Tags tags={tags} />
            </div>
        </article>
    );
};
