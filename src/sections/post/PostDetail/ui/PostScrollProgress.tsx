"use client";

import { useEffect, useRef } from "react";
import styles from "./PostDetail.module.scss";

export const PostScrollProgress = () => {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let frameId = 0;

        const updateProgress = () => {
            frameId = 0;

            const root = document.documentElement;
            const scrollableHeight = root.scrollHeight - root.clientHeight;
            const progress = scrollableHeight > 0 ? root.scrollTop / scrollableHeight : 0;

            progressRef.current?.style.setProperty("--post-scroll-progress", progress.toString());
        };

        const requestUpdate = () => {
            if (frameId) return;
            frameId = window.requestAnimationFrame(updateProgress);
        };

        requestUpdate();
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);

        return () => {
            if (frameId) {
                window.cancelAnimationFrame(frameId);
            }

            window.removeEventListener("scroll", requestUpdate);
            window.removeEventListener("resize", requestUpdate);
        };
    }, []);

    return <div ref={progressRef} className={styles["post-detail__progress"]} aria-hidden="true" />;
};
