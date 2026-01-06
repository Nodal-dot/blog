"use client";

import {
    createContext,
    useState,
    useRef,
    useContext,
    useEffect,
    useCallback,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import styles from "./PageTransition.module.scss";
import { useRouter } from "@/i18n/navigation";

interface IPageTransitionContextProps {
    startTransition: (to: string, locale?: string) => void;
    isTransitioning: boolean;
}

const PageTransitionContext = createContext<IPageTransitionContextProps>({
    startTransition: () => {},
    isTransitioning: false,
});

export const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [mounted, setMounted] = useState(false);
    const transitionData = useRef<{ url: string; locale?: string } | null>(null);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    const startTransition = useCallback(
        (to: string, locale?: string) => {
            if (isTransitioning) return;
            transitionData.current = { url: to, locale };
            setIsTransitioning(true);
        },
        [isTransitioning]
    );

    useEffect(() => {
        if (!isTransitioning || !transitionData.current) return;

        const handleTransitionEnd = () => {
            const { url, locale } = transitionData.current!;
            if (locale) {
                router.push(url, { locale });
            } else {
                router.push(url);
            }

            setTimeout(() => {
                setIsTransitioning(false);
                transitionData.current = null;
            }, 600);
        };

        const timer = setTimeout(handleTransitionEnd, 600);
        return () => clearTimeout(timer);
    }, [isTransitioning, router]);

    const loaderPortal = mounted
        ? createPortal(
              <div className={`${styles.loader} ${isTransitioning ? styles.active : ""}`} />,
              document.body
          )
        : null;

    return (
        <PageTransitionContext.Provider value={{ startTransition, isTransitioning }}>
            {children}
            {loaderPortal}
        </PageTransitionContext.Provider>
    );
};

export const usePageTransition = () => useContext(PageTransitionContext);
