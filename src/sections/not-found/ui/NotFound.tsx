"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./NotFound.module.scss";
import Button from "@/shared/ui/Button";
import { classNames } from "@/shared/lib/classNames";
import { useTranslations } from "next-intl";
import { useRouter } from "@/shared/i18n/navigation";

export const NotFound = () => {
    const t = useTranslations("NotFound");
    
    const router = useRouter();

    const [animate, setAnimate] = useState(false);
    const [navigate, setNavigate] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const rows = 20;
    const cols = 40;
    const tiles = useMemo(() => Array.from({ length: rows * cols }), [rows, cols]);

    const [delays, setDelays] = useState<number[]>([]);

    useEffect(() => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const newDelays = tiles.map((_, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;

            const tileWidth = window.innerWidth / cols;
            const tileHeight = window.innerHeight / rows;

            const tileX = col * tileWidth + tileWidth / 2;
            const tileY = row * tileHeight + tileHeight / 2;

            const distance = Math.hypot(tileX - centerX, tileY - centerY);
            return distance / 1500;
        });

        setDelays(newDelays);
    }, [tiles]);

    useEffect(() => {
        if (animate) {
            const maxDelay = Math.max(...delays);
            const timeout = setTimeout(() => setNavigate(true), (maxDelay + 0.5) * 1000);
            return () => clearTimeout(timeout);
        }
    }, [animate, delays]);

    const handleClick = () => setAnimate(true);

    useEffect(() => {
        if (navigate) router.push("/");
    }, [navigate, router]);

    return (
        <section className={styles["not-found"]} role="alert">
            <h1 className={styles["not-found__glitch"]} aria-label={t("heading")}>
                404
                <span aria-hidden="true">404</span>
                <span aria-hidden="true">404</span>
            </h1>
            <p className={styles["not-found__message"]}>{t("message")}</p>
            <Button
                ref={buttonRef}
                className={classNames(styles["not-found__button"], {
                    [styles["not-found__button--ghost"]]: animate,
                })}
                onClick={handleClick}
            >
                {t("button")}
            </Button>

            <div className={styles["not-found__grid"]}>
                {tiles.map((_, i) => (
                    <div
                        key={i}
                        className={classNames(styles["not-found__tile"], {
                            [styles.active]: animate,
                        })}
                        style={{ transitionDelay: `${delays[i] || 0}s` }}
                    />
                ))}
            </div>
        </section>
    );
};
