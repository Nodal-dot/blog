"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import styles from "./NotFound.module.scss";
import Button from "@/shared/ui/Button";
import { classNames } from "@/shared/lib/classNames";

export const NotFound = () => {
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
        if (navigate) window.location.href = "/";
    }, [navigate]);

    return (
        <section className={styles["not-found"]} role="alert">
            <h1 className={styles["not-found__glitch"]} aria-label="404">
                404
                <span aria-hidden="true">404</span>
                <span aria-hidden="true">404</span>
            </h1>
            <p className={styles["not-found__message"]}>Page not found</p>
            <Button
                ref={buttonRef}
                className={classNames(styles["not-found__button"], {
                    [styles["not-found__button--ghost"]]: animate,
                })}
                onClick={handleClick}
            >
                Back to home
            </Button>

            <div className={styles["not-found__grid"]}>
                {tiles.map((_, i) => (
                    <div
                        key={i}
                        className={classNames(styles["not-found__tile"], {
                            [styles.active]: animate,
                        })}
                        style={{ transitionDelay: `${delays[i] || 0}s` }}
                    ></div>
                ))}
            </div>
        </section>
    );
};
