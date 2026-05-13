"use client";

import {
    createContext,
    useState,
    use,
    useEffect,
    useTransition,
    useRef,
    useCallback,
    useMemo,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { useRouter, usePathname } from "@/shared/i18n/navigation";
import { classNames } from "@/shared/lib/classNames";
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
    const { push } = useRouter();
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
        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        if (savedPathname.current !== pathname) {
            savedPathname.current = pathname;
            timeoutId = setTimeout(() => setIsAnimating(false), 100);
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [pathname]);

    const isAnimatingRef = useRef(isAnimating);
    useEffect(() => {
        isAnimatingRef.current = isAnimating;
    }, [isAnimating]);

    const startTransition = useCallback(
        (to: string, locale?: string) => {
            if (isAnimatingRef.current) return;
            if (to === pathname) return;
            setIsAnimating(true);

            setTimeout(() => {
                startReactTransition(() => {
                    if (locale) {
                        push(to, { locale });
                    } else {
                        push(to);
                    }
                });
            }, 400);
        },
        [pathname, push, startReactTransition]
    );

    const contextValue = useMemo(
        () => ({ startTransition, isPending, isAnimating }),
        [startTransition, isPending, isAnimating]
    );

    const loaderPortal = mounted
        ? createPortal(
              <div
                  className={classNames(styles["loader"], {
                      [styles["loader--active"]]: isAnimating,
                  })}
              />,
              document.body
          )
        : null;

    return (
        <PageTransitionContext.Provider value={contextValue}>
            {children}
            {loaderPortal}
        </PageTransitionContext.Provider>
    );
};

export const usePageTransition = () => use(PageTransitionContext);
