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
}

export const PostDetailMedia = ({ imageSrc, imageAlt, videoUrl }: PostDetailMediaProps) => {
    const { open, openModal, closeModal } = useModal();
    const t = useTranslations("PostDetail");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (open || !videoRef.current) return;

        videoRef.current.pause();
        videoRef.current.currentTime = 0;
    }, [open]);

    return (
        <div className={styles["post-detail__hero-media-wrapper"]}>
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
