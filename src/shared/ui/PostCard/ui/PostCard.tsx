import React, { type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";
import Tags from "@/shared/ui/Tags/index";
import { Maximize2 } from "lucide-react";

export type ViewMode = "compact" | "image" | "video";

export interface PostCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl?: string;
    tags?: string[];
    viewMode: ViewMode;
}
// TODO on view mode image has lag in classes none
export const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    tags = [],
    viewMode,
}) => {
    return (
        <article className={`${styles["post-card"]} ${styles[`mode-${viewMode}`]}`}>
            <Link href={`/posts/${id}`} className={styles["post-card__link"]}>
                <h3 className={styles["post-card__title"]}>{title}</h3>
            </Link>

            {subtitle && <p className={styles["post-card__subtitle"]}>{subtitle}</p>}

            <div className={styles["post-card__media"]}>
                {viewMode === "image" || viewMode === "compact" ? (
                    <Image
                        src={image.src}
                        alt={image.alt ?? title}
                        width={1200}
                        height={675}
                        className={styles.image}
                    />
                ) : (
                    <video src={videoUrl} />
                )}

                <button className={styles["post-card__trigger"]}>
                    <span aria-hidden className={styles["post-card__trigger-icon"]}>
                        <Maximize2 />
                    </span>
                </button>
            </div>

            <Tags tags={tags} />
        </article>
    );
};
