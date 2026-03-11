"use client";

import React, { type FC, useState } from "react";
import styles from "./PostPopup.module.scss";

export interface PostPopupProps {
    activeId?: string;
    videoUrl?: string;
    visible: boolean;
    onClose: () => void;
}

export const PostPopup: FC<PostPopupProps> = ({ activeId, videoUrl, visible, onClose }) => {
    const [isTouch] = useState(
        () =>
            typeof window !== "undefined" &&
            ("ontouchstart" in window || navigator.maxTouchPoints > 0)
    );

    if (!visible || !activeId) return null;

    if (isTouch) {
        return (
            <div className={styles.sheet} role="dialog" aria-modal="true">
                <button className={styles.close} onClick={onClose} aria-label="Close">
                    ×
                </button>
                {videoUrl ? (
                    <video src={videoUrl} controls autoPlay className={styles.video} />
                ) : (
                    <div className={styles.placeholder}>Preview not available</div>
                )}
            </div>
        );
    }

    return (
        <div className={styles["post-popup"]} role="dialog" aria-modal="false">
            <button className={styles["post-popup__close"]} onClick={onClose} aria-label="Close">
                ×
            </button>
            {videoUrl ? (
                <video src={videoUrl} autoPlay muted loop className={styles.video} />
            ) : (
                <div className={styles["post-popup__placeholder"]}>Preview not available</div>
            )}
        </div>
    );
};
