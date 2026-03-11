"use client";

import React, { useEffect, useRef, type FC } from "react";
import { useTranslations } from "next-intl";
import styles from "./Header.module.scss";
import Navigation from "@/features/Navigation";
import { getNavigationsLinks } from "@/widgets/Header/Header.data";
import ThemeToggle from "@/features/ThemeToggle";
import LanguageSwitcher from "@/features/LanguageSwitcher";
import IconLink from "@/shared/ui/IconLink";
import MobileMenu from "@/features/MobileMenu";
import { throttle } from "@/shared/lib/throttle";
import { GITHUB_URL } from "@/config/urls";

export const Header: FC = () => {
    const t = useTranslations();
    const headerRef = useRef<HTMLElement | null>(null);
    useEffect(() => {
        const setHeight = () => {
            if (headerRef.current) {
                const height = headerRef.current.offsetHeight;
                document.body.style.setProperty("--header-height", `${height}px`);
            }
        };

        setHeight();

        const onResize = throttle(setHeight, 300);
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
            onResize.cancel();
        };
    }, []);

    const navigationItems = getNavigationsLinks();
    const links = navigationItems.map((link) => ({ href: link.href, label: t(link.labelKey) }));
    return (
        <header ref={headerRef} className={styles["header"]}>
            <div className={styles["header__nav-desktop"]}>
                <Navigation links={links} />
            </div>

            <MobileMenu links={links} />

            <div className={styles["header__socials"]}>
                <IconLink
                    href={GITHUB_URL}
                    ariaLabel="GitHub"
                    iconLight="/assets/sprites/github-mark.svg"
                    iconDark="/assets/sprites/github-mark-white.svg"
                    width={48}
                    height={48}
                    size="lg"
                />
            </div>

            <div className={styles["header__settings"]}>
                <ThemeToggle />
                <LanguageSwitcher />
            </div>
        </header>
    );
};
