"use client";

import React from "react";
import { usePathname } from "@/i18n/navigation";
import { usePageTransition } from "@/providers/transition/PageTransitionProvider";
import styles from "./Navigation.module.scss";
import NavLink from "@/components/NavLink";
import { classNames } from "@/utils/classNames";

interface INavProps {
    links: Array<{ href: string; label: string }>;
}

export const Navigation: React.FC<INavProps> = ({ links }) => {
    const pathname = usePathname();
    const { startTransition } = usePageTransition();
    return (
        <nav className={classNames(styles.navigation)} aria-label="Main navigation">
            <ul className={classNames(styles["navigation__list"])}>
                {links.map(({ href, label }) => (
                    <li key={href}>
                        <NavLink
                            href={href}
                            label={label}
                            isActive={pathname === href}
                            onClick={() => startTransition(href)}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    );
};
