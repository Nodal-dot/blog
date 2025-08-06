"use client";

import React, { createContext, useState, useRef, useContext, useEffect, useCallback } from "react";
import styles from "./PageTransition.module.scss";
import { useRouter } from "@/i18n/navigation";

interface PageTransitionContextProps {
    startTransition: (to: string, locale?: string) => void;
    isTransitioning: boolean;
}

const PageTransitionContext = createContext<PageTransitionContextProps>({
    startTransition: () => {},
    isTransitioning: false,
});

export const PageTransitionProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const transitionData = useRef<{ url: string; locale?: string } | null>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    const startTransition = useCallback(
        (to: string, locale?: string) => {
            if (isTransitioning) return;

            setIsTransitioning(true);
            transitionData.current = { url: to, locale };
        },
        [isTransitioning]
    );

    useEffect(() => {
        const loader = loaderRef.current;
        if (!loader) return;

        const handleAnimationEnd = (e: TransitionEvent) => {
            if (e.propertyName === "transform" && isTransitioning && transitionData.current) {
                const { url, locale } = transitionData.current;

                if (locale) {
                    router.push(url, { locale });
                } else {
                    router.push(url);
                }

                setTimeout(() => {
                    setIsTransitioning(false);
                    transitionData.current = null;
                }, 600);
            }
        };

        loader.addEventListener("transitionend", handleAnimationEnd);
        return () => loader.removeEventListener("transitionend", handleAnimationEnd);
    }, [isTransitioning, router]);

    return (
        <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
            <div className={styles.wrapper}>
                <div
                    ref={loaderRef}
                    className={`${styles.loader} ${isTransitioning ? styles.active : ""}`}
                />
                <div className={styles.content}>{children}</div>
            </div>
        </PageTransitionContext.Provider>
    );
};

export const usePageTransition = () => useContext(PageTransitionContext);
export default PageTransitionProvider;
