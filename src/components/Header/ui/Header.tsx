"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styles from "./Header.module.scss";
import Nav from "@/components/Navigation";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IconLink from "@/components/IconLink";
import { classNames } from "@/utils/classNames";

const Header: React.FC = () => {
    const t = useTranslations();

    const navLinks = React.useMemo(
        () => [
            { href: "/", label: t("Nav.home") },
            { href: "/about", label: t("Nav.about") },
            { href: "/blog", label: t("Nav.blog") },
        ],
        [t]
    );

    return (
        <header className={classNames(styles.header)}>
            <Nav links={navLinks} />
            <div className={classNames(styles.socials)}>
                <IconLink
                    href="https://github.com"
                    ariaLabel="GitHub"
                    iconLight="/assets/sprites/github-mark.svg"
                    iconDark="/assets/sprites/github-mark-white.svg"
                    width={32}
                    height={32}
                    size="md"
                />
            </div>

            <div className={classNames(styles.settings)}>
                <ThemeToggle />
                <LanguageSwitcher />
            </div>
        </header>
    );
};

export const HeaderMemo = React.memo(Header);
