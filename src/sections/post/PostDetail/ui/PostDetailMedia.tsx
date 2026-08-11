"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Button from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import Modal, { useModal } from "@/shared/ui/Modal";
import styles from "./PostDetail.module.scss";

interface PostDetailMediaProps {
    imageSrc: string;
    imageAlt: string;
    videoUrl: string;
    date: string;
}

export const PostDetailMedia = ({ imageSrc, imageAlt, videoUrl, date }: PostDetailMediaProps) => {
    const { open, openModal, closeModal } = useModal();
    const t = useTranslations("PostDetail");
    const videoRef = useRef<HTMLVideoElement>(null);
    const year = date.slice(0, 4) || new Date().getFullYear().toString();

    useEffect(() => {
        if (open || !videoRef.current) return;

        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }, [open]);

    return (
        <div className={styles["post-detail__hero-media-wrapper"]}>
            <div className={styles["post-detail__hero-media-meta"]} aria-hidden="true">
                <span className={styles["post-detail__hero-media-meta-value"]}>01</span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>POST</span>
            </div>

            <div className={styles["post-detail__hero-media-frame"]}>
                <Image
                    className={styles["post-detail__hero-media"]}
                    src={imageSrc}
                    alt={imageAlt}
                    width={1600}
                    height={800}
                    priority
                    sizes="(max-width: 786px) 100vw, (max-width: 1200px) 60vw, 800px"
                />

                {videoUrl && (
                    <>
                        <Button
                            type="button"
                            ariaLabel={t("playVideo")}
                            className={styles["post-detail__play-button"]}
                            onClick={openModal}
                        />

                        <Button
                            type="button"
                            ariaLabel={t("playVideo")}
                            className={styles["post-detail__play-button-center"]}
                            onClick={openModal}
                        >
                            <Icon name="play" />
                        </Button>
                    </>
                )}
            </div>

            <div
                className={styles["post-detail__hero-media-meta"]}
                data-side="end"
                aria-hidden="true"
            >
                <span className={styles["post-detail__hero-media-meta-value"]}>{year}</span>
                <span className={styles["post-detail__hero-media-meta-line"]} />
                <span className={styles["post-detail__hero-media-meta-label"]}>16:9</span>
            </div>

            {videoUrl && (
                <>
                    <Modal
                        open={open}
                        onClose={closeModal}
                        contentClassName={styles["post-detail__video-modal"]}
                    >
                        <div className={styles["post-detail__video-frame"]}>
                            <video
                                ref={videoRef}
                                className={styles["post-detail__video"]}
                                src={videoUrl}
                                controls
                                autoPlay
                                playsInline
                            />
                        </div>
                    </Modal>
                </>
            )}
        </div>
    );
};
