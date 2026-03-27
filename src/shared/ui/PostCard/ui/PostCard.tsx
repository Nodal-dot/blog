"use client";

import React, { useCallback, useEffect, useRef, useState, type FC } from "react";
import Image from "next/image";
import styles from "./PostCard.module.scss";
import { Link } from "@/shared/i18n/navigation";
import Tags from "@/shared/ui/Tags/index";
import { Maximize2, X } from "lucide-react";
import { classNames } from "@/shared/lib/classNames";

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

type RectState = {
    top: number;
    left: number;
    width: number;
    height: number;
} | null;

export const PostCard: FC<PostCardProps> = ({
    id,
    title,
    subtitle,
    image,
    videoUrl,
    tags = [],
    viewMode,
}) => {
    const originalVideoRef = useRef<HTMLVideoElement | null>(null);
    const overlayVideoRef = useRef<HTMLVideoElement | null>(null);

    const mediaRef = useRef<HTMLDivElement | null>(null);

    const [isExpanded, setIsExpanded] = useState(false);
    const [rect, setRect] = useState<RectState>(null);
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const v = originalVideoRef.current;
        if (!v) return;

        if (isExpanded) {
            try {
                v.pause();
            } catch {}
            v.muted = true;
        } else {
            if (viewMode === "video") {
                v.muted = true;
                void v.play().catch(() => {});
            } else {
                try {
                    v.pause();
                } catch {}
            }
        }
    }, [isExpanded, viewMode]);

    const open = () => {
        const el = mediaRef.current;
        if (!el) return;

        const r = el.getBoundingClientRect();
        setRect(r);
        setIsExpanded(true);

        requestAnimationFrame(() => {
            setAnimate(true);
        });
    };

    const close = useCallback(() => {
        if (overlayVideoRef.current) {
            try {
                overlayVideoRef.current.pause();
            } catch {}
        }

        setAnimate(false);

        setTimeout(() => {
            setIsExpanded(false);
            setRect(null);

            const v = originalVideoRef.current;
            if (!v) return;
            if (viewMode === "video") {
                v.muted = true;
                void v.play().catch(() => {});
            } else {
                try {
                    v.pause();
                } catch {}
            }
        }, 320);
    }, [viewMode]);

    const onOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) close();
    };

    useEffect(() => {
        const onKey = (ev: KeyboardEvent) => {
            if (ev.key === "Escape" && isExpanded) close();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isExpanded, close]);

    useEffect(() => {
        if (isExpanded) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isExpanded]);

    return (
        <article
            data-id={id}
            className={classNames(styles["post-card"], {
                [styles[`mode-${viewMode}`]]: true,
                [styles["post-card--expanded"]]: isExpanded,
            })}
        >
            <Link href={`/posts/${id}`} className={styles["post-card__link"]}>
                <h3 className={styles["post-card__title"]}>{title}</h3>
            </Link>

            {subtitle && <p className={styles["post-card__subtitle"]}>{subtitle}</p>}

            <div className={styles["post-card__media"]} ref={mediaRef}>
                <Image
                    src={image.src}
                    alt={image.alt}
                    width={1200}
                    height={675}
                    className={styles["post-card__image"]}
                />

                <video
                    ref={originalVideoRef}
                    src={videoUrl}
                    muted={viewMode !== "video"}
                    autoPlay={viewMode === "video"}
                    loop
                    playsInline
                    className={styles["post-card__video"]}
                />

                <button onClick={open} className={styles["post-card__trigger"]}>
                    <span className={styles["post-card__trigger-icon"]}>
                        <Maximize2 />
                    </span>
                </button>
            </div>

            {isExpanded && rect && (
                <div className={styles["post-card__overlay"]} onClick={onOverlayClick}>
                    <div
                        className={styles["post-card__overlay-media"]}
                        style={{
                            top: animate ? "50%" : rect.top + rect.height / 2,
                            left: animate ? "50%" : rect.left + rect.width / 2,
                            width: animate ? "90vw" : rect.width,
                            height: animate ? "80vh" : rect.height,
                            transform: "translate(-50%, -50%)",
                        }}
                    >
                        <video
                            ref={overlayVideoRef}
                            src={videoUrl}
                            autoPlay
                            controls
                            loop
                            playsInline
                            className={styles["post-card__video"]}
                        />

                        <button
                            className={styles["post-card__close"]}
                            onClick={close}
                            aria-label="Close"
                        >
                            <X size={32} />
                        </button>
                    </div>
                </div>
            )}

            <Tags tags={tags} />
        </article>
    );
};

export default PostCard;
