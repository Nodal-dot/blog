"use client";

import React, { useEffect, useRef, type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";
import Tags from "@/shared/ui/Tags/index";
import { classNames } from "@/shared/lib/classNames";
import { usePageTransition } from "@/app/providers/transition";

export type ViewMode = "compact" | "image" | "video";

export interface PostCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl: string;
    tags: string[];
    viewMode: ViewMode;
    style?: React.CSSProperties;
}

export const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    tags = [],
    viewMode,
    ...otherProps
}) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const { startTransition } = usePageTransition();
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (viewMode === "video") {
            video.play().catch();
        } else {
            video.pause();
        }
    }, [viewMode]);

    return (
        <article
            data-id={id}
            className={classNames(styles["post-card"], {
                [styles[`mode-${viewMode}`]]: true,
            })}
            {...otherProps}
        >
            <Link
                href={`/posts/${id}`}
                onClick={() => {
                    startTransition(`/posts/${id}`);
                }}
                className={styles["post-card__link"]}
            >
                <h3 className={styles["post-card__title"]}>{title}</h3>
            </Link>

            {subtitle && <p className={styles["post-card__subtitle"]}>{subtitle}</p>}

            <div className={styles["post-card__media"]}>
                <Image
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={675}
                    className={styles["post-card__image"]}
                />

                <video
                    ref={videoRef}
                    src={videoUrl}
                    muted
                    autoPlay={viewMode === "video"}
                    loop
                    playsInline
                    className={styles["post-card__video"]}
                    aria-hidden="true"
                    tabIndex={-1}
                />
            </div>
            <Tags tags={tags} />
        </article>
    );
};

export default PostCard;
