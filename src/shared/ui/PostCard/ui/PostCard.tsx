import React, { useEffect, useRef, useState, type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";
import Modal from "@/shared/ui/Modal";
import Tags from "@/shared/ui/Tags/index";
import { Maximize2 } from "lucide-react";

export type ViewMode = "compact" | "image" | "video";

export interface PostCardProps {
    id: string;
    title: string;
    subtitle: string;
    image: { src: string; alt: string };
    videoUrl: string;
    tags?: string[];
    viewMode: ViewMode;
}

export const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    tags = [],
    viewMode,
}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 1. Управляем воспроизведением через эффект
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (viewMode === "video" && !isModalOpen) {
            video.muted = true;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.warn("Autoplay was prevented:", error);
                });
            }
        } else {
            video.pause();
        }
    }, [viewMode, isModalOpen]);

    const renderVideo = (isInModal: boolean) => (
        <video
            ref={isInModal ? null : videoRef}
            src={videoUrl}
            muted={!isInModal}
            controls={isInModal}
            autoPlay={isInModal || viewMode === "video"}
            loop
            playsInline
            className={styles["post-card__video"]}
        />
    );

    return (
        <article className={`${styles["post-card"]} ${styles[`mode-${viewMode}`]}`}>
            <Link href={`/posts/${id}`} className={styles["post-card__link"]}>
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

                {renderVideo(false)}

                <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles["post-card__trigger"]}
                >
                    <span aria-hidden className={styles["post-card__trigger-icon"]}>
                        <Maximize2 />
                    </span>
                </button>
            </div>

            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                {isModalOpen && renderVideo(true)}
            </Modal>

            <Tags tags={tags} />
        </article>
    );
};
