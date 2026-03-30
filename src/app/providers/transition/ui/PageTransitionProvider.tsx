"use client";

import {
    createContext,
    useState,
    useContext,
    useEffect,
    useTransition,
    useRef,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import styles from "./PageTransition.module.scss";

interface IPageTransitionContextProps {
    startTransition: (to: string, locale?: string) => void;
    isPending: boolean;
    isAnimating: boolean;
}

const PageTransitionContext = createContext<IPageTransitionContextProps>({
    startTransition: () => {},
    isPending: false,
    isAnimating: false,
});

export const PageTransitionProvider = ({ children }: { children: ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();

    const [isPending, startReactTransition] = useTransition();
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);

    const savedPathname = useRef(pathname);

    useEffect(() => {
        const id = requestAnimationFrame(() => setMounted(true));
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (savedPathname.current !== pathname) {
            savedPathname.current = pathname;
            setTimeout(() => setIsAnimating(false), 100);
        }
    }, [pathname]);

    const startTransition = (to: string, locale?: string) => {
        if (isAnimating) return;

        setIsAnimating(true);

        setTimeout(() => {
            startReactTransition(() => {
                if (locale) {
                    router.push(to, { locale });
                } else {
                    router.push(to);
                }
            });
        }, 400);
    };

    const loaderPortal = mounted
        ? createPortal(
              <div className={`${styles.loader} ${isAnimating ? styles.active : ""}`} />,
              document.body
          )
        : null;

    return (
        <PageTransitionContext.Provider value={{ startTransition, isPending, isAnimating }}>
            {children}
            {loaderPortal}
        </PageTransitionContext.Provider>
    );
};

export const usePageTransition = () => useContext(PageTransitionContext);
