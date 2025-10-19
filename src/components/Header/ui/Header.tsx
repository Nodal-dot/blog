"use client";

import React, { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import styles from "./Header.module.scss";
import Nav from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IconLink from "@/components/IconLink";
import MobileMenu from "@/components/MobileMenu";
import { throttle } from "@/utils/throttle";

const Header: React.FC = () => {
    const t = useTranslations();
    const headerRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        const setHeight = () => {
            if (headerRef.current) {
                const h = headerRef.current.offsetHeight;
                document.body.style.setProperty("--header-height", `${h}px`);
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

    const navLinks = [
        { href: "/", label: t("Nav.home") },
        { href: "/about", label: t("Nav.about") },
        { href: "/blog", label: t("Nav.blog") },
    ];

    return (
        <header ref={headerRef} className={styles["header"]}>
            <div className={styles["header__nav-desktop"]}>
                <Nav links={navLinks} />
            </div>

            <MobileMenu links={navLinks} />

            <div className={styles["header__socials"]}>
                <IconLink
                    href="https://github.com"
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

export const HeaderMemo = React.memo(Header);
